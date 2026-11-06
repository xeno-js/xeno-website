---
title: Aggregate Roots
description: Model aggregate boundaries with versioned domain events and explicit state changes.
keywords:
  - Xeno.JS
  - AggregateRoot
  - aggregate
  - domain event
  - domain-driven design
tags:
  - data
  - entities
  - aggregate-root
faqs:
  - question: What does AggregateRoot add to Entity?
    answer: It adds a version number and records domain events raised by the aggregate, while retaining the entity's identity and state behavior.
  - question: Does raising a domain event update the aggregate state?
    answer: The aggregate's apply() implementation updates state. AggregateRoot calls apply() when an event is raised and when history is replayed.
  - question: Does loadFromHistory() add replayed events to the uncommitted list?
    answer: No. It applies each event with isNew set to false and updates the aggregate version without adding those events to the uncommitted list.
  - question: Does AggregateRoot persist or publish its events?
    answer: No. It exposes uncommitted events for the application and infrastructure layers to handle.
---

## Introduction

An aggregate groups domain objects that must remain consistent under one boundary. Its aggregate root is the entity through which application code changes that group. In Xeno.JS, extend `AggregateRoot` when the root also needs versioned domain events and event replay.

## The Problem

Changing an aggregate's state directly does not record what happened, and independently updating objects inside an aggregate can bypass its invariants. Persistence and other parts of the system may also need to know which domain changes have not yet been committed.

## The Principle

Use the aggregate root as the boundary for domain operations. Keep its state changes behind methods that enforce the aggregate's rules, and represent meaningful changes as domain events.

The aggregate root belongs in the domain layer. Application services coordinate commands and persistence; infrastructure implements storage and event delivery. `AggregateRoot` does not persist or publish events itself.

## The Mechanism

`AggregateRoot<TProps, TEvent, TId>` extends `Entity<TProps, TId>` and provides:

- the stable `id` and property access inherited from `Entity`;
- a `version` that starts at `0` and advances when the root raises an event;
- `getUncommittedEvents()`, which returns a new array containing the pending events;
- `clearUncommittedEvents()`, which empties the pending event list without resetting state or version;
- `loadFromHistory()`, which applies stored events with `isNew` set to `false` and sets the version to each event's version;
- the protected `raise()` method, which assigns the aggregate ID, next version, and occurrence time before applying and recording an event;
- the protected abstract `apply()` method, which the concrete aggregate implements to update its state.

The event type `IDomainEvent<TEvent, TId>` includes `aggregateId`, `aggregateType`, `eventType`, `version`, `occurredAt`, and `payload`. It can also include an optional `destination`.

The root's `apply()` method owns the state transition. The base class calls it with `isNew: true` for a newly raised event and `isNew: false` when replaying history. It does not validate history ordering, version gaps, or aggregate identity, so the caller must provide history belonging to that aggregate in the intended order.

## Implement an Aggregate Root

The `Order` aggregate keeps its confirmation rule in the domain and applies the same state transition both for a new event and for replay:

```ts
import { AggregateRoot } from '@xeno-js/shared'
import type { IDomainEvent } from '@xeno-js/shared'

interface OrderProps {
  status: 'draft' | 'confirmed'
}

interface OrderEventPayload {
  status: 'confirmed'
}

export class Order extends AggregateRoot<OrderProps, OrderEventPayload, 'Order'> {
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

  protected apply(event: IDomainEvent<OrderEventPayload, 'Order'>, _isNew: boolean): void {
    if (event.eventType === 'OrderConfirmed') {
      this.setProps({ ...this.getProps(), status: event.payload.status })
    }
  }
}

const order = new Order({ status: 'draft' })
order.confirm()

console.log(order.getProps().status) // 'confirmed'
console.log(order.version) // 1
console.log(order.getUncommittedEvents()[0].eventType) // 'OrderConfirmed'
```

`raise()` is protected so callers cannot bypass the aggregate's domain methods. The example's `confirm()` method checks the current state before raising the event; `apply()` performs the actual state transition.

## Replay Event History

Create an aggregate with its persisted ID, then apply its ordered history to reconstruct state and version:

```ts
import { AggregateRoot, UniqueId } from '@xeno-js/shared'
import type { IDomainEvent } from '@xeno-js/shared'

interface OrderProps {
  status: 'draft' | 'confirmed'
}

interface OrderEventPayload {
  status: 'confirmed'
}

class Order extends AggregateRoot<OrderProps, OrderEventPayload, 'Order'> {
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

  protected apply(event: IDomainEvent<OrderEventPayload, 'Order'>, _isNew: boolean): void {
    if (event.eventType === 'OrderConfirmed') {
      this.setProps({ ...this.getProps(), status: event.payload.status })
    }
  }
}

const orderId = 'c0a80123-4567-489a-8abc-1234567890ab'
const history: IDomainEvent<OrderEventPayload, 'Order'>[] = [
  {
    aggregateId: UniqueId.create('Order', orderId),
    aggregateType: 'Order',
    eventType: 'OrderConfirmed',
    version: 1,
    occurredAt: new Date('2025-01-15T10:00:00.000Z'),
    payload: { status: 'confirmed' },
  },
]

const restoredOrder = new Order({ status: 'draft' }, orderId)
restoredOrder.loadFromHistory(history)

console.log(restoredOrder.getProps().status) // 'confirmed'
console.log(restoredOrder.version) // 1
console.log(restoredOrder.getUncommittedEvents().length) // 0
```

The history event's aggregate ID must match the restored root. `loadFromHistory()` does not add replayed events to the uncommitted list. It also does not clear events already pending on the instance, so replay history into a newly constructed root.

## Handling Uncommitted Events

After an application operation changes an aggregate, it can read the pending events and pass them to the persistence workflow. Clear the list only when that workflow has successfully handled them:

```ts
const pendingEvents = order.getUncommittedEvents()

// Persist the aggregate and pendingEvents in the application's persistence workflow.
order.clearUncommittedEvents()
```

`getUncommittedEvents()` copies the array, but not the event objects inside it. Treat returned events as read-only. `clearUncommittedEvents()` only clears the in-memory list; it does not persist events, publish them, or roll back the aggregate's state.

## Behavior

- New aggregates start at version `0`.
- `raise()` increments the version and assigns the current time before applying the event; it adds the event to the uncommitted list only after `apply()` returns.
- If `apply()` throws, `raise()` does not add the event to the uncommitted list, but the version has already advanced. Validate domain operations before calling `raise()`.
- `loadFromHistory()` applies events without adding them to the uncommitted list and sets the version to the version of each event as it iterates.
- `clearUncommittedEvents()` clears pending events but leaves state and version unchanged.
- The base class does not validate event order, version continuity, aggregate identity, or domain rules. The concrete aggregate and calling workflow own those responsibilities.

## Related Documentation

- [Entities](./entity)
- [Unique ID](./unique-id)
- [Value Objects](./value-object)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support of these awesome people. If you'd like to join them, please read more at [support section](../../../support-us).
