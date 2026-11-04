---
title: Service Container
description: Learn how to use the Xeno.JS service container to register, resolve, and manage application dependencies with explicit dependency injection.
keywords:
- Xeno.JS
- dependency injection
- service container
- ServiceContainer
- XenoAppBuilder
- service registration
- service resolution
- dependency injection container
tags:
- fundamentals
- dependency-injection
- service-container
faqs:
- question: What is the Xeno.JS service container?
  answer: The service container is the dependency injection container used to register and resolve application services.
- question: How do I register a service with Xeno.JS?
  answer: Use XenoAppBuilder.addServices() and register the service with addSingleton(), addScoped(), or addTransient().
- question: How do I resolve a registered service?
  answer: After build(), use the returned application's getServices() for root services, getScopedServices() inside an active scope, or runInScope() for work that needs its own scope.
- question: Can I resolve a scoped service directly from the root container?
  answer: No. Scoped services require an active service scope.
- question: Can I register the same token more than once?
  answer: No. Registering a token that is already registered throws a DI Container Error.
---

## Introduction

Xeno.JS uses a **service container** to register and resolve the dependencies used by your application.

The container gives you explicit dependency injection without requiring decorators, runtime scanning, or implicit dependency discovery.

Use it when you need to:

- register application services;
- connect an interface or token to an implementation;
- define how long a service instance should live;
- resolve dependencies from other services;
- share dependencies across application components;
- keep dependency configuration in your application composition root.

For most applications, you interact with the container through `XenoAppBuilder` rather than creating a `ServiceContainer` directly.

## Before you start

You need `@xeno-js/core` installed:

```bash
npm install @xeno-js/core
```

The usual application entry point is an `XenoAppBuilder`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()
```

`XenoAppBuilder` owns the application's service container and exposes the
registration APIs used during composition. `build()` returns the configured
runtime application, not the container.

---

## Register Services

Register application services with `XenoAppBuilder.addServices()`.

The callback receives the service registration API:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addServices((services) => {
  services.addScoped('USER_REPOSITORY', (scope) => {
    return new UserRepository(
      scope.resolve('USER_DATA_SOURCE'),
    )
  })
})
```

The registration consists of:

1. a **token** that identifies the service;
2. a **factory** that creates the service;
3. a **lifetime** that determines how the created instance is reused.

The factory receives the current service scope, so dependencies can be resolved explicitly:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

This makes the dependency relationship visible directly in the registration.

### Register multiple services

You can register multiple services in the same `addServices()` callback:

```ts
const app = new XenoAppBuilder()

app.addServices((services) => {
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
```

`addServices()` is chainable:

```ts
const app = new XenoAppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', (scope) => {
      return new UserRepository(
        scope.resolve('USER_DATA_SOURCE'),
      )
    })
  })
```

---

## Choose a Service Lifetime

Every registration must use one of the available lifetimes:

| Method           | Instance behavior                | Typical use                            |
| ---------------- | -------------------------------- | -------------------------------------- |
| `addSingleton()` | One instance for the container   | Shared application services            |
| `addScoped()`    | One instance per scope           | Request or operation-specific services |
| `addTransient()` | New instance for each resolution | Lightweight, stateless services        |

For details, see:

- [Singleton](./lifetimes/singleton)
- [Scoped](./lifetimes/scoped)
- [Transient](./lifetimes/transient)

---

## Resolve a Service

`XenoAppBuilder.resolve()` can resolve a registered root-level service:

```ts
const app = new XenoAppBuilder()
  .addServices((services) => {
    services.addSingleton('CONFIG_SERVICE', () => {
      return new ConfigService()
    })
  })

const config = app.resolve('CONFIG_SERVICE') //`XenoAppBuilder.resolve()` before build()

await app.build()

const config = app.getServices().CONFIG_SERVICE // `getServices()` after build()
```

`XenoAppBuilder.resolve()` delegates resolution to the root service container.

Use this builder method for root-level resolution during composition, such as
singleton and transient services without scoped dependencies. In runtime code,
use `getServices()` on the application returned by `build()`.

Scoped services are different: they require an active scope.

---

## Resolve Dependencies Inside a Factory

The registration factory receives a service scope.

