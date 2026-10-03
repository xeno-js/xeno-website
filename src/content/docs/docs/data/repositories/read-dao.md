---
title: ReadDao
description: Implement, register, resolve, and use a read-only DAO in a Xeno.JS application.
keywords:
- Xeno.JS
- ReadDao
- IReadDao
- IReadDataSource
- IMapper
- repository
- data access
- dependency injection
tags:
- repositories
faqs:
- question: How do I implement a read-only DAO in Xeno.JS?
  answer: Extend the abstract ReadDao<T, TDto> class and provide an IReadDataSource<TDto> and an IMapper<T, TDto> to its constructor.
- question: How do I register a ReadDao in Xeno.JS?
  answer: Register the concrete DAO with the application's service container, typically through AppBuilder.addServices().
- question: How do I resolve a ReadDao?
  answer: Build the AppBuilder and resolve the registered token from the service container or from an application service scope.
- question: What operations does ReadDao provide?
  answer: ReadDao provides findById() and findAll(), returning Xeno.JS ResultType values.
- question: Does ReadDao access the database directly?
  answer: No. ReadDao delegates data access to an IReadDataSource and converts DTOs to domain entities through an IMapper.
---

## Introduction

Use `ReadDao<T, TDto>` when you need a **read-only data access class** that converts data-source DTOs into application entities.

The usual implementation path is:

```text
IReadDataSource<TDto>
        │
        ▼
Concrete ReadDao<T, TDto>
        │
        ├── findById()
        └── findAll()
        │
        ▼
IMapper<T, TDto>
        │
        ▼
Domain entity T
```

You normally do not instantiate `ReadDao` directly. It is an abstract base class that you extend with your application's concrete DAO.

The base class is exported publicly by `@xeno-js/core`:

```ts
import { ReadDao } from '@xeno-js/core'
```

## Prerequisites

A concrete `ReadDao` needs three application-level types:

* an entity type `T`;
* a DTO type `TDto`;
* an implementation of `IReadDataSource<TDto>`;
* an implementation of `IMapper<T, TDto>`.

The relevant contracts are public Xeno.JS APIs:

```ts
interface IReadDataSource<TDto> {
  findAll(
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<TDto[]>

  findById(
    id: string | number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<TDto>>
}
```

`IReadDataSource<TDto>` also extends `IDisposable`.

The mapper contract is:

```ts
interface IMapper<T, TDto> {
  toDto(entity: T): TDto
  toEntity(dto: TDto): T
  toPartialDto(entity: Partial<T>): Partial<TDto>
}
```

For `ReadDao`, the relevant mapper operation is `toEntity()`.

## 1. Define the entity and DTO

The following types are application-specific examples:

```ts
export interface User {
  id: string
  name: string
}

export interface UserDto {
  id: string
  fullName: string
}
```

The DTO represents the shape returned by the data source, while `User` represents the entity used by the application.

For example:

```text
Data source
    │
    │ UserDto
    ▼
ReadDao
    │
    │ mapper.toEntity()
    ▼
User
```

## 2. Implement the mapper

Implement `IMapper<User, UserDto>`:

```ts
import type { IMapper } from '@xeno-js/core'

import type { User, UserDto } from './types'

export class UserMapper implements IMapper<User, UserDto> {
  toDto(entity: User): UserDto {
    return {
      id: entity.id,
      fullName: entity.name,
    }
  }

  toEntity(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.fullName,
    }
  }

  toPartialDto(entity: Partial<User>): Partial<UserDto> {
    return {
      ...(entity.id !== undefined ? { id: entity.id } : {}),
      ...(entity.name !== undefined ? { fullName: entity.name } : {}),
    }
  }
}
```

`ReadDao` only needs `toEntity()` for its read operations, but the public `IMapper` contract also requires `toDto()` and `toPartialDto()`.

## 3. Provide the read data source

The data source is responsible for obtaining DTOs.

For example, an application-specific data source can implement:

