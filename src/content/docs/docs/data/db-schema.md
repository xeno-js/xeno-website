---
title: Database Schema
description: Learn how to define your database tables with Drizzle, group them into a DbSchema type, and use that schema with XenoDbRegistry and typed data sources.
keywords:
- Xeno.JS
- database schema
- DbSchema
- XenoDbRegistry
- ApplicationRegistry
- Drizzle
- PostgreSQL
- SQLite
- database tables
- TypeScript
tags:
- data
- database
- schema
- drizzle
- typescript
faqs:
- question: What is DbSchema in Xeno.JS?
  answer: DbSchema is an application-defined TypeScript type that groups the Drizzle table definitions used by the database context.
- question: Does Xeno.JS provide a DbSchema type?
  answer: No. Xeno.JS provides the generic DbContext and XenoDbRegistry types, while the application defines its own DbSchema.
- question: How do I define a database table?
  answer: Define the table with the Drizzle table builder for the database provider, such as pgTable for PostgreSQL.
- question: How do I group multiple tables into one schema?
  answer: Create a DbSchema type whose properties map table names to the corresponding Drizzle table definitions.
- question: How do I connect DbSchema to XenoDbRegistry?
  answer: Pass DbSchema as the first generic parameter of XenoDbRegistry, for example XenoDbRegistry<DbSchema, MyExtensions>.
- question: Does DbSchema register the database with Xeno.JS?
  answer: No. DbSchema provides the compile-time schema used by the typed database context; database connectivity is configured separately with AppBuilder.addDb().
- question: Can I use the same DbSchema for PostgreSQL and SQLite?
  answer: The schema concept is the same, but table definitions use provider-specific Drizzle builders and column types, so the concrete schema may differ between providers.
- question: Does Xeno CLI generate DbSchema files?
  answer: The CLI scaffolds the application structure and configuration, but no dedicated DbSchema generator is part of the audited CLI API.
---

## Introduction

A Xeno.JS database schema defines the tables used by your application and gives the database context a concrete TypeScript type.

The basic flow is:

```text
Individual table definitions
        ↓
      DbSchema
        ↓
XenoDbRegistry<DbSchema, ApplicationServices>
        ↓
     DB_CONTEXT
        ↓
   Data Sources
```

For example, an application can define `users` and `profiles` as separate tables and then group them into one `DbSchema`:

```ts
type DbSchema = {
  users: typeof users
  profiles: typeof profiles
}
```

That type can then be supplied to `XenoDbRegistry`:

```ts
type MyAppRegistry = XenoDbRegistry<
  DbSchema,
  {
    USER_REPOSITORY: IUserRepository
    PROFILE_REPOSITORY: IProfileRepository
  }
>
```

The result is a typed application registry where `DB_CONTEXT` is associated with the application's database schema.

## Prerequisites

You need:

* Xeno.JS Core
* Drizzle ORM
* a database provider such as PostgreSQL or SQLite/libSQL
* TypeScript

For PostgreSQL, the table definitions use Drizzle's PostgreSQL builders.

```bash
npm install @xeno-js/core drizzle-orm pg
```

For SQLite/libSQL, use the corresponding Drizzle/libSQL packages.

The database connection itself is configured separately from the schema.

## Create a Table Schema

Define each table in its own file when the application contains multiple tables.

For example:

```text
src/
├── data/
│   └── schema/
│       ├── user.schema.ts
│       ├── profile.schema.ts
│       └── index.ts
├── registry.ts
└── bootstrap.ts
```

A PostgreSQL `users` table can be defined with Drizzle:

```ts
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull(),
})
```

A `profiles` table can be defined separately:

```ts
import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
})
```

These are normal Drizzle table definitions. Xeno.JS does not replace the database provider's schema-definition API.

## Create the DbSchema Type

Once the individual tables exist, group them into one schema type.

Create `src/data/schema/index.ts`:

```ts
import { profiles } from './profile.schema'
import { users } from './user.schema'

export type DbSchema = {
  profiles: typeof profiles
  users: typeof users
}
```

The keys of `DbSchema` should correspond to the tables that you want to expose through the typed database context.

