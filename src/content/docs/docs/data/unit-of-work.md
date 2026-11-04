---
title: Unit of Work
description: Learn how to use Unit of Work in Xeno.JS to execute multiple database operations as one transactional operation.
keywords:
- Xeno.JS
- Unit of Work
- transaction
- runInTransaction
- UNIT_OF_WORK
- DB_CONTEXT
- database
- transactions
- XenoAppBuilder
- TypeScript
tags:
- data
- unit-of-work
- transaction
- database
- dependency-injection
- XenoAppBuilder
- typescript
faqs:
- question: How do I use Unit of Work in Xeno.JS?
  answer: Resolve UNIT_OF_WORK from an active service scope and call runInTransaction() with the database work that must execute transactionally.
- question: Does Xeno.JS expose begin(), commit(), or rollback() methods?
  answer: No. The public Unit of Work API is runInTransaction(callback, aggregates?, signal?).
- question: How does a transaction commit?
  answer: When the runInTransaction() callback completes successfully, the transaction completes successfully.
- question: What happens when the transaction callback fails?
  answer: The callback error is propagated to the caller and the transaction does not complete successfully.
- question: How do I roll back a transaction?
  answer: Throw or propagate an error from the runInTransaction() callback. Xeno.JS handles the transaction boundary through the Unit of Work API.
- question: How do I resolve UNIT_OF_WORK?
  answer: Resolve UNIT_OF_WORK from an active IServiceScope, or use the current request scope when your application already runs inside one.
- question: What lifetime does Unit of Work use?
  answer: Unit of Work is registered as a scoped service by the database module.
- question: Can I pass an AbortSignal to runInTransaction()?
  answer: Yes. Pass an optional AbortSignal as the third argument, or as the second argument when no aggregates are supplied. The Unit of Work checks whether it has already been aborted before starting the transaction.
- question: Do I need to configure a database before using Unit of Work?
  answer: Yes. Unit of Work is registered by the database module, so addDb() must be configured and the application must be built before resolving UNIT_OF_WORK.
---

## Introduction

Use Unit of Work when multiple database operations must succeed or fail together.

A typical application operation looks like this:

```text
Application service / handler
        ↓
Unit of Work
        ↓
Repository / Data Source
        ↓
Database
```

The shared contract accepts a callback, optional aggregate root(s), and an optional cancellation signal:

```text
await unitOfWork.runInTransaction(callback, aggregates?, signal?)
```

You do not manually call `begin()`, `commit()`, or `rollback()`.

## Prerequisites

Before using Unit of Work:

1. Configure a database plugin with `XenoAppBuilder.addDb()`.
2. Build the application.
3. Execute the transactional operation inside an active service scope.
4. Resolve `UNIT_OF_WORK` from that scope.

For provider-specific configuration, see:

- [Node PostgreSQL](./node-postgresql)
- [SQLite](./sqlite)

For the DI concepts used by this page, see:

- [Registration](../dependency-injection/registration)
- [Resolution](../dependency-injection/resolution)
- [Scoped Lifetime](../dependency-injection/lifetimes/scoped)

## Configure the Database

Unit of Work is registered by the database module, so the database must be configured during application bootstrap.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options, config) => {
  options.connectionString = config.get('DATABASE_URL')!
}))
```

For SQLite, enable the SQLite provider:

```ts
import { withSqlite } from '@xeno-js/sqlite'

app.addDb(withSqlite((options, config) => {
  options.url = config.get('DATABASE_URL', 'file:./data/app.db')!
}))
```

The provider configuration belongs in application bootstrap. Unit of Work does not require a separate transaction configuration.

## Build the Application

Build the application before resolving `UNIT_OF_WORK`:

```ts
const application = await app.build()
```

`build()` returns the runtime application. Resolve scoped services through its active scope.

`UNIT_OF_WORK` is a scoped service, so it must be resolved from an active scope.

## Resolve Unit of Work

Use `runInScope()` to resolve `UNIT_OF_WORK` for an operation:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
  // transactional work
})
```

The scope determines the lifetime of the Unit of Work instance and is disposed when the callback completes.

In a request-driven application, the framework integration may already provide an active service scope. In that case, resolve the service from the current application scope instead of creating a second scope unnecessarily.

