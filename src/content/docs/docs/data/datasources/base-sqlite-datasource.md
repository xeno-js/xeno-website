---
title: Base SQLite DataSource
description: How to implement a SQLite or libSQL data source with BaseSqliteSqlDataSource in Xeno.JS and register it in the dependency injection container.
keywords:
- Xeno.JS
- SQLite
- libSQL
- Drizzle ORM
- DataSource
- BaseSqliteSqlDataSource
- DbContext
- Dependency Injection
tags:
- datasources
- database
- sqlite
- libsql
- drizzle
faqs:
- question: What is BaseSqliteSqlDataSource?
  answer: It is an abstract Xeno.JS class that provides SQLite or libSQL data sources with protected and typed access to a Drizzle LibSQLDatabase.
- question: Can I use BaseSqliteSqlDataSource with PostgreSQL?
  answer: No. The class exposes the database as LibSQLDatabase and is intended for the SQLite/libSQL path configured by Xeno.JS.
- question: How do I enable SQLite in Xeno.JS?
  answer: Configure addDb() and set enableSqlLite to true.
- question: How do I register a SQLite data source?
  answer: Configure addDb() with enableSqlLite enabled, then register the concrete data source with addServices(), normally using a scoped lifetime.
- question: Which client does Xeno.JS use for SQLite?
  answer: Xeno.JS creates the database client with @libsql/client and passes it to Drizzle through drizzle-orm/libsql.

---

## Introduction

`BaseSqliteSqlDataSource` is the base class provided by Xeno.JS for implementing data sources that work with SQLite-compatible databases through Drizzle ORM and the libSQL client.

The class does not implement CRUD operations and does not define methods such as `findById()` or `save()`.

Instead, it provides `protected` access to the database:

```ts
protected get db(): LibSQLDatabase<TSchema>
```

A concrete data source extends the class and uses `this.db` to execute Drizzle queries.

```text
Application
    │
    ├── AppBuilder.addDb()
    │       │
    │       ├── enableSqlLite = true
    │       └── @libsql/client + Drizzle
    │
    ├── TOKENS.DB_CONTEXT
    │
    └── Custom DataSource
            │
            └── BaseSqliteSqlDataSource
                    │
                    └── this.db
```

The public class is exported by `@xeno-js/core` as:

```ts
BaseSqliteSqlDataSource
```

## Prerequisites

To use the SQLite/libSQL database path, the application needs:

* `@xeno-js/core`;
* `drizzle-orm`;
* `@libsql/client`.

The Xeno.JS package declares `drizzle-orm` and `@libsql/client` as optional peer dependencies, so applications using this database integration must install the packages they require.

```bash
npm install @xeno-js/core drizzle-orm @libsql/client
```

Xeno.JS currently uses the `@libsql/client` client together with the Drizzle `drizzle-orm/libsql` integration.

## Define the database schema

Define the tables using the Drizzle SQLite schema API and collect them into an application schema.

For example:

```ts
// src/infrastructure/db/schema.ts

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
})

export const dbSchema = {
  users,
}

export type ProjectDbSchema = typeof dbSchema
```

The schema can then be used as the generic parameter of `BaseSqliteSqlDataSource`.

Using the schema type allows the database exposed through `this.db` to retain the application's Drizzle schema typing.

## Create the SQLite DataSource

A concrete data source extends `BaseSqliteSqlDataSource`.

```ts
// src/infrastructure/datasources/user.datasource.ts

import { eq } from 'drizzle-orm'
import type { BaseSqliteSqlDataSource } from '@xeno-js/core'

import { users } from '../db/schema'
import type { ProjectDbSchema } from '../db/schema'

export class UserDataSource extends BaseSqliteSqlDataSource<ProjectDbSchema> {
  public async findById(id: number) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))

    return user
  }
}
```

The important part is:

```ts
this.db
```

`db` is `protected`, so it is available to the concrete data source but is not exposed as part of the public API of the resolved data source.

The data source does not need to create a `LibSQLDatabase` manually.

## Constructor

The constructor of the base class receives a `DbContext<TSchema>`:

```ts
export abstract class BaseSqliteSqlDataSource<
  TSchema extends Dictionary = Dictionary,
> {
  constructor(private readonly _db: DbContext<TSchema>) {}

  protected get db(): LibSQLDatabase<TSchema> {
    return this._db as LibSQLDatabase<TSchema>
  }
}
```

