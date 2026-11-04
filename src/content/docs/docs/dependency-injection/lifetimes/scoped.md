---
title: Scoped
description: Learn how to register services with scoped lifetime in Xeno.JS and get one instance per service scope.
keywords:
- Xeno.JS
- dependency injection
- scoped
- scoped service
- addScoped
- service scope
- IServiceScope
- createScope
- request scope
- service lifetime
- TypeScript
tags:
- dependency-injection
- lifetimes
- scoped
- services
- typescript
faqs:
- question: How do I register a scoped service in Xeno.JS?
  answer: Use addScoped() with a service token and a factory that creates the service instance.
- question: When is a scoped service created?
  answer: A scoped service is created when it is first resolved within a service scope.
- question: Is a scoped service shared between resolutions?
  answer: Yes. Repeated resolutions of the same scoped service within the same scope return the same instance.
- question: Is a scoped service shared between different scopes?
  answer: No. Each service scope has its own scoped service instances.
- question: Can I resolve a scoped service directly from the root container?
  answer: No. Scoped services must be resolved through an active IServiceScope.
- question: How do I create a service scope?
  answer: For application work, call runInScope() to execute an operation in a new scope, or use getScopedServices() when a scope is already active.
- question: How are scoped services used for requests?
  answer: Xeno.JS creates a service scope for request execution and makes the active scope available through the request context.
- question: What happens when a service scope is disposed?
  answer: The scope is closed and its tracked disposable scoped and transient instances are disposed.
---

## Introduction

Use a **scoped** service when you need one service instance for each logical execution scope, while keeping different scopes isolated from each other.

A common use case is request-level state:

- one repository instance per request
- one transaction state per request
- one unit of work per request
- request-specific services
- other dependencies that must not be shared across concurrent executions

Xeno.JS exposes scoped services through `addScoped()` and resolves them through `IServiceScope`.
After `build()`, use `getScopedServices()` inside an existing scope or
`runInScope()` to execute work in a new one.

## Before you start

You need:

- an `XenoAppBuilder`
- a service token included in the application's registry
- a service implementation
- a service factory

Custom tokens must be represented in your application's registry so TypeScript can associate the token with its service type.

For example:

```ts
type UserRepository = {
  findById(id: string): Promise<unknown>
}
```

## Register a scoped service

Register the service with `addScoped()` inside `AppBuilder.addServices()`:

```ts
const app = new XenoAppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', () => {
      return new UserRepository()
    })
  })

const application = await app.build()
```

The important part is:

```ts
services.addScoped('USER_REPOSITORY', () => {
  return new UserRepository()
})
```

The factory receives the current service scope, so dependencies can be resolved from that scope.

## Register a scoped service with dependencies

Use the factory argument to resolve other services:

```ts
const app = new XenoAppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', (scope) => {
      return new UserRepository(
        scope.resolve('USER_DATA_SOURCE'),
      )
    })
  })

const application = await app.build()
```

This keeps the service graph explicit.

The dependency is resolved from the same scope that is creating `USER_REPOSITORY`.

## Resolve a scoped service

`XenoAppBuilder.build()` returns the runtime application, not the service
container. Do not try to resolve a scoped service through its root services:

```ts
const application = await app.build()
const repository = application.getServices().USER_REPOSITORY
```

This is invalid for a scoped registration because it has no active scope.

For an operation outside an existing request or execution, use `runInScope()`:

```ts
const repository = await application.runInScope(async (services) => {
  return services.USER_REPOSITORY
})
```

The callback receives services resolved through the new scope. The operation
owns that scope's lifetime.

## Reuse the same instance within a scope

A scoped service is created once per scope.

```ts
const sameInstance = await application.runInScope(async (services) => {
  const first = services.USER_REPOSITORY
  const second = services.USER_REPOSITORY
  return first === second
})

console.log(sameInstance) // true
```

The two resolutions return the same instance because they use the same scope.

## Get a different instance in another scope

Different scopes have independent scoped-service instances:

```ts
const repositoryA = await application.runInScope(
  async (services) => services.USER_REPOSITORY,
)
const repositoryB = await application.runInScope(
  async (services) => services.USER_REPOSITORY,
)

console.log(repositoryA === repositoryB) // false
```

This is the main difference between `scoped` and `singleton`:

| Lifetime  | Instance reuse                   |
| --------- | -------------------------------- |
| Singleton | One instance per container       |
| Scoped    | One instance per scope           |
| Transient | New instance for each resolution |

## Create a complete scoped service graph

A typical application can combine scoped services and their dependencies:

```ts
class UserDataSource {
  async findById(id: string) {
    return { id }
  }
}

class UserRepository {
  constructor(
    private readonly dataSource: UserDataSource,
  ) {}

  async findById(id: string) {
    return this.dataSource.findById(id)
  }
}

const app = new XenoAppBuilder()
  .addServices((services) => {
    services.addScoped('USER_DATA_SOURCE', () => {
      return new UserDataSource()
    })

    services.addScoped('USER_REPOSITORY', (scope) => {
      return new UserRepository(
        scope.resolve('USER_DATA_SOURCE'),
      )
    })
  })

const application = await app.build()

const user = await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  return repository.findById('user-123')
})
```

Both `USER_DATA_SOURCE` and `USER_REPOSITORY` belong to the same scope.

If another scope resolves `USER_REPOSITORY`, Xeno.JS creates another scoped graph for that scope.

## Use scoped services for request-level state

A scoped lifetime is useful when a service should be isolated to a logical request or execution.