```ts
import type { IReadDataSource, Optional, UserContext } from '@xeno-js/core'

import type { UserDto } from './types'

export class UserDataSource implements IReadDataSource<UserDto> {
  async findById(
    id: string | number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<UserDto>> {
    // Application-specific database query.
    // Use ctx and signal according to the application's data-access rules.

    return undefined
  }

  async findAll(
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<UserDto[]> {
    // Application-specific database query.

    return []
  }

  async dispose(): Promise<void> {
    // Release resources if this data source owns any.
  }
}
```

The database/query implementation belongs to the `IReadDataSource` implementation, not to `ReadDao`.

`ReadDao` coordinates the data source and mapper.

## 4. Implement the concrete ReadDao

Extend the Xeno.JS base class:

```ts
import { ReadDao } from '@xeno-js/core'
import type { IMapper, IReadDataSource } from '@xeno-js/core'

import type { User, UserDto } from './types'

export class UserReadDao extends ReadDao<User, UserDto> {
  constructor(
    dataSource: IReadDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }
}
```

There is normally no need to override `findById()` or `findAll()`.

The base implementation already:

1. checks the `AbortSignal`;
2. calls the data source;
3. maps DTOs to entities;
4. wraps the result in `Result`.

The corresponding source implementation is equivalent to:

```ts
const result = await this._dataSource.findById(id, ctx, signal)

if (Guards.isNullOrEmpty(result)) {
  return Result.ok()
}

const entity = this._mapper.toEntity(result)

return Result.ok(entity)
```

For `findAll()`:

```ts
const results = await this._dataSource.findAll(ctx, signal)

const entities = results.map((result) => this._mapper.toEntity(result))

return Result.ok(entities)
```

## 5. Understand the ReadDao contract

The public `IReadDao<T>` interface exposes two operations.

### Find by ID

```ts
findById(
  id: string | number,
  ctx: UserContext,
  signal: Optional<AbortSignal>,
): Promise<ResultType<Optional<T>>>
```

The identifier can be either a string or a number.

The `UserContext` is passed through to the data source.

The `AbortSignal` is optional and allows the operation to be cancelled.

If the data source returns `undefined` or `null`, `ReadDao` returns a successful `Result` whose value is `undefined`.

It does not call the mapper when there is no DTO.

### Find all

```ts
findAll(
  ctx: UserContext,
  signal: Optional<AbortSignal>,
): Promise<ResultType<T[]>>
```

The data source returns DTOs:

```ts
UserDto[]
```

and `ReadDao` maps every DTO:

```ts
UserDto[] → User[]
```

An empty data-source result produces a successful result containing an empty array.

## 6. Register the concrete ReadDao

After implementing the class, register it in the application's DI container.

The important point is that **you register `UserReadDao`, not the abstract `ReadDao`**.

A typical registration is:

```ts
app.addServices((services) => {
  services.addScoped('USER_READ_DAO', (container) => {
    return new UserReadDao(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})
```

The exact token names in this example are application-defined.

For this registration to work, the application must also register the dependencies:

```text
USER_DATA_SOURCE
        │
        ▼
USER_READ_DAO
        ▲
        │
USER_MAPPER
```

For example:

```ts
app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', () => {
    return new UserDataSource()
  })

  services.addScoped('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_READ_DAO', (container) => {
    return new UserReadDao(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})
```

The tokens shown here (`USER_DATA_SOURCE`, `USER_MAPPER`, and `USER_READ_DAO`) are application-defined registry entries. They are not predefined Xeno.JS tokens.

## 7. Add the tokens to the application registry

When using a typed `AppBuilder`, add the application-specific tokens to the `XenoRegistry`.

For example:

```ts
import type { XenoRegistry } from '@xeno-js/core'
import type { IReadDataSource, IMapper } from '@xeno-js/core'

type ApplicationRegistry = XenoRegistry<
  {
    db: unknown
  },
  {
    USER_DATA_SOURCE: IReadDataSource<UserDto>
    USER_MAPPER: IMapper<User, UserDto>
    USER_READ_DAO: UserReadDao
  }
>
```

The exact first generic parameter depends on the application's `XenoRegistry` setup.

The important part for the DAO is that the registry associates each token with its resolved type:

