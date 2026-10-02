---
title: SQLite
description: Learn how to configure SQLite, register it with AppBuilder, resolve the database context, create a SQLite data source, and use transactions with Xeno.JS.
keywords:
- Xeno.JS
- SQLite
- libSQL
- database
- data source
- BaseSqliteSqlDataSource
- DB_CONTEXT
- Unit of Work
- AppBuilder
- TypeScript
tags:
- data
- sqlite
- libsql
- database
- data-source
- unit-of-work
- appbuilder
- typescript
faqs:
- question: How do I register SQLite in Xeno.JS?
  answer: Call AppBuilder.addDb() and set enableSqlLite to true.
- question: What configuration does SQLite require?
  answer: SQLite requires a connectionString and enableSqlLite must be set to true.
- question: Which database service does Xeno.JS register for SQLite?
  answer: Xeno.JS registers DB_CONTEXT as a scoped database service after addDb() is configured and the application is built.
- question: Does Xeno.JS provide a ready-made SQLite repository?
  answer: No. Xeno.JS provides BaseSqliteSqlDataSource. Your application creates a concrete data source by extending that class.
- question: How do I access SQLite from a data source?
  answer: Extend BaseSqliteSqlDataSource and use its protected db property in the concrete data source.
- question: How do I resolve DB_CONTEXT?
  answer: Resolve DB_CONTEXT from an active service scope, for example with ContainerUtils.resolveServiceScoped().
- question: How do I use SQLite inside a transaction?
  answer: Resolve UNIT_OF_WORK from an active scope and execute the related data operations inside runInTransaction().
- question: Do I need to call begin(), commit(), or rollback() manually?
  answer: No. The public Unit of Work API is runInTransaction(callback, signal).
- question: What happens when transactional work fails?
  answer: If the transactional callback fails, the transaction does not complete successfully and the error propagates to the caller.
---

## Introduction

Use SQLite when your application needs an embedded relational database through Xeno.JS.

The workflow is:

1. Configure the SQLite connection.
2. Register SQLite with `AppBuilder.addDb()`.
3. Build the application.
4. Resolve `DB_CONTEXT` inside an active service scope.
5. Create an application-specific data source by extending `BaseSqliteSqlDataSource`.
6. Use `UNIT_OF_WORK` when multiple database operations must execute transactionally.

Xeno.JS provides the application-facing database integration. Your repositories and application services decide how that database access is used by the application.

## Prerequisites

Before configuring SQLite, make sure that:

* your application uses `@xeno-js/core`;
* the SQLite/libSQL database dependencies required by your application are installed;
* you have a SQLite connection URL accepted by the configured SQLite/libSQL client;
* your application bootstraps through `AppBuilder`.

For example:

```bash
npm install @xeno-js/core drizzle-orm @libsql/client
```

The exact dependency versions should follow the versions used by your Xeno.JS installation.

## Configure SQLite

SQLite is selected through the `DbConfig` passed to `AppBuilder.addDb()`.

Set:

```ts
enableSqlLite: true
```

and provide the database connection through:

```ts
connectionString
```

For example:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString = 'file:./data/app.db'
  options.enableSqlLite = true
})

await app.build()
```

The important configuration is:

```ts
options.enableSqlLite = true
```

This tells Xeno.JS to configure the SQLite/libSQL database provider rather than PostgreSQL.

The value of `connectionString` is provider-specific. Use a connection URL supported by the SQLite/libSQL client configured for your application.

## Register SQLite in AppBuilder

Register SQLite during application bootstrap with `addDb()`:

```ts
const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString = 'file:./data/app.db'
  options.enableSqlLite = true
})

await app.build()
```

Call `build()` before resolving application services.

`addDb()` is the public database registration API. You do not need to instantiate a SQLite client manually and add it to the container.

## Resolve the SQLite Data Source

After `addDb()` has been configured and the application has been built, Xeno.JS exposes the database context through the `DB_CONTEXT` service.

`DB_CONTEXT` is scoped, so it must be resolved from an active service scope.

For example, at an application or transport boundary:

```ts
import {
  AppBuilder,
  ContainerUtils,
} from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString = 'file:./data/app.db'
  options.enableSqlLite = true
})

await app.build()

const db = ContainerUtils.resolveServiceScoped(
  'DB_CONTEXT',
  app,
)
```

The resolution must happen while an active service scope exists.

Do not use:

```ts
app.resolve('DB_CONTEXT')
```

from code that is outside an active scope. `DB_CONTEXT` is a scoped service.

For more information about scoped services and resolution, see:

* [Scoped](../dependency-injection/lifetimes/scoped)
* [Resolution](../dependency-injection/resolution)
* [Service Container](../dependency-injection/service-container)

## Create a SQLite Data Source

Xeno.JS exposes `BaseSqliteSqlDataSource` as the provider-specific base class for SQLite data access.

Create a concrete data source in your application:

```ts
import { BaseSqliteSqlDataSource } from '@xeno-js/core'

