---
title: Data Overview
description: Learn how to configure database access in Xeno.JS with XenoAppBuilder database plugins, resolve scoped database services, and use data sources and Unit of Work.
keywords:
- Xeno.JS
- data access
- database
- PostgreSQL
- SQLite
- libSQL
- XenoAppBuilder
- DB_CONTEXT
- Unit of Work
- Data Source
- TypeScript
tags:
- data
- database
- postgresql
- sqlite
- unit-of-work
- app-builder
- typescript
faqs:
- question: How do I configure a database in Xeno.JS?
  answer: Pass withPostgresql() or withSqlite() to XenoAppBuilder.addDb() to configure the selected database provider.
- question: Which databases does Xeno.JS support?
  answer: Xeno.JS currently supports PostgreSQL through the Node PostgreSQL integration and SQLite through the libSQL client.
- question: How do I choose SQLite instead of PostgreSQL?
  answer: Pass the withSqlite() database plugin to XenoAppBuilder.addDb().
- question: How do I resolve the configured database?
  answer: Resolve DB_CONTEXT from scoped services in XenoApplication.runInScope().
- question: What Data Source should I use with PostgreSQL?
  answer: Extend BasePostgresSqlDataSource and use its protected db property from your data source implementation.
- question: What Data Source should I use with SQLite?
  answer: Extend BaseSqliteSqlDataSource and use its protected db property from your data source implementation.
- question: How do I run database operations in a transaction?
  answer: Resolve UNIT_OF_WORK from scoped services and execute the operations inside runInTransaction().
- question: Do I manually call begin, commit, and rollback?
  answer: No. Xeno.JS exposes UnitOfWork.runInTransaction() as the public transaction API.
- question: Where should database services be registered?
  answer: Register a provider plugin with XenoAppBuilder.addDb(), then resolve database services through dependency injection.
---

## Introduction

Xeno.JS provides the application-facing infrastructure you need to access relational data and execute database operations without making the database provider the center of your application architecture.

The workflow is:

```text
Choose a database
      ↓
Configure it with XenoAppBuilder and a provider plugin
      ↓
Build the application
      ↓
Resolve the database services
      ↓
Use a provider-specific Data Source
      ↓
Use Unit of Work when operations must run in a transaction
```

Xeno.JS currently supports:

- PostgreSQL through the Node PostgreSQL integration.
- SQLite through the libSQL client.

For provider-specific configuration and usage, see:

- [Node PostgreSQL](./node-postgresql)
- [SQLite](./sqlite)
- [Unit of Work](./unit-of-work)

## Before you start

You need:

- a Xeno.JS application;
- the database provider dependencies required by your selected database;
- a database connection URL or provider-specific connection options;
- an `XenoAppBuilder` instance.

The database is configured during application bootstrap. Application code should consume the registered database services rather than creating database clients directly.

## Configure the database

Use `XenoAppBuilder.addDb()` with a plugin from the selected database integration.

For PostgreSQL, pass `withPostgresql()` and configure its connection options:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

app.addDb(withPostgresql((options, config) => {
  options.connectionString =
    config.get('DATABASE_URL') ??
    'postgres://user:password@localhost:5432/myapp'
}))

await app.build()
```

For SQLite/libSQL, pass `withSqlite()` and configure its URL:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSqlite } from '@xeno-js/sqlite'

const app = new XenoAppBuilder()

app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
}))

await app.build()
```

The option names are provider-specific:

| Provider      | Plugin           | Connection option  |
| ------------- | ---------------- | ------------------ |
| PostgreSQL    | `withPostgresql` | `connectionString` |
| SQLite/libSQL | `withSqlite`     | `url`              |

## Register the database in XenoAppBuilder

Database registration belongs in the application bootstrap.

A typical application setup looks like:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'

const app = new XenoAppBuilder()

app
  .addDb(withPostgresql((options, config) => {
    options.connectionString =
      config.get('DATABASE_URL') ??
      'postgres://user:password@localhost:5432/myapp'
  }))