```ts
{
  USER_DATA_SOURCE: IReadDataSource<UserDto>
  USER_MAPPER: IMapper<User, UserDto>
  USER_READ_DAO: UserReadDao
}
```

This gives `AppBuilder.resolve()` and the service container the corresponding TypeScript types.

## 8. Build the application

Register the services before building the application:

```ts
const app = new AppBuilder<ApplicationRegistry>()

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', () => {
    return new UserDataSource()
  })

  services.addScoped('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_READ_DAO', (container) => {
    return new UserReadDao(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})

const container = await app.build()
```

`build()` initializes the configured application modules and returns the configured service container.

## 9. Resolve the ReadDao

`ReadDao` is commonly registered as a scoped service.

A scoped service must be resolved through a scope.

```ts
const scope = container.createScope()

const readDao = scope.resolve('USER_READ_DAO')
```

The resolved value has the registry type:

```ts
UserReadDao
```

You can then use it directly:

```ts
const result = await readDao.findById(
  'user-123',
  ctx,
  signal,
)
```

When the scope is no longer needed:

```ts
await scope.dispose()
```

### Resolving from AppBuilder

`AppBuilder` also exposes `resolve()`:

```ts
const readDao = app.resolve('USER_READ_DAO')
```

However, the Xeno.JS container does not allow a scoped registration to be resolved from the root container.

For a scoped `ReadDao`, use:

```ts
const container = await app.build()
const scope = container.createScope()

const readDao = scope.resolve('USER_READ_DAO')
```

## 10. Use ReadDao from an application service

A typical application service receives the DAO through dependency injection rather than constructing it itself.

Conceptually:

```ts
export class GetUserService {
  constructor(
    private readonly users: UserReadDao,
  ) {}

  async execute(
    id: string,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ) {
    return this.users.findById(id, ctx, signal)
  }
}
```

The service does not need to know:

* which database is used;
* which SQL/query implementation is used;
* how the DTO is represented;
* how the DTO is mapped to the entity.

Those responsibilities remain behind the data source and mapper.

## 11. Find an entity by ID

Call:

```ts
const result = await readDao.findById(
  'user-123',
  ctx,
  signal,
)
```

The flow is:

```text
UserReadDao.findById()
        │
        ▼
IReadDataSource.findById()
        │
        ▼
UserDto | undefined
        │
        ▼
IMapper.toEntity()
        │
        ▼
ResultType<Optional<User>>
```

If no record is found, the base implementation returns an `ok` result with an undefined value.

If a DTO is returned, it is converted through:

```ts
mapper.toEntity(dto)
```

## 12. Find all entities

Use:

```ts
const result = await readDao.findAll(
  ctx,
  signal,
)
```

The flow is:

```text
UserReadDao.findAll()
        │
        ▼
IReadDataSource.findAll()
        │
        ▼
UserDto[]
        │
        ▼
IMapper.toEntity() for each DTO
        │
        ▼
User[]
```

The mapper is called once for every returned DTO.

An empty result remains an empty entity array.

## 13. Cancellation

`ReadDao` checks the supplied `AbortSignal` before invoking the data source.

For example:

```ts
const controller = new AbortController()

controller.abort()

await readDao.findById(
  'user-123',
  ctx,
  controller.signal,
)
```

An already-aborted signal causes the operation to throw before the data source is called.

The Xeno.JS tests explicitly verify this behavior for both:

```ts
findById()
```

and:

```ts
findAll()
```

Pass the signal through to the DAO when the calling operation supports cancellation:

```ts
await readDao.findAll(ctx, signal)
```

## ReadDao vs Repository

`ReadDao` and `Repository` both provide read operations, but they represent different base abstractions.

### ReadDao

`ReadDao<T, TDto>` is read-only:

```ts
findById()
findAll()
```

It depends on:

```ts
IReadDataSource<TDto>
IMapper<T, TDto>
```

Use it when the abstraction you need is specifically for reading data.

### Repository

`Repository<T, TDto>` implements the complete `IRepository<T>` contract:

```ts
findById()
findAll()
save()
update()
delete()
```

Its data-source dependency is:

```ts
IWriteDataSource<TDto>
```

Use `Repository` when the abstraction needs both reads and writes.