`DbContext<TSchema>` is Xeno.JS's database context type. It is a union that supports both:

* `NodePgDatabase<TSchema>` for PostgreSQL;
* `LibSQLDatabase<TSchema>` for SQLite/libSQL.

For `BaseSqliteSqlDataSource`, the protected getter narrows the context to:

```ts
LibSQLDatabase<TSchema>
```

A concrete data source therefore receives `TOKENS.DB_CONTEXT` from the dependency injection container.

```ts
new UserDataSource(container.resolve(TOKENS.DB_CONTEXT))
```

## Configure SQLite

SQLite/libSQL is configured through `AppBuilder.addDb()`.

The important configuration option is:

```ts
enableSqlLite: true
```

For example:

```ts
const builder = new AppBuilder<AppRegistry>()

builder.addDb((options, config) => {
  options.connectionString = config.getOrThrow('DATABASE_URL')
  options.enableSqlLite = true
})
```

`addDb()` initializes the database configuration with:

```ts
{
  connectionString: '',
  enableSqlLite: false,
}
```

Therefore, SQLite/libSQL must be explicitly enabled.

When `enableSqlLite` is `true`, Xeno.JS uses its SQLite/libSQL database path instead of the PostgreSQL path.

The resulting flow is:

```text
AppBuilder.addDb()
       │
       ├── enableSqlLite = true
       │
       ▼
DbModule
       │
       ▼
DbUtils.addSqlLite()
       │
       ▼
DbSqlLiteClientFactory
       │
       ├── @libsql/client
       └── drizzle-orm/libsql
       │
       ▼
DbContext
```

## Configure the connection string

The SQLite/libSQL factory creates the client with the configured connection string:

```ts
const client = createClient({
  url: opts.connectionString,
})
```

The client is then passed to Drizzle:

```ts
return drizzle({ client })
```

Therefore the value assigned to `connectionString` is passed directly to `@libsql/client` as its `url`.

For example:

```ts
builder.addDb((options, config) => {
  options.connectionString = config.getOrThrow('DATABASE_URL')
  options.enableSqlLite = true
})
```

The exact URL format depends on the libSQL client configuration being used by the application.

## Register the DataSource

After configuring the database, register the concrete data source through `addServices()`.

```ts
import { AppBuilder, TOKENS } from '@xeno-js/core'

import type { AppRegistry } from './infrastructure/xeno-registry/app-registry'
import { UserDataSource } from './infrastructure/datasources/user.datasource'

const builder = new AppBuilder<AppRegistry>()

builder
  .addDb((options, config) => {
    options.connectionString = config.getOrThrow('DATABASE_URL')
    options.enableSqlLite = true
  })
  .addServices((services) => {
    services.addScoped('USER_DATA_SOURCE', (container) => {
      return new UserDataSource(
        container.resolve(TOKENS.DB_CONTEXT),
      )
    })
  })
```

`USER_DATA_SOURCE` is an application-specific token. It is not a built-in Xeno.JS token.

The token should therefore be added to the application's registry.

## Type the Application Registry

Use `XenoRegistry` with the application's Drizzle schema.

```ts
// src/infrastructure/xeno-registry/app-registry.ts

import type { XenoRegistry } from '@xeno-js/core'

import type { ProjectDbSchema } from '../db/schema'
import type { UserDataSource } from '../datasources/user.datasource'

export interface AppRegistry extends XenoRegistry<ProjectDbSchema> {
  USER_DATA_SOURCE: UserDataSource
}
```

The database schema is supplied as the generic parameter:

```ts
XenoRegistry<ProjectDbSchema>
```

The registry can then contain application-specific dependency injection tokens such as:

```ts
USER_DATA_SOURCE
```

## Build and resolve

Complete the application bootstrap with `build()`:

```ts
const container = await builder.build()
```

Because the data source is registered as `scoped`, resolve it from a scope:

```ts
const scope = container.createScope()

const dataSource = scope.resolve('USER_DATA_SOURCE')

const user = await dataSource.findById(42)

await scope.dispose()
```

The scope is important because Xeno.JS registers `DB_CONTEXT` as a scoped service.

The relationship is:

```text
Scope
  │
  ├── TRANSACTION_STATE
  │
  ├── DB_CONTEXT
  │
  └── USER_DATA_SOURCE
```

