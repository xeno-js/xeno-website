---
title: Repository
description: Learn how to implement a repository with Xeno.JS, register it in XenoAppBuilder, resolve it through dependency injection, and use its CRUD operations.
keywords:
- Xeno.JS
- Repository
- IRepository
- XenoAppBuilder
- dependency injection
- data source
- mapper
- CRUD
tags:
- data
- repository
- dependency-injection
faqs:
- question: How do I create a repository in Xeno.JS?
  answer: Extend the abstract Repository<T, TDto> class and pass an IWriteDataSource<TDto> and IMapper<T, TDto> to its constructor.
- question: How do I register a repository in Xeno.JS?
  answer: Register the concrete repository with XenoAppBuilder.addServices() using the service container, normally with addScoped(), addSingleton(), or addTransient().
- question: How do I resolve a repository?
  answer: Resolve scoped repositories through XenoApplication.runInScope(); root resolution cannot retrieve scoped services.
- question: Does Repository implement CRUD operations?
  answer: Yes. The Xeno.JS Repository base class implements findById, findAll, save, update, and delete using the configured data source and mapper.
---

## Introduction

A repository in Xeno.JS is the application-facing abstraction used to work with persisted entities.

You normally create a repository by extending the abstract `Repository<T, TDto>` class:

```ts
import { Repository } from '@xeno-js/core'
import type { IMapper, IWriteDataSource } from '@xeno-js/core'

import type { User } from './user'
import type { UserDto } from './user.dto'

export class UserRepository extends Repository<User, UserDto> {
  constructor(
    dataSource: IWriteDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }
}
```

The base `Repository` already implements the standard operations:

- `findById()`
- `findAll()`
- `save()`
- `update()`
- `delete()`

Your concrete repository therefore normally contains the **entity/DTO types and constructor dependencies**, rather than reimplementing those CRUD methods.

The complete flow is:

```text
Entity
   │
   ▼
Concrete Repository
   │
   ├── IMapper
   │
   └── IWriteDataSource
           │
           ▼
        Database

AppBuilder
   │
   └── registers Repository
            │
            ▼
        DI Container
            │
            ▼
        resolve(...)
```

## Prerequisites

Install Xeno.JS in your application:

```bash
npm install @xeno-js/core
```

You also need implementations of:

- the DTO used by the data source;
- `IWriteDataSource<TDto>`;
- `IMapper<TEntity, TDto>`.

`Repository` is exported from `@xeno-js/core`.

```ts
import {
 XenoAppBuilder,
  Repository,
} from '@xeno-js/core'
```

The shared contracts are also exported through the Xeno.JS package:

```ts
import type {
  IMapper,
  IWriteDataSource,
} from '@xeno-js/core'
```

## 1. Define the Entity

Start with the application entity.

For example:

```ts
export interface User {
  id: string
  name: string
  email: string
}
```

The entity is the type exposed by the repository to the application.

The repository does not expose the DTO used internally by the data source.

## 2. Define the DTO

Define the representation expected by the data source.

For example:

```ts
export interface UserDto {
  id: string
  fullName: string
  emailAddress: string
}
```

The entity and DTO can have different property names or structures.

That is the reason the repository receives an `IMapper`.

## 3. Implement the Mapper

`Repository<T, TDto>` requires an `IMapper<T, TDto>`.

The public mapper contract contains three methods:

```ts
interface IMapper<TE, TDto> {
  toDto(entity: TE): TDto
  toEntity(dto: TDto): TE
  toPartialDto(entity: Partial<TE>): Partial<TDto>
}
```

A concrete mapper can therefore be implemented as:

```ts
import type { IMapper } from '@xeno-js/core'

import type { User } from './user'
import type { UserDto } from './user.dto'

export class UserMapper implements IMapper<User, UserDto> {
  toDto(entity: User): UserDto {
    return {
      id: entity.id,
      fullName: entity.name,
      emailAddress: entity.email,
    }
  }

  toEntity(dto: UserDto): User {
    return {
      id: dto.id,
      name: dto.fullName,
      email: dto.emailAddress,
    }
  }

  toPartialDto(entity: Partial<User>): Partial<UserDto> {
    return {
      ...(entity.id !== undefined && { id: entity.id }),
      ...(entity.name !== undefined && { fullName: entity.name }),
      ...(entity.email !== undefined && { emailAddress: entity.email }),
    }
  }
}
```

