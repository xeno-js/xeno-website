---
title: Node PostgreSQL
description: Learn how to configure PostgreSQL, register it with AppBuilder, resolve the database context, create a PostgreSQL data source, and use transactions with Xeno.JS.
keywords:
- Xeno.JS
- PostgreSQL
- Node PostgreSQL
- database
- data source
- BasePostgresSqlDataSource
- DB_CONTEXT
- Unit of Work
- AppBuilder
- Drizzle
- TypeScript
tags:
- data
- postgresql
- database
- data-source
- unit-of-work
- appbuilder
- typescript
faqs:
- question: How do I register PostgreSQL in Xeno.JS?
  answer: Call AppBuilder.addDb() and configure the connectionString while leaving enableSqlLite set to false.
- question: What configuration does PostgreSQL require?
  answer: The PostgreSQL configuration requires a connectionString. The enableSqlLite option must remain false for PostgreSQL.
- question: Which service does Xeno.JS register for PostgreSQL?
  answer: Xeno.JS registers DB_CONTEXT as a scoped database service after addDb() is configured and the application is built.
- question: Does Xeno.JS provide a ready-made application-specific PostgreSQL data source?
  answer: No. Xeno.JS provides BasePostgresSqlDataSource. Your application creates a concrete data source by extending that class and passing DB_CONTEXT to its constructor.
- question: How do I access PostgreSQL from a data source?
  answer: Extend BasePostgresSqlDataSource and use its protected db property inside the concrete data source.
- question: How do I use PostgreSQL inside a transaction?
  answer: Resolve UNIT_OF_WORK and execute the related data operations inside runInTransaction().
- question: Do I need to call begin(), commit(), or rollback() manually?
  answer: No. The public Unit of Work API is runInTransaction(callback, signal).
- question: What happens if the transactional callback fails?
  answer: The callback error propagates and the database transaction does not complete successfully.
---

## Introduction

If your application uses PostgreSQL, Xeno.JS lets you configure the PostgreSQL database during application bootstrap, resolve the registered database context, and build application-specific data sources on top of `BasePostgresSqlDataSource`.

The typical flow is:

```text
PostgreSQL configuration
        ↓
AppBuilder.addDb()
        ↓
await app.build()
        ↓
resolve DB_CONTEXT
        ↓
application-specific Data Source
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

* Node.js 20 or later.
* `@xeno-js/core`.
* `pg`.
* `drizzle-orm`.
* a reachable PostgreSQL database.
* a PostgreSQL connection string.

`@xeno-js/core` declares `pg` and `drizzle-orm` as optional peer dependencies, so install the PostgreSQL-related dependencies when using this provider.

For example:

```bash
npm install @xeno-js/core pg drizzle-orm
```

## Configure PostgreSQL

PostgreSQL is configured through `AppBuilder.addDb()`.

The database configuration exposes:

```ts
interface DbConfig {
  connectionString: string
  enableSqlLite: boolean
}
```

For PostgreSQL, configure `connectionString` and leave `enableSqlLite` as `false`.

A minimal configuration is:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString =
    'postgres://username:password@localhost:5432/myapp'
  options.enableSqlLite = false
})
```

The connection string is passed to the PostgreSQL provider configured by Xeno.JS.

### Configure the connection from application configuration

`addDb()` receives both the database options and Xeno.JS configuration service.

This allows the connection string to come from your application's configuration source:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get('DATABASE_URL') ??
    'postgres://username:password@localhost:5432/myapp'

  options.enableSqlLite = false
})
```

The configuration key is application-defined. Xeno.JS does not require a specific environment variable name.

## Register PostgreSQL in AppBuilder

The public registration API is:

```ts
app.addDb(...)
```

Register the database before building the application:

```ts
const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString =
    'postgres://username:password@localhost:5432/myapp'
  options.enableSqlLite = false
})

const container = await app.build()
```

After `build()` completes, the database services registered by the database module are available through dependency injection.

Do not create a PostgreSQL `Pool` manually when using the Xeno.JS database registration.

The application should configure the provider through `addDb()` and consume the services exposed by Xeno.JS.

## Resolve the PostgreSQL database context

Xeno.JS registers the database context under the `DB_CONTEXT` token.

After building the application, resolve it with:

```ts
const db = app.resolve('DB_CONTEXT')
```

You can also resolve it from an active service scope:

```ts
const db = scope.resolve('DB_CONTEXT')
```

`DB_CONTEXT` is scoped, so code that consumes the database as a scoped dependency should run inside an appropriate application scope.

For more information about service resolution and scopes, see:

* [Service Resolution](../dependency-injection/resolution)
* [Scoped Lifetime](../dependency-injection/lifetimes/scoped)
* [Service Container](../dependency-injection/service-container)

## Create a PostgreSQL Data Source

Xeno.JS exports `BasePostgresSqlDataSource` as the base class for application-specific PostgreSQL data sources.

The base class accepts the database context:

```ts
import { BasePostgresSqlDataSource } from '@xeno-js/core'