The distinction is therefore:

```text
ReadDao
  └── IReadDataSource
       └── findById
       └── findAll

Repository
  └── IWriteDataSource
       ├── findById
       ├── findAll
       ├── insert
       ├── update
       └── delete
```

`IWriteDataSource` itself includes the read methods, so a write-capable repository can also perform reads.

## ReadDao vs DataSource

The data source and DAO have different responsibilities.

### DataSource

`IReadDataSource<TDto>` works with DTO/data-source representations:

```ts
findById(...): Promise<Optional<TDto>>

findAll(...): Promise<TDto[]>
```

It is responsible for obtaining data.

### Base ReadDao

`ReadDao<T, TDto>` exposes entities:

```ts
findById(...): Promise<ResultType<Optional<T>>>

findAll(...): Promise<ResultType<T[]>>
```

It delegates retrieval to the data source and maps the DTOs:

```text
DataSource
    │
    │ DTO
    ▼
ReadDao
    │
    │ Mapper
    ▼
Entity
```

## Complete example

The following shows the complete application-side structure.

```text
src/
├── users/
│   ├── user.ts
│   ├── user.dto.ts
│   ├── user.mapper.ts
│   ├── user.data-source.ts
│   └── user.read-dao.ts
└── bootstrap.ts
```

### `user.ts`

```ts
export interface User {
  id: string
  name: string
}
```

### `user.dto.ts`

```ts
export interface UserDto {
  id: string
  fullName: string
}
```

### `user.mapper.ts`

```ts
import type { IMapper } from '@xeno-js/core'

import type { User } from './user'
import type { UserDto } from './user.dto'

export class UserMapper implements IMapper<User, UserDto> {
  toDto(entity: User): UserDto {
    return {
      id: entity.id,
      fullName: entity.name,
    }
  }

  toEntity(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.fullName,
    }
  }

  toPartialDto(entity: Partial<User>): Partial<UserDto> {
    return {
      ...(entity.id !== undefined ? { id: entity.id } : {}),
      ...(entity.name !== undefined ? { fullName: entity.name } : {}),
    }
  }
}
```

### `user.data-source.ts`

```ts
import type {
  IReadDataSource,
  Optional,
  UserContext,
} from '@xeno-js/core'

import type { UserDto } from './user.dto'

export class UserDataSource implements IReadDataSource<UserDto> {
  async findById(
    id: string | number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<UserDto>> {
    // Implement the application-specific database query here.
    return undefined
  }

  async findAll(
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<UserDto[]> {
    // Implement the application-specific database query here.
    return []
  }

  async dispose(): Promise<void> {
    // Release resources owned by the data source, if any.
  }
}
```

### `user.read-dao.ts`

```ts
import { ReadDao } from '@xeno-js/core'
import type {
  IMapper,
  IReadDataSource,
} from '@xeno-js/core'

import type { User } from './user'
import type { UserDto } from './user.dto'

export class UserReadDao extends ReadDao<User, UserDto> {
  constructor(
    dataSource: IReadDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }
}
```

### `bootstrap.ts`

The registration follows the normal Xeno.JS DI pattern:

```ts
import { AppBuilder } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/core'
import type {
  IMapper,
  IReadDataSource,
} from '@xeno-js/core'

import type { User } from './users/user'
import type { UserDto } from './users/user.dto'
import { UserMapper } from './users/user.mapper'
import { UserDataSource } from './users/user.data-source'
import { UserReadDao } from './users/user.read-dao'

type ApplicationRegistry = XenoRegistry<
  unknown,
  {
    USER_DATA_SOURCE: IReadDataSource<UserDto>
    USER_MAPPER: IMapper<User, UserDto>
    USER_READ_DAO: UserReadDao
  }
>

const app = new AppBuilder<ApplicationRegistry>()

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', () => {
    return new UserDataSource()
  })

  services.addScoped('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_READ_DAO', (container) => {
    return new UserReadDao(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})

const container = await app.build()

const scope = container.createScope()

const readDao = scope.resolve('USER_READ_DAO')

const result = await readDao.findAll(ctx, signal)

await scope.dispose()
```

