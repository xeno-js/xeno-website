---
title: "Service Container"
description: "Learn how the Xeno.JS Service Container manages dependency injection, service lifetimes, scopes, resolution, and application composition."
keywords: "Xeno.JS Service Container, TypeScript dependency injection, TypeScript DI, dependency injection Node.js, service container TypeScript, scoped services TypeScript, singleton dependency injection, transient services, explicit dependency injection"
canonical: "https://www.xeno-js.it/docs/fundamentals/service-container"
category: "Fundamentals"
tags:
- "dependency-injection"
- "service-container"
- "typescript"
- "nodejs"
- "architecture"
- "scopes"
- "ioc"
author: "Xeno.JS Team"
pubDate: 2026-10-01
type: "article"
---

## Service Container

The **Xeno.JS Service Container** is the runtime responsible for dependency injection and service composition.

It provides an explicit way to register, resolve, and manage application dependencies without relying on decorator-driven discovery or implicit dependency graphs.

At the center of the Xeno.JS architecture is a simple idea:

> **Dependencies should be explicit, composable, and controlled by the application composition root.**

The Service Container works together with the [`AppBuilder`](/docs/fundamentals/app-builder), modules, scopes, request context, and the [`Xeno Registry`](/docs/fundamentals/xeno-registry).

---

## What the Service Container does

The Service Container is responsible for:

* registering services;
* resolving dependencies;
* managing service lifetimes;
* creating scopes;
* caching singleton instances;
* creating scoped instances;
* creating transient instances;
* detecting circular dependencies;
* detecting captive dependencies;
* managing disposable services;
* providing framework services through explicit tokens.

Conceptually:

```text
AppBuilder
    │
    ▼
Service Registration
    │
    ▼
Service Container
    │
    ├── Singleton
    ├── Scoped
    └── Transient
    │
    ▼
Application Services
    │
    ▼
Domain / Infrastructure
```

The container is therefore not only a dependency lookup mechanism.

It is part of the application's composition model.

---

## Explicit dependency injection

Xeno.JS uses explicit registration.

For example:

```typescript
const app = new AppBuilder()
  .addServices((services) => {
    services.addSingleton(
      'USER_REPOSITORY',
      () => new UserRepository(),
    )

    services.addScoped(
      'USER_SERVICE',
      (container) =>
        new UserService(
          container.resolve('USER_REPOSITORY'),
        ),
    )
  })

const container = await app.build()
```

The dependency relationship is visible directly in the composition root.

There is no need to discover the relationship by inspecting decorators or scanning application classes.

This makes the dependency graph easier to reason about and change explicitly.

---

## Service lifetimes

Xeno.JS supports three primary service lifetimes:

* **Singleton**
* **Scoped**
* **Transient**

The lifetime determines how the container creates and reuses an instance.

### Singleton

A singleton is created once and reused by the container.

```typescript
services.addSingleton(
  'CONFIG',
  () => new AppConfig(),
)
```

Conceptually:

```text
Container
    │
    └── CONFIG
          │
          └── one instance
```

Singletons are useful for services whose state should be shared across the application lifetime, such as configuration or infrastructure clients that are designed to be reused.

---

### Scoped

A scoped service is created once within a scope and reused during that scope.

```typescript
services.addScoped(
  'USER_SERVICE',
  (container) =>
    new UserService(
      container.resolve('USER_REPOSITORY'),
    ),
)
```

Conceptually:

```text
Application
    │
    ├── Scope A
    │     └── USER_SERVICE
    │
    ├── Scope B
    │     └── USER_SERVICE
    │
    └── Scope C
          └── USER_SERVICE
```

Different scopes can therefore receive different instances of the same scoped service.

This is particularly important for request-oriented applications where dependencies should not be shared across independent executions.

---

### Transient

A transient service is created whenever it is resolved.

```text
Resolve A ──► Instance 1

Resolve A ──► Instance 2

Resolve A ──► Instance 3
```

Transient services are useful when an object should not be reused between resolutions.

---

## Why lifetimes are architectural

Service lifetime is not only a performance setting.

It defines how state can flow through an application.

For example:

```text
Singleton
    │
    └── Application-wide state

Scoped
    │
    └── Execution / request state

Transient
    │
    └── Per-resolution state
```

Choosing a lifetime therefore requires understanding whether a service contains:

* shared state;
* request-specific state;
* mutable state;
* external resources;
* disposable resources;
* dependencies with narrower lifetimes.

