---
title: SQLite
description: Learn how to configure SQLite with XenoAppBuilder and withSqlite(), resolve scoped database services, create a data source, and use transactions with Xeno.JS.
keywords:
- Xeno.JS
- SQLite
- libSQL
- database
- data source
- BaseSqliteSqlDataSource
- DB_CONTEXT
- Unit of Work
- XenoAppBuilder
- TypeScript
tags:
- data
- sqlite
- libsql
- database
- data-source
- unit-of-work
- app-builder
- typescript
faqs:
- question: How do I register SQLite in Xeno.JS?
  answer: Pass withSqlite() from @xeno-js/sqlite to XenoAppBuilder.addDb().
- question: What configuration does SQLite require?
  answer: withSqlite() reads DATABASE_URL and DB_AUTH_TOKEN from configuration; override its url or other libSQL options in the setup callback when needed.
- question: Which database service does Xeno.JS register for SQLite?
  answer: Xeno.JS registers DB_CONTEXT as a scoped database service when the application is built.
- question: Does Xeno.JS provide a ready-made SQLite repository?
  answer: No. Xeno.JS provides BaseSqliteSqlDataSource. Your application creates a concrete data source by extending that class.
- question: How do I access SQLite from a data source?
  answer: Extend BaseSqliteSqlDataSource and use its protected db property in the concrete data source.
- question: How do I resolve DB_CONTEXT?
  answer: Resolve DB_CONTEXT from scoped services inside XenoApplication.runInScope().
- question: How do I use SQLite inside a transaction?
  answer: Resolve UNIT_OF_WORK from an active scope and execute the related data operations inside runInTransaction().
- question: Do I need to call begin(), commit(), or rollback() manually?
  answer: No. Use UnitOfWork.runInTransaction(callback, aggregates?, signal?).
- question: What happens when transactional work fails?
  answer: If the transactional callback fails, the transaction does not complete successfully and the error propagates to the caller.
---

## Introduction

Use the SQLite/libSQL integration when your application needs relational data access through Xeno.JS, whether the database runs locally or through a libSQL service.

The workflow is:

1. Configure the SQLite connection.
2. Register the SQLite plugin with `XenoAppBuilder.addDb()`.
3. Build the application.
4. Resolve `DB_CONTEXT` inside an active service scope.
6. Use `UNIT_OF_WORK` when multiple database operations must execute transactionally.

Xeno.JS provides the application-facing database integration. Your repositories and application services decide how that database access is used by the application.

## Prerequisites

Before configuring SQLite, make sure that:

- your application uses `@xeno-js/core`;
- the SQLite/libSQL database dependencies required by your application are installed;
- you have a SQLite connection URL accepted by the configured SQLite/libSQL client;
- your application bootstraps through `XenoAppBuilder`.

For example:

```bash
npm install @xeno-js/core @xeno-js/sqlite drizzle-orm @libsql/client
```

The exact dependency versions should follow the versions used by your Xeno.JS installation.

## Configure SQLite

Configure SQLite with `withSqlite()` from `@xeno-js/sqlite`. By default, the plugin reads `DATABASE_URL` and `DB_AUTH_TOKEN` from the configuration service and sets the libSQL concurrency option to `50`. Override these values in the setup callback when required.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSqlite } from '@xeno-js/sqlite'

const app = new XenoAppBuilder()

app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
}))

const application = await app.build()
```

The `url` option is passed to the libSQL client. Use a URL supported by that client, such as a local `file:` URL.

## Register SQLite in XenoAppBuilder

Register `withSqlite()` during application bootstrap with `addDb()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSqlite } from '@xeno-js/sqlite'

const app = new XenoAppBuilder()

app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
}))

const application = await app.build()
```

Call `build()` before resolving application services.

`addDb()` accepts a database plugin. The plugin configures the client and queues the database module; you do not need to instantiate a SQLite client manually.

## Resolve the SQLite database context

After `addDb()` has been configured and the application has been built, Xeno.JS exposes the database context through the `DB_CONTEXT` service.

`DB_CONTEXT` is scoped, so it must be resolved from an active service scope.

Resolve the scoped service inside an application scope:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSqlite } from '@xeno-js/sqlite'

const app = new XenoAppBuilder()

app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
}))

const application = await app.build()

await application.runInScope(async (services) => {
  const db = services.DB_CONTEXT
  // Use the scoped database context here.
})
```

`DB_CONTEXT` is scoped. Do not resolve it from the builder's root container; use `runInScope()` or an already active scope.

