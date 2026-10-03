---
title: Base PostgreSQL DataSource
description: How to implement a PostgreSQL data source with BasePostgresSqlDataSource in Xeno.JS and register it in the dependency injection container.
keywords:
- Xeno.JS
- PostgreSQL
- Drizzle ORM
- DataSource
- BasePostgresSqlDataSource
- DbContext
- Dependency Injection
tags:
- datasources
- database
- postgresql
- drizzle
faqs:
- question: What is BasePostgresSqlDataSource?
  answer: It is an abstract Xeno.JS class that provides PostgreSQL data sources with protected and typed access to the Drizzle PostgreSQL DbContext.
- question: Can I use BasePostgresSqlDataSource with SQLite?
  answer: No. The class exposes the database as NodePgDatabase and must be used with the PostgreSQL database configured by Xeno.JS.
- question: How do I register a PostgreSQL data source?
  answer: Configure the database with addDb(), then register the concrete data source with addServices(), normally using a scoped lifetime.
- question: Where is the database used by the data source resolved?
  answer: The database is registered by Xeno.JS under TOKENS.DB_CONTEXT and can be resolved from the container or a scope.

---

## Introduction

`BasePostgresSqlDataSource` is the base class provided by Xeno.JS for implementing data sources that work with PostgreSQL through Drizzle ORM.

The class does not implement CRUD queries and does not define methods such as `findById()` or `save()`.

Instead, it provides `protected` access to the database:

```ts
protected get db(): NodePgDatabase<TSchema>

```

A concrete data source therefore extends the class and uses `this.db` to execute Drizzle queries.

```text
Application
    │
    ├── AppBuilder.addDb()
    │       │
    │       └── PostgreSQL + Drizzle
    │
    ├── TOKENS.DB_CONTEXT
    │
    └── Custom DataSource
            │
            └── BasePostgresSqlDataSource
                    │
                    └── this.db

```

## Prerequisites

To use this class, the application must use:

* `@xeno-js/core`;
* `drizzle-orm`;
* the PostgreSQL `pg` driver.

`@xeno-js/core` declares `drizzle-orm` and `pg` as optional peer dependencies. An application using PostgreSQL support must therefore have the required dependencies installed.

```bash
npm install @xeno-js/core drizzle-orm pg

```

## Define the database schema

Define the Drizzle tables and collect them into an application schema.

```ts
// src/infrastructure/db/schema.ts

import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer('id').primaryKey(),
  email: text('email').notNull(),
})

export const dbSchema = {
  users,
}

export type ProjectDbSchema = typeof dbSchema

```

The schema is then used as the parameter of `XenoRegistry`.

This allows `TOKENS.DB_CONTEXT` to be typed as `DbContext<ProjectDbSchema>`.

## Create the PostgreSQL DataSource

A concrete data source extends `BasePostgresSqlDataSource`.

```ts
// src/infrastructure/datasources/user.datasource.ts

import { eq } from 'drizzle-orm'
import type { DbContext, BasePostgresSqlDataSource } from '@xeno-js/core'

import { users } from '../db/schema'
import type { ProjectDbSchema } from '../db/schema'

export class UserDataSource extends BasePostgresSqlDataSource<ProjectDbSchema> {
  public async findById(id: number) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))

    return user
  }
}

```

The important part is `this.db`.

`db` is `protected`, so it is not directly exposed to consumers of the data source. It is available to the concrete class that extends `BasePostgresSqlDataSource`.

There is no need to manually create a `NodePgDatabase`.

## Constructor

The base class constructor receives a `DbContext<TSchema>`.

```ts
export abstract class BasePostgresSqlDataSource<
  TSchema extends Dictionary = Dictionary,
> {
  constructor(private readonly _db: DbContext<TSchema>) {}

  protected get db(): NodePgDatabase<TSchema> {
    return this._db as NodePgDatabase<TSchema>
  }
}

```

A concrete data source therefore receives `DB_CONTEXT` from the dependency injection container:

```ts
new UserDataSource(container.resolve(TOKENS.DB_CONTEXT))

```

## Configure PostgreSQL

Configure the database through `AppBuilder.addDb()`.

```ts
const builder = new AppBuilder<AppRegistry>()

builder.addDb((options, config) => {
  options.connectionString = config.getOrThrow('DATABASE_URL')
})

```

`DbConfig` exposes:

```ts
interface DbConfig {
  connectionString: string
  enableSqlLite: boolean
}

```

For PostgreSQL, `enableSqlLite` must remain `false`, which is the value used by the initial `AppBuilder` configuration.

`addDb()` creates the PostgreSQL database through the Drizzle/node-postgres integration and registers `DB_CONTEXT` in the container.

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
  })
  .addServices((services) => {
    services.addScoped('USER_DATA_SOURCE', (container) => {
      return new UserDataSource(
        container.resolve(TOKENS.DB_CONTEXT),
      )
    })
  })

