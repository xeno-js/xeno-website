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
- AppBuilder
- TypeScript
tags:
- data
- unit-of-work
- transaction
- database
- dependency-injection
- appbuilder
- typescript
faqs:
- question: How do I use Unit of Work in Xeno.JS?
  answer: Resolve UNIT_OF_WORK from an active service scope and call runInTransaction() with the database work that must execute transactionally.
- question: Does Xeno.JS expose begin(), commit(), or rollback() methods?
  answer: No. The public Unit of Work API is runInTransaction(callback, signal).
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
  answer: Yes. runInTransaction() accepts an optional AbortSignal and checks whether it has already been aborted before starting the transaction.
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

In Xeno.JS, the public transaction API is:

```ts
await unitOfWork.runInTransaction(callback, signal)
```

You do not manually call `begin()`, `commit()`, or `rollback()`.

## Prerequisites

Before using Unit of Work:

1. Configure a database with `AppBuilder.addDb()`.
2. Build the application.
3. Execute the transactional operation inside an active service scope.
4. Resolve `UNIT_OF_WORK` from that scope.

For provider-specific configuration, see:

* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqlite)

For the DI concepts used by this page, see:

* [Registration](../dependency-injection/registration)
* [Resolution](../dependency-injection/resolution)
* [Scoped Lifetime](../dependency-injection/lifetimes/scoped)

## Configure the Database

Unit of Work is registered by the database module, so the database must be configured during application bootstrap.

For example:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.getOrThrow('DB_CONNECTION_STRING')
})
```

For SQLite, enable the SQLite provider:

```ts
app.addDb((options, config) => {
  options.connectionString =
    config.get('DB_CONNECTION_STRING', 'file:./data/app.db')

  options.enableSqlLite = true
})
```

The provider configuration belongs in application bootstrap. Unit of Work does not require a separate transaction configuration.

## Build the Application

Build the application before resolving `UNIT_OF_WORK`:

```ts
const container = await app.build()
```

The returned container exposes the configured dependency-injection services.

`UNIT_OF_WORK` is a scoped service, so it must be resolved from an active scope.

## Resolve Unit of Work

Create a service scope and resolve `UNIT_OF_WORK` from it:

```ts
const scope = container.createScope()

try {
  const unitOfWork = scope.resolve('UNIT_OF_WORK')

  // transactional work
} finally {
  await scope.dispose()
}
```

The scope determines the lifetime of the Unit of Work instance.

In a request-driven application, the framework integration may already provide an active service scope. In that case, resolve the service from the current application scope instead of creating a second scope unnecessarily.

## Start Transactional Work

Call `runInTransaction()` with an asynchronous callback:

```ts
const result = await unitOfWork.runInTransaction(
  async () => {
    // database operations
    return result
  },
  undefined,
)
```

The callback contains the complete set of operations that must execute as one transaction.

The second argument is an optional `AbortSignal`. Pass `undefined` when cancellation is not required.

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
      async () => {
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
      undefined,
    )
  }
}
```

The repositories in this example are application-defined. The important Xeno.JS contract is the transaction boundary around the application operation.

If `users.create()` and `profiles.create()` both succeed, the callback completes successfully.

If either operation fails, the callback rejects and the transaction does not complete successfully.

## Commit and Rollback Behavior

Xeno.JS exposes transaction boundaries through `runInTransaction()` rather than separate commit and rollback methods.

### Successful callback

When the callback completes successfully:

```ts
await unitOfWork.runInTransaction(
  async () => {
    await users.create(user)
    await profiles.create(profile)
  },
  undefined,
)
```

the transaction completes successfully.

There is no explicit `commit()` call.

### Failed callback

When an operation throws an error:

```ts
await unitOfWork.runInTransaction(
  async () => {
    await users.create(user)

    throw new Error('Profile creation failed')
  },
  undefined,
)
```

the error is propagated to the caller.

There is no explicit `rollback()` call.

Handle the application error at the appropriate application boundary:

```ts
try {
  await unitOfWork.runInTransaction(
    async () => {
      await users.create(user)
      await profiles.create(profile)
    },
    undefined,
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
  async () => {
    await users.create(user)
  },
  controller.signal,
)
```

If the signal has already been aborted when `runInTransaction()` is called, Xeno.JS rejects the operation before starting the transaction.

Use the signal when the surrounding application operation already has cancellation semantics.

## Complete Example

The following example shows the complete application-level flow:

```ts
import { AppBuilder } from '@xeno-js/core'
import type { IUnitOfWork } from '@xeno-js/shared'

interface CreateUserInput {
  email: string
  name: string
  displayName: string
}

interface User {
  id: string
  email: string
  name: string
}

interface UserRepository {
  create(input: {
    email: string
    name: string
  }): Promise<User>
}

interface ProfileRepository {
  create(input: {
    userId: string
    displayName: string
  }): Promise<void>
}

class UserService {
  constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly users: UserRepository,
    private readonly profiles: ProfileRepository,
  ) {}

  async createUser(input: CreateUserInput): Promise<User> {
    return this.unitOfWork.runInTransaction(
      async () => {
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
      undefined,
    )
  }
}

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get(
      'DB_CONNECTION_STRING',
      'postgres://username:password@localhost:5432/myapp',
    )
})

const container = await app.build()

const scope = container.createScope()

try {
  const unitOfWork = scope.resolve('UNIT_OF_WORK')

  const userService = new UserService(
    unitOfWork,
    userRepository,
    profileRepository,
  )

  await userService.createUser({
    email: 'alice@example.com',
    name: 'Alice',
    displayName: 'Alice',
  })
} finally {
  await scope.dispose()
}
```

The repository instances in this example represent application-specific data-access services. They are intentionally separate from the Unit of Work API.

The important flow is:

```text
addDb()
  ↓
app.build()
  ↓
createScope()
  ↓
resolve('UNIT_OF_WORK')
  ↓
runInTransaction(...)
  ↓
repository / data-source operations
```

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
const container = await app.build()
const scope = container.createScope()

try {
  const unitOfWork = scope.resolve('UNIT_OF_WORK')
} finally {
  await scope.dispose()
}
```

### Resolving a scoped service from the root container

`UNIT_OF_WORK` is scoped.

Do not do this:

```ts
const container = await app.build()

container.resolve('UNIT_OF_WORK')
```

Resolve it from an `IServiceScope`:

```ts
const scope = container.createScope()

try {
  const unitOfWork = scope.resolve('UNIT_OF_WORK')
} finally {
  await scope.dispose()
}
```

See [Scoped Lifetime](../dependency-injection/lifetimes/scoped) for the general DI lifetime rules.

### Transaction work is not grouped together

Make sure every operation that must succeed or fail together is inside the same callback:

```ts
await unitOfWork.runInTransaction(
  async () => {
    await users.create(user)
    await profiles.create(profile)
    await auditLog.create(entry)
  },
  undefined,
)
```

Operations performed outside the callback are not part of that transaction boundary.

### Manually calling `commit()` or `rollback()`

Do not add manual transaction control around `runInTransaction()`.

The public API is:

```ts
await unitOfWork.runInTransaction(callback, signal)
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

The same Unit of Work API is used with the database configured through `AppBuilder.addDb()`.

Provider-specific setup belongs in the provider documentation:

* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqlite)

## Related Docs

### Data

* [Data Overview](./overview)
* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqlite)

### Dependency Injection

* [Service Container](../dependency-injection/service-container)
* [Registration](../dependency-injection/registration)
* [Resolution](../dependency-injection/resolution)
* [Scoped Lifetime](../dependency-injection/lifetimes/scoped)
* [Dependency Graph](../dependency-injection/dependency-graph)

### Application

* [Commands](../application/cqrs/command)
* [Command Handlers](../application/cqrs/handler)
* [Queries](../application/cqrs/query)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
