---
title: Singleton
description: Learn how to register a singleton service in Xeno.JS and reuse one shared instance throughout the application container.
keywords:
- Xeno.JS
- dependency injection
- singleton
- singleton service
- addSingleton
- service lifetime
- service container
- dependency injection lifetime
- TypeScript
tags:
- dependency-injection
- lifetimes
- singleton
- services
- typescript
faqs:
- question: How do I register a singleton service in Xeno.JS?
  answer: Use addSingleton() with a service token and a factory that creates the service instance.
- question: When is a singleton service created?
  answer: A singleton is created the first time the service is resolved and the same instance is reused for subsequent resolutions from the container.
- question: Is a singleton shared across service scopes?
  answer: Yes. Service scopes share singleton instances created by the root container.
- question: When should I use a singleton service?
  answer: Use a singleton when the service should have one shared instance for the lifetime of the application container and does not require per-request or per-scope state.
- question: Can a singleton depend on another service?
  answer: Yes. The singleton factory can resolve its dependencies from the provided service scope, subject to Xeno.JS lifetime rules.
- question: Can a singleton depend on a scoped service?
  answer: No. Xeno.JS rejects resolving a scoped service while constructing a singleton because the singleton would outlive the scoped dependency.

---

## Introduction

Use a **singleton** when your application needs one shared service instance for the lifetime of the dependency injection container.

A singleton is useful for services that are safe to share across the application, such as stateless infrastructure clients, configuration-related services, caches, or other resources whose lifetime should not be tied to an individual request or scope.

## Before you start

You need:

* an Xeno.JS application using `AppBuilder`
* a service token available in your application registry
* a service class or factory function to instantiate

Xeno.JS uses explicit dependency injection. You register the service yourself instead of relying on decorators or automatic dependency discovery.

If you are adding a custom service token, make sure it is part of your application's registry.

## Register a singleton

Register a singleton with `addSingleton()` inside `AppBuilder.addServices()`:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder().addServices((services) => {
  services.addSingleton('USER_SERVICE', () => {
    return new UserService()
  })
})

await app.build()
```

The important part is:

```ts
services.addSingleton('USER_SERVICE', () => {
  return new UserService()
})
```

The factory creates the service instance. Xeno.JS creates that instance when the service is first resolved and reuses it for later resolutions.

## Resolve the singleton

After the application has been built, resolve the service from the application:

```ts
const userService = app.resolve('USER_SERVICE')
```

Resolving the same token again returns the same instance:

```ts
const first = app.resolve('USER_SERVICE')
const second = app.resolve('USER_SERVICE')

console.log(first === second) // true
```

This is the defining behavior of the singleton lifetime.

## Add dependencies to a singleton

Singleton factories receive a service scope. Use that scope to resolve the services required by the singleton.

For example:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

The dependency graph is therefore explicit in the registration:

```text
USER_SERVICE
    |
    v
USER_REPOSITORY
```

You do not need constructor decorators or runtime dependency scanning.

## Register a singleton with multiple dependencies

A singleton can resolve several registered services:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
    scope.resolve('LOGGER'),
    scope.resolve('CONFIGURATION_SERVICE'),
  )
})
```

Keep the registration responsible for composing the service. The service itself should receive the dependencies it needs through its constructor or factory API.

## Singleton and service scopes

Creating a service scope does **not** create another singleton instance.

For example:

```ts
const scopeA = container.createScope()
const scopeB = container.createScope()

const serviceA = scopeA.resolve('USER_SERVICE')
const serviceB = scopeB.resolve('USER_SERVICE')

console.log(serviceA === serviceB) // true
```

Singletons are shared by the container, while scoped services have a separate instance for each scope.

This distinction is important when an application uses request or operation scopes.

For more information about scoped services, see [Scoped](./scoped).

## When to use a singleton

Use a singleton when the service should be shared across the application's container lifetime.

Typical candidates include:

* stateless application services that are safe to share
* reusable infrastructure clients
* caches
* configuration services
* loggers
* factories
* immutable or internally synchronized resources
* resources that should have one instance for the application

The important requirement is that the service must be safe to share.

For example, a service containing mutable state specific to one HTTP request should generally not be registered as a singleton.

## When not to use a singleton

Do not use a singleton simply because creating one instance is convenient.

A different lifetime may be more appropriate when the service contains:

* request-specific state
* user-specific state
* transaction-specific state
* scope-specific resources
* mutable state that must not be shared between requests

For request- or operation-specific dependencies, use a scoped lifetime instead.