The values are the actual Drizzle table definitions.

This is the important distinction:

```ts
type DbSchema = {
  users: typeof users
  profiles: typeof profiles
}
```

`DbSchema` is the **TypeScript type**.

The actual table objects remain:

```ts
users
profiles
```

## Use DbSchema with XenoDbRegistry

Xeno.JS exposes:

```ts
export type XenoDbRegistry<
  TSchema extends Dictionary = Dictionary,
  TExtensions = object,
> = ApplicationRegistry<DbContext<TSchema>, DbTransaction> & ...
```

The first generic parameter is the database schema.

Your application registry can therefore specialize it with `DbSchema`.

For example:

```ts
import type { XenoDbRegistry } from '@xeno-js/core/db'

import type { DbSchema } from './data/schema'
import type { IProfileRepository } from './data/profile.repository'
import type { IUserRepository } from './data/user.repository'

export type MyAppRegistry = XenoDbRegistry<
  DbSchema,
  {
    USER_REPOSITORY: IUserRepository
    PROFILE_REPOSITORY: IProfileRepository
  }
>
```

The structure is:

```text
XenoDbRegistry<
  DbSchema,
  Application-specific DI tokens
>
```

The first parameter describes the database schema.

The second parameter extends the application registry with application-specific tokens.

For example:

```ts
type MyAppRegistry = XenoDbRegistry<
  DbSchema,
  {
    USER_REPOSITORY: IUserRepository
    PROFILE_REPOSITORY: IProfileRepository
  }
>
```

This keeps database schema typing and application dependency typing in the same registry.

## Understand the DB_CONTEXT Type

`ApplicationRegistry` defines the database token as:

```ts
readonly DB_CONTEXT: T
```

`XenoDbRegistry` specializes `ApplicationRegistry` with:

```ts
ApplicationRegistry<DbContext<TSchema>, DbTransaction>
```

Therefore, when you define:

```ts
type MyAppRegistry = XenoDbRegistry<DbSchema>
```

the `DB_CONTEXT` token is typed using:

```ts
DbContext<DbSchema>
```

This is what connects your application-defined schema to Xeno.JS's database context.

The relationship is:

```text
DbSchema
   │
   ▼
XenoDbRegistry<DbSchema>
   │
   ▼
ApplicationRegistry<DbContext<DbSchema>>
   │
   ▼
DB_CONTEXT
```

You do not manually register the `DbSchema` as a service.

It is a compile-time type parameter.

## Configure the Database Separately

Defining `DbSchema` does not configure the database connection.

Database configuration is handled by `AppBuilder.addDb()`.

For PostgreSQL:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get(
      'DB_CONNECTION_STRING',
      'postgres://username:password@localhost:5432/myapp'
    )
})
```

The two concerns are therefore separate:

```text
DbSchema
    │
    └── describes tables and their types

AppBuilder.addDb()
    │
    └── configures database connectivity
```

You need both when building a database-backed application.

## Resolve the Typed Database Context

After the application is built, `DB_CONTEXT` can be resolved from the service container.

When working with a scoped service, resolve it through an active scope:

```ts
const container = await app.build()
const scope = container.createScope()

try {
  const db = scope.resolve('DB_CONTEXT')

  // db is typed using the registry's DbSchema.
} finally {
  await scope.dispose()
}
```

If your application uses a typed `MyAppRegistry`, the registry connects the `DB_CONTEXT` token to:

```ts
DbContext<DbSchema>
```

This allows the database API to retain the schema information defined by your application.

## Use DbSchema in a Data Source

Xeno.JS provides provider-specific base data sources.

For PostgreSQL:

```ts
import { BasePostgresSqlDataSource } from '@xeno-js/core/db'

import type { DbSchema } from './schema'