Xeno.JS also detects **captive dependencies**, helping prevent a service with a longer lifetime from incorrectly capturing a dependency with a shorter lifetime.

---

## Resolving dependencies

Dependencies can be resolved from the container:

```typescript
const repository = container.resolve(
  'USER_REPOSITORY',
)
```

A service can also resolve dependencies while it is being created:

```typescript
services.addScoped(
  'USER_SERVICE',
  (container) => {
    const repository =
      container.resolve('USER_REPOSITORY')

    return new UserService(repository)
  },
)
```

This keeps dependency construction in the composition layer rather than inside the service itself.

The application service receives what it needs:

```typescript
class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  // ...
}
```

The service does not need to know how `UserRepository` was constructed.

---

## Dependency graphs

The Service Container builds a runtime dependency graph.

For example:

```text
USER_CONTROLLER
       │
       ▼
USER_SERVICE
       │
       ▼
USER_REPOSITORY
       │
       ▼
USER_DATA_SOURCE
```

Each dependency can itself have dependencies.

The container resolves the graph from the registered definitions.

This makes the composition root the place where the application's infrastructure is assembled.

---

## Circular dependency detection

Circular dependencies can make an application difficult to initialize and reason about.

For example:

```text
Service A
   │
   ▼
Service B
   │
   ▼
Service A
```

Xeno.JS detects circular dependency chains during resolution rather than allowing an opaque initialization failure to propagate through the application.

When a dependency graph is invalid, the container can identify the resolution path involved in the failure.

---

## Captive dependency detection

A common dependency injection error occurs when a long-lived service captures a shorter-lived dependency.

For example:

```text
Singleton
   │
   ▼
Scoped Service
```

The scoped service cannot safely behave as request-specific state if it has been captured by a singleton.

Xeno.JS detects this class of lifetime mismatch.

This makes service lifetimes part of the container's architectural validation rather than merely configuration values.

---

## Scopes

A scope represents an isolated dependency resolution boundary.

Conceptually:

```text
Container
    │
    ├── Scope 1
    │     ├── Service A
    │     └── Service B
    │
    └── Scope 2
          ├── Service A
          └── Service B
```

Singleton services remain shared according to their lifetime.

Scoped services are isolated between scopes.

Transient services are recreated on resolution.

Scopes are especially useful when an execution needs its own state boundary.

---

## Request context

Xeno.JS can associate request execution with a context using asynchronous execution context.

This allows request-specific information to remain available while application code executes across different layers.

A typical execution can look like:

```text
HTTP Request
     │
     ▼
Request Context
     │
     ├── Identity
     ├── Request metadata
     ├── Correlation information
     └── Scoped services
     │
     ▼
Application Pipeline
     │
     ▼
Command / Query
     │
     ▼
Handler
```

The context is particularly useful for cross-cutting concerns such as authentication, authorization, logging, transactions, and request metadata.

Xeno's logging subsystem, for example, can enrich log entries with request-scoped context such as correlation or tenant information.

---

## Framework services

The Service Container is also used by Xeno.JS itself.

Framework capabilities can register services and expose them through framework tokens.

For example, cache implementations are registered into the container and application services can resolve the framework cache contract rather than coupling themselves to a concrete cache implementation.

The same model is used for other framework infrastructure such as logging and request context.

This gives the application a consistent dependency model:

```text
Application Service
       │
       ▼
Interface / Contract
       │
       ▼
Service Container
       │
       ▼
Concrete Implementation
```

For example:

```text
ICache
  │
  ├── InMemoryCache
  │
  └── RedisCache
```

The application can therefore depend on the contract rather than directly depending on Redis or another implementation.

---

## Service Container and AppBuilder

The Service Container is normally assembled through [`AppBuilder`](/docs/fundamentals/app-builder).

The builder collects the application's registrations and framework modules before building the container.

For example:

```typescript
const app = new AppBuilder()
  .addServices((services) => {
    services.addSingleton(
      'USER_REPOSITORY',
      () => new UserRepository(),
    )

    services.addScoped(
      'USER_SERVICE',
      (container) =>
        new UserService(
          container.resolve('USER_REPOSITORY'),
        ),
    )
  })

const container = await app.build()
```

The composition flow is:

```text
AppBuilder
    │
    ├── Framework modules
    ├── Application services
    ├── Infrastructure
    └── Custom modules
            │
            ▼
       build()
            │
            ▼
    Service Container
```

