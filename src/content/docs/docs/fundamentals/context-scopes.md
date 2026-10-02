---
title: Context and Scopes
description: Learn how to access request context, user identity, and scoped services in Xeno.JS applications.
keywords:
- Xeno.JS context
- Xeno.JS scopes
- request context
- service scope
- scoped services
- ContainerUtils
- resolveServiceScoped
- UserContext
- dependency injection scope
tags:
- fundamentals
- context
- scopes
- dependency-injection
faqs:
- question: How do I access the current request context in Xeno.JS?
  answer: Resolve the context accessor and call getContext() to access the current RequestContext.
- question: How do I access the current service scope?
  answer: Resolve the SERVICE_SCOPE_ACCESSOR and call getScope() to retrieve the active service scope.
- question: How do I resolve a scoped service from the Xeno.JS container?
  answer: Use ContainerUtils.resolveServiceScoped() with the service token and application container while an active service scope exists.
- question: How do I register a scoped service?
  answer: Register it with container.addScoped() and resolve it through the active service scope.
- question: How do I access the current user identity?
  answer: Resolve the identity accessor and call getIdentity(), or use BaseHandler._getCurrentContext() when working inside a BaseHandler.
- question: Does Xeno.JS create a scope for each request?
  answer: Xeno.JS creates a service scope when a request context execution starts and disposes that scope when the execution completes.
- question: Can I resolve scoped services from the root container?
  answer: No. Scoped services must be resolved through an active service scope.
---

## Introduction

Xeno.JS uses **request context** and **service scopes** to make request-specific state and scoped dependencies available during an application execution.

Use this page when you need to:

* access the current request context;
* access the current user identity;
* resolve a scoped service from application code;
* work with `ContainerUtils.resolveServiceScoped()`;
* create or use a service scope explicitly;
* understand when scoped services are available;
* access context from commands, queries, handlers, or transport code.

## Before you start

You should already have:

* an [`AppBuilder`](./app-builder);
* services registered in the Xeno.JS container;
* an understanding of [Dependency Injection](./dependency-injection).

`AppBuilder` configures the context infrastructure automatically, so you normally do not need to register the request context yourself.

---

## Understand Context and Scopes

There are two related concepts:

### Request context

The request context stores information associated with the current application execution.

You can use it to access:

* the current `RequestContext`;
* the current user identity;
* the current service scope;
* the current network context.

### Service scope

A service scope provides the resolution boundary for scoped services.

A scoped service gets its own instance within a scope. Resolving the same scoped service again through that scope returns the instance associated with that scope.

Scoped services must be resolved through an active scope.

For example:

```ts
container.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('USER_DATA_SOURCE'),
  )
})
```

The service can then be resolved from the active scope.

---

## Access the Current Request Context

If you need the current `RequestContext`, resolve the context accessor:

```ts
const contextAccessor = app.resolve('CONTEXT_ACCESSOR')

const context = contextAccessor.getContext()
```

`getContext()` returns the current context when execution is running inside an active request context.

Outside an active context, it returns `undefined`.

Use the context accessor when application code needs request-specific information without receiving the context explicitly through every method call.

---

## Access the Current Identity

To access the current authenticated identity:

```ts
const identityAccessor = app.resolve('IDENTITY_ACCESSOR')

const identity = identityAccessor.getIdentity()
```

The result is `undefined` when there is no active identity.

You can also update the identity associated with the current context:

```ts
const contextAccessor = app.resolve('CONTEXT_ACCESSOR')

contextAccessor.updateIdentity(identity)
```

This updates the identity for the current context execution.

---

## Access User Context in a Handler

Handlers extending `BaseHandler` can access the current user context through `_getCurrentContext()`:

```ts
export class CreateUserHandler extends BaseHandler<
  CreateUserCommand,
  User
> {
  protected async executeAsync(
    request: CreateUserCommand,
  ): Promise<ResultType<User>> {
    const userContext = this._getCurrentContext()

    // Use the current user context here.

    return Result.ok({
      id: crypto.randomUUID(),
      email: request.email,
      name: request.name,
    })
  }
}
```

This is useful when the handler needs user-specific information as part of a use case.