The mapper is used by the base repository as follows:

```text
findById / findAll
        │
        ▼
IWriteDataSource<UserDto>
        │
        ▼
     UserDto
        │
        ▼
IMapper.toEntity()
        │
        ▼
      User
```

For write operations:

```text
User
 │
 ▼
IMapper.toDto()
 │
 ▼
UserDto
 │
 ▼
IWriteDataSource
```

For partial updates:

```text
Partial<User>
 │
 ▼
IMapper.toPartialDto()
 │
 ▼
Partial<UserDto>
 │
 ▼
IWriteDataSource.update()
```

## 4. Implement the Data Source

The repository depends on `IWriteDataSource<TDto>`.

The contract extends `IDisposable` and contains both read and write operations:

```ts
import type { IDisposable, Optional, UserContext } from '@xeno-js/core'

interface IWriteDataSource<TDto> extends IDisposable {
  findAll(
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<TDto[]>

  findById(
    id: string | number,
    ctx?: Optional<UserContext>,
    signal?: Optional<AbortSignal>,
  ): Promise<Optional<TDto>>

  insert(
    dto: TDto,
    signal?: Optional<AbortSignal>,
  ): Promise<void>

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

  dispose(): Promise<void>
}
```

The concrete data source must implement these operations and `dispose()`. It is responsible for the actual persistence operation and releasing any resources it owns.

The important separation is:

```text
UserRepository
    │
    ▼
IWriteDataSource<UserDto>
    │
    ▼
database implementation
```

The repository does not construct SQL itself when using this abstraction. The data source owns the persistence-specific implementation.

## 5. Create the Concrete Repository

Now create the repository itself.

The Xeno.JS base class is:

```ts
abstract class Repository<T, TDto>
```

Its constructor requires:

```ts
constructor(
  dataSource: IWriteDataSource<TDto>,
  mapper: IMapper<T, TDto>,
)
```

Therefore the concrete repository can be:

```ts
import {
  Repository,
} from '@xeno-js/core'

import type {
  IMapper,
  IWriteDataSource,
} from '@xeno-js/core'

export class UserRepository extends Repository<User, UserDto> {
  constructor(
    dataSource: IWriteDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }
}
```

This is enough to obtain the standard repository operations.

You do **not** need to implement:

```ts
findById()
findAll()
save()
update()
delete()
```

again.

They are already implemented by `Repository`.

### Adding application-specific methods

If your repository needs operations beyond the base CRUD contract, you can add methods to the concrete class.

For example:

```ts
import type {
  IMapper,
  IWriteDataSource,
  Optional,
  ResultType,
  UserContext,
} from '@xeno-js/core'
import { Repository } from '@xeno-js/core'

import type { User } from './user'
import type { UserDto } from './user.dto'

export class UserRepository extends Repository<User, UserDto> {
  constructor(
    dataSource: IWriteDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }

  async findByEmail(
    email: string,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<ResultType<Optional<User>>> {
    throw new Error('Implement the application-specific email lookup.')
  }
}
```

Only methods that are not provided by the base `Repository` need to be added by the concrete repository.

## 6. Register the Repository in `XenoAppBuilder`

Xeno.JS uses explicit dependency injection registration.

The application composition root is `XenoAppBuilder`.

The registration examples assume `app` uses the typed `Registry` shown in the next section.

Use:

```ts
app.addServices(...)
```

to register application services.

The README contains the same pattern for a repository:

```ts
services.addScoped('USER_REPOSITORY', (container) => {
  return new UserRepository(
    container.resolve('USER_DATA_SOURCE'),
    container.resolve('USER_MAPPER'),
  )
})
```

A complete registration therefore looks like:

```ts
const app = new XenoAppBuilder()

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (container) => {
    return new UserDataSource(
      container.resolve('DB_CONTEXT'),
    )
  })

  services.addScoped('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_REPOSITORY', (container) => {
    return new UserRepository(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})
```

