---
title: Captive Dependencies
description: Learn how to identify, fix, and prevent captive dependencies in Xeno.JS service registrations.
keywords:
- Xeno.JS
- dependency injection
- captive dependency
- singleton
- scoped
- service lifetime
- service container
- dependency graph
- TypeScript
tags:
- dependency-injection
- captive-dependencies
- lifetimes
- service-container
- typescript
faqs:
- question: What is a captive dependency in Xeno.JS?
  answer: A captive dependency occurs when a longer-lived service, such as a singleton, depends on a shorter-lived scoped service.
- question: Can a singleton depend on a scoped service in Xeno.JS?
  answer: No. Xeno.JS rejects resolving a scoped service from a singleton resolution context.
- question: What error does Xeno.JS throw for a captive dependency?
  answer: Xeno.JS throws a DI Captive Dependency Error and includes the resolution path.
- question: How do I fix a singleton-to-scoped dependency?
  answer: Change the dependent service to scoped or transient when appropriate, or redesign the dependency so the singleton does not directly depend on request-scoped state.
- question: Can a scoped service depend on a singleton?
  answer: Yes. A scoped service can use a singleton because the singleton has a lifetime that is at least as long as the scope.
- question: Can a transient service depend on a scoped service?
  answer: Yes, provided the transient service is resolved within an active scope.
- question: How do I find which dependency causes a captive dependency error?
  answer: Read the resolution path included in the DI Captive Dependency Error and inspect the corresponding service registrations.
- question: Does Xeno.JS detect every possible lifetime design problem?
  answer: Xeno.JS explicitly rejects singleton-to-scoped resolution, while other lifetime combinations should be evaluated according to the scope in which the service is resolved.
---

## Introduction

A **captive dependency** happens when a service with a longer lifetime holds or requires a dependency with a shorter lifetime.

The most important case in Xeno.JS is:

```text
Singleton
    ↓
Scoped
```

A singleton lives for the lifetime of the service container, while a scoped service belongs to a specific logical scope.

Xeno.JS prevents this combination during service resolution.

## When this problem occurs

You can encounter a captive dependency when you register a singleton that resolves a scoped service:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_CONTEXT'),
  )
})
```

If `REQUEST_CONTEXT` is registered as scoped, resolving `USER_SERVICE` requires the container to create a singleton that depends on a scoped instance.

That dependency is invalid because the singleton could outlive the scope that created the scoped dependency.

Xeno.JS detects this situation and throws a captive dependency error instead of allowing the invalid lifetime relationship.

## Understand the lifetime relationship

A useful way to reason about service lifetimes is:

```text
Longer lifetime
      │
      ▼
  Singleton
      │
      ▼
    Scoped
      │
      ▼
   Transient
Shorter lifetime
```

The important rule is not simply "never mix lifetimes".

The problem is that a longer-lived service must not capture a shorter-lived dependency.

For example:

```text
Singleton → Scoped
```

is invalid.

By contrast:

```text
Scoped → Singleton
```

is valid because the singleton remains available for the entire lifetime of the scope.

## How Xeno.JS detects the problem

Xeno.JS checks the lifetime of the service currently being created against the lifetime of the dependency being resolved.

When a singleton resolves a scoped service, the container throws:

```text
[DI Captive Dependency Error]: Attempted to resolve a scoped service 'REQUEST_CONTEXT' from a singleton context. This can lead to captive dependencies. Resolution path: USER_SERVICE -> REQUEST_CONTEXT
```

The exact token names and resolution path depend on your registrations.

The resolution path is useful because it tells you which dependency chain caused the problem.

For example:

```text
USER_SERVICE
    ↓
USER_REPOSITORY
    ↓
REQUEST_CONTEXT
```

If `USER_SERVICE` is a singleton and `REQUEST_CONTEXT` is scoped, the entire chain contains the problematic relationship.

## Fix a singleton that depends on a scoped service

The simplest solution is usually to change the dependent service to scoped.

### Before

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_CONTEXT'),
  )
})

services.addScoped('REQUEST_CONTEXT', () => {
  return new RequestContext()
})
```

This creates:

```text
USER_SERVICE [singleton]
       ↓
REQUEST_CONTEXT [scoped]
```

### After

```ts
services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_CONTEXT'),
  )
})

services.addScoped('REQUEST_CONTEXT', () => {
  return new RequestContext()
})
```

The dependency graph is now:

```text
USER_SERVICE [scoped]
       ↓
REQUEST_CONTEXT [scoped]
```

Both services belong to the same scope.

This is appropriate when `UserService` represents request-level or operation-level state.