For general request context access, use the context/accessor APIs. For handler-specific user context, use the `BaseHandler` API.

---

## Register a Scoped Service

Register services with scoped lifetime using `addScoped()`:

```ts
const app = new AppBuilder()
  .addServices((container) => {
    container.addScoped(
      'USER_REPOSITORY',
      (scope) => {
        return new UserRepository(
          scope.resolve('USER_DATA_SOURCE'),
        )
      },
    )
  })
```

A scoped service is associated with the active service scope.

This makes scoped lifetime useful for services that should share state during one application execution without becoming global singletons.

---

## Resolve a Scoped Service

There are two ways to work with a scoped service.

### Resolve directly from a service scope

If you already have the scope:

```ts
const scope = contextAccessor.getScope()

if (!scope) {
  throw new Error('An active service scope is required.')
}

const repository = scope.resolve('USER_REPOSITORY')
```

This is useful when your code already has access to `IServiceScope`.

### Resolve with `ContainerUtils.resolveServiceScoped()`

When you have the application container but want to resolve a service using the currently active scope, use `ContainerUtils.resolveServiceScoped()`.

```ts
import { ContainerUtils } from '@xeno-js/core'

const repository = ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  app,
)
```

`resolveServiceScoped()`:

1. gets the active service scope from the container's context;
2. requires an active scope;
3. resolves the requested service through that scope;
4. returns the scoped service instance.

This is particularly useful at integration boundaries where you have the application container available but do not want to manually retrieve the current scope.

For example, an HTTP entry point can resolve a scoped controller:

```ts
import { ContainerUtils } from '@xeno-js/core'

const controller = ContainerUtils.resolveServiceScoped(
  'FIND_USER_CONTROLLER',
  app,
)

const result = await controller.handle()
```

The important distinction is:

```ts
// Root container
app.resolve('USER_REPOSITORY')
```

versus:

```ts
// Active scope
ContainerUtils.resolveServiceScoped(
  'USER_REPOSITORY',
  app,
)
```

A scoped service belongs to the active scope, so it must not be resolved directly from the root container.

If no active scope exists, `resolveServiceScoped()` throws an error indicating that an active service scope is required.

---

## Use a Scope in a Service

If a factory receives a service scope, resolve its dependencies from that scope:

```ts
container.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
    scope.resolve('LOGGER'),
  )
})
```

This keeps dependency resolution inside the lifetime boundary of the service being created.

You do not need to manually create a scope just to resolve dependencies in a normal DI factory.

---

## Scoped Service Lifetime

A scoped service is cached within its service scope.

For example:

```ts
container.addScoped('REQUEST_STATE', () => {
  return new RequestState()
})
```

Within the same scope:

```ts
const first = scope.resolve('REQUEST_STATE')
const second = scope.resolve('REQUEST_STATE')
```

`first` and `second` refer to the same scoped instance.

A different scope gets a different instance.

When the scope is disposed, its scoped services are disposed as part of the scope lifecycle when they support disposal.

---

## Singleton, Scoped, and Transient

Xeno.JS supports three common service lifetimes:

| Lifetime  | Instance behavior                          |
| --------- | ------------------------------------------ |
| Singleton | One instance for the application container |
| Scoped    | One instance per service scope             |
| Transient | A new instance for each resolution         |

Use scoped lifetime when a service should live for the duration of an application execution and share its instance with other services resolved from that scope.

For example:

```ts
container.addSingleton('CONFIGURATION_SERVICE', () => {
  return new ConfigurationService()
})

container.addScoped('UNIT_OF_WORK', (scope) => {
  return new UnitOfWork(
    scope.resolve('DB_CONTEXT'),
  )
})

container.addTransient('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

See [Dependency Injection](./dependency-injection) for registration and lifetime details.

---

## Create a Scope Manually

You can create a service scope directly from the service container:

```ts
const scope = app.createScope()

try {
  const service = scope.resolve('USER_SERVICE')

  await service.execute()
} finally {
  await scope.dispose()
}
```

Always dispose manually created scopes when they are no longer needed.

Manual scopes are useful for application executions that are not already running inside an existing request context.

---

## Use the Scope Factory

When your code needs to create scopes through dependency injection, use the scope factory provided by Xeno.JS.

The factory creates a new service scope:

```ts
const scope = scopeFactory.create()