For more information about scoped services and resolution, see:

- [Scoped](../dependency-injection/lifetimes/scoped)
- [Resolution](../dependency-injection/resolution)
- [Service Container](../dependency-injection/service-container)

## Create a SQLite Data Source

Xeno.JS exposes `IReadDataSource` and `IWriteDataSource` as contracts for data access.

Create a concrete data source in your application:

```ts
import type { IReadDataSource } from '@xeno-js/core'
import type { DbSchema } from './schema'
import type { DbContext } from '@xeno-js/sqlite'

export class UserDataSource implements IReadDataSource {
  constructor(private readonly _db: DbContext<DbSchema>)
  async findUserById(id: string) {
    // Use this.db for SQLite queries.
  }
}
```

In normal application code, the database context is resolved from the active scope and passed to the data source.

## Use the Data Source from Application Code

A typical application keeps SQLite access behind a data source or repository instead of resolving the database context throughout the application.

For example:

```ts
import type { IWriteDataSource } from '@xeno-js/core'
import type { DbSchema } from './schema'
import type { DbContext } from '@xeno-js/sqlite'

export class UserDataSource implements IWriteDataSource {
  constructor(private readonly _db: DbContext<DbSchema>)
  async findUserById(id: string) {
    // Use this.db to execute the query for your application's schema.
  }

  async createUser(user: {
    id: string
    email: string
  }) {
    // Use this._db to insert the user.
  }
}
```

The application service can then depend on `UserDataSource` rather than directly depending on the SQLite client.

A typical application flow is:

```text
Command / Query
      ↓
Handler
      ↓
Application Service / Repository
      ↓
UserDataSource
      ↓
SQLite
```

This keeps the database provider as application infrastructure rather than making the database client part of the application boundary.

## Register a Data Source in DI

If your data source is an application service, register it through the normal Xeno.JS dependency injection APIs.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSqlite } from '@xeno-js/sqlite'
import type { DbContext, DbTransaction } from '@xeno-js/sqlite'
import type { XenoRegistry } from '@xeno-js/shared'

interface AppRegistry extends XenoRegistry<DbContext, DbTransaction> {
  USER_DATA_SOURCE: UserDataSource
}

const app = new XenoAppBuilder<AppRegistry>()

app.addDb(withSqlite<AppRegistry>((options) => {
  options.url = 'file:./data/app.db'
}))

app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    const db = scope.resolve('DB_CONTEXT')

    return new UserDataSource(db)
  })
})

const application = await app.build()
```

The exact token used for an application-specific service depends on your application's registry.

The important relationship is:

```text
SQLite registration
      ↓
DB_CONTEXT
      ↓
UserDataSource
      ↓
application service / repository
```

Because both the database context and the data source are scoped, resolve them inside the active scope in which the application operation executes.

For example:

```ts
await application.runInScope(async (services) => {
  const userDataSource = services.USER_DATA_SOURCE
  await userDataSource.findUserById('user-1')
})
```

See [Registration](../dependency-injection/registration) and [Scoped](../dependency-injection/lifetimes/scoped) for the general DI rules.

## Use SQLite with Unit of Work

Use Unit of Work when several database operations must succeed or fail as one transactional operation.

For example, related data changes can be grouped in one transaction:

```ts
await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
  const userDataSource = services.USER_DATA_SOURCE

  await unitOfWork.runInTransaction(async () => {
    await userDataSource.createUser({
      id: 'user-1',
      email: 'user@example.com',
    })
  })
})
```

The public API is:

```ts
runInTransaction(callback, aggregates?, signal?)
```

The callback receives the transaction database context. The optional `aggregates` argument lets the SQLite Unit of Work persist uncommitted domain events to the outbox table when outbox support is configured. The optional `signal` can abort the operation.

You do not manually call:

```ts
begin()
commit()
rollback()
```

The callback defines the transactional work.

If the callback completes successfully, the transaction completes successfully. If the callback fails, the transactional operation does not complete successfully and the error is propagated to the caller.

## Configure the Outbox

The SQLite plugin can create outbox tables for named aggregates. Enable the outbox and provide at least one aggregate name:

```ts
app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
  options.outbox = {
    enable: true,
    name: 'Order',
    worker: true,
  }
}))
```

The plugin creates a table named `order_outbox_messages`. For multiple aggregates, provide an array of names. Setting `outbox.enable` to `true` without `outbox.name` causes configuration to throw.

When outbox support is enabled, `runInTransaction()` can accept an aggregate root or an array of aggregate roots as its second argument. The SQLite Unit of Work writes their uncommitted events to the outbox table in the transaction, then clears those events after insertion.

When `outbox.worker` is `true`, the plugin registers the worker under `TOKENS.BACKGROUND_WORKER`; it does not start it during plugin configuration. The worker's `start()` method polls every 5000 ms by default, processes up to 50 pending messages per table per poll, and marks a message `FAILED` after its third unsuccessful dispatch attempt.

## Complete Example

A minimal application can be structured like this:

```text
src/
├── app.ts
└── users/
    └── user.data-source.ts
