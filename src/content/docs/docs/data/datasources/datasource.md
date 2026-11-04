---
title: Data Sources
description: Define and register Xeno.JS data sources that translate application data-access contracts into database or provider-specific operations.
keywords:
- Xeno.JS
- data source
- IReadDataSource
- IWriteDataSource
- DbContext
- DTO
- data access
- dependency injection
tags:
- data
- datasource
- database
- dependency-injection
faqs:
- question: What is a data source in Xeno.JS?
  answer: A data source implements a typed contract for reading or writing DTOs and adapts those operations to a database or another data provider.
- question: What is the difference between IReadDataSource and IWriteDataSource?
  answer: IReadDataSource defines findAll and findById. IWriteDataSource defines those read methods plus insert, delete, and update; each contract independently extends IDisposable.
- question: Does a data source convert DTOs into domain entities?
  answer: No. A data source returns and accepts DTOs. A repository or DAO can use an IMapper to translate between DTOs and domain entities.
- question: Does UserContext enforce tenant isolation automatically?
  answer: No. The contract only passes UserContext to the data-source implementation. The implementation must apply the required authorization and tenant constraints.
- question: How should a data source be registered?
  answer: Register its application-specific token through XenoAppBuilder.addServices(). Use a lifetime compatible with its dependencies; a data source that depends on a scoped database context should normally be scoped.
- question: Does the data-source contract provide pagination or filtering?
  answer: No. Add application-specific methods to a derived contract when a use case needs filtering, pagination, or other queries.
---

## Introduction

A data source is the infrastructure-facing implementation of an application's data-access contract. It translates operations on DTOs into queries or commands for a database or another provider.

The application depends on the contract, not on the database library:

```text
Application use case
        │
        ▼
IReadDataSource<TDto> or IWriteDataSource<TDto>
        │
        ▼
Concrete data source
        │
        ▼
Database or external provider
```

This boundary keeps provider-specific query code out of application logic. The trade-off is an explicit contract and implementation for each data source; that separation makes provider access replaceable and testable.

## Choose a data-source contract

Import the contracts from `@xeno-js/core`:

```ts
import type {
  IReadDataSource,
  IWriteDataSource,
} from '@xeno-js/core'
```

Both interfaces are generic over the DTO used at the data boundary, and both extend `IDisposable`.

### Read operations

Use `IReadDataSource<TDto>` when the implementation only needs to retrieve data:

```ts
import type { Optional, UserContext } from '@xeno-js/core'

interface IReadDataSource<TDto> {
  findAll(
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<TDto[]>

  findById(
    id: string | number,
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<Optional<TDto>>
}
```

`Optional<T>` means `T | undefined`. Consequently, `findById()` represents a missing row as `undefined`; the contract does not throw a not-found error or wrap the result in a Xeno.JS `ResultType`.

### Read and write operations

`IWriteDataSource<TDto>` contains the same read operations and adds:

```ts
import type { Optional, UserContext } from '@xeno-js/core'

interface IWriteDataSource<TDto> {
  findAll(
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<TDto[]>

  findById(
    id: string | number,
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<Optional<TDto>>

  insert(dto: TDto, signal?: Optional<AbortSignal>): Promise<void>

  delete(
    dto: TDto,
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<void>

  update(
    id: string | number,
    dto: Partial<TDto>,
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<void>
}
```

The full interface also declares `findAll()` and `findById()`. The current contracts declare `IWriteDataSource` and `IReadDataSource` independently; `IWriteDataSource` does not extend `IReadDataSource`, even though both expose the read methods.

The methods intentionally return `void` for writes. They do not specify generated identifiers, affected-row counts, or database-specific return values. Add a more specific application contract if a use case needs those results.

## Implement a read data source

The data source owns the provider query and returns DTOs. For example, a PostgreSQL-backed implementation can use the typed `DbContext` and Drizzle query builder:

```ts
// user.schema.ts
import { pgTable, text, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
})
```

```ts
// schema.ts
import type { users } from './user.schema'

export type DbSchema = { users: typeof users }
```

The implementation can then use that schema and the inferred row type:

```ts
import { AppError } from '@xeno-js/core'
import type {
  IReadDataSource,
  Optional,
  UserContext,
} from '@xeno-js/core'
import type { DbContext } from '@xeno-js/postgresql'
import { eq } from 'drizzle-orm'

import type { DbSchema } from './schema'
import { users } from './user.schema'
type UserDto = typeof users.$inferSelect

export class UserDataSource implements IReadDataSource<UserDto> {
  constructor(private readonly db: DbContext<DbSchema>) {}

  async findAll(
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<UserDto[]> {
    AppError.throwIfAborted(signal, 'UserDataSource.findAll')

    return this.db.select().from(users).execute()
  }

  async findById(
    id: string | number,
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<Optional<UserDto>> {
    AppError.throwIfAborted(signal, 'UserDataSource.findById')

    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, String(id)))
      .limit(1)
      .execute()

    return user
  }

  async dispose(): Promise<void> {}
}
```

The schema type binds the database context to the table definition. The implementation checks the optional `AbortSignal` before starting each query. A provider operation that supports cancellation can also receive the signal; the data-source contract does not automatically cancel an operation.

This example does not use `ctx`, so it performs no user- or tenant-specific filtering. If the operation requires that boundary, apply the relevant conditions in the data source rather than assuming the contract enforces them. An empty `dispose()` is appropriate only when the data source owns no resources; dispose resources that the implementation itself acquires.

## Add write operations

Implement all five query and command methods, plus `dispose()`, when the application needs `IWriteDataSource<TDto>`. The signatures are shown above; the implementation maps each operation to provider-specific calls.

The method contracts distinguish the update key from the partial DTO, while `delete()` receives the DTO itself. Implementations decide how these inputs map to provider operations. For example, a database implementation may soft-delete a row rather than physically remove it, if that matches the application's persistence rules.

The shared contracts do not define filtering, sorting, pagination, transactions, or authorization behavior. Add explicit methods to an application-specific contract for those requirements:

```ts
import type {
  IPaginatedResult,
  IWriteDataSource,
  Optional,
  UserContext,
} from '@xeno-js/core'

type OrderDto = { id: string; userId: string }

interface IOrderDataSource extends IWriteDataSource<OrderDto> {
  findByUserId(
    userId: string,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<OrderDto[]>

  findPaginatedByUserId(
    userId: string,
    page: number,
    pageSize: number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<IPaginatedResult<OrderDto>>
}
```

These methods are application-specific extensions; the generic `IWriteDataSource` does not supply them.

## Register and resolve the implementation

Keep the application token and its implementation type in the registry. Register the data source while composing the application with `XenoAppBuilder`:

```ts
import { XenoAppBuilder, TOKENS } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/core'
import type { DbContext, DbTransaction } from '@xeno-js/postgresql'

import type { DbSchema } from './schema'
import { UserDataSource } from './user.datasource'

interface AppRegistry extends XenoRegistry<
  DbContext<DbSchema>,
  DbTransaction
> {
  USER_DATA_SOURCE: UserDataSource
}

const app = new XenoAppBuilder<AppRegistry>()

// Configure the database provider with app.addDb(...) before resolving DB_CONTEXT.
app.addServices((services) => {
  services.addScoped(
    'USER_DATA_SOURCE',
    (container) => new UserDataSource(container.resolve(TOKENS.DB_CONTEXT)),
  )
})

const application = await app.build()

await application.runInScope(async (services) => {
  const users = await services.USER_DATA_SOURCE.findAll()
  console.log(users)
})
```

`addServices()` queues the service registration as part of builder composition. `build()` configures the queued modules; `runInScope()` creates an execution scope in which the scoped data source can be resolved. The database provider must register `DB_CONTEXT` before the data source factory runs.

Choose the lifetime according to the dependencies:

- Use `addScoped()` when the data source depends on a scoped database context, transaction, or request-specific state.
- Use `addSingleton()` only when all dependencies are safe to share for the lifetime of the container.
- Use `addTransient()` when each resolution should create a separate instance.

Do not capture a scoped dependency in a singleton data source. See [Xeno Registry](../../fundamentals/xeno-registry), [App Builder](../../fundamentals/app-builder), and [XenoApplication](../../fundamentals/xeno-application) for registry typing, composition, and scoped resolution.

## Data source, repository, and mapper

A data source deals with DTOs and provider operations. It does not own the domain entity mapping. A repository or DAO can coordinate the data source with an `IMapper`:

```text
Application
    │
    ▼
Repository or DAO
    ├── IMapper<TEntity, TDto>
    └── IWriteDataSource<TDto>
              │
              ▼
          Data provider
```

Use a data source directly when the application contract is intentionally DTO-oriented. Use a repository or DAO when the application needs entity-oriented operations and mapping. See [Repository](../repositories/repository) and [ReadDao](../repositories/read-dao) for those abstractions.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
