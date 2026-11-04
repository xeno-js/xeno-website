---
title: Service Resolution
description: Learn how to resolve registered services in Xeno.JS through the runtime application and its active service scopes.
keywords:
- Xeno.JS
- dependency injection
- service resolution
- resolve
- XenoAppBuilder
- IServiceScope
- scoped services
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
  answer: After building the application, use getServices() for root services, getScopedServices() inside an active scope, or runInScope() to start a scoped operation.
- question: Can I resolve a service directly from XenoAppBuilder?
  answer: XenoAppBuilder exposes resolve() for root-container registrations. The value returned by build() is the runtime application, whose getServices() method resolves root services.
- question: Can I resolve a scoped service from the root container?
  answer: No. Scoped services require an active IServiceScope.
- question: How do I resolve a scoped service from a request?
  answer: Use getScopedServices() inside the active request scope. Use runInScope() when the operation needs its own scope.
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

If you have already registered a service and need to use it, the runtime
application provides separate APIs for root and scoped resolution.

The method is type-safe: the service token determines the type returned by the registry.

Use:

- `application.getServices()` for singleton or transient services that can be resolved from the root. Resolve a transient with scoped dependencies inside the intended operation scope.
- `application.getScopedServices()` inside an existing request or execution scope.
- `application.runInScope()` when an operation needs a new scope.

## Before you start

You need:

1. A service registered in the container.
2. The service token used by that registration.
3. An active scope if the service uses the `scoped` lifetime.

For example:

```ts
const app = new XenoAppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

const application = await app.build()
```

`build()` returns the runtime application, not the service container. Resolve
the service from its root services:

```ts
const userService = application.getServices().USER_SERVICE
```

## Resolve a service with `XenoAppBuilder`

`XenoAppBuilder` exposes a root resolution convenience:

```ts
resolve<K extends keyof TRegistry>(token: K): TRegistry[K]
```

After `build()`, prefer the runtime application's `getServices()` API:

```ts
const app = new XenoAppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

const application = await app.build()
const userService = application.getServices().USER_SERVICE

await userService.findById('123')
```

`XenoAppBuilder.resolve()` delegates to the root service container. It cannot
resolve scoped registrations because they require an active scope.

### When to use it

Use `app.resolve()` only for root-resolvable services when code intentionally
has access to the builder. For application runtime code, use
`application.getServices()`.

For request-scoped application code, prefer resolving through the active scope instead.

## Resolve from the runtime application

After building the application, `build()` returns the configured runtime
application, not the `IServiceContainer`.

```ts
const app = new XenoAppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

const application = await app.build()

const userService = application.getServices().USER_SERVICE
```

The application proxy uses the registry to associate each property with its
service type. The builder also exposes `resolve()` for root-container
registrations, but the built application is the runtime API.

## Resolve a service from a scope

Scoped services cannot be resolved directly from the root container.

Register the service as scoped:

```ts
const app = new XenoAppBuilder().addServices((services) => {
  services.addScoped('REQUEST_SERVICE', () => {
    return new RequestService()
  })
})

const application = await app.build()
```

This does **not** work:

```ts
const requestService = application.getServices().REQUEST_SERVICE
```

Xeno.JS throws:

```text
[DI Container Error]: Scoped service 'REQUEST_SERVICE' requires an active scope.
```

Run the operation within a scope instead:

```ts
await application.runInScope(async (services) => {
  const requestService = services.REQUEST_SERVICE
  await requestService.execute()
})
```

`runInScope()` creates the request context and resolution scope for the
operation, then disposes the scope when the operation completes.

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
const first = application.getServices().CONFIGURATION_SERVICE
const second = application.getServices().CONFIGURATION_SERVICE

console.log(first === second)
// true
```

### Scoped

A scoped service returns the same instance within one scope:

```ts
await application.runInScope(async (services) => {
  const first = services.REQUEST_SERVICE
  const second = services.REQUEST_SERVICE

  console.log(first === second)
  // true
})
```

A separate `runInScope()` call creates a different scope and therefore a
different scoped instance. Do not retain a scoped service beyond the callback
that owns its scope.

### Transient

A transient service creates a new instance for every resolution:

```ts
const sameInstance = await application.runInScope(async (services) => {
  const first = services.USER_FACTORY
  const second = services.USER_FACTORY
  return first === second
})

