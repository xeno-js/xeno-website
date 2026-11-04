---
title: Node PostgreSQL
description: Learn how to configure PostgreSQL with XenoAppBuilder and withPostgresql(), implement application data-source contracts, use transactions, and run the Outbox worker.
keywords:
- Xeno.JS
- PostgreSQL
- Node PostgreSQL
- database
- data source
- IReadDataSource
- IWriteDataSource
- DB_CONTEXT
- Unit of Work
- XenoAppBuilder
- Drizzle
- TypeScript
tags:
- data
- postgresql
- database
- data-source
- unit-of-work
- XenoAppBuilder
- typescript
faqs:
- question: How do I register PostgreSQL in Xeno.JS?
  answer: Pass withPostgresql() from @xeno-js/postgresql to XenoAppBuilder.addDb().
- question: What configuration does PostgreSQL require?
  answer: Configure PostgreSQL options through the withPostgresql() setup callback.
- question: Which service does Xeno.JS register for PostgreSQL?
  answer: Xeno.JS registers DB_CONTEXT as a scoped database service after addDb() is configured and the application is built.
- question: Does Xeno.JS provide a ready-made application-specific PostgreSQL data source?
  answer: No. Implement the shared IReadDataSource or IWriteDataSource contract for your DTO and inject the PostgreSQL DbContext.
- question: How do I access PostgreSQL from a data source?
  answer: Inject DB_CONTEXT into your data source and implement the required data-source interface methods.
- question: How do I use PostgreSQL inside a transaction?
  answer: Resolve UNIT_OF_WORK in an active service scope and execute related operations inside runInTransaction().
- question: Do I need to call begin(), commit(), or rollback() manually?
  answer: No. The public Unit of Work API is runInTransaction(callback, aggregates?, signal?).
- question: What happens if the transactional callback fails?
  answer: The callback error propagates and the database transaction does not complete successfully.
- question: How do I run the PostgreSQL Outbox worker?
  answer: Enable outbox and worker in withPostgresql(), then resolve the registered worker and call start().
---

## Introduction

If your application uses PostgreSQL, Xeno.JS lets you configure the database during application bootstrap, resolve the scoped database context, and implement application-specific data sources using the shared data-source contracts.

The typical flow is:

```text
PostgreSQL configuration
        ↓
XenoAppBuilder.addDb(withPostgresql())
        ↓
await app.build()
        ↓
resolve scoped DB_CONTEXT
        ↓
application Data Source implementing a shared interface
        ↓
repository / application service / handler
```

For transactional operations, add Unit of Work:

```text
application service / handler
        ↓
UNIT_OF_WORK
        ↓
runInTransaction(...)
        ↓
PostgreSQL Data Source
        ↓
PostgreSQL transaction
```

## Prerequisites

Before configuring PostgreSQL, make sure your application has:

- Node.js 20 or later.
- `@xeno-js/core`.
- `@xeno-js/postgresql`.
- `pg`.
- `drizzle-orm`.
- a reachable PostgreSQL database.
- a PostgreSQL connection string.

Install the PostgreSQL integration and its runtime dependencies:

For example:

```bash
npm install @xeno-js/core @xeno-js/postgresql pg drizzle-orm
```

## Configure PostgreSQL

Configure PostgreSQL with `withPostgresql()` from `@xeno-js/postgresql` and pass the plugin to `XenoAppBuilder.addDb()`.

A minimal configuration is:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options) => {
  options.connectionString = process.env.DATABASE_URL!
}))
```

The connection string is passed to the PostgreSQL provider configured by Xeno.JS.

### Configure the connection from application configuration

`addDb()` receives both the database options and Xeno.JS configuration service.

This allows the connection string to come from your application's configuration source:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

    app.addDb(withPostgresql((options, config) => {
      options.connectionString =
        config.get('DATABASE_URL') ?? process.env.DATABASE_URL!
    }))
```

The configuration key is application-defined. Xeno.JS does not require a specific environment variable name.

## Register PostgreSQL in XenoAppBuilder

The public registration API is:

```ts
app.addDb(withPostgresql(...))
```

Register the database before building the application:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options) => {
  options.connectionString = process.env.DATABASE_URL!
}))

const application = await app.build()
```

After `build()` completes, the database services registered by the database module are available through dependency injection.

Do not create a PostgreSQL `Pool` manually when using the Xeno.JS database registration.

The application should configure the provider through `withPostgresql()` and consume the services exposed by Xeno.JS.

## Resolve the PostgreSQL database context

Xeno.JS registers the database context under the `DB_CONTEXT` token.

`DB_CONTEXT` is scoped. Resolve it from the runtime application's active scope:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const db = services.DB_CONTEXT
  // Use the scoped database context here.
})
```

