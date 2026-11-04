---
title: Registration
description: Learn how to register application services in the Xeno.JS dependency injection container using explicit tokens, factories, and service lifetimes.
keywords:
- Xeno.JS
- dependency injection
- service registration
- addServices
- addSingleton
- addScoped
- addTransient
- service container
- injection tokens
- TypeScript
tags:
- dependency-injection
- registration
- services
- typescript
faqs:
- question: How do I register a service in Xeno.JS?
  answer: Use XenoAppBuilder.addServices() and register the service with addSingleton(), addScoped(), or addTransient().
- question: Can a service factory resolve other services?
  answer: Yes. A registration factory receives a service scope that it can use to resolve registered dependencies. Singleton factories receive the root scope; scoped and transient factories receive the scope used for their resolution.
- question: Do I need decorators to register services?
  answer: No. Xeno.JS uses explicit service registration with tokens and factory functions.
- question: Why does TypeScript reject my service token?
  answer: The token must exist in the application's service registry. Custom application registries can extend the registry when additional service tokens are required.
- question: When are services registered with XenoAppBuilder.addServices()?
  answer: The registration callback is queued by XenoAppBuilder and executed during build().
---

## Introduction

Register application services explicitly with Xeno.JS dependency injection.

A registration connects:

- a **token** used to identify the service
- a **factory** used to create the service
- a **lifetime** that controls how the created instance is reused

The basic registration API is:

```ts
services.addSingleton(token, factory)
services.addScoped(token, factory)
services.addTransient(token, factory)
```

Xeno.JS does not require decorators or runtime service scanning. You register the services you want to make available to the application.

## Before you start

You need:

- a Xeno.JS application using `XenoAppBuilder`
- a service implementation
- a token available in the application registry
- any dependencies required by the service

For most applications, register application services through `AppBuilder.addServices()`.

## Register a service

Use `addServices()` to configure the application's service container.

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addServices((services) => {
  services.addScoped('USER_REPOSITORY', (scope) => {
    return new UserRepository()
  })
})

await app.build()
```

`addServices()` receives the service container and returns the `XenoAppBuilder`, so registrations can be chained with other application configuration.

The registration callback is applied when `build()` bootstraps the application.

## Choose a registration lifetime

Xeno.JS provides three registration methods:

| Method           | Instance behavior                       |
| ---------------- | --------------------------------------- |
| `addSingleton()` | One instance for the container lifetime |
| `addScoped()`    | One instance per service scope          |
| `addTransient()` | A new instance for each resolution      |

Choose the lifetime based on how the service should behave. The lifetime itself is not part of the token; it is defined when the service is registered.

For detailed lifetime guidance, see:

- [Singleton](./lifetimes/singleton)
- [Scoped](./lifetimes/scoped)
- [Transient](./lifetimes/transient)

## Register a singleton

Use `addSingleton()` when the application should reuse the same service instance.

```ts
app.addServices((services) => {
  services.addSingleton('USER_MAPPER', () => {
    return new UserMapper()
  })
})
```

The factory is called when the service is first resolved. Subsequent resolutions reuse the same instance.

Typical examples include services that are intentionally shared across the application, such as stateless infrastructure services or reusable configuration-oriented components.

## Register a scoped service

Use `addScoped()` when the service should have one instance within a logical service scope.

```ts
app.addServices((services) => {
  services.addScoped('USER_REPOSITORY', (scope) => {
    return new UserRepository()
  })
})
```

A scoped service must be resolved through an active scope.

For request-oriented applications, scoped services are commonly used for dependencies whose lifetime should follow the current request or execution scope.

```ts
const application = await app.build()

await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
})
```

Do not resolve a scoped service directly from the root container:

```ts
const application = await app.build()

// Invalid: USER_REPOSITORY is scoped.
application.getServices().USER_REPOSITORY
```

For more information, see [Scoped](./lifetimes/scoped).

## Register a transient service

Use `addTransient()` when a new service instance should be created for each resolution.

```ts
app.addServices((services) => {
  services.addTransient('USER_SERVICE', () => {
    return new UserService()
  })
})
```

Transient services are useful when the service does not need to retain instance state between resolutions.

For more information, see [Transient](./lifetimes/transient).

## Register a service with dependencies

Service factories receive the current service scope.

Use that scope to resolve dependencies explicitly:

```ts
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
```

This creates the following dependency relationship:

```text
USER_SERVICE
    │
    └── USER_REPOSITORY
            │
            └── USER_DATA_SOURCE