The important point is that **the repository is not automatically discovered**.

You explicitly register:

```text
USER_DATA_SOURCE
       │
       ▼
USER_MAPPER
       │
       ▼
USER_REPOSITORY
```

and the container resolves the dependencies when it creates the repository.

## 7. Register the Repository With the Correct Lifetime

Xeno.JS supports three service lifetimes:

```ts
services.addSingleton(...)
services.addScoped(...)
services.addTransient(...)
```

### Scoped

A scoped registration creates one instance per service scope:

```ts
services.addScoped('USER_REPOSITORY', (container) => {
  return new UserRepository(
    container.resolve('USER_DATA_SOURCE'),
    container.resolve('USER_MAPPER'),
  )
})
```

A scoped service must be resolved from an active scope. `XenoAppBuilder.build()` returns the runtime application, so use `XenoApplication.runInScope()`:

```ts
import type { UserContext } from '@xeno-js/core'

const application = await app.build()
const userContext: UserContext = {
  userId: 'd108b2d2-1df8-45ca-8a27-686f9f443269',
  tenantId: '6fdeff88-9f53-4c58-b24f-2e2db77d95ce',
}

const result = await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  return repository.findAll(userContext, undefined)
})
```

The application manages the scope lifetime and disposes it when the callback completes.

### Singleton

A singleton is shared by the container:

Register a repository as singleton only when its data source and mapper are also root-resolvable and safe to share. Do not use the scoped `USER_DATA_SOURCE` and `USER_MAPPER` registrations shown above for this lifetime.

For a repository registered as singleton (not the scoped registration shown above), `XenoAppBuilder.resolve()` resolves it from the root container:

```ts
const repository = app.resolve('USER_REPOSITORY')
```

A singleton should only be used when its dependencies and application semantics are compatible with singleton lifetime. In particular, do not capture scoped dependencies in a singleton.

### Transient

A transient creates a new instance on each resolution:

```ts
services.addTransient('USER_REPOSITORY', (container) => {
  return new UserRepository(
    container.resolve('USER_DATA_SOURCE'),
    container.resolve('USER_MAPPER'),
  )
})
```

Because the dependencies registered above are scoped, resolve this transient repository inside `application.runInScope()`. Root resolution is only valid when the transient repository's dependency graph is also root-resolvable. A repository that depends on scoped services must not be registered as a singleton.

## 8. Extend the XenoRegistry for Application Services

Xeno.JS types the dependency injection container through `XenoRegistry`.

The registry can be extended with application-specific services.

For example:

```ts
import type {
  IMapper,
  IWriteDataSource,
} from '@xeno-js/core'

import type {
  XenoRegistry,
} from '@xeno-js/core'
import type { User } from './user'
import type { UserDto } from './user.dto'
import type { UserRepository } from './user.repository'

interface Registry extends XenoRegistry {
  USER_DATA_SOURCE: IWriteDataSource<UserDto>
  USER_MAPPER: IMapper<User, UserDto>
  USER_REPOSITORY: UserRepository
}
```

The builder can then use that registry:

```ts
const app = new XenoAppBuilder<Registry>()
```

This makes the custom tokens part of the compile-time registry used by `addServices()` and `resolve()`.

The pattern is:

```text
XenoRegistry
    │
    └── application extensions
            │
            ├── USER_DATA_SOURCE
            ├── USER_MAPPER
            └── USER_REPOSITORY
```

This is preferable to leaving application dependencies untyped.

## 9. Complete Registration Example

A complete composition root can therefore look like this:

```ts
import type {
  IMapper,
  IWriteDataSource,
} from '@xeno-js/core'
import type { User } from './domain/users/user'
import type { UserDto } from './infrastructure/users/user.dto'
import { UserMapper } from './infrastructure/users/user.mapper'
import { UserDataSource } from './infrastructure/users/user.data-source'
import { UserRepository } from './infrastructure/users/user.repository'

import {
 XenoAppBuilder,
} from '@xeno-js/core'

import type {
  XenoRegistry,
} from '@xeno-js/core'

interface Registry extends XenoRegistry {
  USER_DATA_SOURCE: IWriteDataSource<UserDto>
  USER_MAPPER: IMapper<User, UserDto>
  USER_REPOSITORY: UserRepository
}

const app = new XenoAppBuilder<Registry>()

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (container) => {
    return new UserDataSource(
      container.resolve('DB_CONTEXT'),
    )
  })

  services.addScoped('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_REPOSITORY', (container) => {
    return new UserRepository(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})

const application = await app.build()
```

