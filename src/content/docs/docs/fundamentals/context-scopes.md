---
title: Context and Scopes
description: Learn how to access request context, user identity, and scoped services in Xeno.JS applications.
keywords:
- Xeno.JS context
- Xeno.JS scopes
- request context
- service scope
- scoped services
- getScopedServices
- runInScope
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
  answer: Use getScopedServices() to access registered services through the active scope, or getServices().serviceScopeAccessor.getScope() to retrieve the scope itself.
- question: How do I resolve a scoped service from the Xeno.JS container?
  answer: Use getScopedServices() while a scope is active, or runInScope() to create a scope for an operation.
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

- access the current request context;
- access the current user identity;
- resolve a scoped service from application code;
- use `getScopedServices()` or `runInScope()`;
- create or use a service scope explicitly;
- understand when scoped services are available;
- access context from commands, queries, handlers, or transport code.

## Before you start

You should already have:

- an [`XenoAppBuilder`](./app-builder);
- services registered in the Xeno.JS container;
- an understanding of [Dependency Injection](./dependency-injection).

With the Node configuration service, `XenoAppBuilder` adds the default context module during `build()` when none has been configured. With the Vite configuration service, configure a context plugin explicitly.

After `build()`, use the returned `XenoApplication` to access services. `getServices()` resolves root services, `getScopedServices()` resolves services through the active scope, and `runInScope()` runs an operation in a new scope.

In the examples below, `application` refers to the value returned by `await builder.build()`. The service proxy exposes registry keys as properties. For example, the built-in logger key is `logger`, so it can be accessed by its registry name or by the token value:

```ts
import { TOKENS } from '@xeno-js/shared'

const { logger } = application.getServices()
const loggerByToken = application.getServices().LOGGER
```

---

## Understand Context and Scopes

There are two related concepts:

### Request context

The request context stores information associated with the current application execution.

You can use it to access:

- the current `RequestContext`;
- the current user identity;
- the current service scope;
- the current network context.

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
const { contextAccessor } = application.getServices()

const context = contextAccessor.getContext()
```

`getContext()` returns the current context when execution is running inside an active request context.

Outside an active context, it returns `undefined`.

Use the context accessor when application code needs request-specific information without receiving the context explicitly through every method call.

---

## Access the Current Identity

To access the current authenticated identity:

```ts
const { identityAccessor } = application.getServices()

const identity = identityAccessor.getIdentity()
```

The result is `undefined` when there is no active identity.

You can also update the identity associated with the current context:

```ts
const {requestContext} = application.getServices()

requestContext.updateIdentity(identity)
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
const app = new XenoAppBuilder()
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

Use the application returned by `build()` to resolve scoped services.

### Resolve through the active scope

When a request or another execution has already established a scope, use `getScopedServices()`:

```ts
const { USER_REPOSITORY: repository } = application.getScopedServices()
```

`getScopedServices()` throws if there is no active scope. It returns the registered services through that scope; the property names are the keys in the application registry.

### Start a new scoped operation

For work outside an existing request or execution, use `runInScope()`. The callback receives the services resolved through the new scope:

```ts
const result = await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
  // Use the repository within this scope.
})
```

`runInScope()` creates the request context and service scope for the operation, then disposes the scope when the operation completes. Use `getScopedServices()` inside an existing active scope; use `runInScope()` when the operation needs its own scope.

---

## Use a Scope in a Service

If a factory receives a service scope, resolve its dependencies from that scope:

```ts
container.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
    scope.resolve(TOKENS.LOGGER),
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
    scope.resolve(TOKENS.DB_CONTEXT),
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

The `XenoApplication` returned by `build()` does not expose the container's `createScope()` method. Use `runInScope()` to create and dispose a scope for application work:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
  // Use the service within this scope.
})
```

Use this for executions that are not already running inside an existing request context.

---

## Use `runInScope()`

`runInScope()` creates the request context and service scope, passes the scoped services proxy to the callback, and disposes the scope when the callback completes:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
  // Use the service within this scope.
})
```

Prefer the existing application/request scope when one is already active. Start a new scope only when the execution boundary requires one.

---

## Run Code with a Request Context

Use `runInScope()` to establish a context and service scope for an asynchronous execution:

```ts
const result = await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
  // Run the operation that uses the service.
})
```

During the callback:

- the request context is available;
- the service scope is available;
- scoped services can be resolved;
- context accessors can retrieve the current context and scope.

When the callback completes, the scope is disposed.

Use `IRequestContext.runAsync()` when working directly with the request-context contract; for application code, `runInScope()` provides the scope and services together.

---

## Update the Current Identity

If authentication or another application boundary establishes a new identity during execution, update the current context:

```ts
const {requestContext} = application.getServices()