The `build()` operation creates the configured runtime container.

The application can then resolve its services from that container.

---

## Service Container and modules

Modules provide a way to organize service registration into architectural boundaries.

Instead of putting every service into a single composition root, an application can group registrations according to a feature or subsystem.

For example:

```text
Application
│
├── UsersModule
│   ├── UserService
│   └── UserRepository
│
├── OrdersModule
│   ├── OrderService
│   └── OrderRepository
│
└── BillingModule
    ├── BillingService
    └── PaymentGateway
```

Each module contributes its registrations to the application container.

This allows the Service Container to remain the central runtime composition mechanism while the application itself remains modular.

See [`Modules`](/docs/fundamentals/modules) for module composition.

---

## Type-safe service registration

When an application uses a [`Xeno Registry`](/docs/fundamentals/xeno-registry), service tokens can become part of an explicit type contract.

For example:

```typescript
const app = new AppBuilder<MyRegistry>()
```

The registry defines the application's known service mappings.

This provides a typed relationship between service identifiers and their implementations instead of treating the container as an untyped global lookup mechanism.

The result is a dependency graph that can be understood both at runtime and through TypeScript's type system.

---

## Disposable services

Some dependencies own resources that need to be released.

Examples include:

* database connections;
* network clients;
* file handles;
* event consumers;
* external resources.

Xeno.JS supports disposable services so that resources owned by the container can participate in application lifecycle management.

This is particularly important for infrastructure services whose lifetime is tied to the application or a scope.

---

## When should you use each lifetime?

A simple starting point is:

| Lifetime  | Use when                                                          |
| --------- | ----------------------------------------------------------------- |
| Singleton | The instance can safely be shared across the application lifetime |
| Scoped    | The instance belongs to an execution or request scope             |
| Transient | A new instance should be created for each resolution              |

For example:

```text
Configuration
     └── Singleton

Request Context
     └── Scoped

Application Service
     └── Scoped or Transient

Stateless Utility
     └── Transient
```

These are starting points rather than universal rules.

The correct lifetime depends on the state, dependencies, and resource ownership of each service.

---

## Best practices

### Keep registration in the composition root

Prefer:

```text
AppBuilder
    │
    └── Service registration
```

over having application services construct their own infrastructure dependencies.

### Depend on contracts

Prefer:

```typescript
class UserService {
  constructor(
    private readonly repository: IUserRepository,
  ) {}
}
```

over coupling application logic directly to a concrete infrastructure implementation.

### Choose lifetimes deliberately

Do not default every service to singleton.

Consider whether state belongs to:

* the entire application;
* one execution scope;
* one resolution.

### Avoid service locator patterns inside business logic

The container should primarily compose dependencies.

Application services should generally receive their dependencies rather than repeatedly resolving arbitrary services during business operations.

### Keep the container at the composition boundary

The Service Container belongs to application composition and infrastructure wiring.

Domain logic should not need to know that a dependency came from a Service Container.

---

## Service Container in the Xeno.JS architecture

The Service Container is one component of the larger Xeno.JS execution model:

```text
                    AppBuilder
                        │
                        ▼
                 Service Container
                        │
             ┌──────────┼──────────┐
             │          │          │
          Modules    Context    Services
             │          │          │
             └──────────┼──────────┘
                        ▼
                  Application
                        │
                ┌───────┴───────┐
                │               │
             Commands         Queries
                │               │
                └───────┬───────┘
                        ▼
                    Pipelines
                        │
                        ▼
                    Handlers
                        │
                        ▼
                     Domain
                        │
                        ▼
                 Infrastructure
```

The container provides the dependency boundary.

Scopes provide execution boundaries.

The context provides request/execution state.

AppBuilder provides the composition root.

Together, these pieces form the runtime foundation of a Xeno.JS application.

---

## Summary

The Xeno.JS Service Container provides explicit dependency injection with:

* Singleton, scoped, and transient lifetimes;
* dependency resolution;
* scopes;
* request context integration;
* circular dependency detection;
* captive dependency detection;
* disposable services;
* framework service registration;
* type-safe service contracts through the Xeno Registry.

The goal is not simply to provide an IoC container.

The goal is to make **application composition explicit**.

In a Xeno.JS application, dependencies, lifetimes, scopes, modules, and infrastructure are assembled deliberately at the composition boundary rather than being hidden behind implicit framework conventions.