export class UserDataSource extends BasePostgresSqlDataSource<DbSchema> {
  async findByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })
  }
}
```

The important part is:

```ts
BasePostgresSqlDataSource<DbSchema>
```

The same schema type used by the registry can therefore be propagated to the application data source.

The base PostgreSQL data source receives a `DbContext<TSchema>` and exposes the PostgreSQL database connection to subclasses through its protected `db` property.

## Register a Data Source

Application-specific data sources are normal DI services.

For example:

```ts
const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get(
      'DB_CONNECTION_STRING',
      'postgres://username:password@localhost:5432/myapp',
    )
})

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (scope) => {
    const db = scope.resolve('DB_CONTEXT')

    return new UserDataSource(db)
  })
})
```

The exact registration token must also exist in the application's registry.

For example:

```ts
type MyAppRegistry = XenoDbRegistry<
  DbSchema,
  {
    USER_DATA_SOURCE: UserDataSource
  }
>
```

This gives the application a consistent type flow:

```text
DbSchema
   ↓
XenoDbRegistry<DbSchema, ...>
   ↓
DB_CONTEXT: DbContext<DbSchema>
   ↓
UserDataSource<DbSchema>
```

## Organize a Larger Schema

For a larger application, keep each table definition separate and expose the complete schema from one module.

For example:

```text
src/
└── data/
    └── schema/
        ├── user.schema.ts
        ├── profile.schema.ts
        ├── order.schema.ts
        ├── order-item.schema.ts
        └── index.ts
```

Each file defines one table:

```ts
// user.schema.ts
export const users = ...
```

```ts
// profile.schema.ts
export const profiles = ...
```

```ts
// order.schema.ts
export const orders = ...
```

The schema entry point groups them:

```ts
import { orderItems } from './order-item.schema'
import { orders } from './order.schema'
import { profiles } from './profile.schema'
import { users } from './user.schema'

export type DbSchema = {
  orderItems: typeof orderItems
  orders: typeof orders
  profiles: typeof profiles
  users: typeof users
}
```

This gives the rest of the application one stable type to import:

```ts
import type { DbSchema } from './data/schema'
```

Instead of importing every table definition whenever a type parameter is required.

## Keep Table Definitions and DbSchema Together

A useful convention is:

```text
data/
└── schema/
    ├── user.schema.ts
    ├── profile.schema.ts
    ├── order.schema.ts
    └── index.ts
```

The individual files own the table definitions.

`index.ts` owns the application-level schema type.

For example:

```ts
// data/schema/user.schema.ts
export const users = ...
```

```ts
// data/schema/profile.schema.ts
export const profiles = ...
```

```ts
// data/schema/index.ts
import { profiles } from './profile.schema'
import { users } from './user.schema'

export type DbSchema = {
  profiles: typeof profiles
  users: typeof users
}
```

This makes the schema boundary easy to find when adding a new table.

## PostgreSQL and SQLite

The `DbSchema` concept is independent from the Xeno.JS application registry, but the actual table definitions are provided by Drizzle's database-specific APIs.

For PostgreSQL:

```ts
import { pgTable, integer, varchar } from 'drizzle-orm/pg-core'
```

For SQLite/libSQL, use the corresponding SQLite Drizzle builders.

The application-level pattern remains:

```ts
type DbSchema = {
  users: typeof users
  profiles: typeof profiles
}
```

However, do not assume that a PostgreSQL table definition can be reused unchanged for SQLite. The table builders and supported column types are provider-specific.

Choose the provider-specific schema definitions that match the database configured with `AppBuilder.addDb()`.

## Complete Example

A small PostgreSQL application can use this structure:

```text
src/
├── data/
│   └── schema/
│       ├── user.schema.ts
│       ├── profile.schema.ts
│       └── index.ts
├── registry.ts
└── bootstrap.ts
```

### User table

```ts
// src/data/schema/user.schema.ts

import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull(),
})
```

### Profile table

```ts
// src/data/schema/profile.schema.ts

import { integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
})
```

### DbSchema

```ts
// src/data/schema/index.ts

import { profiles } from './profile.schema'
import { users } from './user.schema'

export type DbSchema = {
  profiles: typeof profiles
  users: typeof users
}
```

### Application registry

```ts
// src/registry.ts

import type { XenoDbRegistry } from '@xeno-js/core/db'

import type { DbSchema } from './data/schema'