```

The dependency is visible directly in the registration code.

You do not need a decorator or constructor metadata to tell Xeno.JS how the dependency should be obtained.

## Register a complete service graph

A typical application can register multiple services in one `addServices()` call:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addServices((services) => {
  services.addSingleton('USER_MAPPER', () => {
    return new UserMapper()
  })

  services.addScoped('USER_DATA_SOURCE', (scope) => {
    return new UserDataSource(
      scope.resolve('DB_CONTEXT'),
    )
  })

  services.addScoped('USER_REPOSITORY', (scope) => {
    return new UserRepository(
      scope.resolve('USER_DATA_SOURCE'),
      scope.resolve('USER_MAPPER'),
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

The important part is that every dependency used by a factory must itself be registered and available under the expected token. `build()` returns the configured runtime application, not the service container.

## Register services with custom application tokens

Xeno.JS uses a typed application registry to associate service tokens with their service types.

The registry includes built-in service tokens such as:

- `CONFIGURATION_SERVICE`
- `LOGGER`
- `MEDIATOR`
- `REQUEST_CONTEXT`
- `CACHE`
- `CONCURRENCY_SERVICE`
- `DB_CONTEXT`
- `HTTP_ADAPTER`

Custom application services can extend the application registry when your application needs additional typed tokens.

The registry is what allows calls such as:

```ts
scope.resolve('USER_SERVICE')
```

to be checked against the registered token type by TypeScript.

Keep custom tokens stable and descriptive. A token should identify the service contract or role rather than an implementation detail.

For example:

```ts
'USER_REPOSITORY'
```

is preferable to:

```ts
'POSTGRES_USER_REPOSITORY_V2'
```

when the application depends on the repository abstraction rather than its concrete implementation.

## Register an existing service implementation

Factories are regular TypeScript functions, so the implementation can be constructed directly:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

The factory can also contain configuration required to construct the service:

```ts
services.addSingleton('USER_CLIENT', (scope) => {
  const configuration = scope.resolve('CONFIGURATION_SERVICE')

  return new UserClient({
    baseUrl: configuration.get('USER_API_URL'),
  })
})
```

Keep the factory focused on composition. Business behavior should remain in the service itself.

## Register services through a module

If a feature contains several related services, you can package their registrations in an Xeno.JS module.

A module receives the service container during configuration:

```ts
import type { IModule, IServiceContainer } from '@xeno-js/core'

export class UserModule implements IModule {
  async configure(container: IServiceContainer): Promise<void> {
    container.addScoped('USER_REPOSITORY', (scope) => {
      return new UserRepository(
        scope.resolve('USER_DATA_SOURCE'),
      )
    })

    container.addScoped('USER_SERVICE', (scope) => {
      return new UserService(
        scope.resolve('USER_REPOSITORY'),
      )
    })
  }
}
```

Register the module with the application:

```ts
const app = new XenoAppBuilder()

app.addModule('UserModule', async () => {
  return new UserModule()
})

await app.build()
```

Use direct `addServices()` registrations for application-level composition and modules when a feature owns a cohesive group of registrations.

## Do not register the same token twice

Each token can have one registration in a service container.

This is invalid:

```ts
services.addScoped('USER_SERVICE', () => {
  return new UserService()
})

services.addTransient('USER_SERVICE', () => {
  return new UserService()
})
```

The second registration throws a container error:

```text
[DI Container Error]: The token 'USER_SERVICE' is already registered in the container.
```

If you need different implementations, give them different tokens or change the existing registration rather than registering the same token twice.

## Make sure every dependency is registered

If a factory resolves a token that has no registration, resolution fails.

For example:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

If `USER_REPOSITORY` has not been registered, Xeno.JS reports:

```text
[DI Container Error]: Registration not found for token 'USER_REPOSITORY'. Ensure the service is registered before resolving.
```

Check the registration graph:

```text
USER_SERVICE
    │
    └── USER_REPOSITORY
```

Then make sure both nodes are registered.

## Avoid resolving scoped services from the root container

A scoped registration requires an active scope.

This is invalid:

```ts
services.addScoped('USER_REPOSITORY', () => {
  return new UserRepository()
})

const application = await app.build()

