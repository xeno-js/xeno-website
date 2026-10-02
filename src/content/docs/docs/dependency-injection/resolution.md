---
title: Service Resolution
description: Learn how to resolve registered services in Xeno.JS from the application container, AppBuilder, or an active service scope.
keywords:
- Xeno.JS
- dependency injection
- service resolution
- resolve
- AppBuilder
- IServiceContainer
- IServiceScope
- scoped services
- ContainerUtils
- TypeScript
tags:
- dependency-injection
- resolution
- services
- service-container
- scopes
- typescript
faqs:
- question: How do I resolve a service in Xeno.JS?
  answer: Call resolve() with the service token on the service container, AppBuilder, or an active IServiceScope.
- question: Can I resolve a service directly from AppBuilder?
  answer: Yes. AppBuilder exposes resolve(), which delegates to the configured service container.
- question: Can I resolve a scoped service from the root container?
  answer: No. Scoped services require an active IServiceScope.
- question: How do I resolve a scoped service from a request?
  answer: Use the current request scope or ContainerUtils.resolveServiceScoped() when resolving the service at an integration or transport boundary.
- question: What happens if I resolve an unregistered service?
  answer: Xeno.JS throws a DI Container Error indicating that the registration was not found for the requested token.
- question: What happens if I resolve a service from a disposed scope?
  answer: Xeno.JS throws a DI Container Error indicating that the scope has been closed.
- question: Does resolve() return the same instance every time?
  answer: It depends on the service lifetime. Singleton services are shared by the container, scoped services are shared within a scope, and transient services create a new instance for each resolution.
- question: How does TypeScript know the type returned by resolve()?
  answer: The service token is typed through the application registry, so resolve() returns the service type associated with that token.
---

## Introduction

If you have already registered a service and need to use it, Xeno.JS provides `resolve()` on the service container, `AppBuilder`, and `IServiceScope`.

The method is type-safe: the service token determines the type returned by the registry.

Use:

* `AppBuilder.resolve()` when resolving an application service from the composition root.
* `IServiceContainer.resolve()` when you already have the configured container.
* `IServiceScope.resolve()` when the service is scoped.
* `ContainerUtils.resolveServiceScoped()` when resolving a scoped service from an integration or transport boundary.

## Before you start

You need:

1. A service registered in the container.
2. The service token used by that registration.
3. An active scope if the service uses the `scoped` lifetime.

For example:

```ts
const app = new AppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

await app.build()
```

The service can then be resolved with the same token:

```ts
const userService = app.resolve('USER_SERVICE')
```

## Resolve a service with `AppBuilder`

`AppBuilder` exposes:

```ts
resolve<K extends keyof TRegistry>(token: K): TRegistry[K]
```

This is the simplest option when your code already has access to the application builder.

```ts
const app = new AppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

await app.build()

const userService = app.resolve('USER_SERVICE')

await userService.findById('123')
```

`AppBuilder.resolve()` delegates resolution to the configured service container.

### When to use it

Use `app.resolve()` when resolving services from the application composition layer or other code that intentionally has access to the application builder.

For request-scoped application code, prefer resolving through the active scope instead.

## Resolve a service from `IServiceContainer`

After building the application, `build()` returns the configured `IServiceContainer`.

```ts
const app = new AppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

const container = await app.build()

const userService = container.resolve('USER_SERVICE')
```

This is useful when a component receives the container explicitly:

```ts
function createApplication(container: IServiceContainer) {
  const userService = container.resolve('USER_SERVICE')

  return userService
}
```

The container's `resolve()` method uses the registry to associate the token with its service type.

## Resolve a service from a scope

Scoped services cannot be resolved directly from the root container.

Register the service as scoped:

```ts
const app = new AppBuilder().addServices((services) => {
  services.addScoped('REQUEST_SERVICE', () => {
    return new RequestService()
  })
})

const container = await app.build()
```

This does **not** work:

```ts
const requestService = container.resolve('REQUEST_SERVICE')
```

Xeno.JS throws:

```text
[DI Container Error]: Scoped service 'REQUEST_SERVICE' requires an active scope.
```

Create a scope and resolve the service through it instead:

```ts
const scope = container.createScope()

try {
  const requestService = scope.resolve('REQUEST_SERVICE')

  await requestService.execute()
} finally {
  await scope.dispose()
}
```

The scope provides the resolution boundary required by scoped services.

## Resolve dependencies inside a service factory

Service factories receive the current `IServiceScope`.

This allows a service to explicitly resolve its dependencies:

```ts
services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
    scope.resolve('USER_MAPPER'),
  )
})
```

The dependency graph is therefore explicit in the registration:

```text
USER_REPOSITORY
├── USER_DATA_SOURCE
└── USER_MAPPER
```

You do not need decorators or runtime dependency scanning.

## Resolve different service lifetimes

The result of `resolve()` depends on the registered lifetime.

### Singleton

A singleton returns the same instance from the same container:

```ts
const first = container.resolve('CONFIGURATION_SERVICE')
const second = container.resolve('CONFIGURATION_SERVICE')

console.log(first === second)
// true
```

### Scoped

A scoped service returns the same instance within one scope:

```ts
const scope = container.createScope()

try {
  const first = scope.resolve('REQUEST_SERVICE')
  const second = scope.resolve('REQUEST_SERVICE')

  console.log(first === second)
  // true
} finally {
  await scope.dispose()
}
```

A different scope has its own scoped instance:

```ts
const firstScope = container.createScope()
const secondScope = container.createScope()

try {
  const first = firstScope.resolve('REQUEST_SERVICE')
  const second = secondScope.resolve('REQUEST_SERVICE')

  console.log(first === second)
  // false
} finally {
  await firstScope.dispose()
  await secondScope.dispose()
}
```

### Transient

A transient service creates a new instance for every resolution:

```ts
const first = container.resolve('USER_FACTORY')
const second = container.resolve('USER_FACTORY')

console.log(first === second)
// false
```

See [Transient](./lifetimes/transient) for details.

## Resolve a scoped service from the current request

Xeno.JS creates a service scope for request execution.

When application code runs inside that request scope, scoped services can be resolved through the current `IServiceScope`.

If you need to access the current scope explicitly, Xeno.JS exposes the `IServiceScopeAccessor` through the application registry.

```ts
const scopeAccessor = container.resolve('SERVICE_SCOPE_ACCESSOR')
const scope = scopeAccessor.getScope()

if (!scope) {
  throw new Error('An active service scope is required.')
}

const requestService = scope.resolve('REQUEST_SERVICE')
```

The scope is available only while the request execution is active.

After request execution finishes, the request scope is disposed.

## Resolve a scoped service with `ContainerUtils`

When code sits at a transport or integration boundary, `ContainerUtils.resolveServiceScoped()` provides a convenient way to resolve a service through the current active scope.

```ts
import { ContainerUtils } from '@xeno-js/core'

const controller = ContainerUtils.resolveServiceScoped(
  'FIND_USER_CONTROLLER',
  container,
)
```

The utility obtains the current service scope and resolves the requested token through that scope.

This is particularly useful in transport adapters:

```ts
fastify.get('/users/:id', async (req, reply) => {
  const controller = ContainerUtils.resolveServiceScoped(
    'FIND_USER_CONTROLLER',
    container,
  )

  const result = await controller.handle(req.params.id)

  return reply.send(result)
})
```

An active service scope is required.

If no scope is available, Xeno.JS throws:

```text
Active service scope is required to execute Scoped service.
```

Use this approach when the transport layer needs to obtain a request-scoped application component without manually creating and managing the request scope.

## Resolve built-in Xeno.JS services

Xeno.JS also registers services identified by its built-in registry tokens.

For example:

```ts
const mediator = container.resolve('MEDIATOR')
const logger = container.resolve('LOGGER')
const requestContext = container.resolve('REQUEST_CONTEXT')
```

The registry associates each token with its corresponding service type.

For example, `MEDIATOR` resolves to the mediator contract, while `REQUEST_CONTEXT` resolves to the request-context contract.

This means TypeScript can infer the result of the resolution:

```ts
const mediator = container.resolve('MEDIATOR')

await mediator.send(command)
```

No manual type cast is required.

## Resolve a service by its custom token

Custom services can extend the application registry so their tokens remain type-safe.

For example:

```ts
interface UserServiceRegistry {
  USER_SERVICE: UserService
}
```