try {
  const service = scope.resolve('USER_SERVICE')

  await service.execute()
} finally {
  await scope.dispose()
}
```

Prefer the existing application/request scope when one is already active. Create a new scope only when the execution boundary requires one.

---

## Run Code with a Request Context

`IRequestContext.runAsync()` establishes the context and service scope for an asynchronous execution:

```ts
const requestContext = app.resolve('REQUEST_CONTEXT')

const result = await requestContext.runAsync(
  requestContextData,
  async () => {
    const service = ContainerUtils.resolveServiceScoped(
      'USER_SERVICE',
      app,
    )

    return await service.execute()
  },
)
```

During the callback:

* the request context is available;
* the service scope is available;
* scoped services can be resolved;
* context accessors can retrieve the current context and scope.

When the callback completes, the scope is disposed.

This makes `runAsync()` the appropriate boundary when you need to execute code with a request context outside an already established execution.

---

## Update the Current Identity

If authentication or another application boundary establishes a new identity during execution, update the current context:

```ts
const requestContext = app.resolve('REQUEST_CONTEXT')

requestContext.updateIdentity(identity)
```

Subsequent context and identity access within the same execution can observe the updated identity.

---

## Access Network Context

Network information associated with the current request can be accessed through the request context:

```ts
const requestContext = app.resolve('REQUEST_CONTEXT')

const networkContext = requestContext.getNetworkContext()
```

The value is available only when the current execution has an associated network context.

Use this API when application or infrastructure code needs request network metadata rather than accessing transport-specific request objects directly.

---

## Context Outside an Active Execution

Context accessors are safe to call when no execution context is active.

For example:

```ts
const context = contextAccessor.getContext()

if (!context) {
  // No active context.
}
```

Similarly:

```ts
const scope = contextAccessor.getScope()

if (!scope) {
  // No active service scope.
}
```

`ContainerUtils.resolveServiceScoped()` behaves differently: it requires an active scope and throws when one is not available.

This distinction is important:

```ts
// Optional access
const scope = contextAccessor.getScope()

// Required scoped resolution
const service = ContainerUtils.resolveServiceScoped(
  'USER_SERVICE',
  app,
)
```

Use the accessor when absence is a valid condition. Use `resolveServiceScoped()` when the operation requires a scoped service.

---

## Context in Background Jobs

Background jobs do not necessarily start inside an existing request context.

If a job needs scoped services, establish an execution boundary before resolving them.

For example:

```ts
const requestContext = app.resolve('REQUEST_CONTEXT')

await requestContext.runAsync(
  backgroundContext,
  async () => {
    const service = ContainerUtils.resolveServiceScoped(
      'USER_SERVICE',
      app,
    )

    await service.execute()
  },
)
```

This gives the job its own service scope and ensures the scope is disposed when the execution finishes.

Do not rely on a request scope remaining available after the request execution has completed.

---

## Context in Commands and Queries

Commands and queries normally execute inside an application scope established by the surrounding execution.

Handlers can therefore use their injected dependencies normally:

```ts
export class FindUserHandler extends BaseHandler<
  FindUserQuery,
  User
> {
  constructor(
    userContextFactory: UserContextFactory,
    private readonly userRepository: IUserRepository,
  ) {
    super(userContextFactory)
  }

  protected async executeAsync(
    request: FindUserQuery,
  ): Promise<ResultType<User>> {
    const userContext = this._getCurrentContext()

    return this.userRepository.findById(
      request.userId,
      userContext,
    )
  }
}
```

For handlers, prefer constructor injection for declared dependencies.

Use `ContainerUtils.resolveServiceScoped()` mainly at integration or composition boundaries where you have the application container and need to resolve a service from the currently active scope.

See:

* [Creating Commands](../application/cqrs/command)
* [Creating Queries](../application/cqrs/query)
* [Creating and Registering Handlers](../application/cqrs/handler)

---

## When to Use `ContainerUtils.resolveServiceScoped()`

`ContainerUtils.resolveServiceScoped()` is especially useful when application code sits at the boundary between a transport and the Xeno.JS application layer.

For example:

```ts
const controller = ContainerUtils.resolveServiceScoped(
  'FIND_USER_CONTROLLER',
  app,
)