## Start Transactional Work

Call `runInTransaction()` with an asynchronous callback:

```ts
await unitOfWork.runInTransaction(
  async (tx) => {
    // Execute database operations with tx.
  },
)
```

The callback contains the complete set of operations that must execute as one transaction.

The callback receives the transaction context. The second argument is for aggregate root(s); the third is an optional `AbortSignal`. When no aggregates are supplied, pass `undefined` before the signal.

## Base and Provider-Specific Implementations

The shared `IUnitOfWork<TTransaction>` contract is provider-neutral. The core `UnitOfWork` implementation runs the callback through the configured transactional database and supplies its active transaction as `tx`. It also exposes that transaction to scoped `DB_CONTEXT` consumers for the duration of the callback, then clears the transaction state.

SQLite and PostgreSQL use the same callback contract, with `tx` typed as their Drizzle database context. When their Outbox option is enabled, the database plugin supplies a provider-specific Unit of Work: after the callback succeeds, it writes any uncommitted events from the supplied aggregate root(s) to the Outbox table in that transaction. Configure the Outbox and a name for each aggregate type in the provider plugin; passing aggregates alone to the core implementation does not persist events.

For example, the provider-specific call shape is:

```ts
await unitOfWork.runInTransaction(
  async (tx) => {
    await tx.insert(orders).values(orderDto).execute()
  },
  order,
  signal,
)
```

The Outbox argument is optional. Without an aggregate argument, `runInTransaction(callback)` executes the ordinary database transaction. See [Node PostgreSQL](./node-postgresql) and [SQLite](./sqlite) for provider-specific Outbox configuration.

## Perform Multiple Data Operations

Unit of Work is useful when one application operation changes multiple pieces of data.

For example, creating a user may require both a user record and a related profile:

```ts
class UserService {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly users: UserRepository,
    private readonly profiles: ProfileRepository,
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    return this.unitOfWork.runInTransaction(
      async (_tx) => {
        const user = await this.users.create({
          email: input.email,
          name: input.name,
        })

        await this.profiles.create({
          userId: user.id,
          displayName: input.displayName,
        })

        return user
      },
    )
  }
}
```

The repositories in this example are application-defined. The important Xeno.JS contract is the transaction boundary around the application operation.

Resolve the Unit of Work and the repositories from the same active scope. The scoped `DB_CONTEXT` exposes the transaction opened by `runInTransaction()` to data-access services used by the callback.

If `users.create()` and `profiles.create()` both succeed, the callback completes successfully.

If either operation fails, the callback rejects and the transaction does not complete successfully.

## Commit and Rollback Behavior

Xeno.JS exposes transaction boundaries through `runInTransaction()` rather than separate commit and rollback methods.

### Successful callback

When the callback completes successfully:

```ts
await unitOfWork.runInTransaction(
  async (_tx) => {
    await users.create(user)
    await profiles.create(profile)
  },
)
```

the transaction completes successfully.

There is no explicit `commit()` call.

### Failed callback

When an operation throws an error:

```ts
await unitOfWork.runInTransaction(
  async (_tx) => {
    await users.create(user)

    throw new Error('Profile creation failed')
  },
)
```

the error is propagated to the caller.

There is no explicit `rollback()` call.

Handle the application error at the appropriate application boundary:

```ts
try {
  await unitOfWork.runInTransaction(
    async (_tx) => {
      await users.create(user)
      await profiles.create(profile)
    },
  )
} catch (error) {
  // Handle or propagate the application failure.
  throw error
}
```

Do not catch an error only to continue execution as if the transactional operation had succeeded.

## Use an AbortSignal

`runInTransaction()` accepts an optional `AbortSignal`:

```ts
const controller = new AbortController()

await unitOfWork.runInTransaction(
  async (_tx) => {
    await users.create(user)
  },
  undefined,
  controller.signal,
)
```

If the signal has already been aborted when `runInTransaction()` is called, Xeno.JS rejects the operation before starting the transaction.

Use the signal when the surrounding application operation already has cancellation semantics.

## Complete PostgreSQL Example

