---
title: Transient
description: Learn how to register transient services in Xeno.JS and create a new service instance on every resolution.
keywords:
- Xeno.JS
- dependency injection
- transient
- transient service
- addTransient
- service lifetime
- IServiceContainer
- IServiceScope
- dependency injection lifetime
- TypeScript
tags:
- dependency-injection
- lifetimes
- transient
- services
- typescript
faqs:
- question: How do I register a transient service in Xeno.JS?
  answer: Use addTransient() with a service token and a factory that creates the service instance.
- question: When is a transient service created?
  answer: A transient service is created each time the service is resolved.
- question: Is a transient service shared between resolutions?
  answer: No. Each resolution creates a new transient service instance.
- question: Can a transient service have dependencies?
  answer: Yes. The factory receives the current service scope, which you can use to resolve the service dependencies.
- question: Can a transient service depend on a singleton?
  answer: Yes. The transient service can resolve registered singleton services as dependencies.
- question: Can a transient service depend on a scoped service?
  answer: Yes, when the transient service is resolved within an active service scope.
- question: Does a transient service need an explicit scope?
  answer: Not by itself. A transient service can be resolved from the root container, but any scoped dependency it resolves requires an active scope.
- question: What happens if a transient service implements dispose()?
  answer: Xeno.JS tracks disposable transient instances in the scope used for resolution and disposes them when that scope is disposed.
- question: When should I use a transient service?
  answer: Use transient lifetime when each resolution should produce an independent service instance without shared instance state.
---

## Introduction

Use a transient service when you want **a new instance every time the service is resolved**.

Transient services are useful for lightweight services that do not need to preserve instance state between resolutions.

In Xeno.JS, register a transient service with `addTransient()`:

```ts
services.addTransient('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

Every call to `resolve('USER_SERVICE')` creates a new `UserService` instance.

## Before you start

You need:

* an Xeno.JS service container;
* a service token registered in your application registry;
* a factory that creates the service instance.

For an application built with `AppBuilder`, register application services with `addServices()`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addTransient('USER_SERVICE', (scope) => {
      return new UserService(
        scope.resolve('USER_REPOSITORY'),
      )
    })
  })

const container = await app.build()
```

`addServices()` configures the application's `IServiceContainer`. The resulting container can then be used to resolve the registered service.

## Register a transient service

Use `addTransient()` with:

1. the service token;
2. a factory function that creates the service.

```ts
services.addTransient('USER_SERVICE', () => {
  return new UserService()
})
```

The factory receives the current `IServiceScope`:

```ts
services.addTransient('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

Use the scope to resolve dependencies instead of constructing them manually inside the service.

## Resolve a transient service

After registration and application build, resolve the service from the container:

```ts
const container = await app.build()

const userService = container.resolve('USER_SERVICE')
```

Each resolution creates a new instance:

```ts
const first = container.resolve('USER_SERVICE')
const second = container.resolve('USER_SERVICE')

console.log(first === second) // false
```

This is the defining behavior of the transient lifetime.

## Create a new instance for every resolution

Choose transient lifetime when the service should not be shared between resolutions.

For example:

```ts
class RequestOperation {
  public readonly id = crypto.randomUUID()
}

services.addTransient('REQUEST_OPERATION', () => {
  return new RequestOperation()
})
```

Resolving the service twice produces two different instances:

```ts
const first = container.resolve('REQUEST_OPERATION')
const second = container.resolve('REQUEST_OPERATION')

console.log(first.id)
console.log(second.id)

console.log(first === second) // false
```

This is different from a singleton, where both resolutions return the same instance.

## Register a transient service with dependencies

Transient services can depend on other registered services.

```ts
class UserRepository {
  findById(id: string) {
    // ...
  }
}

class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  async findUser(id: string) {
    return this.repository.findById(id)
  }
}
```

Register both services:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', () => {
      return new UserRepository()
    })

    services.addTransient('USER_SERVICE', (scope) => {
      return new UserService(
        scope.resolve('USER_REPOSITORY'),
      )
    })
  })

const container = await app.build()
```

The transient `USER_SERVICE` gets its dependencies through the scope supplied to its factory.

## Transient services and dependency lifetimes

A transient service can depend on services with different lifetimes.

For example:

```text
Transient
├── Singleton
└── Scoped
```

The important distinction is that the **transient service itself is recreated on every resolution**. Its dependencies keep the lifetime with which they were registered.

