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
  answer: Call container.createScope() and resolve scoped services through the returned IServiceScope.
- question: How are scoped services used for requests?
  answer: Xeno.JS creates a service scope for request execution and makes the active scope available through the request context.
- question: What happens when a service scope is disposed?
  answer: The scope is closed and its tracked scoped resources are disposed.
---

## Introduction

Use a **scoped** service when you need one service instance for each logical execution scope, while keeping different scopes isolated from each other.

A common use case is request-level state:

* one repository instance per request
* one transaction state per request
* one unit of work per request
* request-specific services
* other dependencies that must not be shared across concurrent executions

Xeno.JS exposes scoped services through `addScoped()` and resolves them through `IServiceScope`.

## Before you start

You need:

* an `AppBuilder`
* a service token included in the application's registry
* a service implementation
* a service factory

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
const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', () => {
      return new UserRepository()
    })
  })

const container = await app.build()
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
const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', (scope) => {
      return new UserRepository(
        scope.resolve('USER_DATA_SOURCE'),
      )
    })
  })

const container = await app.build()
```

This keeps the service graph explicit.

The dependency is resolved from the same scope that is creating `USER_REPOSITORY`.

## Resolve a scoped service

Do not resolve a scoped service directly from the root container:

```ts
const repository = container.resolve('USER_REPOSITORY')
```

This is invalid for a scoped registration.

Instead, create a service scope:

```ts
const scope = container.createScope()

const repository = scope.resolve('USER_REPOSITORY')
```

The scope is responsible for the lifetime of the scoped instances created through it.

## Reuse the same instance within a scope

A scoped service is created once per scope.

```ts
const scope = container.createScope()

const first = scope.resolve('USER_REPOSITORY')
const second = scope.resolve('USER_REPOSITORY')

console.log(first === second) // true
```

The two resolutions return the same instance because they use the same scope.

## Get a different instance in another scope

Different scopes have independent scoped-service instances:

```ts
const scopeA = container.createScope()
const scopeB = container.createScope()

const repositoryA = scopeA.resolve('USER_REPOSITORY')
const repositoryB = scopeB.resolve('USER_REPOSITORY')

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

const app = new AppBuilder()
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

const container = await app.build()

const scope = container.createScope()

const repository = scope.resolve('USER_REPOSITORY')

const user = await repository.findById('user-123')
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
const app = new AppBuilder()
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

Conceptually:

```ts
const scope = requestContext.getScope()

if (!scope) {
  throw new Error('No active service scope')
}

const repository = scope.resolve('USER_REPOSITORY')
```

This is particularly useful when a service must participate in the same scope as the rest of the current request.

## Resolve a scoped service from the active application scope

At integration or transport boundaries, Xeno.JS also exposes `ContainerUtils.resolveServiceScoped()`.

```ts
const repository = ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  container,
)
```

This utility looks for the active service scope and resolves the service through it.

If there is no active scope, it throws:

```text
Active service scope is required to execute Scoped service.
```

Use this approach when code already has access to the application container but should resolve a service from the current active scope.

## Dispose the scope

A service scope implements `dispose()`.

Dispose a manually created scope when its work is complete:

```ts
const scope = container.createScope()

try {
  const repository = scope.resolve('USER_REPOSITORY')

  await repository.findById('user-123')
} finally {
  await scope.dispose()
}
```

This is especially important when scoped services own resources that need cleanup.

Xeno.JS tracks disposable scoped instances and disposes them when the scope is disposed.

## Prefer request-managed scopes for requests

If your application already uses Xeno.JS request context, do not create an additional scope for every service resolution.

Instead, resolve services from the active request scope.

For example:

```ts
const scope = requestContext.getScope()

if (!scope) {
  throw new Error('No active service scope')
}

const unitOfWork = scope.resolve('UNIT_OF_WORK')
const repository = scope.resolve('USER_REPOSITORY')
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

The repository remains scoped, while the mapper follows transient lifetime semantics.

Each resolution of the transient dependency creates a new instance.

## Scoped services and singleton dependencies

A scoped service can use a singleton dependency when that dependency is appropriate for sharing across scopes:

```ts
services.addSingleton('LOGGER', () => {
  return new Logger()
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('LOGGER'),
  )
})
```

The repository is different for each scope, while the logger is shared by the container.

The reverse relationship requires more care: a singleton must not depend on a scoped service.

See [Captive Dependencies](../captive-dependencies).

## Common error: resolving a scoped service from the root

If you do this:

```ts
const repository = container.resolve('USER_REPOSITORY')
```

Xeno.JS throws:

```text
[DI Container Error]: Scoped service 'USER_REPOSITORY' requires an active scope.
```

### Fix

Create a scope and resolve through it:

```ts
const scope = container.createScope()

const repository = scope.resolve('USER_REPOSITORY')
```

For request-bound code, use the active request scope instead.

## Common error: no active request scope

If you use:

```ts
ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  container,
)
```

outside an active service scope, Xeno.JS throws:

```text
Active service scope is required to execute Scoped service.
```

### How to Fix

Make sure the code executes inside the application's request/execution scope.

If you are manually managing the operation rather than executing it through a request scope, create and dispose a scope explicitly:

```ts
const scope = container.createScope()

try {
  const repository = scope.resolve('USER_REPOSITORY')

  // Use the repository here.
} finally {
  await scope.dispose()
}
```

## Common error: using the wrong scope

Avoid creating an unrelated scope inside code that is already executing within a request scope:

```ts
// Avoid creating a second scope when the request already
// provides the scope you need.
const newScope = container.createScope()
```

A second scope creates a separate set of scoped instances.

If the operation is supposed to participate in the current request, resolve the service from the existing scope instead.

## When to use scoped lifetime

Use `scoped` when:

* state must be isolated per request or execution
* multiple services in one request should share the same instance
* a resource should live for the duration of a scope
* a repository or unit of work should not be shared globally
* concurrent requests must not share mutable service state

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

* use **singleton** when one shared instance should live with the container
* use **scoped** when one instance should exist per logical scope
* use **transient** when every resolution should create a new instance

See [Singleton](./singleton) and [Transient](./transient) for the other lifetime options.

## Scoped lifetime checklist

Before registering a service as scoped, verify:

* [ ] The service needs one instance per logical scope.
* [ ] Different scopes must receive different instances.
* [ ] The service token exists in the application registry.
* [ ] The service is registered with `addScoped()`.
* [ ] Dependencies are resolved through the provided scope.
* [ ] The service is resolved through `IServiceScope`.
* [ ] Request-bound code uses the active request scope when appropriate.
* [ ] Manually created scopes are disposed after use.
* [ ] The service does not require singleton lifetime.

## Related docs

* [Service Container](../service-container)
* [Registration](../registration)
* [Singleton](./singleton)
* [Transient](./transient)
* [Resolution](../resolution)
* [Dependency Graph](../dependency-graph)
* [Captive Dependencies](../captive-dependencies)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