export type MyAppRegistry = XenoDbRegistry<
  DbSchema,
  {
    USER_DATA_SOURCE: UserDataSource
  }
>
```

The application-specific token types can be expanded as the application grows:

```ts
export type MyAppRegistry = XenoDbRegistry<
  DbSchema,
  {
    USER_DATA_SOURCE: UserDataSource
    PROFILE_DATA_SOURCE: ProfileDataSource
    USER_REPOSITORY: IUserRepository
    PROFILE_REPOSITORY: IProfileRepository
  }
>
```

The database schema remains a separate concern:

```ts
type DbSchema = {
  profiles: typeof profiles
  users: typeof users
}
```

### Database bootstrap

```ts
// src/bootstrap.ts

import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addDb((options, config) => {
  options.connectionString =
    config.get(
      'DB_CONNECTION_STRING',
      'postgres://username:password@localhost:5432/myapp',
    )
})

export { app }
```

The important relationship is now explicit:

```text
user.schema.ts
profile.schema.ts
       │
       ▼
    DbSchema
       │
       ▼
MyAppRegistry = XenoDbRegistry<DbSchema, ...>
       │
       ▼
 DB_CONTEXT: DbContext<DbSchema>
       │
       ▼
 application data sources
```

## Common Problems

### `DbSchema` is defined but `DB_CONTEXT` is not typed

Make sure the application registry uses the schema as the first `XenoDbRegistry` generic:

```ts
type MyAppRegistry = XenoDbRegistry<DbSchema>
```

Not:

```ts
type MyAppRegistry = XenoDbRegistry
```

The latter falls back to the default schema type.

### A table is missing from the database type

Add the table to `DbSchema`:

```ts
type DbSchema = {
  users: typeof users
  profiles: typeof profiles
  orders: typeof orders
}
```

Defining a table file alone does not add it to the application schema type.

### The database connection does not work

Check the database configuration independently from `DbSchema`.

For PostgreSQL:

```ts
app.addDb((options, config) => {
  options.connectionString =
    config.getOrThrow('DB_CONNECTION_STRING')
})
```

`DbSchema` describes the database structure at the TypeScript level. It does not establish the database connection.

### A scoped database service cannot be resolved

Database services registered by Xeno.JS are scoped.

Resolve them through an active service scope:

```ts
const container = await app.build()
const scope = container.createScope()

try {
  const db = scope.resolve('DB_CONTEXT')
} finally {
  await scope.dispose()
}
```

For request-driven code, use the application's active request scope rather than creating an unrelated scope for each operation.

### The PostgreSQL data source rejects the schema type

Make sure the data source and registry use the same schema type:

```ts
type DbSchema = {
  users: typeof users
  profiles: typeof profiles
}

type MyAppRegistry = XenoDbRegistry<DbSchema>

class UserDataSource extends BasePostgresSqlDataSource<DbSchema> {
  // ...
}
```

Using one shared `DbSchema` type prevents the registry and data sources from describing different database structures.

## DbSchema Is Not a Migration

`DbSchema` describes the database structure to TypeScript and Drizzle.

It does not, by itself, create or migrate database tables.

Keep these concerns separate:

```text
DbSchema
    ↓
Type-safe database access

Database migrations
    ↓
Actual database structure
```

Use the database tooling appropriate to your Drizzle/provider setup to create and migrate the physical database.

## DbSchema and the Xeno CLI

Xeno CLI provides project scaffolding and generators for the Xeno application architecture.

The audited CLI does not expose a dedicated command that generates a `DbSchema` from database tables.

Therefore, create and maintain the schema explicitly in the application:

```text
src/data/schema/
├── user.schema.ts
├── profile.schema.ts
└── index.ts
```

The CLI can provide the application structure around this code, but the database model remains application-specific.

## Related Docs

* [Data Overview](./overview)
* [Node PostgreSQL](./node-postgresql)
* [SQLite](./sqllite)
* [Unit of Work](./unit-of-work)
* [Service Registration](../dependency-injection/registration)
* [Service Resolution](../dependency-injection/resolution)
* [Dependency Graph](../dependency-injection/dependency-graph)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