## Keep the singleton when it should be application-wide

Sometimes the singleton is intentionally long-lived.

For example:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('REQUEST_CONTEXT'),
  )
})
```

If `UserService` genuinely needs request-specific state, changing the dependency to another lifetime may hide the underlying design problem.

Instead, remove the scoped dependency from the singleton.

For example, make the singleton depend only on long-lived services:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY_FACTORY'),
  )
})
```

Then provide request-specific dependencies at the operation boundary:

```text
Singleton
    │
    └── long-lived dependency

Request scope
    │
    ├── RequestContext
    ├── Repository
    └── UserService
```

The exact design depends on what the service actually needs, but the key requirement is the same: the singleton must not capture a scoped instance.

## Check indirect dependencies

The problem does not have to be directly visible in the registration.

For example:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})

services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('REQUEST_CONTEXT'),
  )
})

services.addScoped('REQUEST_CONTEXT', () => {
  return new RequestContext()
})
```

The graph is:

```text
USER_SERVICE [singleton]
       ↓
USER_REPOSITORY [scoped]
       ↓
REQUEST_CONTEXT [scoped]
```

The captive dependency is indirect.

When Xeno.JS reports the resolution path, use it to trace the registrations from the singleton to the scoped service.

## Valid lifetime combinations

The lifetime of the dependency matters relative to the lifetime of the service that consumes it.

### Singleton → Singleton

Valid:

```text
Singleton
    ↓
Singleton
```

Example:

```ts
services.addSingleton('CONFIGURATION', () => {
  return new Configuration()
})

services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('CONFIGURATION'),
  )
})
```

Both services can live for the lifetime of the container.

### Scoped → Singleton

Valid:

```text
Scoped
    ↓
Singleton
```

Example:

```ts
services.addSingleton('LOGGER', () => {
  return new Logger()
})

services.addScoped('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('LOGGER'),
  )
})
```

The scoped service can safely use the longer-lived singleton.

### Scoped → Scoped

Valid:

```text
Scoped
    ↓
Scoped
```

Both services are resolved within the same active scope.

```ts
services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('REQUEST_CONTEXT'),
  )
})

services.addScoped('REQUEST_CONTEXT', () => {
  return new RequestContext()
})
```

### Transient → Scoped

A transient service can depend on a scoped service when the transient is resolved inside an active scope:

```text
Transient
    ↓
Scoped
```

For example:

```ts
services.addScoped('REQUEST_CONTEXT', () => {
  return new RequestContext()
})

services.addTransient('USER_HELPER', (scope) => {
  return new UserHelper(
    scope.resolve('REQUEST_CONTEXT'),
  )
})
```

The transient receives the scoped instance belonging to the active scope.

## Avoid fixing the error by changing everything to singleton

A common workaround is to change the scoped dependency into a singleton:

```ts
services.addSingleton('REQUEST_CONTEXT', () => {
  return new RequestContext()
})
```

This may remove the lifetime error, but it can introduce a different application bug if `REQUEST_CONTEXT` contains request-specific state.

Instead, first determine what the dependency represents.

Use a scoped lifetime when the service contains state that belongs to a logical scope, such as:

* request-specific state
* transaction-specific state
* per-operation state
* contextual data

Use a singleton when the service is genuinely safe to share across the application's container lifetime.

## Use the active scope correctly

Scoped services must be resolved through an active `IServiceScope`.

For example:

```ts
const scope = container.createScope()