console.log(sameInstance)
// false
```

For a transient without scoped dependencies, `getServices()` can also resolve
it from the root. If it depends on scoped services, resolve it through the
intended execution scope.

See [Transient](./lifetimes/transient) for details.

## Resolve a scoped service from the current execution

When a request or other application execution already has an active scope, use
`getScopedServices()` to resolve services through it:

```ts
const { REQUEST_SERVICE: requestService } =
  application.getScopedServices()

await requestService.execute()
```

`getScopedServices()` throws if there is no active scope. For work outside an
existing request or execution, use `runInScope()`:

```ts
await application.runInScope(async (services) => {
  const requestService = services.REQUEST_SERVICE
  await requestService.execute()
})
```

The scope is disposed when the `runInScope()` operation completes. Do not
retain scoped services for use after that execution ends.

## Resolve built-in Xeno.JS services

Xeno.JS also registers services identified by its built-in registry tokens.

For example:

```ts
const { mediator, logger, requestContext } = application.getServices()
```

The registry associates each token with its corresponding service type.

For example, `MEDIATOR` resolves to the mediator contract, while `REQUEST_CONTEXT` resolves to the request-context contract.

This means TypeScript can infer the result of the resolution:

```ts
const { mediator } = application.getServices()

await mediator.send(command)
```

No manual type cast is required.

## Resolve a service by its custom token

Custom services can extend the application registry so their tokens remain type-safe.

For example:

```ts
interface UserServiceRegistry extends XenoRegistry {
  USER_SERVICE: UserService
}
```

Use the application-specific registry as the generic parameter when creating
the builder:

```ts
const app = new XenoAppBuilder<UserServiceRegistry>()
```

Once the token is part of the registry, the same resolution API applies:

```ts
const userService = application.getServices().USER_SERVICE
```

The returned value is typed as `UserService`.

## Common problems

### Registration not found

If you resolve a token that has not been registered:

```ts
const userService = application.getServices().USER_SERVICE
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
const app = new XenoAppBuilder().addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

const application = await app.build()
```

### Scoped service requires an active scope

If you see:

```text
[DI Container Error]: Scoped service 'USER_SERVICE' requires an active scope.
```

the service was resolved from the root container even though it was registered as scoped.

Use `runInScope()` when the operation needs its own scope:

```ts
await application.runInScope(async (services) => {
  const userService = services.USER_SERVICE
})
```

When already inside request execution, resolve through the active scope with
`getScopedServices()`.

### Scope has been closed

A disposed scope cannot be used for further resolution.

`runInScope()` disposes its scope when the callback completes. Do not retain
scoped services and use them after the execution has ended; their owning scope
has been disposed and cannot perform further resolutions. A disposed
`IServiceScope` throws:

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
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder().addServices((services) => {
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

const user = await application.runInScope(async (services) => {
  const userService = services.USER_SERVICE
  return userService.findById('123')
})
```

The important part is that the resolution follows the lifetime boundary:

```text
application
   |
   +-- runInScope()
          |
          +-- USER_SERVICE
                 |
                 +-- USER_REPOSITORY
                        |
                        +-- USER_DATA_SOURCE
```

The services registered as scoped are resolved within the same scope.

## Choosing the resolution API

| Situation | Use |
| --- | --- |
| Resolve a root-level singleton or transient | `application.getServices()` |
| Resolve a service in an active request scope | `application.getScopedServices()` |
| Create a scope for an operation | `application.runInScope()` |
| Resolve a dependency inside a registration factory | `scope.resolve(token)` |

The key rule is simple:

> **Resolve scoped services through an active scope.**

## Checklist

Before resolving a service, verify:

- [ ] The service has been registered.
- [ ] You are using the same token used during registration.
- [ ] The application has been built when using `XenoAppBuilder`.
- [ ] You are using an active scope for scoped services.
- [ ] You are not resolving a service from a disposed scope.
- [ ] The custom token is included in the application registry when using custom services.

## Related docs

- [Service Container](./service-container) — understand the container used to register and resolve services.
- [Registration](./registration) — register services with Xeno.JS.
- [Singleton](./lifetimes/singleton) — register services with one shared instance.
- [Scoped](./lifetimes/scoped) — register services with one instance per scope.
- [Transient](./lifetimes/transient) — create a new instance on every resolution.
- [Dependency Graph](./dependency-graph) — understand how registered services depend on each other.
- [Captive Dependencies](./captive-dependencies) — troubleshoot invalid lifetime dependencies.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
