---
title: Data Overview
description: Learn how to configure database access in Xeno.JS, register a database with AppBuilder, resolve the database services, and use data sources and Unit of Work in your application.
keywords:
- Xeno.JS
- data access
- database
- PostgreSQL
- SQLite
- libSQL
- AppBuilder
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
  answer: Use AppBuilder.addDb() to configure the database connection string and choose PostgreSQL or SQLite.
- question: Which databases does Xeno.JS support?
  answer: Xeno.JS currently supports PostgreSQL through the Node PostgreSQL integration and SQLite through the libSQL client.
- question: How do I choose SQLite instead of PostgreSQL?
  answer: Set enableSqlLite to true in the DbConfig passed to AppBuilder.addDb().
- question: How do I resolve the configured database?
  answer: Resolve the DB_CONTEXT service from AppBuilder or the service container after the application has been built.
- question: What Data Source should I use with PostgreSQL?
  answer: Extend BasePostgresSqlDataSource and use its protected db property from your data source implementation.
- question: What Data Source should I use with SQLite?
  answer: Extend BaseSqliteSqlDataSource and use its protected db property from your data source implementation.
- question: How do I run database operations in a transaction?
  answer: Resolve UNIT_OF_WORK and execute the operations inside runInTransaction().
- question: Do I manually call begin, commit, and rollback?
  answer: No. Xeno.JS exposes UnitOfWork.runInTransaction() as the public transaction API.
- question: Where should database services be registered?
  answer: Register the database during application bootstrap with AppBuilder.addDb(), then resolve the database services through dependency injection.
---

## Introduction

Xeno.JS provides the application-facing infrastructure you need to access relational data and execute database operations without making the database provider the center of your application architecture.

The workflow is:

```text
Choose a database
      ↓
Configure it with AppBuilder
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

* PostgreSQL through the Node PostgreSQL integration.
* SQLite through the libSQL client.

For provider-specific configuration and usage, see:

* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqlite)
* [Unit of Work](./unit-of-work)

## Before you start

You need:

* a Xeno.JS application;
* the database provider dependencies required by your selected database;
* a database connection string;
* an `AppBuilder` instance.

The database is configured during application bootstrap. Application code should consume the registered database services rather than creating database clients directly.

## Configure the database

Use `AppBuilder.addDb()` to configure the database.

For PostgreSQL, keep `enableSqlLite` disabled:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get('DB_CONNECTION_STRING') ??
    'postgres://user:password@localhost:5432/myapp'

  options.enableSqlLite = false
})

await app.build()
```

For SQLite, enable SQLite:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString = 'file:./data/app.db'
  options.enableSqlLite = true
})

await app.build()
```

The important configuration options are:

| Option             | Purpose                                                    |
| ------------------ | ---------------------------------------------------------- |
| `connectionString` | Connection URL passed to the configured database provider. |
| `enableSqlLite`    | Selects SQLite when set to `true`.                         |

When `enableSqlLite` is `false`, Xeno.JS uses the PostgreSQL database client.

## Register the database in AppBuilder

Database registration belongs in the application bootstrap.

A typical application setup looks like:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app
  .addDb((options, config) => {
    options.connectionString =
      config.get('DB_CONNECTION_STRING') ??
      'postgres://user:password@localhost:5432/myapp'

    options.enableSqlLite = false
  })
  .addPipeline()

const container = await app.build()
```

`addDb()` queues the database module during bootstrap. `build()` initializes the configured modules and returns the application service container.

After the build completes, the database services are available through dependency injection.

## Resolve the database

The database context is registered under the `DB_CONTEXT` token.

You can resolve it directly from `AppBuilder`:

```ts
const db = app.resolve('DB_CONTEXT')
```

Or from the built service container:

```ts
const container = await app.build()

const db = container.resolve('DB_CONTEXT')
```

The exact type of `DB_CONTEXT` depends on the application's Xeno registry.

For most application code, however, you should not pass the database context throughout the application manually. Instead, create a provider-specific Data Source and inject it where data access is required.

## Create a Data Source

Xeno.JS exposes provider-specific base Data Sources for application infrastructure.

For PostgreSQL, extend:

```ts
BasePostgresSqlDataSource
```

For SQLite, extend:

```ts
BaseSqliteSqlDataSource
```

These base classes give your Data Source access to the configured database through the protected `db` property.

### PostgreSQL

```ts
import { BasePostgresSqlDataSource } from '@xeno-js/core/db'

export class UserDataSource extends BasePostgresSqlDataSource {
  async findUserById(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}
```

### SQLite

```ts
import { BaseSqliteSqlDataSource } from '@xeno-js/core/db'

export class UserDataSource extends BaseSqliteSqlDataSource {
  async findUserById(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}
```

The provider-specific pages contain the complete configuration and Data Source examples:

* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqlite)