At this point the repository has been registered. `build()` returns the runtime application, not the service container.

## 10. Resolve a Scoped Repository

Resolve the repository within the scope managed by the runtime application:

```ts
const result = await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  return repository.findById(userId, userContext, undefined)
})
```

The registry types `services.USER_REPOSITORY` as `UserRepository`. The scope is disposed when the callback completes.

## 11. Resolve the Repository from `XenoAppBuilder`

`XenoAppBuilder` also exposes:

```ts
app.resolve(token)
```

This resolves from the root service container; it cannot resolve a scoped repository. Resolve scoped repositories through the runtime application's `runInScope()` method, as shown above.

## 12. Use the Repository in an Application Service

A common pattern is to inject or resolve the repository at the application composition boundary and then use it from an application service or handler.

For example:

```ts
export class CreateUserHandler {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  async execute(user: User): Promise<void> {
    await this.repository.save(user, undefined)
  }
}
```

The application service should receive the repository rather than constructing it itself.

Avoid:

```ts
const repository = new UserRepository(
  dataSource,
  mapper,
)
```

inside every handler.

The DI container should own the construction:

```text
AppBuilder
    │
    ▼
ServiceContainer
    │
    ├── UserDataSource
    ├── UserMapper
    └── UserRepository
             │
             ▼
       Application code
```

This keeps the repository's dependencies explicit and replaceable.

## 13. Repository Operations

The base `Repository` implements the `IRepository<T>` contract.

### Find by ID

```ts
const result = await repository.findById(
  id,
  ctx,
  signal,
)
```

Signature:

```ts
findById(
  id: string | number,
  ctx: UserContext,
  signal: Optional<AbortSignal>,
): Promise<ResultType<Optional<T>>>
```

The repository:

1. checks the abort signal;
2. asks the data source for the DTO;
3. returns an empty successful result when the data source returns `null` or `undefined`;
4. maps the DTO to the entity;
5. returns the entity inside the `Result`.

### Find all

```ts
const result = await repository.findAll(
  ctx,
  signal,
)
```

Signature:

```ts
findAll(
  ctx: UserContext,
  signal: Optional<AbortSignal>,
): Promise<ResultType<T[]>>
```

Every DTO returned by the data source is converted with:

```ts
mapper.toEntity(dto)
```

### Save

```ts
const result = await repository.save(
  user,
  signal,
)
```

Signature:

```ts
save(
  entity: T,
  signal: Optional<AbortSignal>,
): Promise<ResultType<void>>
```

The repository converts the entity with:

```ts
mapper.toDto(entity)
```

and passes the DTO to:

```ts
dataSource.insert(dto, signal)
```

### Update

```ts
const result = await repository.update(
  userId,
  { name: 'Alice' },
  ctx,
  signal,
)
```

Signature:

```ts
update(
  id: string | number,
  entity: Partial<T>,
  ctx: UserContext,
  signal: Optional<AbortSignal>,
): Promise<ResultType<void>>
```

The partial entity is converted with:

```ts
mapper.toPartialDto(entity)
```

before being passed to the data source.

### Delete

```ts
const result = await repository.delete(
  user,
  ctx,
  signal,
)
```

Signature:

```ts
delete(
  entity: T,
  ctx: UserContext,
  signal: Optional<AbortSignal>,
): Promise<ResultType<void>>
```

The entity is first converted to its DTO representation and then passed to the data source.

## 14. Cancellation

The base repository accepts an optional `AbortSignal`.

For example:

```ts
const controller = new AbortController()

const result = await repository.findById(
  userId,
  ctx,
  controller.signal,
)
```

The repository checks whether the operation has already been aborted before invoking the corresponding data-source operation.

The repository tests explicitly verify this behavior for:

- `findById`;
- `findAll`;
- `save`;
- `delete`;
- `update`.

One implementation detail that matters when reasoning about this behavior is that `save`, `delete`, and `update` perform their mapper operation before the abort check. The data-source operation is not invoked after the signal has already been aborted.

## 15. Result Handling

Repository methods return `ResultType`.

For example:

```ts
const result = await repository.findById(
  userId,
  ctx,
  undefined,
)
```

The repository itself wraps successful operations with `Result.ok(...)`.

For a missing entity, `findById()` returns a successful result whose value is `undefined`.
If a data-source or mapper operation throws, the repository does not catch that exception or convert it into a `Result`; the returned promise rejects.

Therefore a missing entity should not be confused with a repository failure.

Conceptually:

```text
findById()
    │
    ├── entity found
    │      └── Result.ok(entity)
    │
    ├── entity not found
    │      └── Result.ok(undefined)
    │
    └── underlying operation throws
           └── rejected promise; the base class does not convert it to Result
```

## 16. Repository vs Data Source

The two abstractions have different responsibilities.

### Repository

The repository works with application entities:

```ts
User
```

and coordinates:

```text
Entity
  ↕
Mapper
  ↕
DTO
  ↕
DataSource
```

### Data Source

The data source works with persistence DTOs:

```ts
UserDto
```

and performs the actual data access.

This separation allows the application-facing repository to remain independent from the persistence representation.

## 17. Repository vs ReadDao

Xeno.JS also exposes an abstract `ReadDao<T, TDto>`.

`ReadDao` implements the read-only `IReadDao<T>` contract:

```ts
findById(...)
findAll(...)
```

`Repository` implements the broader `IRepository<T>` contract:

```ts
findById(...)
findAll(...)
save(...)
update(...)
delete(...)
```

Use `Repository` when the abstraction needs the complete CRUD contract.

Use `ReadDao` when the abstraction is intentionally read-only.

The important distinction is therefore the public contract:

```text
ReadDao
  └── findById
  └── findAll

Repository
  ├── findById
  ├── findAll
  ├── save
  ├── update
  └── delete
```

## 18. Complete Example

A typical application can be organized as:

```text
src/
├── application/
│   └── users/
│       └── create-user.handler.ts
├── domain/
│   └── users/
│       └── user.ts
├── infrastructure/
│   └── users/
│       ├── user.data-source.ts
│       ├── user.mapper.ts
│       └── user.repository.ts
└── bootstrap.ts
```

### `user.repository.ts`

```ts
import type { User } from '../../domain/users/user'
import type { UserDto } from './user.dto'

import {
  Repository,
} from '@xeno-js/core'

import type {
  IMapper,
  IWriteDataSource,
} from '@xeno-js/core'

export class UserRepository extends Repository<User, UserDto> {
  constructor(
    dataSource: IWriteDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }
}
```

### `bootstrap.ts`

```ts
import type {
  IMapper,
  Optional,
  UserContext,
  IWriteDataSource,
} from '@xeno-js/core'
import type { User } from './domain/users/user'
import type { UserDto } from './infrastructure/users/user.dto'
import { UserMapper } from './infrastructure/users/user.mapper'
import { UserDataSource } from './infrastructure/users/user.data-source'
import { UserRepository } from './infrastructure/users/user.repository'

import {
  XenoAppBuilder,
} from '@xeno-js/core'

import type {
  XenoRegistry,
} from '@xeno-js/core'

interface Registry extends XenoRegistry {
  USER_DATA_SOURCE: IWriteDataSource<UserDto>
  USER_MAPPER: IMapper<User, UserDto>
  USER_REPOSITORY: UserRepository
}

const app = new XenoAppBuilder<Registry>()

app.addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', (container) => {
    return new UserDataSource(
      container.resolve('DB_CONTEXT'),
    )
  })

  services.addScoped('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_REPOSITORY', (container) => {
    return new UserRepository(
      container.resolve('USER_DATA_SOURCE'),
      container.resolve('USER_MAPPER'),
    )
  })
})

const application = await app.build()
const userId = 'user-123'
const userContext: UserContext = {
  userId: 'd108b2d2-1df8-45ca-8a27-686f9f443269',
  tenantId: '6fdeff88-9f53-4c58-b24f-2e2db77d95ce',
}
const signal: Optional<AbortSignal> = undefined

const result = await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  return repository.findById(userId, userContext, signal)
})
```