export class UserDataSource extends BaseSqliteSqlDataSource {
  async findUserById(id: string) {
    // Use this.db for SQLite queries.
  }
}
```

The base class receives the database context through its constructor:

```ts
import { BaseSqliteSqlDataSource } from '@xeno-js/core'

export class UserDataSource extends BaseSqliteSqlDataSource {
  constructor(db: ConstructorParameters<typeof BaseSqliteSqlDataSource>[0]) {
    super(db)
  }

  async findUserById(id: string) {
    // Query the database through this.db.
  }
}
```

In normal application code, the database context is resolved from the active scope and passed to the data source.

The `db` property provided by `BaseSqliteSqlDataSource` is `protected`, so application-specific data sources can use it directly while callers interact with the methods exposed by the concrete data source.

## Use the Data Source from Application Code

A typical application keeps SQLite access behind a data source or repository instead of resolving the database context throughout the application.

For example:

```ts
import { BaseSqliteSqlDataSource } from '@xeno-js/core'

export class UserDataSource extends BaseSqliteSqlDataSource {
  async findUserById(id: string) {
    // Use this.db to execute the query for your application's schema.
  }

  async createUser(user: {
    id: string
    email: string
  }) {
    // Use this.db to insert the user.
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
app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    const db = scope.resolve('DB_CONTEXT')

    return new UserDataSource(db)
  })
})
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

See [Registration](../dependency-injection/registration) and [Scoped](../dependency-injection/lifetimes/scoped) for the general DI rules.

## Use SQLite with Unit of Work

Use Unit of Work when several database operations must succeed or fail as one transactional operation.

For example, creating a user and creating a related profile can be treated as one transaction:

```ts
const unitOfWork = ContainerUtils.resolveServiceScoped(
  'UNIT_OF_WORK',
  app,
)

await unitOfWork.runInTransaction(async () => {
  await userDataSource.createUser({
    id: userId,
    email,
  })

  await profileDataSource.createProfile({
    userId,
    displayName,
  })
}, undefined)
```

The public API is:

```ts
runInTransaction(callback, signal)
```

You do not manually call:

```ts
begin()
commit()
rollback()
```

The callback defines the transactional work.

If the callback completes successfully, the transaction completes successfully. If the callback fails, the transactional operation does not complete successfully and the error is propagated to the caller.

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
import { BaseSqliteSqlDataSource } from '@xeno-js/core'

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
import {
  AppBuilder,
  ContainerUtils,
} from '@xeno-js/core'

import { UserDataSource } from './users/user.data-source'

const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString = 'file:./data/app.db'
  options.enableSqlLite = true
})

app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

await app.build()

// This code must execute inside an active Xeno.JS service scope.
const userDataSource = ContainerUtils.resolveServiceScoped(
  'USER_DATA_SOURCE',
  app,
)

const unitOfWork = ContainerUtils.resolveServiceScoped(
  'UNIT_OF_WORK',
  app,
)

await unitOfWork.runInTransaction(async () => {
  await userDataSource.createUser({
    id: 'user-1',
    email: 'user@example.com',
  })

  // Additional related database operations can be performed here.
}, undefined)
```

The query itself is intentionally application-specific: Xeno.JS provides the SQLite data source base class and database context, while your application defines its Drizzle schema and data-access operations.

## Troubleshooting

### SQLite is not being used

Check that the database registration contains:

```ts
options.enableSqlLite = true
```

If this flag is not enabled, `addDb()` configures the PostgreSQL database path instead.

### The database connection is not configured

Check that:

```ts
options.connectionString = '...'
```

is assigned during `addDb()` configuration.

Also verify that the connection URL is valid for the SQLite/libSQL client used by your application.

### `DB_CONTEXT` cannot be resolved

Make sure that:

1. `addDb()` was called;
2. `await app.build()` completed successfully;
3. the resolution happens inside an active service scope.

For scoped resolution, use:

```ts
ContainerUtils.resolveServiceScoped(
  'DB_CONTEXT',
  app,
)
```

If there is no active scope, Xeno.JS reports:

```text
Active service scope is required to execute Scoped service.
```

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

* `UNIT_OF_WORK` is resolved from an active scope;
* all operations that must belong to the transaction execute inside the `runInTransaction()` callback;
* errors from the transactional operation are not being silently discarded.

Example:

```ts
await unitOfWork.runInTransaction(async () => {
  await userDataSource.createUser(user)
  await profileDataSource.createProfile(profile)
}, undefined)
```

Do not manually manage `begin`, `commit`, or `rollback`.

## Related Docs

* [Data Overview](./overview)
* [Node PostgreSQL](./node-postgresql)
* [Unit of Work](./unit-of-work)
* [Service Container](../dependency-injection/service-container)
* [Registration](../dependency-injection/registration)
* [Resolution](../dependency-injection/resolution)
* [Scoped](../dependency-injection/lifetimes/scoped)
* [Dependency Graph](../dependency-injection/dependency-graph)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