Use that scope to resolve the dependencies required to construct your service:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  const repository = scope.resolve('USER_REPOSITORY')
  const logger = scope.resolve('LOGGER')

  return new UserService(
    repository,
    logger,
  )
})
```

The scope supplied to a factory depends on the registration and resolution:
singleton factories receive the root scope, while scoped and transient
factories receive the scope used to resolve them.

This is the standard Xeno.JS pattern for explicit dependency injection.

You do not need to manually construct the dependency graph at every call site:

```ts
// Avoid constructing the dependency graph manually.
const repository = new UserRepository(...)
const logger = new Logger(...)
const service = new UserService(repository, logger)
```

Instead, register the graph once:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
    scope.resolve('LOGGER'),
  )
})
```

Then resolve the service where it is needed.

---

## Use a Service Scope

A service scope is required when working with scoped services.

`build()` returns the runtime application, not the service container. For
application work that needs scoped services, use `runInScope()`:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
})
```

`runInScope()` creates the request context and service scope for the operation,
then disposes the scope when the operation completes.

Within the same scope:

```ts
await application.runInScope(async (services) => {
  const first = services.USER_REPOSITORY
  const second = services.USER_REPOSITORY

  console.log(first === second) // true
})
```

A different scope receives a different scoped instance:

```ts
const repository1 = await application.runInScope(
  async (services) => services.USER_REPOSITORY,
)
const repository2 = await application.runInScope(
  async (services) => services.USER_REPOSITORY,
)

console.log(repository1 === repository2) // false
```

For request-scoped application code, Xeno.JS can manage the active scope through its context system. See [Context & Scopes](../context-scopes).

---

## Resolve a Scoped Service from the Application

When an execution already has an active scope, use `getScopedServices()`:

```ts
const { USER_REPOSITORY: repository } =
  application.getScopedServices()
```

If there is no active scope, `getScopedServices()` throws. For work outside an
existing request or execution, use `runInScope()` as shown above. See
[Context & Scopes](../context-scopes) for more information about active scopes.

---

## Build the Application

Service registrations added through `XenoAppBuilder.addServices()` are applied when the application is built.

A typical bootstrap looks like this:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addServices((services) => {
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
})

const application = await app.build()
```

After `build()` completes, use the returned runtime application to access
registered services. It is not the service container.

---

## Complete Example

The following example shows a small dependency graph:

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

