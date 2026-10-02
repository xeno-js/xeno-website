---
title: Dependency Graph
description: Learn how to define, inspect, and troubleshoot service dependencies in Xeno.JS using explicit dependency injection registrations.
keywords:
- Xeno.JS
- dependency injection
- dependency graph
- service dependencies
- service container
- service registration
- circular dependency
- dependency lifetime
- TypeScript
tags:
- dependency-injection
- dependency-graph
- services
- service-container
- typescript
faqs:
- question: How do I define a dependency between services in Xeno.JS?
  answer: Resolve the dependency from the service scope passed to the registration factory.
- question: Does Xeno.JS automatically discover service dependencies?
  answer: No. Dependencies are defined explicitly in service registration factories.
- question: Where should I define the dependency graph?
  answer: Define service dependencies at the application composition root, typically through AppBuilder.addServices() or a module configuration.
- question: How do I make one service depend on another?
  answer: Register the dependent service and resolve the required service from the factory scope.
- question: How does Xeno.JS detect circular dependencies?
  answer: The service container detects a circular resolution path and throws a DI Circular Dependency Error containing the resolution path.
- question: Can a singleton depend on a scoped service?
  answer: No. Xeno.JS rejects resolving a scoped service from a singleton resolution context to prevent a captive dependency.
- question: Can a service have multiple dependencies?
  answer: Yes. A registration factory can resolve multiple services from the current scope.
- question: Do service lifetimes affect the dependency graph?
  answer: Yes. Dependencies are resolved according to their registered lifetime, and lifetime combinations must respect the scope in which services are resolved.
---

## Introduction

When your application contains several services, each service can depend on other registered services.

In Xeno.JS, you define these relationships explicitly in your dependency injection registrations.

For example:

```text
UserController
      |
      v
   UserService
      |
      v
 UserRepository
      |
      v
 UserDataSource
```

The dependency graph is expressed directly in the registration code:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
  )
})
```

You do not need decorators, runtime scanning, or a separate graph configuration.

## Before you start

You should already have:

* a Xeno.JS application created with `AppBuilder`
* the services you want to connect
* service registrations for their dependencies
* a clear lifetime for each service

For application-level registration, use `AppBuilder.addServices()`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    // service registrations
  })

await app.build()
```

`addServices()` gives you access to the configured `IServiceContainer`, where you can register singleton, scoped, and transient services.

See [Registration](./registration) for the registration API and [Lifetimes](./lifetimes/singleton) for service lifetime details.

## Define a dependency between services

Register the dependency first conceptually, then resolve it from the dependent service's factory.

For example, suppose `UserService` needs `UserRepository`.

```ts
services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
  )
})

services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

The resulting dependency relationship is:

```text
USER_SERVICE
     |
     v
USER_REPOSITORY
     |
     v
USER_DATA_SOURCE
```

The `scope` passed to every registration factory is the mechanism used to resolve dependencies.

## Register multiple dependencies

A service can depend on more than one service.

For example:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
    scope.resolve('USER_VALIDATOR'),
    scope.resolve('LOGGER'),
  )
})
```

The graph is:

```text
             ┌──> USER_REPOSITORY
             |
USER_SERVICE ├──> USER_VALIDATOR
             |
             └──> LOGGER
```

Each `resolve()` call adds another dependency to the service's composition.

Keep the dependencies explicit in the factory:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  const repository = scope.resolve('USER_REPOSITORY')
  const validator = scope.resolve('USER_VALIDATOR')
  const logger = scope.resolve('LOGGER')

  return new UserService(repository, validator, logger)
})
```

This form can be useful when the registration becomes large or when you want to make the dependency list easier to inspect.

## Build a multi-level dependency graph

Dependencies can continue through several levels.

For example:

```ts
services.addScoped('USER_CONTROLLER', (scope) => {
  return new UserController(
    scope.resolve('USER_SERVICE'),
  )
})

services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
  )
})

services.addScoped('USER_DATA_SOURCE', () => {
  return new UserDataSource()
})
```

The resulting graph is:

```text
USER_CONTROLLER
       |
       v
 USER_SERVICE
       |
       v
USER_REPOSITORY
       |
       v
USER_DATA_SOURCE
```

This makes the composition of the application visible in the registration code.

## Keep dependency direction explicit

When designing a service graph, register dependencies according to the direction in which your application needs them.

For example:

```text
Controller
    |
    v
Application Service
    |
    v
Repository
    |
    v
Data Source
```

The controller depends on the application service.

The application service depends on the repository.

The repository depends on the data source.

The dependency direction is encoded directly in the factories:

```ts
services.addScoped('USER_CONTROLLER', (scope) => {
  return new UserController(
    scope.resolve('USER_SERVICE'),
  )
})