### Transient → Singleton

A transient service can resolve a singleton:

```ts
services.addSingleton('LOGGER', () => {
  return new Logger()
})

services.addTransient('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('LOGGER'),
  )
})
```

Every `USER_SERVICE` resolution creates a new `UserService`, while `LOGGER` remains shared according to its singleton lifetime.

### Transient → Scoped

A transient service can also resolve a scoped service when it is resolved inside an active scope:

```ts
services.addScoped('REQUEST_STATE', () => {
  return new RequestState()
})

services.addTransient('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_STATE'),
  )
})
```

Within the same service scope:

```text
resolve USER_SERVICE
        │
        ├── new UserService
        │
        └── REQUEST_STATE
              │
              └── same scoped instance for this scope
```

The transient service is recreated on every resolution, while the scoped dependency follows the lifetime of the active scope.

If there is no active scope when the scoped dependency is required, the resolution fails.

See [Scoped](./scoped) for request and scope-based service lifetimes.

## Complete example

The following example registers a repository as scoped and a service as transient:

```ts
import { AppBuilder } from 'xeno-js'

class UserRepository {
  async findById(id: string) {
    return {
      id,
      name: 'Ada',
    }
  }
}

class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  async findUser(id: string) {
    return this.repository.findById(id)
  }
}

const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', () => {
      return new UserRepository()
    })

    services.addTransient('USER_SERVICE', (scope) => {
      return new UserService(
        scope.resolve('USER_REPOSITORY'),
      )
    })
  })

const container = await app.build()
```

When the transient service is resolved repeatedly:

```ts
const first = container.resolve('USER_SERVICE')
const second = container.resolve('USER_SERVICE')

console.log(first === second) // false
```

Each resolution creates a new `UserService`.

## Transient services in a request scope

A transient service does not create or own a scope.

When a transient service is resolved from an active scope, its factory receives that scope and can resolve scoped dependencies from it:

```ts
const scope = container.createScope()

try {
  const first = scope.resolve('USER_SERVICE')
  const second = scope.resolve('USER_SERVICE')

  console.log(first === second) // false
} finally {
  await scope.dispose()
}
```

The two `USER_SERVICE` resolutions still produce different instances because the service is transient.

If `USER_SERVICE` depends on a scoped service, both transient instances can resolve the same scoped dependency within this scope.

For example:

```ts
const scope = container.createScope()

try {
  const first = scope.resolve('USER_SERVICE')
  const second = scope.resolve('USER_SERVICE')

  // USER_SERVICE is different for each resolution.
  console.log(first === second) // false
} finally {
  await scope.dispose()
}
```

The lifetime of each dependency is independent of the lifetime of `USER_SERVICE`.

## Transient services and disposal

If a transient service exposes a `dispose()` method, Xeno.JS tracks the instance for disposal.

For example:

```ts
class TemporaryResource {
  async dispose() {
    // Release the resource.
  }
}

services.addTransient('TEMPORARY_RESOURCE', () => {
  return new TemporaryResource()
})
```

When the service is resolved through a scope, the transient instance can be disposed when that scope is disposed:

```ts
const scope = container.createScope()

try {
  const resource = scope.resolve('TEMPORARY_RESOURCE')

  // Use resource...
} finally {
  await scope.dispose()
}
```

This is particularly useful for transient services that allocate resources during their lifetime.

If the service does not need cleanup, no `dispose()` method is required.

## Transient vs singleton

Use a **transient** service when each resolution should produce a new instance:

```ts
services.addTransient('USER_OPERATION', () => {
  return new UserOperation()
})
```

Use a **singleton** when the same instance should be reused:

```ts
services.addSingleton('USER_OPERATION', () => {
  return new UserOperation()
})
```

The difference is observable directly from resolution:

```ts
const first = container.resolve('USER_OPERATION')
const second = container.resolve('USER_OPERATION')

console.log(first === second)
```

With transient lifetime:

```text
resolve → instance A
resolve → instance B
resolve → instance C
```

With singleton lifetime:

```text
resolve ─┐
resolve ─┼→ same instance
resolve ─┘
```

See [Singleton](./singleton) for shared service instances.

## Transient vs scoped

Transient and scoped services are both created more than once, but they follow different rules.

| Lifetime  | Instance reuse                          |
| --------- | --------------------------------------- |
| Transient | New instance for every resolution       |
| Scoped    | One instance per service scope          |
| Singleton | One instance for the container lifetime |