## Complete example

A minimal application structure can be:

```text
src/
├── bootstrap.ts
├── domain/
│   └── ...
└── infrastructure/
    ├── db/
    │   └── schema.ts
    ├── datasources/
    │   └── user.datasource.ts
    └── xeno-registry/
        └── app-registry.ts
```

### Database schema

```ts
// src/infrastructure/db/schema.ts

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
})

export const dbSchema = {
  users,
}

export type ProjectDbSchema = typeof dbSchema
```

### Application registry

```ts
// src/infrastructure/xeno-registry/app-registry.ts

import type { XenoRegistry } from '@xeno-js/core'

import type { ProjectDbSchema } from '../db/schema'
import type { UserDataSource } from '../datasources/user.datasource'

export interface AppRegistry extends XenoRegistry<ProjectDbSchema> {
  USER_DATA_SOURCE: UserDataSource
}
```

### Data source

```ts
// src/infrastructure/datasources/user.datasource.ts

import { eq } from 'drizzle-orm'
import { BaseSqliteSqlDataSource } from '@xeno-js/core'

import { users } from '../db/schema'
import type { ProjectDbSchema } from '../db/schema'

export class UserDataSource extends BaseSqliteSqlDataSource<ProjectDbSchema> {
  public async findById(id: number) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))

    return user
  }
}
```

### Bootstrap

```ts
// src/bootstrap.ts

import { AppBuilder, TOKENS } from '@xeno-js/core'

import type { AppRegistry } from './infrastructure/xeno-registry/app-registry'
import { UserDataSource } from './infrastructure/datasources/user.datasource'

export async function bootstrap() {
  const builder = new AppBuilder<AppRegistry>()

  builder
    .addDb((options, config) => {
      options.connectionString = config.getOrThrow('DATABASE_URL')
      options.enableSqlLite = true
    })
    .addServices((services) => {
      services.addScoped('USER_DATA_SOURCE', (container) => {
        return new UserDataSource(
          container.resolve(TOKENS.DB_CONTEXT),
        )
      })
    })

  return builder.build()
}
```

### Usage

```ts
const container = await bootstrap()

const scope = container.createScope()

const dataSource = scope.resolve('USER_DATA_SOURCE')

const user = await dataSource.findById(42)

await scope.dispose()
```

## Use the database directly

`BaseSqliteSqlDataSource` is useful when a data source needs to execute SQLite/libSQL-specific queries through Drizzle.

For example:

```ts
export class UserDataSource extends BaseSqliteSqlDataSource<ProjectDbSchema> {
  public async findAll() {
    return this.db
      .select()
      .from(users)
  }
}
```

The base class does not impose a particular application-level API on the data source.

A concrete data source can therefore contain:

* specific queries;
* filters;
* joins supported by the configured Drizzle dialect;
* aggregations;
* insert operations;
* update operations;
* delete operations;
* queries used by Repository or ReadDao.

The responsibility for implementing those queries remains with the concrete data source.

## BaseSqliteSqlDataSource vs BasePostgresSqlDataSource

Xeno.JS exposes separate base data source classes for PostgreSQL and SQLite/libSQL.

For PostgreSQL:

```text
BasePostgresSqlDataSource
        ↓
NodePgDatabase<TSchema>
```

For SQLite/libSQL:

```text
BaseSqliteSqlDataSource
        ↓
LibSQLDatabase<TSchema>
```

The corresponding database clients are also different.

The SQLite/libSQL path uses:

```text
@libsql/client
        ↓
drizzle-orm/libsql
        ↓
LibSQLDatabase
```

The PostgreSQL path uses the PostgreSQL Drizzle integration instead.

Choose the base data source that corresponds to the database path configured through `addDb()`.

## SQLite/libSQL only

`BaseSqliteSqlDataSource` is intended for the SQLite/libSQL path.

The database must therefore be configured with:

```ts
options.enableSqlLite = true
```

For example:

```ts
builder.addDb((options, config) => {
  options.connectionString = config.getOrThrow('DATABASE_URL')
  options.enableSqlLite = true
})
```

If `enableSqlLite` remains `false`, Xeno.JS uses the PostgreSQL database factory instead.

The two paths are selected inside `DbModule`:

```ts
const db = opts.enableSqlLite
  ? await DbUtils.addSqlLite(opts)
  : await DbUtils.addDbClient(opts)
```