try {
  const userRepository = scope.resolve('USER_REPOSITORY')

  await userRepository.findById('123')
} finally {
  await scope.dispose()
}
```

Do not resolve a scoped dependency directly from the root container:

```ts
const userRepository = container.resolve('USER_REPOSITORY')
```

Xeno.JS rejects this with:

```text
[DI Container Error]: Scoped service 'USER_REPOSITORY' requires an active scope.
```

The captive dependency problem is different: it occurs when a singleton is being constructed and tries to resolve that scoped dependency.

## Diagnose a captive dependency error

When you see:

```text
[DI Captive Dependency Error]
```

check the following.

### 1. Find the singleton

Look at the first service in the resolution path.

For example:

```text
USER_SERVICE -> USER_REPOSITORY -> REQUEST_CONTEXT
```

If `USER_SERVICE` is registered as singleton, start there:

```ts
services.addSingleton('USER_SERVICE', ...)
```

### 2. Follow every `resolve()`

Inspect the registration:

```ts
services.addSingleton('USER_SERVICE', (scope) => {
  return new UserService(
    scope.resolve('USER_REPOSITORY'),
  )
})
```

Then inspect `USER_REPOSITORY`:

```ts
services.addScoped('USER_REPOSITORY', (scope) => {
  return new UserRepository(
    scope.resolve('REQUEST_CONTEXT'),
  )
})
```

You can reconstruct the dependency graph directly from the registration factories.

### 3. Check the lifetime of the dependency

Find the dependency registration:

```ts
services.addScoped('REQUEST_CONTEXT', ...)
```

If the chain starts from a singleton and eventually reaches a scoped service, you have the lifetime conflict.

### 4. Decide which lifetime represents the actual use case

Do not change a lifetime only to silence the error.

Ask:

* Should this service exist once for the application?
* Should it exist once per scope?
* Should a new instance be created on each resolution?
* Does it contain request-specific or transaction-specific state?

Then change the registration or dependency design accordingly.

## Complete example

The following example shows a valid scoped dependency graph:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

  .addServices((services) => {
    services.addSingleton('LOGGER', () => {
      return new Logger()
    })

    services.addScoped('REQUEST_CONTEXT', () => {
      return new RequestContext()
    })

    services.addScoped('USER_REPOSITORY', (scope) => {
      return new UserRepository(
        scope.resolve('REQUEST_CONTEXT'),
        scope.resolve('LOGGER'),
      )
    })

    services.addScoped('USER_SERVICE', (scope) => {
      return new UserService(
        scope.resolve('USER_REPOSITORY'),
        scope.resolve('LOGGER'),
      )
    })
  })

await app.build()
```

The resulting dependency graph is:

```text
USER_SERVICE [scoped]
    │
    ├── USER_REPOSITORY [scoped]
    │       │
    │       └── REQUEST_CONTEXT [scoped]
    │
    └── LOGGER [singleton]
```

This is valid because:

* `USER_SERVICE` is scoped.
* `USER_REPOSITORY` is scoped.
* `REQUEST_CONTEXT` is scoped.
* `LOGGER` is singleton.
* No singleton captures a scoped service.

## Common problems

### Singleton depends directly on scoped service

**Error:**

```text
[DI Captive Dependency Error]: Attempted to resolve a scoped service 'REQUEST_CONTEXT' from a singleton context.
```

**Check:**

```ts
services.addSingleton('MY_SERVICE', (scope) => {
  return new MyService(scope.resolve('REQUEST_CONTEXT'))
})
```

**Fix:**

Make `MY_SERVICE` scoped if it genuinely requires request-scoped state:

```ts
services.addScoped('MY_SERVICE', (scope) => {
  return new MyService(scope.resolve('REQUEST_CONTEXT'))
})
```

Or redesign the singleton so it does not retain the scoped dependency.

### Singleton indirectly depends on scoped service

**Graph:**

```text
Singleton
    ↓
Singleton
    ↓
Scoped
```

The dependency can be hidden several registrations deep.

**Fix:** follow the resolution path from the error and inspect each registration in the chain.

### Scoped service resolved without a scope

**Error:**

```text
[DI Container Error]: Scoped service 'USER_REPOSITORY' requires an active scope.
```

**Fix:**

Resolve the service through an active `IServiceScope`:

```ts
const scope = container.createScope()

try {
  const repository = scope.resolve('USER_REPOSITORY')
} finally {
  await scope.dispose()
}
```

### Changing a scoped service to singleton breaks request isolation

If a service contains request-specific state, do not change its lifetime to singleton simply to remove a captive dependency.

Keep the service scoped and adjust the dependent service instead.

## Checklist

When you encounter a captive dependency:

* [ ] Read the complete resolution path from the error.
* [ ] Find the singleton at the beginning of the dependency chain.
* [ ] Inspect each `scope.resolve(...)` in the chain.
* [ ] Find the scoped service that is being captured.
* [ ] Check whether the dependent service should actually be scoped.
* [ ] If the dependent service must remain singleton, remove its direct dependency on scoped state.
* [ ] Do not change a service to singleton merely to suppress the error.
* [ ] Verify that request and transaction isolation are preserved.
* [ ] Rebuild the application and resolve the dependency again.

## Related docs

* [Service Container](./service-container) — Learn where services are registered and resolved.
* [Registration](./registration) — Learn how to register services with explicit lifetimes.
* [Singleton](./lifetimes/singleton) — Learn how singleton services behave.
* [Scoped](./lifetimes/scoped) — Learn how scoped services behave.
* [Transient](./lifetimes/transient) — Learn how transient services behave.
* [Resolution](./resolution) — Learn how to resolve registered services.
* [Dependency Graph](./dependency-graph) — Learn how to model dependencies between services.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
