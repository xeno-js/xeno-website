---
title: Service Container
description: Learn how to use the Xeno.JS service container to register, resolve, and manage application dependencies with explicit dependency injection.
keywords:
- Xeno.JS
- dependency injection
- service container
- ServiceContainer
- AppBuilder
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
  answer: Use AppBuilder.addServices() and register the service with addSingleton(), addScoped(), or addTransient().
- question: How do I resolve a registered service?
  answer: Use AppBuilder.resolve() when resolving a root-level service, or resolve() on an active IServiceScope for scoped services.
- question: Can I resolve a scoped service directly from the root container?
  answer: No. Scoped services require an active service scope.
- question: Can I register the same token more than once?
  answer: No. Registering a token that is already registered throws a DI Container Error.
---

## Introduction

Xeno.JS uses a **service container** to register and resolve the dependencies used by your application.

The container gives you explicit dependency injection without requiring decorators, runtime scanning, or implicit dependency discovery.

Use it when you need to:

* register application services;
* connect an interface or token to an implementation;
* define how long a service instance should live;
* resolve dependencies from other services;
* share dependencies across application components;
* keep dependency configuration in your application composition root.

For most applications, you interact with the container through `AppBuilder` rather than creating a `ServiceContainer` directly.

## Before you start

You need `@xeno-js/core` installed:

```bash
npm install @xeno-js/core
```

The usual application entry point is an `AppBuilder`:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()
```

`AppBuilder` owns the application's service container and exposes the registration and resolution APIs you normally need.

---

## Register Services

Register application services with `AppBuilder.addServices()`.

The callback receives the service container:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

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
const app = new AppBuilder()

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
const app = new AppBuilder()
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

* [Singleton](./lifetimes/singleton)
* [Scoped](./lifetimes/scoped)
* [Transient](./lifetimes/transient)
* [Lifetimes](./lifetimes)

---

## Resolve a Service

If you have an `AppBuilder`, you can resolve a registered root-level service with `app.resolve()`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addSingleton('CONFIG_SERVICE', () => {
      return new ConfigService()
    })
  })

await app.build()

const config = app.resolve('CONFIG_SERVICE')
```

`AppBuilder.resolve()` delegates resolution to its service container.

This is useful for services that can be resolved directly from the root container, such as singleton and transient services.

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

You can create a scope from the service container:

```ts
const container = await app.build()

const scope = container.createScope()

const repository = scope.resolve('USER_REPOSITORY')

await scope.dispose()
```

A scope provides the lifetime boundary for scoped services.

Within the same scope:

```ts
const first = scope.resolve('USER_REPOSITORY')
const second = scope.resolve('USER_REPOSITORY')

console.log(first === second) // true
```

A different scope receives a different scoped instance:

```ts
const scope1 = container.createScope()
const scope2 = container.createScope()

const repository1 = scope1.resolve('USER_REPOSITORY')
const repository2 = scope2.resolve('USER_REPOSITORY')

console.log(repository1 === repository2) // false

await scope1.dispose()
await scope2.dispose()
```

For request-scoped application code, Xeno.JS can manage the active scope through its context system. See [Context & Scopes](../context-scopes).

---

## Resolve a Scoped Service with `ContainerUtils`

If you already have the application container and need to resolve a scoped service from the current active scope, use `ContainerUtils.resolveServiceScoped()`:

```ts
import { ContainerUtils } from '@xeno-js/core'

const repository = ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  app,
)
```

This is useful at application or transport boundaries where you have the application container but want the service associated with the current active scope.

A scoped service cannot be resolved directly from the root container:

```ts
app.resolve('USER_REPOSITORY')
```

Instead, when an active scope exists:

```ts
ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  app,
)
```

If there is no active scope, `resolveServiceScoped()` throws:

```text
Active service scope is required to execute Scoped service.
```

See [Context & Scopes](../context-scopes) for more information about active scopes.

---

## Build the Application

Service registrations added through `AppBuilder.addServices()` are applied when the application is built.

A typical bootstrap looks like this:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

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

const container = await app.build()
```

After `build()` completes, the application container is ready to resolve the registered services.

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
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

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

await app.build()
```

The dependency graph is defined entirely through registrations.

When `USER_CONTROLLER` is resolved, its factory resolves `USER_SERVICE`, which resolves `USER_REPOSITORY`, which resolves `USER_DATA_SOURCE`.

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
const app = new AppBuilder()

app.addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

await app.build()

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
4. that `app.build()` has completed before resolving from the built container.

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

Use an active scope instead:

```ts
const container = await app.build()
const scope = container.createScope()

const repository = scope.resolve('USER_REPOSITORY')

await scope.dispose()
```

Or, when an active application scope already exists:

```ts
const repository = ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  app,
)
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

## Dispose the Container and Scopes

The service container and scopes implement disposal.

Dispose a scope when it is no longer needed:

```ts
const scope = container.createScope()

try {
  const service = scope.resolve('USER_SERVICE')

  // Use the service.
} finally {
  await scope.dispose()
}
```

Dispose the application container during application shutdown:

```ts
await container.dispose()
```

Services that expose a `dispose()` method can participate in container or scope cleanup.

This is particularly useful for services that own resources that must be released explicitly.

---

## When to Use the Service Container Directly

Most application code should use `AppBuilder.addServices()` for registration.

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

Application code generally does not need to instantiate `ServiceContainer` manually.

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
scope.resolve('USER_SERVICE')
```

not a different token.

### `Scoped service requires an active scope`

The service was registered with `addScoped()` but was resolved from the root container.

Use:

```ts
const scope = container.createScope()

const service = scope.resolve('USER_SERVICE')
```

or use `ContainerUtils.resolveServiceScoped()` when an active scope already exists.

### `already registered`

The same token has been registered more than once.

Remove the duplicate registration or give the implementations different tokens.

### `DI Circular Dependency Error`

Two or more services depend on each other through their registration factories.

Inspect the resolution path in the error and remove the dependency cycle.

### `DI Captive Dependency Error`

A singleton is trying to resolve a scoped service.

Review the lifetimes of the services involved and move the scoped dependency to a scoped/transient component, or change the dependency boundary.

### Resolution after disposal fails

A disposed scope can no longer resolve services.

Make sure the scope remains alive for the complete operation that uses its services.

---

## Service Container Checklist

Before considering your dependency injection setup complete:

* [ ] Every service has a unique registration token.
* [ ] Every service uses the appropriate lifetime.
* [ ] Dependencies are resolved explicitly inside registration factories.
* [ ] Scoped services are only resolved from an active scope.
* [ ] The application is built before resolving services from the built container.
* [ ] There are no circular dependencies.
* [ ] Singletons do not depend on scoped services.
* [ ] Scopes are disposed when their work is complete.
* [ ] The application container is disposed during application shutdown when appropriate.

## Related Documentation

* [Dependency Injection](./overview)
* [Registration](./registration)
* [Lifetimes](./lifetimes)
* [Singleton](./lifetimes/singleton)
* [Scoped](./lifetimes/scoped)
* [Transient](./lifetimes/transient)
* [Resolution](./resolution)
* [Dependency Graph](./dependency-graph)
* [Captive Dependencies](./captive-dependencies)
* [Context & Scopes](../context-scopes)
* [App Builder](../app-builder)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