## Register your Data Source

Your application Data Source is a normal dependency-injection service.

For example:

```ts
const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get('DB_CONNECTION_STRING') ??
    'postgres://user:password@localhost:5432/myapp'

  options.enableSqlLite = false
})

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

const container = await app.build()
```

The Data Source can then be resolved from the application container or injected into another service.

For more information about registration and lifetimes, see:

* [Registration](../dependency-injection/registration)
* [Resolution](../dependency-injection/resolution)
* [Scoped Services](../dependency-injection/lifetimes/scoped)

## Use Unit of Work for transactions

When an operation requires multiple database changes to succeed as one unit, use the registered Unit of Work.

Resolve it through the `UNIT_OF_WORK` token:

```ts
const unitOfWork = app.resolve('UNIT_OF_WORK')
```

Then execute the transactional operation with `runInTransaction()`:

```ts
await unitOfWork.runInTransaction(async () => {
  await userDataSource.createUser(user)
  await userDataSource.createProfile(profile)
}, undefined)
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
import { AppBuilder } from '@xeno-js/core'
import { BasePostgresSqlDataSource } from '@xeno-js/core/db'

class UserDataSource extends BasePostgresSqlDataSource {
  async findUserById(id: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    })
  }
}

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get('DB_CONNECTION_STRING') ??
    'postgres://user:password@localhost:5432/myapp'

  options.enableSqlLite = false
})

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

await app.build()

const dataSource = app.resolve('USER_DATA_SOURCE')

const user = await dataSource.findUserById('user-123')
```

This example demonstrates the complete Data workflow:

1. configure the database;
2. register the database with `addDb()`;
3. register an application Data Source;
4. build the application;
5. resolve the Data Source;
6. perform data access.

The provider-specific pages show the complete implementation for each database.

## Choose the right Data page

### I need PostgreSQL

Go to [Node PostgreSQL](./node-postgresql).

Use this page when you need to:

* configure a PostgreSQL connection;
* register PostgreSQL in `AppBuilder`;
* create a PostgreSQL Data Source;
* access the PostgreSQL database from application infrastructure.

### I need SQLite

Go to [SQLite](./sqlite).

Use this page when you need to:

* configure SQLite;
* register SQLite in `AppBuilder`;
* create a SQLite Data Source;
* access the SQLite database from application infrastructure.

### I need a transaction

Go to [Unit of Work](./unit-of-work).

Use this page when multiple database operations must execute as one transactional operation.

## Troubleshooting

### `DB_CONTEXT` cannot be resolved

Make sure the database module has been registered:

```ts
app.addDb((options) => {
  options.connectionString = 'postgres://user:password@localhost:5432/myapp'
})
```

Then build the application before resolving the service:

```ts
await app.build()

const db = app.resolve('DB_CONTEXT')
```

### The application fails while bootstrapping the database

Check:

1. the `connectionString`;
2. the selected provider;
3. the provider dependency installation;
4. whether the configured database is reachable.

The error may be wrapped by `AppBuilder` as a bootstrap failure for the database module.

### The wrong database provider is being used

Check `enableSqlLite`.

PostgreSQL:

```ts
options.enableSqlLite = false
```

SQLite:

```ts
options.enableSqlLite = true
```

### Unit of Work is not available

Make sure `addDb()` has been configured and the application has been built.

`UNIT_OF_WORK` is registered by the database module.

```ts
app.addDb((options) => {
  options.connectionString = 'postgres://user:password@localhost:5432/myapp'
})

await app.build()

const unitOfWork = app.resolve('UNIT_OF_WORK')
```

## Data checklist

Before implementing database access, verify:

* [ ] I selected PostgreSQL or SQLite.
* [ ] The required provider dependency is installed.
* [ ] I configured `connectionString`.
* [ ] I configured `enableSqlLite` correctly.
* [ ] I registered the database with `AppBuilder.addDb()`.
* [ ] I called `build()` before resolving database services.
* [ ] I use `DB_CONTEXT` through dependency injection.
* [ ] My application Data Source extends the correct provider-specific base class.
* [ ] I register my Data Source with the appropriate lifetime.
* [ ] I use `UNIT_OF_WORK` for transactional operations.
* [ ] I keep database infrastructure outside the domain layer.

## Related docs

### Database providers

* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqlite)
* [Unit of Work](./unit-of-work)

### Dependency Injection

* [Service Container](../dependency-injection/service-container)
* [Registration](../dependency-injection/registration)
* [Resolution](../dependency-injection/resolution)
* [Scoped Services](../dependency-injection/lifetimes/scoped)
* [Dependency Graph](../dependency-injection/dependency-graph)

### Application

* [CQRS Overview](../application/cqrs/overview)
* [Commands](../application/cqrs/command)
* [Queries](../application/cqrs/query)
* [Handlers](../application/cqrs/handler)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
