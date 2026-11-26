---
title: Transactional Outbox with Unit of Work
description: Use the transactional outbox pattern with Xeno.JS Unit of Work to store domain events alongside database changes in PostgreSQL or SQLite.
keywords:
  - Xeno.JS
  - transactional outbox
  - outbox pattern
  - Unit of Work
  - domain events
  - PostgreSQL
  - SQLite
  - TypeScript
tags:
  - data
  - outbox
  - unit-of-work
  - domain-events
  - transactions
faqs:
  - question: What is the transactional outbox pattern?
    answer: It stores messages in the same database transaction as business changes so both are committed or rolled back together. A separate process can then dispatch the stored messages.
  - question: How do I use the outbox with Unit of Work in Xeno.JS?
    answer: Enable outbox in the PostgreSQL or SQLite plugin, configure the aggregate name, and pass the aggregate as the second argument to runInTransaction().
  - question: Does enabling the outbox start the worker?
    answer: No. Set outbox.worker to true to register it, then call start() after building the application.
  - question: Does the outbox guarantee exactly-once delivery?
    answer: No. Dispatch and status updates are separate operations, and failures or concurrent workers can cause duplicate dispatches. Handlers should make their side effects idempotent.
  - question: Are domain events written automatically without passing an aggregate?
    answer: No. Pass each aggregate whose uncommitted events should be stored to runInTransaction().
---

## What is the transactional outbox pattern?

The transactional outbox pattern stores a message in the same database transaction as the business change that produced it. If the transaction rolls back, neither change is committed. A separate worker can dispatch the stored message after the transaction completes.

In Xeno.JS, the PostgreSQL and SQLite plugins connect the outbox to [Unit of Work](/docs/data/unit-of-work). When outbox support is enabled, `runInTransaction()` saves the uncommitted events of the supplied aggregate roots after the callback succeeds, using the same database transaction.

This solves the database side of the dual-write problem: an order update and its outbox row succeed or fail together. Dispatch to a handler or external service happens later and has its own failure modes.

## How the outbox and Unit of Work interact

1. A domain operation raises an event on an aggregate root.
2. The application passes the aggregate to `runInTransaction()` and saves its state in the callback.
3. After the callback succeeds, the provider-specific Unit of Work inserts the aggregate's uncommitted events into its outbox table.
4. The database commits the state changes and outbox rows together.
5. If started, the outbox worker polls pending rows and sends events to the event dispatcher.

If the callback or outbox insert fails, the transaction rejects and the database changes roll back. Returning a failure value from the callback does not itself cause rollback: throw or propagate an error instead.

The Unit of Work does not save aggregate state automatically. Use the transaction argument or scoped data-access services for every database operation that belongs to the transaction.

## Configure the outbox

Choose the database provider used by the application. Enable the outbox and set `name` to the lowercase runtime class name of each aggregate. For a class named `Order`, use `order`; the plugin creates `order_outbox_messages`.

The lowercase spelling also matters to the built-in worker: table creation lowercases configured names, while the worker uses the configured names when constructing its queries. Keep aggregate class names stable across builds because the Unit of Work derives table names from `aggregate.constructor.name`, not from the event's `aggregateType`.

### PostgreSQL

```ts
import type { XenoRegistry, } from '@xeno-js/core'
import { XenoAppBuilder, } from '@xeno-js/core'
import type { DbContext, DbTransaction } from '@xeno-js/postgresql'
import { withPostgresql } from '@xeno-js/postgresql'

export interface MyRegistry extends XenoRegistry<DbContext, DbTransaction> { }

const app = new XenoAppBuilder<MyRegistry>()

app.addDb(withPostgresql((options, config) => {
  options.connectionString = config.get('DATABASE_URL')!
  options.outbox = {
    enable: true,
    name: 'order',
    worker: true,
  }
}))
```

### SQLite

```ts
import type { XenoRegistry, } from '@xeno-js/core'
import { XenoAppBuilder, } from '@xeno-js/core'
import type { DbContext, DbTransaction } from '@xeno-js/sqlite'
import { withSqlite } from '@xeno-js/sqlite'

export interface MyRegistry extends XenoRegistry<DbContext, DbTransaction> { }

const app = new XenoAppBuilder<MyRegistry>()

app.addDb(withSqlite((options, config) => {
  options.url = config.get('DATABASE_URL', 'file:./data/app.db')!
  options.outbox = {
    enable: true,
    name: 'order',
    worker: true,
  }
}))
```

For multiple aggregate classes, use an array such as `name: ['order', 'product']`. Each name creates a separate outbox table. An enabled outbox without a name causes configuration to throw. Use fixed, trusted names in configuration.

Set `worker: true` only when this application instance should register the built-in worker. Outbox persistence works without it, but another process must handle dispatch.

## Raise a domain event

The following aggregate records an `OrderConfirmed` event when its state changes. `raise()` assigns the aggregate ID, event version and occurrence time, calls `apply()`, and adds the event to the uncommitted list.

```ts
import { AggregateRoot } from '@xeno-js/shared'
import type { IDomainEvent } from '@xeno-js/shared'

interface OrderProps {
  status: 'draft' | 'confirmed'
}

interface OrderConfirmedPayload {
  status: 'confirmed'
}

class Order extends AggregateRoot<OrderProps, OrderConfirmedPayload, 'Order'> {
  public constructor(props: OrderProps, id?: string) {
    super(props, id)
  }

  public confirm(): void {
    if (this.getProps().status !== 'draft') {
      throw new Error('Only draft orders can be confirmed.')
    }

    this.raise({
      aggregateType: 'Order',
      eventType: 'OrderConfirmed',
      payload: { status: 'confirmed' },
    })
  }

  protected apply(event: IDomainEvent<OrderConfirmedPayload, 'Order'>): void {
    if (event.eventType === 'OrderConfirmed') {
      this.setProps({ ...this.getProps(), status: event.payload.status })
    }
  }
}
```