```

`USER_DATA_SOURCE` is an application token: it is not a token provided by Xeno.JS.

The token must be added to the application registry.

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

The first parameter of `XenoRegistry` represents the database schema.

The second parameter can be used to add application-specific tokens.

## Build and resolve

Complete the bootstrap with `build()`.

```ts
const container = await builder.build()

```

Because `USER_DATA_SOURCE` is registered as `scoped`, it must be resolved from a scope.

```ts
const scope = container.createScope()

const dataSource = scope.resolve('USER_DATA_SOURCE')

const user = await dataSource.findById(42)

await scope.dispose()

```

The root container can instead resolve singleton or transient services; scoped services must be resolved through `createScope()`.

## Complete example

A minimal structure can be:

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

Bootstrap:

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

Usage:

```ts
const container = await bootstrap()

const scope = container.createScope()

const dataSource = scope.resolve('USER_DATA_SOURCE')

const user = await dataSource.findById(42)

await scope.dispose()

```

## Use the database directly

`BasePostgresSqlDataSource` is useful when the data source needs to execute PostgreSQL/Drizzle-specific queries.

For example:

```ts
export class UserDataSource extends BasePostgresSqlDataSource<ProjectDbSchema> {
  public async findActiveUsers() {
    return this.db
      .select()
      .from(users)
  }
}

```

The base class does not impose a structure on the data source's application methods.

You can therefore define:

* specific queries;
* joins;
* filters;
* aggregations;
* insert/update/delete operations when the data source needs them;
* queries used by Repository or ReadDao.

The responsibility for the query remains with the concrete data source.

## BasePostgresSqlDataSource vs ReadDao

The two abstractions have different responsibilities.

`BasePostgresSqlDataSource` provides infrastructure-level access to Drizzle PostgreSQL.

```text
BasePostgresSqlDataSource
        │
        └── this.db

```

`ReadDao`, on the other hand, provides an application-level abstraction for read operations and works through `IReadDataSource` and `IMapper`.

```text
ReadDao
   │
   ├── IReadDataSource
   │       │
   │       └── PostgreSQL DataSource
   │
   └── IMapper

```

A concrete PostgreSQL data source can therefore be used as the underlying implementation of a `ReadDao`.

The PostgreSQL base class does not replace `ReadDao`.

## PostgreSQL only

`BasePostgresSqlDataSource` must be used for the PostgreSQL path.

Do not use it when:

```ts
options.enableSqlLite = true

```

In that case, Xeno.JS configures the database through `BaseSqliteSqlDataSource` and `LibSQLDatabase`.

The two classes are separate because they expose two different Drizzle database types:

```text
BasePostgresSqlDataSource
        ↓
NodePgDatabase<TSchema>

```

```text
BaseSqliteSqlDataSource
        ↓
LibSQLDatabase<TSchema>

```

## Transaction context

`TOKENS.DB_CONTEXT` is registered by `DbModule` as a scoped service.

The database context is also integrated with Xeno.JS transaction state. For this reason, a data source that receives `DB_CONTEXT` should normally be registered as `scoped`, so that it uses the context belonging to the current scope.

```ts
services.addScoped('USER_DATA_SOURCE', (container) => {
  return new UserDataSource(
    container.resolve(TOKENS.DB_CONTEXT),
  )
})

```

This is particularly important when the data source is used within operations that share the scope's transaction state.

## Common problems

### `this.db` is not available

`db` is `protected`.

It cannot be used from external code:

```ts
const dataSource = scope.resolve('USER_DATA_SOURCE')

dataSource.db // not accessible

```

It is instead available inside the concrete class:

```ts
class UserDataSource extends BasePostgresSqlDataSource<ProjectDbSchema> {
  public query() {
    return this.db.select().from(users)
  }
}

```

### PostgreSQL does not connect

Check that:

* `addDb()` has been configured;
* `connectionString` contains a valid PostgreSQL connection string;
* `pg` is installed;
* `drizzle-orm` is installed;
* `enableSqlLite` is not set to `true`.

### `DB_CONTEXT` cannot be resolved

Verify that:

```ts
builder.addDb(...)

```

has been configured before `build()`.

`DB_CONTEXT` is registered by `DbModule`, so without `addDb()` the data source cannot obtain the database context from the container.

### The data source is resolved from the root container

If it has been registered with:

```ts
services.addScoped(...)

```

it must not be resolved directly from the root container.

Use:

```ts
const scope = container.createScope()

const dataSource = scope.resolve('USER_DATA_SOURCE')

```

and at the end:

```ts
await scope.dispose()

```

## Checklist

To implement a PostgreSQL DataSource:

* install `@xeno-js/core`;
* install `drizzle-orm`;
* install `pg`;
* define the Drizzle tables;
* create the `ProjectDbSchema`;
* specialize `XenoRegistry<ProjectDbSchema>`;
* create a class that extends `BasePostgresSqlDataSource<ProjectDbSchema>`;
* use `this.db` for queries;
* configure `addDb()`;
* register the data source with `addServices()`;
* normally use `addScoped()` for a data source that depends on `DB_CONTEXT`;
* resolve the data source from a scope;
* close the scope with `dispose()`.

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