export class UserDataSource extends BasePostgresSqlDataSource {
  async findAll() {
    return this.db.select()
  }
}
```

The `db` property is protected, so it is available inside your concrete data source but not directly from application code using the data source.

This keeps database-specific access inside the data-access layer.

A data source is application code. Xeno.JS provides the PostgreSQL base class and database context; your application defines the actual queries and domain-specific operations.

## Use a PostgreSQL Data Source

A concrete data source normally receives `DB_CONTEXT` through dependency injection.

For example:

```ts
import {
  BasePostgresSqlDataSource,
  type DbContext,
} from '@xeno-js/core'

export class UserDataSource extends BasePostgresSqlDataSource {
  async findByEmail(email: string) {
    // Use this.db with your application's Drizzle schema.
    return this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
  }
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
BasePostgresSqlDataSource
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
const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString =
    'postgres://username:password@localhost:5432/myapp'
  options.enableSqlLite = false
})

app.addServices((container) => {
  container.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(scope.resolve('DB_CONTEXT'))
  })
})

await app.build()
```

Your application's registry type should include custom tokens when you want them to be strongly typed through `AppBuilder.resolve()`.

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

Resolve it from the application container or an active scope:

```ts
const unitOfWork = app.resolve('UNIT_OF_WORK')
```

Then execute the transactional operation through:

```ts
await unitOfWork.runInTransaction(
  async () => {
    // database operations
  },
  undefined,
)
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
await unitOfWork.runInTransaction(
  async () => {
    await userDataSource.createUser({
      email: 'alice@example.com',
    })

    await userDataSource.createProfile({
      email: 'alice@example.com',
      displayName: 'Alice',
    })
  },
  undefined,
)
```

If the callback completes successfully, the transactional operation completes successfully.

If the callback throws, the error propagates and the transaction does not complete successfully.

Keep the related database operations inside the same `runInTransaction()` callback when they must share one transaction.

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
import { BasePostgresSqlDataSource } from '@xeno-js/core'

import { users } from './schema'

export class UserDataSource extends BasePostgresSqlDataSource {
  async findByEmail(email: string) {
    return this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
  }

  async create(email: string) {
    return this.db
      .insert(users)
      .values({ email })
  }
}
```

### `src/app.ts`

```ts
import { AppBuilder } from '@xeno-js/core'

import { UserDataSource } from './data/user.data-source'

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get('DATABASE_URL') ??
    'postgres://username:password@localhost:5432/myapp'

  options.enableSqlLite = false
})

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
app.addDb((options) => {
  options.connectionString = 'postgres://...'
  options.enableSqlLite = false
})
```

and that the application is built afterward:

```ts
await app.build()
```

### PostgreSQL is configured as SQLite

Make sure PostgreSQL uses:

```ts
options.enableSqlLite = false
```

Setting this option to `true` selects the SQLite/libSQL provider instead.

### `DB_CONTEXT` cannot be resolved

Check that:

1. `addDb()` is registered.
2. `await app.build()` has completed before resolving the service.
3. the code is using the correct token:

```ts
'DB_CONTEXT'
```

If the problem is related to service lifetimes or resolution, see [Service Resolution](../dependency-injection/resolution).

### The data source cannot access `db`

`BasePostgresSqlDataSource.db` is protected.

This works:

```ts
class UserDataSource extends BasePostgresSqlDataSource {
  async findUsers() {
    return this.db.select().from(users)
  }
}
```

This does not:

```ts
const dataSource = new UserDataSource(db)

dataSource.db
```

Use public methods on your concrete data source instead of exposing the database context to callers.

### A data source is using the wrong database provider

`BasePostgresSqlDataSource` is intended for PostgreSQL.

If the application is configured with:

```ts
options.enableSqlLite = true
```

use `BaseSqliteSqlDataSource` instead.

Do not mix the provider-specific base data source with a different configured provider.

### Transactional work is not behaving as one unit

Make sure all operations that must succeed or fail together execute inside the same:

```ts
unitOfWork.runInTransaction(...)
```

For example:

```ts
await unitOfWork.runInTransaction(
  async () => {
    await userDataSource.create(...)
    await profileDataSource.create(...)
  },
  undefined,
)
```

Do not split operations that must be atomic across separate transaction callbacks.

### Unit of Work cannot be resolved

`UNIT_OF_WORK` is registered by the database module.

Check that PostgreSQL was registered with `addDb()` and that the application has been built:

```ts
app.addDb(...)
await app.build()
```

For general DI problems, see [Resolution](../dependency-injection/resolution).

## Related docs

* [Data Overview](./overview)
* [SQLite](./sqlite)
* [Unit of Work](./unit-of-work)
* [Service Container](../dependency-injection/service-container)
* [Registration](../dependency-injection/registration)
* [Service Resolution](../dependency-injection/resolution)
* [Scoped Lifetime](../dependency-injection/lifetimes/scoped)
* [Dependency Graph](../dependency-injection/dependency-graph)
* [CQRS Commands](../application/cqrs/command)
* [CQRS Queries](../application/cqrs/query)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