Do not resolve this scoped service from the builder's root container.

For more information about service resolution and scopes, see:

- [Service Resolution](../dependency-injection/resolution)
- [Scoped Lifetime](../dependency-injection/lifetimes/scoped)
- [Service Container](../dependency-injection/service-container)

## Create a PostgreSQL Data Source

Implement the shared data-source interface required by your application and inject the PostgreSQL `DbContext`. Xeno.JS does not provide a PostgreSQL base data-source class.

## Use a PostgreSQL Data Source

A concrete data source normally receives `DB_CONTEXT` through dependency injection.

For example:

```ts
import { AppError, Enumerable } from '@xeno-js/core'
import type { IReadDataSource, Optional, UserContext } from '@xeno-js/core'
import type { DbContext } from '@xeno-js/postgresql'
import { eq } from 'drizzle-orm'

import { users } from './schema'

type UserDto = typeof users.$inferSelect

export class UserDataSource implements IReadDataSource<UserDto> {
  constructor(private readonly _db: DbContext) {}

  async findAll(
    _ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<UserDto[]> {
    AppError.throwIfAborted(signal, 'UserDataSource.findAll')
    return this._db.select().from(users).execute()
  }

  async findById(
    id: string | number,
    _ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<Optional<UserDto>> {
    AppError.throwIfAborted(signal, 'UserDataSource.findById')
    const result = await this._db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1)
      .execute()
    return Enumerable.firstOrDefault(result)
  }

  async dispose(): Promise<void> {}
}
```

The `users` table and its schema are application-defined. Xeno.JS does not define your application's database schema.

For example, with Drizzle:

```ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
})
```

The query can then use standard Drizzle operators:

```ts
import { eq } from 'drizzle-orm'
```

The important Xeno.JS boundary is:

```text
DB_CONTEXT
    ↓
IReadDataSource<UserDto>
    ↓
UserDataSource
    ↓
application service / repository
```

Your application owns the concrete data-access operations.

## Register a Data Source in Dependency Injection

If the data source is consumed by handlers or application services, register it in the service container.

Because `DB_CONTEXT` is scoped, the concrete data source should normally be scoped as well.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options) => {
  options.connectionString = process.env.DATABASE_URL!
}))

app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

await app.build()
```

Your application's registry type should include custom tokens when you want those services to be strongly typed through the runtime application's `getServices()`.

The important lifetime relationship is:

```text
DB_CONTEXT          → scoped
USER_DATA_SOURCE    → scoped
```

The data source receives the database context belonging to the same scope.

For general service registration rules, see [Registration](../dependency-injection/registration) and [Scoped Lifetime](../dependency-injection/lifetimes/scoped).

## Use Unit of Work with PostgreSQL

Use Unit of Work when multiple database operations must succeed or fail together.

Xeno.JS registers Unit of Work under:

```ts
UNIT_OF_WORK
```

Resolve it from an active application scope:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
  await unitOfWork.runInTransaction(async (tx) => {
    // Database operations use this transaction context.
  })
})
```

The public API does not require manual:

```ts
begin()
commit()
rollback()
```

Instead, `runInTransaction()` defines the transaction boundary.

### Transactional application operation

A realistic operation can combine multiple data changes:

```ts
await application.runInScope(async (services) => {
  await services.UNIT_OF_WORK.runInTransaction(async (tx) => {
    await tx.insert(users).values({
      email: 'alice@example.com',
    })
  })
})
```

If the callback completes successfully, the transactional operation completes successfully.

If the callback throws, the error propagates and the transaction does not complete successfully.

Keep the related database operations inside the same `runInTransaction()` callback when they must share one transaction.

## Run the PostgreSQL Outbox worker

When aggregates are passed to `runInTransaction()`, the Unit of Work writes their uncommitted events to the Outbox in that PostgreSQL transaction. Enable this integration by setting `outbox.enable` and providing one or more aggregate names. The plugin creates a `<name-lowercase>_outbox_messages` table for each name; a name is required when the Outbox is enabled.

Set `outbox.worker` to `true` to register the background worker and optionally configure event handlers. Registering the worker does not start its polling loop: the application must start it explicitly.

```ts
app.addDb(withPostgresql((options) => {
  options.connectionString = process.env.DATABASE_URL!
  options.outbox = {
    enable: true,
    name: 'Order',
    worker: true,
  }
}))
```

After building the application, start the worker from the runtime services and stop it during shutdown:

```ts
const application = await app.build()
const { worker } = application.getServices()

worker.start(5000)

// During application shutdown:
worker.stop()
```

The interval defaults to 5 seconds. Each polling pass handles at most 50 pending messages per configured Outbox table. Failed dispatches are retried; after the third failed attempt, the worker marks a message as `FAILED`. The worker dispatches events in a synthetic request context.

Use the configured `outbox.handlers` factories to provide handlers for events read from the Outbox. The plugin invokes each factory with the service container and subscribes the returned handler to the event dispatcher when it registers the worker.

## Complete example

A minimal application can be structured like this:

```text
src/
├── app.ts
├── data/
│   ├── schema.ts
│   └── user.data-source.ts
└── users/
    └── user.service.ts
```

### `src/data/schema.ts`

```ts
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
})
```

### `src/data/user.data-source.ts`

```ts
import { eq } from 'drizzle-orm'
import { AppError, Enumerable } from '@xeno-js/core'
import type { IReadDataSource, Optional, UserContext } from '@xeno-js/core'
import type { DbContext } from '@xeno-js/postgresql'

import { users } from './schema'

type UserDto = typeof users.$inferSelect

export class UserDataSource implements IReadDataSource<UserDto> {
  constructor(private readonly _db: DbContext) {}

  async findAll(
    _ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<UserDto[]> {
    AppError.throwIfAborted(signal, 'UserDataSource.findAll')
    return this._db.select().from(users).execute()
  }

  async findById(
    id: string | number,
    _ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<Optional<UserDto>> {
    AppError.throwIfAborted(signal, 'UserDataSource.findById')
    const result = await this._db
      .select()
      .from(users)
      .where(eq(users.id, Number(id)))
      .limit(1)
      .execute()
    return Enumerable.firstOrDefault(result)
  }

  async dispose(): Promise<void> {}
}
```

### `src/app.ts`

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

import { UserDataSource } from './data/user.data-source'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options, config) => {
  options.connectionString =
    config.get('DATABASE_URL') ?? process.env.DATABASE_URL!
}))

app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

await app.build()
```

At this point:

1. PostgreSQL is configured.
2. `addDb()` registers the database infrastructure.
3. `DB_CONTEXT` is available through DI.
4. `UserDataSource` receives `DB_CONTEXT`.
5. Application code can consume `USER_DATA_SOURCE`.

For production applications, keep the connection string outside source code and provide it through your application's configuration environment.

## Troubleshooting

### PostgreSQL is not configured

If `addDb()` is not called, the database module is not registered.

Check that bootstrap contains:

```ts
app.addDb(withPostgresql((options) => {
  options.connectionString = process.env.DATABASE_URL!
}))
```

and that the application is built afterward:

```ts
await app.build()
```

### `DB_CONTEXT` cannot be resolved

Check that:

1. `addDb()` is registered.
2. `await app.build()` has completed before resolving the service.
3. resolution occurs inside an active application scope using the registered token:

```ts
await application.runInScope(async (services) => {
  const db = services.DB_CONTEXT
})
```

If the problem is related to service lifetimes or resolution, see [Service Resolution](../dependency-injection/resolution).

### The data source does not satisfy its contract

Implement the shared data-source interface used by the application, and inject `DbContext` into the implementation. Keep provider-specific Drizzle queries inside the data source rather than exposing the database context to callers.

### Transactional work is not behaving as one unit

Make sure all operations that must succeed or fail together execute inside the same:

```ts
unitOfWork.runInTransaction(...)
```

For example:

```ts
await unitOfWork.runInTransaction(
  async (tx) => {
    // Execute all related PostgreSQL operations with tx.
  },
)
```

Do not split operations that must be atomic across separate transaction callbacks.

### Unit of Work cannot be resolved

`UNIT_OF_WORK` is registered by the database module.

Check that PostgreSQL was registered with `addDb()` and that the application has been built:

```ts
app.addDb(withPostgresql(...))
await app.build()
```

For general DI problems, see [Resolution](../dependency-injection/resolution).

## Related docs

- [Data Overview](./overview)
- [SQLite](./sqlite)
- [Unit of Work](./unit-of-work)
- [Service Container](../dependency-injection/service-container)
- [Registration](../dependency-injection/registration)
- [Service Resolution](../dependency-injection/resolution)
- [Scoped Lifetime](../dependency-injection/lifetimes/scoped)
- [Dependency Graph](../dependency-injection/dependency-graph)
- [CQRS Commands](../application/cqrs/command)
- [CQRS Queries](../application/cqrs/query)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