The `unknown` used as the first `XenoRegistry` parameter above is only a placeholder for the application's actual registry base type. It is not a special Xeno.JS value required by `ReadDao`.

## What ReadDao does for you

Once the concrete DAO is implemented and registered, the base class handles the common read workflow:

```text
findById(id, ctx, signal)
        │
        ├── cancellation check
        │
        ├── dataSource.findById(...)
        │
        ├── null/undefined → Result.ok()
        │
        └── mapper.toEntity(dto)
                 │
                 ▼
             Result.ok(entity)
```

and:

```text
findAll(ctx, signal)
        │
        ├── cancellation check
        │
        ├── dataSource.findAll(...)
        │
        └── mapper.toEntity() for every DTO
                 │
                 ▼
             Result.ok(entities)
```

You therefore only need to provide the application-specific pieces:

```text
Entity
   +
DTO
   +
IReadDataSource implementation
   +
IMapper implementation
   ↓
Concrete ReadDao
```

## Troubleshooting

### `ReadDao` cannot be instantiated

`ReadDao` is abstract.

Do this:

```ts
class UserReadDao extends ReadDao<User, UserDto> {
  // ...
}
```

not:

```ts
const dao = new ReadDao<User, UserDto>(...)
```

### The constructor dependencies do not match

The base constructor requires:

```ts
constructor(
  dataSource: IReadDataSource<TDto>,
  mapper: IMapper<T, TDto>,
)
```

Make sure the DTO type is the same in both dependencies:

```ts
IReadDataSource<UserDto>
IMapper<User, UserDto>
```

### `resolve()` reports that the registration does not exist

Make sure the DAO was registered before:

```ts
await app.build()
```

and that the token used for registration is exactly the token used for resolution:

```ts
services.addScoped('USER_READ_DAO', ...)
```

then:

```ts
scope.resolve('USER_READ_DAO')
```

### A scoped DAO cannot be resolved from `container.resolve()`

This is expected for a scoped registration.

The service container explicitly rejects resolving scoped services from the root container.

Use:

```ts
const scope = container.createScope()

const dao = scope.resolve('USER_READ_DAO')
```

### `findById()` returns no entity

The base `ReadDao` treats `null` and `undefined` from the data source as "not found" and returns a successful result with an undefined value.

Check the data source:

```ts
await dataSource.findById(id, ctx, signal)
```

and verify that it returns the expected DTO when a record exists.

### The entity has the wrong shape

`ReadDao` does not transform DTO fields itself.

The transformation is performed by:

```ts
mapper.toEntity(dto)
```

Check the concrete `IMapper<T, TDto>` implementation.

### A cancelled operation still reaches the data source

Check that the same `AbortSignal` is passed to the DAO:

```ts
await readDao.findById(id, ctx, signal)
```

`ReadDao` checks an already-aborted signal before invoking its data source.

## Checklist

To implement a read-only DAO:

* [ ] Define the entity type.
* [ ] Define the data-source DTO type.
* [ ] Implement `IReadDataSource<TDto>`.
* [ ] Implement `IMapper<T, TDto>`.
* [ ] Create a concrete class extending `ReadDao<T, TDto>`.
* [ ] Pass the data source and mapper to `super(...)`.
* [ ] Add the concrete DAO to the application's registry.
* [ ] Register the data source.
* [ ] Register the mapper.
* [ ] Register the DAO.
* [ ] Build the `AppBuilder`.
* [ ] Create a scope when the DAO is registered as scoped.
* [ ] Resolve the DAO using its application-defined token.
* [ ] Call `findById()` or `findAll()`.
* [ ] Pass the `UserContext`.
* [ ] Pass an `AbortSignal` when cancellation is needed.
* [ ] Dispose the scope when its lifetime ends.

---

## Related Docs

* [Data Overview](../overview)
* [Node PostgreSQL](../node-postgresql)
* [SQLite](../sqllite)
* [Unit of Work](../unit-of-work)
* [Service Registration](../../dependency-injection/registration)
* [Service Resolution](../../dependency-injection/resolution)
* [Dependency Graph](../../dependency-injection/dependency-graph)
* [Repository](./repository)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