See [Aggregate Roots](/docs/data/entities/aggregate-root) and [Domain Events](/docs/data/entities/events) for the domain contracts.

## Save aggregate state and events together

Build the configured application and resolve `unitOfWork` inside a service scope. In this example, `orders` is an application-defined Drizzle table and `order` is an `Order` instance loaded or created by the application.

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  order.confirm()

  await services.unitOfWork.runInTransaction(
    async (tx) => {
      await tx.insert(orders).values({
        id: order.id.toString(),
        status: order.getProps().status,
      }).execute()
    },
    order,
  )
})
```

Use an insert for a new order or an update for an existing one. The example uses an insert to show the transaction boundary; the application owns its schema and persistence rules.

Pass an array as the second argument when several aggregates have events to store:

```ts
await unitOfWork.runInTransaction(async (tx) => {
  // Persist both aggregates using tx.
}, [firstOrder, secondOrder])
```

An optional `AbortSignal` can be passed as the third argument. The provider checks whether it is already aborted before beginning the transaction; this check does not guarantee cancellation of work already running.

### Event clearing and rollback

Each provider clears an aggregate's in-memory uncommitted events after inserting its rows, before the database transaction has finished committing. If a later insert or the final commit fails, database changes roll back, but events already cleared from earlier aggregates are not restored in memory. An outbox insert that fails before clearing leaves that aggregate's events in memory.

After any transaction failure, discard affected in-memory aggregate instances and reload or reconstruct them before retrying. Do not manually clear events before `runInTransaction()`.

## Dispatch stored events

With `worker: true`, the plugin registers the worker but does not start it. Start it after building the application and stop it during shutdown:

```ts
const application = await app.build()
const { worker } = application.getServices()

worker.start() // Default polling interval: 5000 ms.

// During application shutdown:
worker.stop()
```

Each poll reads up to 50 `PENDING` messages per configured table, ordered by creation time. A successful dispatcher result marks the row `PUBLISHED`. A failed dispatcher result increments `retry_count`, stores `last_error`, and returns the row to `PENDING`; the third failed attempt marks it `FAILED`. `stop()` prevents future polls; it does not wait for a dispatch already in progress.

The `outbox.handlers` option accepts factories returning application event handlers. With `worker: true`, the plugin calls each factory with the service container and subscribes the returned handler using its `eventType`. Register a handler for each event type that needs processing. The dispatcher returns success when no handler is subscribed, so an unmatched event can be marked `PUBLISHED` without any handler running.

The worker publishes an object containing `eventType`, `aggregateId` and `payload`. It does not pass the outbox row ID, event version, destination, or stored tracing and identity fields to the handler. It also creates a new synthetic request context. Include any stable application-level idempotency key and required business context in the payload; do not assume the original request context is restored.

Publishing here means dispatching to the Xeno.JS event dispatcher. Sending to a message broker, email service, or external API requires an application handler or a separate publisher.

## Delivery limits and operations

The outbox makes the database write atomic; it does not guarantee exactly-once delivery. A handler can complete before the worker records `PUBLISHED`, so a later attempt can repeat its side effect. Make handlers idempotent using an application-defined key carried in the payload and a durable deduplication strategy appropriate to the destination.

The built-in workers do not provide an unconditional at-least-once guarantee:

- PostgreSQL selects pending rows with `FOR UPDATE SKIP LOCKED`, but releases the transaction before dispatch. Multiple workers can select the same row after that transaction ends.
- SQLite marks selected rows `PROCESSING` before dispatch. An interruption can leave rows in that state; the built-in worker only selects `PENDING` rows and has no automatic recovery for stranded `PROCESSING` rows.
- Dispatcher failures stop retrying after three attempts. Unexpected worker errors are logged and do not necessarily follow the same retry path.

Monitor pending and failed rows, retry counts, worker logs and, for SQLite, stranded `PROCESSING` rows. Define an operational recovery procedure before manually changing a row's status: first determine whether its handler already performed an external side effect. Neither provider automatically cleans up published rows, so plan retention according to application requirements.

## Common problems

### No outbox rows appear

Enable the provider's outbox, configure a name matching the aggregate's lowercase runtime class name, and pass the aggregate as the second argument to `runInTransaction()`. The aggregate must have uncommitted events; raising an event alone does not persist it. The core Unit of Work used without the provider's outbox integration does not insert outbox rows.

### Business data changed but no event was stored

Check that the aggregate was passed to the same `runInTransaction()` call as the database write. A write performed before the callback is outside that transaction. Verify that errors are propagated instead of caught and ignored.

### Messages remain pending

Check that the worker is registered with `worker: true`, that `start()` was called, and that the configured name is lowercase and matches the table. Inspect worker logs and `last_error`. A row in `FAILED` needs an application-specific recovery decision; a SQLite row in `PROCESSING` is not retried automatically.

### A message is published without the expected side effect

Confirm that the handler factory is configured, its `eventType` matches the stored event type exactly, and it is subscribed when the worker is registered. An event with no subscribed handlers is treated as a successful dispatch.

### Duplicate effects occur

Do not treat `PUBLISHED` as an exactly-once guarantee. A retry or concurrent worker may dispatch the same event again. Make the handler's side effect idempotent and include a stable deduplication key in the payload.

## Related documentation

- [Unit of Work](/docs/data/unit-of-work)
- [Node PostgreSQL](/docs/data/node-postgresql)
- [SQLite](/docs/data/sqllite)
- [Aggregate Roots](/docs/data/entities/aggregate-root)
- [Domain Events](/docs/data/entities/events)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