The following example shows the complete application-level flow:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'
import { sql } from 'drizzle-orm'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options) => {
  options.connectionString = process.env.DATABASE_URL!
}))

const application = await app.build()

await application.runInScope(async (services) => {
  return services.UNIT_OF_WORK.runInTransaction(async (tx) => {
    return tx.execute(sql`select 1`)
  })
})
```

The important flow is:

```text
addDb(withPostgresql(...))
  ↓
app.build()
  ↓
application.runInScope(...)
  ↓
services.UNIT_OF_WORK
  ↓
runInTransaction(...)
```

Replace the example query with the operations required by your application. For business workflows, keep application services and scoped repositories inside the same `runInScope()` callback.

## Use Unit of Work from a Handler

Unit of Work normally belongs below the transport boundary.

For a CQRS command, the flow can be:

```text
HTTP / transport
      ↓
Command
      ↓
Command Handler
      ↓
Application Service
      ↓
Unit of Work
      ↓
Data Source / Repository
      ↓
Database
```

For example:

```ts
class CreateUserHandler {
  constructor(private readonly users: UserService) {}

  async execute(command: CreateUserCommand): Promise<User> {
    return this.users.createUser({
      email: command.email,
      name: command.name,
      displayName: command.displayName,
    })
  }
}
```

The handler does not need to manage transaction boundaries directly when the application service owns the transactional operation.

This keeps transaction management in the application layer rather than in the HTTP or transport layer.

## Common Problems

### `UNIT_OF_WORK` cannot be resolved

Make sure that:

1. `addDb()` was called during bootstrap.
2. The application was built with `await app.build()`.
3. You are resolving `UNIT_OF_WORK` from an active service scope.
4. The database module was not omitted from the application bootstrap.

Example:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
})
```

### Resolving a scoped service from the root container

`UNIT_OF_WORK` is scoped.

Do not do this:

```ts
const application = await app.build()

// Do not resolve UNIT_OF_WORK from the root application services.
application.getServices().UNIT_OF_WORK
```

Resolve it inside a scoped operation:

```ts
await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
})
```

See [Scoped Lifetime](../dependency-injection/lifetimes/scoped) for the general DI lifetime rules.

### Transaction work is not grouped together

Make sure every operation that must succeed or fail together is inside the same callback:

```ts
await unitOfWork.runInTransaction(
  async (_tx) => {
    await users.create(user)
    await profiles.create(profile)
    await auditLog.create(entry)
  },
)
```

Operations performed outside the callback are not part of that transaction boundary.

### Manually calling `commit()` or `rollback()`

Do not add manual transaction control around `runInTransaction()`.

The public API is:

```text
await unitOfWork.runInTransaction(callback, aggregates?, signal?)
```

The callback defines the transactional operation.

### The transaction callback throws

A failure from the callback is propagated to the caller.

Handle the error at the application boundary where the operation should be reported, retried, or converted into an application error.

Do not assume that returning a failure value automatically represents a transaction failure. If the operation must fail transactionally, let the callback reject.

## Unit of Work and Data Sources

Unit of Work defines the transaction boundary; the provider-specific Data Source performs the actual data access.

For example:

```text
Unit of Work
    ↓
transactional application operation
    ↓
PostgreSQL Data Source
    ↓
PostgreSQL
```

or:

```text
Unit of Work
    ↓
transactional application operation
    ↓
SQLite Data Source
    ↓
SQLite
```

The same Unit of Work API is used with the database plugin configured through `XenoAppBuilder.addDb()`.

Provider-specific setup belongs in the provider documentation:

- [Node PostgreSQL](./node-postgresql)
- [SQLite](./sqlite)

## Related Docs

### Data

- [Data Overview](./overview)
- [Node PostgreSQL](./node-postgresql)
- [SQLite](./sqlite)

### Dependency Injection

- [Service Container](../dependency-injection/service-container)
- [Registration](../dependency-injection/registration)
- [Resolution](../dependency-injection/resolution)
- [Scoped Lifetime](../dependency-injection/lifetimes/scoped)
- [Dependency Graph](../dependency-injection/dependency-graph)

### Application

- [Commands](../application/cqrs/command)
- [Command Handlers](../application/cqrs/handler)
- [Queries](../application/cqrs/query)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