For services that should be recreated for every resolution, use transient lifetime.

See:

* [Scoped](./scoped)
* [Transient](./transient)

## Singleton dependencies

A singleton can depend on services with lifetimes that are compatible with its lifetime.

For example, a singleton depending on another singleton is valid:

```ts
services.addSingleton('CONFIG_SERVICE', () => {
  return new ConfigurationService()
})

services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('CONFIG_SERVICE'),
  )
})
```

Both services are shared by the container.

### Avoid singleton → scoped dependencies

A singleton must not depend on a scoped service.

For example:

```ts
services.addScoped('REQUEST_SERVICE', () => {
  return new RequestService()
})

services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_SERVICE'),
  )
})
```

This is invalid because `USER_SERVICE` lives for the lifetime of the container while `REQUEST_SERVICE` belongs to an individual scope.

Xeno.JS detects this situation and throws a captive dependency error.

If the service needs request-specific or scope-specific state, consider registering the consuming service as scoped as well.

See [Captive Dependencies](../captive-dependencies).

## Singleton disposal

If a singleton implements the disposable contract exposed by Xeno.JS, its cleanup is handled when the container is disposed.

For example:

```ts
class ExternalClient {
  async dispose(): Promise<void> {
    await this.closeConnection()
  }

  async closeConnection(): Promise<void> {
    // Release external resources.
  }
}
```

Register it normally:

```ts
services.addSingleton('EXTERNAL_CLIENT', () => {
  return new ExternalClient()
})
```

Dispose the application container when the application is shutting down:

```ts
await container.dispose()
```

This allows disposable singleton resources to be released with the container lifecycle.

## Complete example

The following example registers a shared `UserService` and gives it a repository dependency.

```ts
import { AppBuilder } from '@xeno-js/core'

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

  async findById(id: string) {
    return this.repository.findById(id)
  }
}

const app = new AppBuilder().addServices((services) => {
  services.addSingleton('USER_REPOSITORY', () => {
    return new UserRepository()
  })

  services.addSingleton('USER_SERVICE', (scope) => {
    return new UserService(
      scope.resolve('USER_REPOSITORY'),
    )
  })
})

const container = await app.build()

const first = container.resolve('USER_SERVICE')
const second = container.resolve('USER_SERVICE')

console.log(first === second) // true
```

The resulting dependency graph is:

```text
USER_SERVICE
    |
    v
USER_REPOSITORY
```

Both services use the singleton lifetime, so the same instances are reused by the container.

## Troubleshooting

### `The token '...' is already registered`

A service token can only have one registration in the container.

Check that the same token is not registered twice:

```ts
services.addSingleton('USER_SERVICE', () => {
  return new UserService()
})

// Do not register USER_SERVICE again.
```

If a module already registers the service, remove the duplicate application registration or use a different token.

### `Registration not found for token '...'`

The dependency has not been registered before it is resolved.

For example:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

requires `USER_REPOSITORY` to be registered:

```ts
services.addSingleton('USER_REPOSITORY', () => {
  return new UserRepository()
})
```

Check the token spelling and make sure the registration is part of the application configuration.

### `Scoped service '...' requires an active scope`

A scoped service cannot be resolved directly from the root container.

If the service is intentionally scoped, resolve it through an active `IServiceScope` instead.

If the service is intended to be application-wide, reconsider whether it should be registered as a singleton.

### `DI Captive Dependency Error`

This usually means a singleton is trying to resolve a scoped service:

```text
Singleton
    |
    v
Scoped service
```

Change the lifetime of the consuming service when it needs scope-specific state, or move the scoped dependency out of the singleton.

See [Captive Dependencies](../captive-dependencies).

### The singleton contains request-specific state

If the service stores data that belongs to an individual request, user, transaction, or operation, singleton lifetime is probably not appropriate.

Move that state into a scoped service or another request-specific abstraction.

## Singleton checklist

Before registering a service as singleton, verify:

* [ ] The service should have one instance for the container lifetime.
* [ ] The service is safe to share between scopes.
* [ ] The service does not store request-specific state.
* [ ] Its dependencies use compatible lifetimes.
* [ ] All dependency tokens are registered.
* [ ] The service is registered only once.
* [ ] Disposable resources are cleaned up when the container is disposed.

## Related docs

* [Dependency Injection](../overview)
* [Service Container](../service-container)
* [Registration](../registration)
* [Scoped](./scoped)
* [Transient](./transient)
* [Resolution](../resolution)
* [Dependency Graph](../dependency-graph)
* [Captive Dependencies](../captive-dependencies)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