requestContext.updateIdentity(identity)
```

Subsequent context and identity access within the same execution can observe the updated identity.

---

## Access Network Context

Network information associated with the current request can be accessed through the request context:

```ts
const {networkContextAccessor} = application.getServices()

const networkContext = networkContextAccessor.getNetworkContext()
```

The value is available only when the current execution has an associated network context.

Use this API when application or infrastructure code needs request network metadata rather than accessing transport-specific request objects directly.

---

## Context Outside an Active Execution

Context accessors are safe to call when no execution context is active.

For example:

```ts
const context = application.getServices().contextAccessor.getContext()

if (!context) {
  // No active context.
}
```

Similarly:

```ts
const scope = application.getServices().serviceScopeAccessor.getScope()

if (!scope) {
  // No active service scope.
}
```

`getScopedServices()` behaves differently: it requires an active scope and throws when one is not available.

This distinction is important:

```ts
// Optional access
const scope = application.getServices().serviceScopeAccessor.getScope()

// Required scoped resolution
const service = application.getScopedServices().USER_SERVICE
```

Use the accessor when absence is a valid condition. Use `getScopedServices()` when the operation requires a scoped service in an existing scope, or `runInScope()` when it must create one.

---

## Context in Background Jobs

Background jobs do not necessarily start inside an existing request context.

If a job needs scoped services, establish an execution boundary before resolving them.

For example:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
  // Run the background operation using this scoped service.
})
```

This gives the job its own request context and service scope, and disposes the scope when the execution finishes.

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

Use `getScopedServices()` at integration or composition boundaries when an execution has already established the scope.

See:

- [Creating Commands](../application/cqrs/command)
- [Creating Queries](../application/cqrs/query)
- [Creating and Registering Handlers](../application/cqrs/handler)

---

## When to Use `getScopedServices()`

`getScopedServices()` is useful when application code sits at the boundary between a transport and the Xeno.JS application layer and needs a service from the active scope.

For example:

```ts
const controller = application.getScopedServices().FIND_USER_CONTROLLER

// Use the controller within the active scope.
```

This method requires an active scope. For work outside an existing scope, use `runInScope()` instead.

---

## Troubleshooting

### `Active service scope is required to execute Scoped service`

You called `getScopedServices()` without an active service scope.

Use `runInScope()` when the operation needs to create its own scope:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
  // Run the operation using this scoped service.
})
```

If the code is already inside a request execution, verify that the request/context middleware has established the Xeno.JS context before the service is resolved.

### Scoped service cannot be resolved from the root container

Do not resolve a scoped service directly from the root container:

```ts
// Incorrect for a scoped service
application.getServices().USER_SERVICE
```

Use an active scope or create one for the operation:

```ts
application.getScopedServices().USER_SERVICE
```

or:

```ts
await application.runInScope(async (services) => {
  const service = services.USER_SERVICE
  // Run the operation using this scoped service.
})
```

### `getScope()` returns `undefined`

There is no active request/service context at the point where the accessor is called.

Check the execution boundary and establish a context when the operation requires scoped services.

### Service registration is missing

If the scope exists but the requested token is not registered, normal container resolution fails.

Verify that the service is registered before the application is built:

```ts
const app = new XenoAppBuilder()
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

### Use `getScopedServices()` or `runInScope()` at application boundaries

Use `getScopedServices()` when a transport, adapter, or other boundary is already running in a scope. Use `runInScope()` when the operation needs a new scope.

### Do not resolve scoped services from the root container

Always use an active scope for scoped dependencies.

### Do not manually create scopes unnecessarily

If Xeno.JS already established a scope for the current execution, reuse it.

### Let `runInScope()` manage the scope lifetime

`runInScope()` disposes the scope when the callback completes. Keep scoped-service work inside that callback.

### Keep context access transport-independent

Application code should consume context and identity through Xeno.JS APIs rather than depending directly on Fastify, Express, or another transport's request object.

---

## Context and Scopes Checklist

Before shipping context-dependent code, verify:

- [ ] scoped services are registered with `addScoped()`;
- [ ] scoped services are resolved through an active scope;
- [ ] `getScopedServices()` is used only when an active scope exists;
- [ ] `runInScope()` is used to create a scope for work outside an existing execution;
- [ ] request context exists before resolving scoped services;
- [ ] context accessors handle `undefined` when no context is expected;
- [ ] scoped-service work completes before the `runInScope()` callback returns;
- [ ] scoped services are not used after their scope is disposed;
- [ ] handlers use dependency injection for their declared dependencies;
- [ ] transport-specific request objects do not leak into application services unnecessarily.

---

## Related Documentation

- [Fundamentals Overview](./overview)
- [Dependency Injection](./dependency-injection)
- [App Builder](./app-builder)
- [Creating Commands](../application/cqrs/command)
- [Creating Queries](../application/cqrs/query)
- [Creating and Registering Handlers](../application/cqrs/handler)
- [Application Overview](../application/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