return await controller.handle()
```

This avoids manually retrieving the current scope:

```ts
const scope = app
  .resolve('SERVICE_SCOPE_ACCESSOR')
  .getScope()

if (!scope) {
  throw new Error('An active service scope is required.')
}

const controller = scope.resolve(
  'FIND_USER_CONTROLLER',
)
```

Both approaches resolve through the active scope. `ContainerUtils.resolveServiceScoped()` is the shorter public utility for this common case.

---

## Troubleshooting

### `Active service scope is required to execute Scoped service`

You called `ContainerUtils.resolveServiceScoped()` without an active service scope.

Check that the code runs inside an established request/context execution:

```ts
await requestContext.runAsync(
  context,
  async () => {
    const service = ContainerUtils.resolveServiceScoped(
      'USER_SERVICE',
      app,
    )

    await service.execute()
  },
)
```

If the code is already inside a request execution, verify that the request/context middleware has established the Xeno.JS context before the service is resolved.

### Scoped service cannot be resolved from the root container

Do not resolve a scoped service directly from the root container:

```ts
// Incorrect for a scoped service
app.resolve('USER_SERVICE')
```

Use an active scope:

```ts
ContainerUtils.resolveServiceScoped(
  'USER_SERVICE',
  app,
)
```

or:

```ts
scope.resolve('USER_SERVICE')
```

### `getScope()` returns `undefined`

There is no active request/service context at the point where the accessor is called.

Check the execution boundary and establish a context when the operation requires scoped services.

### Service registration is missing

If the scope exists but the requested token is not registered, normal container resolution fails.

Verify that the service is registered before the application is built:

```ts
const app = new AppBuilder()
  .addServices((container) => {
    container.addScoped(
      'USER_SERVICE',
      (scope) => {
        return new UserService(
          scope.resolve('USER_REPOSITORY'),
        )
      },
    )
  })

await app.build()
```

### Scope has already been disposed

A service scope is valid only during its lifetime.

Do not keep a scope or scoped service and use it after the scope has completed.

For asynchronous work, keep the work inside the execution that owns the scope.

---

## Best Practices

### Use dependency injection for handler dependencies

Prefer:

```ts
constructor(
  private readonly userRepository: IUserRepository,
) {}
```

over resolving application dependencies dynamically inside the handler.

### Use `resolveServiceScoped()` at application boundaries

`ContainerUtils.resolveServiceScoped()` is useful when a transport, adapter, or other boundary has access to the application container and needs a service from the active scope.

### Do not resolve scoped services from the root container

Always use an active scope for scoped dependencies.

### Do not manually create scopes unnecessarily

If Xeno.JS already established a scope for the current execution, reuse it.

### Dispose manually created scopes

If you create a scope yourself, always dispose it:

```ts
const scope = app.createScope()

try {
  // Work with the scope.
} finally {
  await scope.dispose()
}
```

### Keep context access transport-independent

Application code should consume context and identity through Xeno.JS APIs rather than depending directly on Fastify, Express, or another transport's request object.

---

## Context and Scopes Checklist

Before shipping context-dependent code, verify:

* [ ] scoped services are registered with `addScoped()`;
* [ ] scoped services are resolved through an active scope;
* [ ] `ContainerUtils.resolveServiceScoped()` is used when resolving from the application container at a boundary;
* [ ] request context exists before resolving scoped services;
* [ ] context accessors handle `undefined` when no context is expected;
* [ ] manually created scopes are disposed;
* [ ] scoped services are not used after their scope is disposed;
* [ ] handlers use dependency injection for their declared dependencies;
* [ ] transport-specific request objects do not leak into application services unnecessarily.

---

## Related Documentation

* [Fundamentals Overview](./overview)
* [Dependency Injection](./dependency-injection)
* [App Builder](./app-builder)
* [Creating Commands](../application/cqrs/command)
* [Creating Queries](../application/cqrs/query)
* [Creating and Registering Handlers](../application/cqrs/handler)
* [Application Overview](../application/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