services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
  )
})
```

If a dependency points in an unexpected direction, review the service boundary before adding another registration.

## Use built-in Xeno.JS services as dependencies

Xeno.JS registers framework services in the application registry.

For example, a service can depend on the request context or mediator:

```ts
services.addTransient('USER_CONTROLLER', (scope) => {
  return new UserController(
    scope.resolve('REQUEST_CONTEXT'),
    scope.resolve('MEDIATOR'),
  )
})
```

The built-in tokens are typed through the application registry, so the token determines the type returned by `resolve()`.

Common built-in services include:

* `REQUEST_CONTEXT`
* `MEDIATOR`
* `LOGGER`
* `CACHE`
* `CONFIGURATION_SERVICE`
* `SERVICE_CONTAINER`
* `SERVICE_SCOPE_ACCESSOR`
* `UNIT_OF_WORK`
* `VALIDATOR_SERVICE`

Only use a built-in token when the corresponding service is available in your application's configuration.

## Register dependencies through modules

For larger applications, related registrations can be grouped in a module instead of placing everything in one `addServices()` callback.

A module receives the same service container and can configure its own services.

Conceptually:

```text
Application
    |
    +-- User Module
    |     |
    |     +-- UserController
    |     +-- UserService
    |     +-- UserRepository
    |
    +-- Order Module
          |
          +-- OrderService
          +-- OrderRepository
```

Each module can own the registrations required for its feature.

This keeps the composition root manageable while keeping dependencies explicit.

See [Registration](./registration) for service registration and the module documentation for application module composition.

## Avoid circular dependencies

A circular dependency exists when services eventually depend on themselves.

For example:

```text
SERVICE_A
   |
   v
SERVICE_B
   |
   v
SERVICE_A
```

The registrations might look like this:

```ts
services.addTransient('SERVICE_A', (scope) => {
  return new ServiceA(
    scope.resolve('SERVICE_B'),
  )
})

services.addTransient('SERVICE_B', (scope) => {
  return new ServiceB(
    scope.resolve('SERVICE_A'),
  )
})
```

Xeno.JS detects the circular dependency while resolving the services and throws an error similar to:

```text
[DI Circular Dependency Error]: Detected circular dependency while resolving 'SERVICE_A'. Resolution path: SERVICE_A -> SERVICE_B -> SERVICE_A
```

### Fix a circular dependency

Do not try to work around the error by adding another `resolve()` call.

Instead, identify why the two services require each other.

For example, if:

```text
UserService -> NotificationService -> UserService
```

is required only because both services need a small shared operation, extract that operation into a separate service:

```text
        +------------------+
        | SharedService    |
        +------------------+
           ^            ^
           |            |
     UserService   NotificationService
```

Then register the new dependency explicitly:

```ts
services.addScoped('SHARED_SERVICE', () => {
  return new SharedService()
})

services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('SHARED_SERVICE'),
    scope.resolve('NOTIFICATION_SERVICE'),
  )
})

services.addScoped('NOTIFICATION_SERVICE', (scope) => {
  return new NotificationService(
    scope.resolve('SHARED_SERVICE'),
  )
})
```

If the two services genuinely need each other, review the application boundary rather than attempting to hide the cycle inside the container.

See [Captive Dependencies](./captive-dependencies) for lifetime-related dependency problems.

## Respect lifetime boundaries

The dependency graph also includes the lifetime of each service.

For example:

```text
Singleton
    |
    v
Scoped
```

is not a valid dependency relationship in Xeno.JS.

A singleton is created at the container level, while a scoped service belongs to an active scope. Allowing the singleton to retain the scoped service would make the scoped instance outlive its intended scope.

Xeno.JS detects this situation and throws a captive dependency error.

For example:

```text
[DI Captive Dependency Error]: Attempted to resolve a scoped service 'REQUEST_SERVICE' from a singleton context. This can lead to captive dependencies. Resolution path: ...
```

If a singleton needs data that is specific to a scope, change the design so that the scoped value is resolved within the appropriate scope rather than stored by the singleton.

See [Singleton](./lifetimes/singleton), [Scoped](./lifetimes/scoped), and [Captive Dependencies](./captive-dependencies).

## Use the service scope for scoped dependencies

If a service depends on a scoped service, its factory must resolve the dependency from the active service scope.

For example:

```ts
services.addScoped('REQUEST_DATA', () => {
  return new RequestData()
})

services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_DATA'),
  )
})
```

Both services are resolved within the same logical scope:

```text
Request scope
     |
     +--> USER_SERVICE
              |
              +--> REQUEST_DATA
```

This allows `REQUEST_DATA` to remain scoped to the current application execution.

See [Scoped](./lifetimes/scoped) and [Resolution](./resolution).

## Inspect the graph from your registrations

Xeno.JS does not require a separate dependency graph declaration.

When investigating a service, start from its registration:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
    scope.resolve('LOGGER'),
  )
})
```

The immediate dependencies are:

```text
USER_SERVICE
   ├──> USER_REPOSITORY
   └──> LOGGER
```

Then inspect the registrations for those dependencies:

```ts
services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
  )
})
```

Now the graph becomes:

```text
USER_SERVICE
   ├──> USER_REPOSITORY
   │       |
   │       └──> USER_DATA_SOURCE
   |
   └──> LOGGER
```

This is the practical way to trace a dependency chain in Xeno.JS: follow each `resolve()` from the service registration to the next registration.

## Common problems

### Registration not found

If a dependency is referenced but has not been registered:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

and `USER_REPOSITORY` has no registration, Xeno.JS throws:

```text
[DI Container Error]: Registration not found for token 'USER_REPOSITORY'. Ensure the service is registered before resolving.
```

Check that:

1. the dependency has been registered;
2. the token is spelled correctly;
3. the registration is included in the application build;
4. the module containing the registration is configured.

### Duplicate registration

A token cannot be registered more than once in the same container.

For example:

```ts
services.addScoped('USER_SERVICE', () => {
  return new UserService()
})

services.addScoped('USER_SERVICE', () => {
  return new UserService()
})
```

causes:

```text
[DI Container Error]: The token 'USER_SERVICE' is already registered in the container.
```

Keep a single registration for each token in a container.

If multiple implementations are required, use different tokens and choose explicitly which service each consumer depends on.

### Scoped service requires an active scope

If a dependency is scoped but the service is resolved from the root container, Xeno.JS throws:

```text
[DI Container Error]: Scoped service 'USER_SERVICE' requires an active scope.
```

Resolve scoped services through an `IServiceScope` instead.

```ts
const scope = container.createScope()

try {
  const service = scope.resolve('USER_SERVICE')
  await service.execute()
} finally {
  await scope.dispose()
}
```

In request-driven code, use the request's active service scope rather than creating an unrelated scope for every dependency.

See [Resolution](./resolution).

### Circular dependency

If the container reports:

```text
[DI Circular Dependency Error]
```

follow the resolution path included in the error.

For example:

```text
SERVICE_A -> SERVICE_B -> SERVICE_C -> SERVICE_A
```

Inspect those registrations and remove the cycle by changing the service boundary or extracting a shared dependency.

### Singleton depends on scoped service

If the error contains:

```text
[DI Captive Dependency Error]
```

check the lifetimes along the reported resolution path.

A singleton should not directly resolve a scoped service during its construction.

See [Captive Dependencies](./captive-dependencies).

## Complete example

The following example defines a small application graph with a controller, application service, repository, and data source:

```ts
import { AppBuilder } from '@xeno-js/core'

class UserDataSource {
  async findById(id: string) {
    return {
      id,
      name: 'Ada',
    }
  }
}

class UserRepository {
  constructor(
    private readonly dataSource: UserDataSource,
  ) {}

  findById(id: string) {
    return this.dataSource.findById(id)
  }
}

class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  findById(id: string) {
    return this.repository.findById(id)
  }
}

class UserController {
  constructor(
    private readonly service: UserService,
  ) {}

  handle(id: string) {
    return this.service.findById(id)
  }
}

const app = new AppBuilder().addServices((services) => {
  services.addScoped('USER_DATA_SOURCE', () => {
    return new UserDataSource()
  })

  services.addScoped('USER_REPOSITORY', (scope) => {
    return new UserRepository(
      scope.resolve('USER_DATA_SOURCE'),
    )
  })

  services.addScoped('USER_SERVICE', (scope) => {
    return new UserService(
      scope.resolve('USER_REPOSITORY'),
    )
  })

  services.addTransient('USER_CONTROLLER', (scope) => {
    return new UserController(
      scope.resolve('USER_SERVICE'),
    )
  })
})

const container = await app.build()
```

The dependency graph is:

```text
USER_CONTROLLER
       |
       v
 USER_SERVICE
       |
       v
USER_REPOSITORY
       |
       v
USER_DATA_SOURCE
```

The important part is that every edge in the graph is visible in the registration code.

## Dependency graph checklist

When adding a new service, verify:

* [ ] The service has a registration.
* [ ] Every dependency has a registration.
* [ ] Each dependency is resolved explicitly from the factory scope.
* [ ] The service lifetime matches how it is used.
* [ ] Scoped dependencies are resolved inside an active scope.
* [ ] There is no circular dependency.
* [ ] A singleton does not depend directly on a scoped service.
* [ ] The dependency direction matches the application's boundaries.
* [ ] The registrations are included in the application build.

## Related docs

* [Service Container](./service-container) — understand the container used to register and resolve services.
* [Registration](./registration) — register singleton, scoped, and transient services.
* [Singleton](./lifetimes/singleton) — configure services shared by the container.
* [Scoped](./lifetimes/scoped) — configure services tied to a logical scope.
* [Transient](./lifetimes/transient) — create a new instance for each resolution.
* [Resolution](./resolution) — resolve services from the container or an active scope.
* [Captive Dependencies](./captive-dependencies) — fix invalid lifetime relationships.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