For example:

```ts
class RequestState {
  private readonly values = new Map<string, unknown>()

  set(key: string, value: unknown) {
    this.values.set(key, value)
  }

  get<T>(key: string): T | undefined {
    return this.values.get(key) as T | undefined
  }
}
```

Register it as scoped:

```ts
const app = new XenoAppBuilder()
  .addServices((services) => {
    services.addScoped('REQUEST_STATE', () => {
      return new RequestState()
    })
  })
```

Each scope gets its own `RequestState`.

This prevents request-specific state from being shared between unrelated executions.

## Scoped services and request execution

Xeno.JS provides a request context that exposes the current service scope.

During request execution, the request context creates a service scope and makes it available through the current execution context.

Application code that needs the active scope can use the request-context abstraction rather than creating an unrelated scope.

Inside application code, use the application's scoped service API rather than
reaching into the root container:

```ts
const { USER_REPOSITORY: repository } = application.getScopedServices()
```

This is particularly useful when a service must participate in the same scope as the rest of the current request.

If there is no active scope, `getScopedServices()` throws. For work that needs
its own scope, call `runInScope()` instead.

## Scope disposal

`runInScope()` owns the scope lifecycle and disposes the scope when the
operation completes, including when the callback fails:

```ts
await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  await repository.findById('user-123')
})
```

When the scope is disposed, the container disposes its tracked disposable
instances in reverse creation order. It also tracks disposable transient
instances created through that scope. A disposed scope cannot resolve more
services.

## Prefer request-managed scopes for requests

If your application already uses Xeno.JS request context, do not create an additional scope for every service resolution.

Instead, resolve services from the active request scope.

For example:

```ts
const { unitOfWork, USER_REPOSITORY: repository } =
  application.getScopedServices()
```

This allows all scoped dependencies participating in the request to share the same scope.

## Scoped services and transient dependencies

A scoped service can resolve transient dependencies:

```ts
services.addTransient('USER_MAPPER', () => {
  return new UserMapper()
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_MAPPER'),
  )
})
```

The repository remains scoped, while each resolution of the mapper follows
transient lifetime semantics. The repository factory resolves the mapper when
the repository is first created in that scope; later resolutions of the
repository return the cached repository instance.

Each separate resolution of the transient dependency creates a new instance.

## Scoped services and singleton dependencies

A scoped service can use a singleton dependency when that dependency is appropriate for sharing across scopes:

```ts
services.addSingleton('MY_LOGGER', () => {
  return new Logger()
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('MY_LOGGER'),
  )
})
```

The repository is different for each scope, while the logger is shared by the container.

The reverse relationship requires more care: a singleton must not depend on a scoped service.

See [Captive Dependencies](../captive-dependencies).

## Common error: resolving a scoped service from the root

If a scoped registration is resolved from the root container, for example
through `getServices()`:

```ts
const repository = application.getServices().USER_REPOSITORY
```

Xeno.JS throws:

```text
[DI Container Error]: Scoped service 'USER_REPOSITORY' requires an active scope.
```

### Fix

Run the operation in a scope:

```ts
const repository = await application.runInScope(
  async (services) => services.USER_REPOSITORY,
)
```

For request-bound code, use the active request scope instead.

## Common error: no active scope

Calling `getScopedServices()` when no request or execution scope is active:

```ts
application.getScopedServices()
```

throws an error because there is no active scope. For work outside a request or
other execution, create the scope through `runInScope()`:

```ts
await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  // Use the repository within this scope.
})
```

## Common error: using the wrong scope

Avoid starting a separate `runInScope()` operation inside code that is already
executing within a request scope:

```ts
await application.runInScope(async (services) => {
  // This operation has a separate scope from the current request.
})
```

A separate scope has its own scoped instances.

If the operation should participate in the current request, resolve services
from the active scope with `getScopedServices()` instead.

## When to use scoped lifetime

Use `scoped` when:

- state must be isolated per request or execution
- multiple services in one request should share the same instance
- a resource should live for the duration of a scope
- a repository or unit of work should not be shared globally
- concurrent requests must not share mutable service state

Typical examples include:

```text
Request
  └── Service Scope
      ├── UnitOfWork
      ├── TransactionState
      ├── UserRepository
      └── RequestState
```

The exact services in a scope depend on your application.

## When not to use scoped lifetime

Do not use `scoped` merely because a service is used by several classes.

Choose the lifetime based on how the service's instance should be shared:

- use **singleton** when one shared instance should live with the container
- use **scoped** when one instance should exist per logical scope
- use **transient** when every resolution should create a new instance

See [Singleton](./singleton) and [Transient](./transient) for the other lifetime options.

## Scoped lifetime checklist

Before registering a service as scoped, verify:

- [ ] The service needs one instance per logical scope.
- [ ] Different scopes must receive different instances.
- [ ] The service token exists in the application registry.
- [ ] The service is registered with `addScoped()`.
- [ ] Dependencies are resolved through the provided scope.
- [ ] The service is resolved through an active scope, such as with `getScopedServices()` or `runInScope()`.
- [ ] Request-bound code uses the active request scope when appropriate.
- [ ] Scoped work runs through the request scope or `runInScope()` so its scope is disposed after use.
- [ ] The service does not require singleton lifetime.

## Related docs

- [Service Container](../service-container)
- [Registration](../registration)
- [Singleton](./singleton)
- [Transient](./transient)
- [Resolution](../resolution)
- [Dependency Graph](../dependency-graph)
- [Captive Dependencies](../captive-dependencies)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