For example, with a single scope:

```ts
const scope = container.createScope()

try {
  const transientA = scope.resolve('TRANSIENT_SERVICE')
  const transientB = scope.resolve('TRANSIENT_SERVICE')

  const scopedA = scope.resolve('SCOPED_SERVICE')
  const scopedB = scope.resolve('SCOPED_SERVICE')

  console.log(transientA === transientB) // false
  console.log(scopedA === scopedB) // true
} finally {
  await scope.dispose()
}
```

Use transient when you need a new instance for every resolution.

Use scoped when you need one instance shared by resolutions inside the same logical scope.

See [Scoped](./scoped) for scoped lifetime behavior.

## Common problems

### The service is not registered

If the token has not been registered, resolution fails with:

```text
[DI Container Error]: Registration not found for token 'USER_SERVICE'. Ensure the service is registered before resolving.
```

Check that the service is registered:

```ts
services.addTransient('USER_SERVICE', () => {
  return new UserService()
})
```

Also make sure the registration is part of the application configuration before calling `build()`.

### The token is already registered

A token can only have one registration in the container.

Registering the same token again throws:

```text
[DI Container Error]: The token 'USER_SERVICE' is already registered in the container.
```

Check for duplicate registrations in:

* `addServices()`;
* custom modules;
* framework modules;
* application bootstrap configuration.

If the service should have different behavior, use a different token rather than registering the same token twice.

### A transient service requires a scoped dependency without an active scope

Consider:

```ts
services.addScoped('REQUEST_STATE', () => {
  return new RequestState()
})

services.addTransient('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_STATE'),
  )
})
```

If `USER_SERVICE` is resolved from the root container:

```ts
container.resolve('USER_SERVICE')
```

the transient service attempts to resolve its scoped dependency without an active scope.

The container reports:

```text
[DI Container Error]: Scoped service 'REQUEST_STATE' requires an active scope.
```

Resolve the service from an active scope instead:

```ts
const scope = container.createScope()

try {
  const userService = scope.resolve('USER_SERVICE')

  // Use userService...
} finally {
  await scope.dispose()
}
```

For request-based applications, prefer the request-managed scope instead of creating scopes manually for every request.

See [Scoped](./scoped).

### The service unexpectedly shares state

If two resolutions return the same instance, verify that the service was registered as transient:

```ts
services.addTransient('USER_SERVICE', () => {
  return new UserService()
})
```

If it was registered with `addSingleton()`, the same instance is intentionally reused.

If it was registered with `addScoped()`, the same instance is intentionally reused within the active scope.

## When to use transient

Use transient lifetime when:

* each resolution should produce an independent instance;
* the service does not need shared instance state;
* the service is lightweight to construct;
* the service represents an operation or short-lived object;
* sharing one instance could introduce unwanted state between consumers.

Typical examples include:

* operation-specific services;
* lightweight application services;
* request-independent helper objects;
* factories or adapters whose instances should not be reused.

## When not to use transient

Avoid transient lifetime when you explicitly need one shared instance.

For application-wide shared state or resources, consider a singleton:

```ts
services.addSingleton('LOGGER', () => {
  return new Logger()
})
```

For state that should be shared only within a logical scope, consider scoped lifetime:

```ts
services.addScoped('REQUEST_STATE', () => {
  return new RequestState()
})
```

Do not choose a lifetime only because the service is small or large. Choose it according to the required instance reuse behavior.

## Checklist

Before registering a service as transient, verify:

* [ ] A service token exists in the application registry.
* [ ] The service is registered with `addTransient()`.
* [ ] The factory creates a new instance.
* [ ] Dependencies are resolved through the factory's `scope`.
* [ ] Any scoped dependency is resolved within an active scope.
* [ ] The service does not require shared instance state.
* [ ] Disposable resources are released when the owning scope is disposed.

## Related docs

* [Service Container](../service-container) — Learn where services are registered and resolved.
* [Registration](../registration) — Learn how to register services and choose a lifetime.
* [Singleton](./singleton) — Share one service instance across the container.
* [Scoped](./scoped) — Share one service instance within a logical scope.
* [Resolution](../resolution) — Learn how to resolve registered services.
* [Dependency Graph](../dependency-graph) — Learn how services depend on one another.
* [Captive Dependencies](../captive-dependencies) — Learn how incompatible service lifetimes can cause dependency problems.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