const application = await app.build()
```

`addDb()` invokes the plugin to queue the provider-specific database module. `build()` initializes the configured modules and returns the runtime application, not the service container.

After the build completes, the database services are available through dependency injection.

## Resolve the database

The database context is registered under the `DB_CONTEXT` token.

`DB_CONTEXT` is scoped, so resolve it from an active service scope. Use `runInScope()` on the runtime application:

```ts
await application.runInScope(async (services) => {
  const db = services.DB_CONTEXT
  // Use the scoped database context here.
})
```

The exact type of `DB_CONTEXT` depends on the application's Xeno registry.

For most application code, however, you should not pass the database context throughout the application manually. Instead, create a provider-specific Data Source and inject it where data access is required.

## Create a Data Source

### PostgreSQL

```ts
import type { IReadDataSource } from '@xeno-js/core'

export class UserDataSource implements IReadDataSource {
  async findUserById(id: string) {
    return this._db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}
```

### SQLite

```ts
import type { IReadDataSource } from '@xeno-js/core'
import type { DbContext } from '@xeno-js/sqlite'
import type { DbSchema } from './schema'

export class UserDataSource implements IReadDataSource {
  constructor(private readonly _db: DbContext<DbSchema>)
  async findUserById(id: string) {
    return this._db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}
```

The provider-specific pages contain the complete configuration and Data Source examples:

- [Node PostgreSQL](./node-postgresql)
- [SQLite](./sqlite)

## Register your Data Source

Your application Data Source is a normal dependency-injection service.
Declare its token and type in the application's Xeno registry before registering it.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'
import type { DbContext, DbTransaction } from '@xeno-js/postgresql'
import type { XenoRegistry } from '@xeno-js/shared'
import type { DbSchema } from './schema'

interface AppRegistry extends XenoRegistry<DbContext<DbSchema>, DbTransaction> {
  USER_DATA_SOURCE: UserDataSource
}

const app = new XenoAppBuilder<AppRegistry>()

app.addDb(withPostgresql<AppRegistry>((options, config) => {
  options.connectionString =
    config.get('DATABASE_URL') ??
    'postgres://user:password@localhost:5432/myapp'
}))

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

const application = await app.build()
```

Because this Data Source is scoped, resolve it from scoped services within `runInScope()` or inject it into another service with a compatible lifetime.

For more information about registration and lifetimes, see:

- [Registration](../dependency-injection/registration)
- [Resolution](../dependency-injection/resolution)
- [Scoped Services](../dependency-injection/lifetimes/scoped)

## Use Unit of Work for transactions

When an operation requires multiple database changes to succeed as one unit, use the registered Unit of Work.

`UNIT_OF_WORK` is scoped. Resolve it from the active scope and perform the work within that scope:

```ts
await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
  const userDataSource = services.USER_DATA_SOURCE

  await unitOfWork.runInTransaction(async () => {
    await userDataSource.createUser(user)
    await userDataSource.createProfile(profile)
  })
})
```

The transaction API is callback-based.

You do not manually call:

```ts
begin()
commit()
rollback()
```

Instead, the work performed inside `runInTransaction()` is executed as one transaction.

For the complete transaction workflow, see [Unit of Work](./unit-of-work).

## Typical application flow

A typical application that uses Xeno.JS Data infrastructure can be organized like this:

```text
HTTP / transport
       ↓
Command or Query
       ↓
Handler
       ↓
Application service / Repository
       ↓
Data Source
       ↓
Database
```

For transactional operations:

```text
Command Handler
       ↓
Unit of Work
       ↓
Data Source(s)
       ↓
Database transaction
```

The database provider remains infrastructure. Your application services, handlers, and repositories consume the data access services through explicit dependencies.

## Complete example

The following example shows the basic composition of a PostgreSQL application.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPostgresql } from '@xeno-js/postgresql'
import type { IReadDataSource } from '@xeno-js/core'
import type { DbContext, DbTransaction } from '@xeno-js/postgresql'
import type { XenoRegistry } from '@xeno-js/shared'
import type { DbSchema } from './schema'

class UserDataSource implements IReadDataSource {
  constructor(private readonly _db: DbContext<DbSchema>)
  async findUserById(id: string) {
    return this._db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}

interface AppRegistry extends XenoRegistry<DbContext<DbSchema>, DbTransaction> {
  USER_DATA_SOURCE: UserDataSource
}

const app = new XenoAppBuilder<AppRegistry>()

app.addDb(withPostgresql<AppRegistry>((options, config) => {
  options.connectionString =
    config.get('DATABASE_URL') ??
    'postgres://user:password@localhost:5432/myapp'
}))

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

const application = await app.build()

await application.runInScope(async (services) => {
  const dataSource = services.USER_DATA_SOURCE
  const user = await dataSource.findUserById('user-123')
})
```

This example demonstrates the complete Data workflow:

1. configure the database;
2. register the database with `addDb()`;
3. register an application Data Source;
4. build the application;
5. resolve the scoped Data Source;
6. perform data access within its scope.

The provider-specific pages show the complete implementation for each database.

## Choose the right Data page

### I need PostgreSQL

Go to [Node PostgreSQL](./node-postgresql).

Use this page when you need to:

- configure a PostgreSQL connection;
- register PostgreSQL in `XenoAppBuilder`;
- create a PostgreSQL Data Source;
- access the PostgreSQL database from application infrastructure.

### I need SQLite

Go to [SQLite](./sqlite).

Use this page when you need to:

- configure SQLite;
- register SQLite in `XenoAppBuilder`;
- create a SQLite Data Source;
- access the SQLite database from application infrastructure.

### I need a transaction

Go to [Unit of Work](./unit-of-work).

Use this page when multiple database operations must execute as one transactional operation.

## Troubleshooting

### `DB_CONTEXT` cannot be resolved

Make sure the provider plugin has been registered:

```ts
app.addDb(withPostgresql((options) => {
  options.connectionString = 'postgres://user:password@localhost:5432/myapp'
}))
```

Then build the application and resolve the scoped service inside `runInScope()`:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const db = services.DB_CONTEXT
})
```

### The application fails while bootstrapping the database

Check:

1. the provider-specific connection option (`connectionString` for PostgreSQL or `url` for SQLite/libSQL);
2. the selected provider;
3. the provider dependency installation;
4. whether the configured database is reachable.

The error may be wrapped by `XenoAppBuilder` as a bootstrap failure for the database module.

### The wrong database provider is being used

Choose the provider by passing its plugin to `addDb()`.

PostgreSQL:

```ts
app.addDb(withPostgresql((options) => {
  options.connectionString = 'postgres://user:password@localhost:5432/myapp'
}))
```

SQLite/libSQL:

```ts
app.addDb(withSqlite((options) => {
  options.url = 'file:./data/app.db'
}))
```

### Unit of Work is not available

Make sure a database plugin has been configured and the application has been built. `UNIT_OF_WORK` is scoped, so resolve it inside an active scope:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const unitOfWork = services.UNIT_OF_WORK
})
```

## Data checklist

Before implementing database access, verify:

- [ ] I selected PostgreSQL or SQLite.
- [ ] The required provider dependency is installed.
- [ ] I configured the selected provider's connection option (`connectionString` or `url`).
- [ ] I registered the provider plugin with `XenoAppBuilder.addDb()`.
- [ ] I called `build()` before resolving database services.
- [ ] I use `DB_CONTEXT` through dependency injection.
- [ ] My application Data Source extends the correct provider-specific base class.
- [ ] I register my Data Source with the appropriate lifetime.
- [ ] I use `UNIT_OF_WORK` for transactional operations.
- [ ] I keep database infrastructure outside the domain layer.

## Related docs

### Database providers

- [Node PostgreSQL](./node-postgresql)
- [SQLite](./sqlite)
- [Unit of Work](./unit-of-work)

### Dependency Injection

- [Service Container](../dependency-injection/service-container)
- [Registration](../dependency-injection/registration)
- [Resolution](../dependency-injection/resolution)
- [Scoped Services](../dependency-injection/lifetimes/scoped)
- [Dependency Graph](../dependency-injection/dependency-graph)

### Application

- [CQRS Overview](../application/cqrs/overview)
- [Commands](../application/cqrs/command)
- [Queries](../application/cqrs/query)
- [Handlers](../application/cqrs/handler)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