The important application workflow is:

```text
1. Define Entity
       ↓
2. Define DTO
       ↓
3. Implement IMapper
       ↓
4. Implement IWriteDataSource
       ↓
5. Extend Repository<Entity, DTO>
       ↓
6. Register dependencies with addServices()
       ↓
7. Register concrete Repository
       ↓
8. build()
       ↓
9. runInScope() for scoped services
       ↓
10. Resolve USER_REPOSITORY inside the scope
       ↓
11. repository.findById(...)
    repository.findAll(...)
    repository.save(...)
    repository.update(...)
    repository.delete(...)
```

## Troubleshooting

### `Repository` cannot be instantiated

`Repository` is abstract.

Do not do:

```ts
const repository = new Repository<User, UserDto>(
  dataSource,
  mapper,
)
```

Create a concrete subclass:

```ts
class UserRepository extends Repository<User, UserDto> {
  constructor(
    dataSource: IWriteDataSource<UserDto>,
    mapper: IMapper<User, UserDto>,
  ) {
    super(dataSource, mapper)
  }
}
```

### The repository cannot be resolved

Check that it was registered:

```ts
app.addServices((services) => {
  services.addScoped('USER_REPOSITORY', ...)
})
```

Also check that `build()` has completed before resolving services. For a scoped repository, resolve it inside `application.runInScope()`.

### A scoped repository cannot be resolved from `XenoAppBuilder`

This is expected.

A scoped service requires an active scope.

Use the runtime application's scoped execution API:

```ts
const application = await app.build()
await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  // Use the repository within this scope.
})
```

### A repository dependency cannot be resolved

Check every dependency used by its factory:

```ts
services.addScoped('USER_REPOSITORY', (container) => {
  return new UserRepository(
    container.resolve('USER_DATA_SOURCE'),
    container.resolve('USER_MAPPER'),
  )
})
```

Both:

```text
USER_DATA_SOURCE
USER_MAPPER
```

must be registered before the repository can be constructed.

### The repository token is not type-safe

Extend the application's `XenoRegistry`:

```ts
interface Registry extends XenoRegistry {
  USER_REPOSITORY: UserRepository
}
```

and construct:

```ts
const app = new XenoAppBuilder<Registry>()
```

This makes the custom token part of the registry used by the DI APIs.

### The mapper is not converting data correctly

Check all three mapper methods:

```ts
toDto(...)
toEntity(...)
toPartialDto(...)
```

The base repository uses them for different operations:

| Repository operation | Mapper method  |
| -------------------- | -------------- |
| `findById`           | `toEntity`     |
| `findAll`            | `toEntity`     |
| `save`               | `toDto`        |
| `update`             | `toPartialDto` |
| `delete`             | `toDto`        |

## Checklist

Before using a repository in an application, verify:

- [ ] The entity type is defined.
- [ ] The persistence DTO is defined.
- [ ] `IMapper<Entity, Dto>` is implemented.
- [ ] `IWriteDataSource<Dto>` is implemented.
- [ ] The concrete repository extends `Repository<Entity, Dto>`.
- [ ] The mapper is registered in the DI container.
- [ ] The data source is registered in the DI container.
- [ ] The repository is registered with `addServices()`.
- [ ] The repository token is included in the application's registry when type-safe custom tokens are desired.
- [ ] The application is built before resolving services.
- [ ] Scoped repository work runs inside `XenoApplication.runInScope()`.
- [ ] The repository is resolved using the same token used during registration.

---

## Related Docs

- [Data Overview](../overview)
- [Node PostgreSQL](../node-postgresql)
- [SQLite](../sqllite)
- [Unit of Work](../unit-of-work)
- [Service Registration](../../dependency-injection/registration)
- [Service Resolution](../../dependency-injection/resolution)
- [Dependency Graph](../../dependency-injection/dependency-graph)
- [Read Dao](./read-dao)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