Your application registry can then include the custom token:

```ts
type AppRegistry = XenoRegistry<
  Dictionary,
  UserServiceRegistry
>
```

The exact registry composition depends on how your application defines its custom services.

Once the token is part of the registry, the same resolution API applies:

```ts
const userService = container.resolve('USER_SERVICE')
```

The returned value is typed as `UserService`.

## Common problems

### Registration not found

If you resolve a token that has not been registered:

```ts
const userService = container.resolve('USER_SERVICE')
```

Xeno.JS throws:

```text
[DI Container Error]: Registration not found for token 'USER_SERVICE'. Ensure the service is registered before resolving.
```

Check that:

1. The service is registered.
2. The registration runs before resolution.
3. The token is spelled exactly the same in registration and resolution.
4. The module containing the registration has been configured before the service is resolved.

For application-level registrations, prefer configuring them through `addServices()`:

```ts
const app = new AppBuilder().addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

const container = await app.build()
```

### Scoped service requires an active scope

If you see:

```text
[DI Container Error]: Scoped service 'USER_SERVICE' requires an active scope.
```

the service was resolved from the root container even though it was registered as scoped.

Instead of:

```ts
container.resolve('USER_SERVICE')
```

use:

```ts
const scope = container.createScope()

try {
  const userService = scope.resolve('USER_SERVICE')
} finally {
  await scope.dispose()
}
```

Or, when already inside request execution, resolve it through the active request scope.

### Scope has been closed

A disposed scope cannot be used for further resolution.

```ts
const scope = container.createScope()

await scope.dispose()

scope.resolve('USER_SERVICE')
```

This throws:

```text
[DI Container Error]: Unable to resolve 'USER_SERVICE'. The scope has been closed.
```

Do not retain a scoped service or scope beyond the lifetime in which it is valid.

### Duplicate registration

A token can only be registered once in a container.

For example:

```ts
services.addSingleton('USER_SERVICE', () => new UserService())

services.addScoped('USER_SERVICE', () => new UserService())
```

throws:

```text
[DI Container Error]: The token 'USER_SERVICE' is already registered in the container.
```

Choose one registration for the token or use a different token.

## Complete example

The following example registers a repository and a service, then resolves the service from a request scope.

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder().addServices((services) => {
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

const scope = container.createScope()

try {
  const userService = scope.resolve('USER_SERVICE')

  const user = await userService.findById('123')

  console.log(user)
} finally {
  await scope.dispose()
}
```

The important part is that the resolution follows the lifetime boundary:

```text
container
   |
   +-- createScope()
          |
          +-- USER_SERVICE
                 |
                 +-- USER_REPOSITORY
                        |
                        +-- USER_DATA_SOURCE
```

The services registered as scoped are resolved within the same scope.

## Choosing the resolution API

| Situation                                                    | Use                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| Resolve a root-level singleton or transient                  | `container.resolve(token)`                              |
| Resolve from the application builder                         | `app.resolve(token)`                                    |
| Resolve a scoped service                                     | `scope.resolve(token)`                                  |
| Resolve a scoped service at a transport/integration boundary | `ContainerUtils.resolveServiceScoped(token, container)` |
| Resolve a dependency inside a registration factory           | `scope.resolve(token)`                                  |

The key rule is simple:

> **Resolve scoped services through an active scope.**

## Checklist

Before resolving a service, verify:

* [ ] The service has been registered.
* [ ] You are using the same token used during registration.
* [ ] The application has been built when using `AppBuilder`.
* [ ] You are using an active scope for scoped services.
* [ ] You are not resolving a service from a disposed scope.
* [ ] The custom token is included in the application registry when using custom services.

## Related docs

* [Service Container](./service-container) — understand the container used to register and resolve services.
* [Registration](./registration) — register services with Xeno.JS.
* [Singleton](./lifetimes/singleton) — register services with one shared instance.
* [Scoped](./lifetimes/scoped) — register services with one instance per scope.
* [Transient](./lifetimes/transient) — create a new instance on every resolution.
* [Dependency Graph](./dependency-graph) — understand how registered services depend on each other.
* [Captive Dependencies](./captive-dependencies) — troubleshoot invalid lifetime dependencies.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