Register the services explicitly:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addServices((services) => {
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

const application = await app.build()
```

The dependency graph is defined entirely through registrations.

When `USER_CONTROLLER` is resolved in a scope, its factory resolves
`USER_SERVICE`, which resolves `USER_REPOSITORY`, which resolves
`USER_DATA_SOURCE`:

```ts
await application.runInScope(async (services) => {
  const controller = services.USER_CONTROLLER
})
```

---

## Use Custom Registries

Xeno.JS uses a typed registry to associate service tokens with their TypeScript types.

This means registrations and resolutions are type-checked.

For example, if your registry contains:

```ts
type ApplicationRegistry = {
  USER_REPOSITORY: UserRepository
  USER_SERVICE: UserService
}
```

then:

```ts
services.addScoped('USER_REPOSITORY', () => {
  return new UserRepository()
})
```

and:

```ts
const service = app.resolve('USER_SERVICE')
```

are checked against the registered token types.

This allows the dependency injection API to remain explicit while preserving TypeScript type safety.

For applications extending the Xeno.JS registry, see [Registration](./registration).

---

## Registering the Same Token Twice

A token can only have one registration in a container.

This is invalid:

```ts
services.addScoped('USER_SERVICE', () => {
  return new UserService()
})

services.addSingleton('USER_SERVICE', () => {
  return new UserService()
})
```

The second registration throws a container error similar to:

```text
[DI Container Error]: The token 'USER_SERVICE' is already registered in the container.
```

If you need different implementations, use different tokens.

---

## Missing Registrations

Resolving a token that has not been registered fails.

For example:

```ts
const app = new XenoAppBuilder()

app.addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

const application = await app.build()

app.resolve('USER_REPOSITORY')
```

The container reports:

```text
[DI Container Error]: Registration not found for token 'USER_REPOSITORY'. Ensure the service is registered before resolving.
```

When this happens, check:

1. the token used by `resolve()`;
2. the token used during registration;
3. that the registration is inside `addServices()`;
4. that the token is registered before attempting resolution.

Token names must match exactly.

---

## Scoped Service Resolution Errors

This is invalid:

```ts
services.addScoped('USER_REPOSITORY', () => {
  return new UserRepository()
})

const repository = app.resolve('USER_REPOSITORY')
```

A scoped service requires an active scope.

The container reports:

```text
[DI Container Error]: Scoped service 'USER_REPOSITORY' requires an active scope.
```

Use an application scope instead:

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
})
```

Or, when an application scope already exists:

```ts
const { USER_REPOSITORY: repository } =
  application.getScopedServices()
```

---

## Circular Dependencies

The container detects circular dependencies during resolution.

For example:

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

Resolving `SERVICE_A` produces a circular dependency error:

```text
[DI Circular Dependency Error]: Detected circular dependency while resolving 'SERVICE_A'.
```

If this happens, inspect the dependency graph and remove the cycle.

See [Dependency Graph](./dependency-graph) for strategies for structuring service dependencies.

---

## Captive Dependencies

A singleton must not depend on a scoped service.

For example:

```ts
services.addScoped('REQUEST_SERVICE', () => {
  return new RequestService()
})

services.addSingleton('APPLICATION_SERVICE', (scope) => {
  return new ApplicationService(
    scope.resolve('REQUEST_SERVICE'),
  )
})
```

Resolving the singleton causes a captive dependency error.

```text
[DI Captive Dependency Error]: Attempted to resolve a scoped service 'REQUEST_SERVICE' from a singleton context.
```

If you encounter this error, review the lifetimes of the services involved.

See [Captive Dependencies](./captive-dependencies).

---

## Dispose Scoped Services

`runInScope()` disposes the scope when the scoped operation completes. Disposable
scoped and transient instances are tracked by the scope used to resolve them.
Singleton instances are tracked by the root scope.

`ServiceContainer.dispose()` disposes the root scope, then clears its singleton
instances and registrations. This API belongs to a directly owned
`ServiceContainer`; `XenoAppBuilder.build()` returns a runtime application, not
that container. The application API shown here does not expose
`ServiceContainer.dispose()`.

The container disposes tracked instances in reverse creation order. If disposal
of one instance fails, it logs the error and continues disposing the others.

---

## When to Use the Service Container Directly

Most application code should use `XenoAppBuilder.addServices()` for registration.

Use the underlying container directly when you are building infrastructure, modules, or integration code that receives an `IServiceContainer`.

For example:

```ts
async function configureModule(
  container: IServiceContainer,
) {
  container.addScoped('USER_REPOSITORY', (scope) => {
    return new UserRepository(
      scope.resolve('USER_DATA_SOURCE'),
    )
  })
}
```

Application code generally does not need to instantiate or manage
`ServiceContainer` manually.

The normal application flow is:

```text
AppBuilder
    |
    v
addServices()
    |
    v
Service registration
    |
    v
build()
    |
    v
Service resolution
```

---

## Troubleshooting

### `Registration not found for token`

Check that the service has been registered using exactly the same token:

```ts
services.addScoped('USER_SERVICE', ...)
```

must be resolved with:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
})
```

not a different token.

### `Scoped service requires an active scope`

The service was registered with `addScoped()` but was resolved from the root container.

Use:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
})
```

or use `application.getScopedServices()` when an active scope already exists.

### `already registered`

The same token has been registered more than once.

Remove the duplicate registration or give the implementations different tokens.

### `DI Circular Dependency Error`

Two or more services depend on each other through their registration factories.

Inspect the resolution path in the error and remove the dependency cycle.

### `DI Captive Dependency Error`

A singleton is trying to resolve a scoped service.

Review the resolution path and keep scoped work outside the singleton's
construction path. A transient dependency does not make a scoped dependency
safe when the transient is being resolved as part of singleton construction.

### Scoped service used outside its operation

Do not retain a scoped service beyond the `runInScope()` callback that created
it. The scope closes when that operation completes.

---

## Service Container Checklist

Before considering your dependency injection setup complete:

- [ ] Every service has a unique registration token.
- [ ] Every service uses the appropriate lifetime.
- [ ] Dependencies are resolved explicitly inside registration factories.
- [ ] Scoped services are only resolved from an active scope.
- [ ] Resolve root services through the runtime application's `getServices()`.
- [ ] Resolve scoped services through `getScopedServices()` only in an active scope, or use `runInScope()`.
- [ ] There are no circular dependencies.
- [ ] Singletons do not depend on scoped services.
- [ ] Use `runInScope()` so each application scope is closed when its work completes.
- [ ] Scoped services are used only during the scope that created them.

## Related Documentation

- [Dependency Injection](./overview)
- [Registration](./registration)
- [Singleton](./lifetimes/singleton)
- [Scoped](./lifetimes/scoped)
- [Transient](./lifetimes/transient)
- [Resolution](./resolution)
- [Dependency Graph](./dependency-graph)
- [Captive Dependencies](./captive-dependencies)
- [Context & Scopes](../context-scopes)
- [App Builder](../app-builder)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