This means the setting determines which implementation of `DbContext` is created.

## Transaction context

`DB_CONTEXT` is registered by `DbModule` as a scoped service.

Xeno.JS also registers `TRANSACTION_STATE` as scoped and creates `DB_CONTEXT` using that transaction state.

When there is an active transaction, the `DB_CONTEXT` proxy delegates database operations to the active transaction state.

Conceptually:

```text
Scope
  │
  ├── TRANSACTION_STATE
  │       │
  │       └── active transaction
  │
  └── DB_CONTEXT
          │
          ├── normal database
          │
          └── active transaction when present
```

A data source that receives `DB_CONTEXT` should therefore be registered as `scoped` when it captures that scoped dependency:

```ts
services.addScoped('USER_DATA_SOURCE', (container) => {
  return new UserDataSource(
    container.resolve(TOKENS.DB_CONTEXT),
  )
})
```

This allows the data source to receive the `DB_CONTEXT` belonging to the current scope.

## Common problems

### `this.db` is not available

`db` is `protected`.

It cannot be accessed through the resolved data source:

```ts
const dataSource = scope.resolve('USER_DATA_SOURCE')

dataSource.db // not accessible
```

It is available inside the concrete data source:

```ts
class UserDataSource extends BaseSqliteSqlDataSource<ProjectDbSchema> {
  public query() {
    return this.db.select().from(users)
  }
}
```

### SQLite is not being used

Check that `addDb()` explicitly enables the SQLite/libSQL path:

```ts
builder.addDb((options, config) => {
  options.connectionString = config.getOrThrow('DATABASE_URL')
  options.enableSqlLite = true
})
```

If `enableSqlLite` is left as `false`, Xeno.JS selects the PostgreSQL database factory.

### The libSQL client cannot be loaded

Verify that the application has installed:

```bash
npm install @libsql/client
```

`@libsql/client` is an optional peer dependency of `@xeno-js/core`.

### Drizzle SQLite types are not available

Verify that `drizzle-orm` is installed:

```bash
npm install drizzle-orm
```

The SQLite data source imports:

```ts
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
```

and the Xeno.JS SQLite database factory uses:

```ts
import { drizzle } from 'drizzle-orm/libsql'
```

### `DB_CONTEXT` cannot be resolved

Make sure the database module has been configured:

```ts
builder.addDb(...)
```

before:

```ts
await builder.build()
```

`DB_CONTEXT` is registered by `DbModule`, which is queued by `addDb()`.

### The data source is resolved from the root container

If the data source is registered with:

```ts
services.addScoped(...)
```

resolve it through a scope:

```ts
const scope = container.createScope()

const dataSource = scope.resolve('USER_DATA_SOURCE')
```

Then dispose of the scope when it is no longer needed:

```ts
await scope.dispose()
```

## Source naming note

The public class is:

```ts
BaseSqliteSqlDataSource
```

and it is exported from `@xeno-js/core`.

[Unverified] The current repository source file is named:

```text
base-sqllite.datasource.ts
```

The filename contains `sqllite`, while the public class name uses `Sqlite`:

```ts
BaseSqliteSqlDataSource
```

For application documentation and imports from `@xeno-js/core`, use the public class name rather than relying on the internal source filename.

## Checklist

To implement a SQLite/libSQL DataSource:

* install `@xeno-js/core`;
* install `drizzle-orm`;
* install `@libsql/client`;
* define the Drizzle SQLite tables;
* create the application database schema type;
* specialize `XenoRegistry<ProjectDbSchema>`;
* create a class extending `BaseSqliteSqlDataSource<ProjectDbSchema>`;
* use `this.db` for Drizzle queries;
* configure `addDb()`;
* set `options.enableSqlLite = true`;
* provide the database connection string;
* register the data source with `addServices()`;
* use `addScoped()` when the data source depends on the scoped `DB_CONTEXT`;
* resolve the data source from a scope;
* dispose of the scope when finished.

---

## Related Docs

* [Data Overview](../overview)
* [Node PostgreSQL](../node-postgresql)
* [SQLite](../sqllite)
* [Unit of Work](../unit-of-work)
* [Service Registration](../../dependency-injection/registration)
* [Service Resolution](../../dependency-injection/resolution)
* [Dependency Graph](../../dependency-injection/dependency-graph)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