application.getServices().USER_REPOSITORY
```

Xeno.JS reports:

```text
[DI Container Error]: Scoped service 'USER_REPOSITORY' requires an active scope.
```

Resolve it within an operation scope instead:

```ts
await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
})
```

If the service is intentionally application-wide, consider whether `addSingleton()` is the appropriate lifetime instead.

## Avoid circular registrations

A registration graph must have a valid dependency path.

For example:

```text
SERVICE_A
    │
    └── SERVICE_B
            │
            └── SERVICE_A
```

This creates a circular dependency:

```ts
services.addScoped('SERVICE_A', (scope) => {
  return new ServiceA(
    scope.resolve('SERVICE_B'),
  )
})

services.addScoped('SERVICE_B', (scope) => {
  return new ServiceB(
    scope.resolve('SERVICE_A'),
  )
})
```

Xeno.JS detects the cycle during resolution and reports a circular dependency error.

To fix it, change the dependency direction or extract the shared responsibility into another service.

For dependency-graph guidance, see [Dependency Graph](./dependency-graph).

## Avoid invalid lifetime combinations

Registration lifetime affects which dependencies a service can safely use.

A singleton should not capture a scoped service:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_SERVICE'),
  )
})

services.addScoped('REQUEST_SERVICE', () => {
  return new RequestService()
})
```

This creates a lifetime mismatch:

```text
Singleton
USER_SERVICE
    │
    └── Scoped
        REQUEST_SERVICE
```

While constructing a singleton, the container detects this situation and
reports a captive dependency error. The same check applies when the resolution
reaches a scoped registration through a transient dependency. It does not
validate every lifetime combination or root-scope use.

If the dependency is request- or scope-specific, consider making the consuming service scoped as well:

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_SERVICE'),
  )
})
```

See [Captive Dependencies](./captive-dependencies) for more details.

## Build the application after registration

`addServices()` configures the builder. The registrations are applied when the application is built.

```ts
const app = new XenoAppBuilder()

app.addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

const application = await app.build()
```

`build()` returns the configured runtime application, not the service
container. Resolve root services from the application:

```ts
const userService = application.getServices().USER_SERVICE
```

For scoped services, run the operation in a scope:

```ts
await application.runInScope(async (services) => {
  const userService = services.USER_SERVICE
})
```

## Troubleshooting

### "The token is already registered"

Check whether the same token is registered more than once.

```text
[DI Container Error]: The token 'USER_SERVICE' is already registered in the container.
```

Search your application modules and `addServices()` callbacks for the token.

### "Registration not found"

The factory is resolving a token that has not been registered.

```text
[DI Container Error]: Registration not found for token 'USER_REPOSITORY'. Ensure the service is registered before resolving.
```

Check that:

1. the token is spelled correctly
2. the registration exists
3. the registration is part of the application being built
4. the dependency is available before the service is resolved

### "Scoped service requires an active scope"

The service was registered with `addScoped()` but was resolved from the root container.

Use:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
})
```

instead of:

```ts
application.getServices().USER_SERVICE
```

### TypeScript does not accept my token

Check the application's registry.

Xeno.JS types service registrations and resolutions through the registry, so a custom token must be represented in the registry used by the application.

Do not work around a registry error by casting the container to an unrelated type. Extend the application's registry so the token and service type remain connected.

### A service works in one place but fails in another

Check the service lifetime and resolution context.

In particular:

- `singleton` services can be resolved from root services
- `transient` services can be resolved from root or scoped services; if they depend on scoped services, resolve them inside the intended operation scope
- `scoped` services require an active scope

If the service depends on scoped services, also check the lifetime of the consuming service.

## Registration checklist

Before considering a registration complete, verify:

- [ ] The service has a clear token.
- [ ] The token exists in the application registry.
- [ ] The correct lifetime is selected.
- [ ] Every dependency used by the factory is registered.
- [ ] Scoped dependencies are resolved from an active scope.
- [ ] No token is registered more than once.
- [ ] The dependency graph contains no circular dependency.
- [ ] A singleton does not depend on a scoped service.
- [ ] The application calls `build()` after configuring registrations.

## Related docs

- [Service Container](../dependency-injection/service-container)
- [Singleton](../dependency-injection/lifetimes/singleton)
- [Scoped](../dependency-injection/lifetimes/scoped)
- [Transient](../dependency-injection/lifetimes/transient)
- [Resolution](../dependency-injection/resolution)
- [Dependency Graph](../dependency-injection/dependency-graph)
- [Captive Dependencies](../dependency-injection/captive-dependencies)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