```

### `src/users/user.data-source.ts`

```ts
import { BaseSqliteSqlDataSource } from '@xeno-js/core/db'

export class UserDataSource extends BaseSqliteSqlDataSource {
  async createUser(user: {
    id: string
    email: string
  }) {
    // Use this.db with the application's Drizzle schema.
    // Example query omitted because the schema is application-specific.
  }
}
```

### `src/app.ts`

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSqlite } from '@xeno-js/sqlite'
import type { DbContext, DbTransaction } from '@xeno-js/sqlite'
import type { XenoRegistry } from '@xeno-js/shared'

import { UserDataSource } from './users/user.data-source'

interface AppRegistry extends XenoRegistry<DbContext, DbTransaction> {
  USER_DATA_SOURCE: UserDataSource
}

const app = new XenoAppBuilder<AppRegistry>()

app.addDb(withSqlite<AppRegistry>((options) => {
  options.url = 'file:./data/app.db'
}))

app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

const application = await app.build()

await application.runInScope(async (services) => {
  const userDataSource = services.USER_DATA_SOURCE
  const unitOfWork = services.UNIT_OF_WORK

  await unitOfWork.runInTransaction(async () => {
    await userDataSource.createUser({
      id: 'user-1',
      email: 'user@example.com',
    })

    // Additional related database operations can be performed here.
  })
})
```

The query itself is intentionally application-specific: Xeno.JS provides the SQLite data source base class and database context, while your application defines its Drizzle schema and data-access operations.

## Troubleshooting

### SQLite is not being used

Check that `withSqlite()` is passed to `addDb()`:

```ts
app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
}))
```

The SQLite plugin selects the libSQL client; its configuration does not use an `enableSqlLite` switch.

### The database connection is not configured

Check that:

```ts
options.url = '...'
```

is assigned in the `withSqlite()` setup callback, or that `DATABASE_URL` is configured.

Also verify that the connection URL is valid for the SQLite/libSQL client used by your application.

### `DB_CONTEXT` cannot be resolved

Make sure that:

1. `addDb()` was called;
2. `await app.build()` completed successfully;
3. the resolution happens inside an active service scope.

For scoped resolution, use:

```ts
await application.runInScope(async (services) => {
  const db = services.DB_CONTEXT
})
```

Resolving a scoped service without an active scope throws an error.

See [Resolution](../dependency-injection/resolution) for the general scoped-resolution rules.

### The SQLite data source cannot access `db`

`BaseSqliteSqlDataSource` exposes `db` as a `protected` property.

Use it from a class that extends `BaseSqliteSqlDataSource`:

```ts
class UserDataSource extends BaseSqliteSqlDataSource {
  async findUser() {
    return this.db
  }
}
```

Do not expect callers outside the data source to access `db` directly.

### The provider-specific data source does not work

Make sure the provider matches the base data source:

```text
SQLite configuration
        ↓
BaseSqliteSqlDataSource
```

For PostgreSQL, use `BasePostgresSqlDataSource` instead.

Do not mix the provider configuration and provider-specific data source.

### Transactional work is failing

Check that:

- `UNIT_OF_WORK` is resolved from an active scope;
- all operations that must belong to the transaction execute inside the `runInTransaction()` callback;
- errors from the transactional operation are not being silently discarded.

Example:

```ts
await unitOfWork.runInTransaction(async () => {
  await userDataSource.createUser(user)
})
```

Do not manually manage `begin`, `commit`, or `rollback`.

## Related Docs

- [Data Overview](./overview)
- [Node PostgreSQL](./node-postgresql)
- [Unit of Work](./unit-of-work)
- [Service Container](../dependency-injection/service-container)
- [Registration](../dependency-injection/registration)
- [Resolution](../dependency-injection/resolution)
- [Scoped](../dependency-injection/lifetimes/scoped)
- [Dependency Graph](../dependency-injection/dependency-graph)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
