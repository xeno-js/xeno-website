---

title: Service Lifetimes
description: Understand singleton, scoped, and transient service lifetimes in Xeno.JS and how they interact with dependency injection and service scopes.
---------------------------------------------------------------------------------------------------------------------------------------------------------

# Service Lifetimes

Xeno.JS supports three service lifetimes:

* **Singleton** — one instance for the lifetime of the service container.
* **Scoped** — one instance per service scope.
* **Transient** — a new instance every time the service is resolved.

Service lifetimes are part of the dependency injection model and determine **how long a resolved service instance remains alive and which other services it can safely depend on**.

```text
Service Container
│
├── Singleton
│   └── one instance
│       └── shared across the application
│
├── Scoped
│   └── one instance per scope
│       └── shared inside that scope
│
└── Transient
    └── new instance per resolution
```

## Why lifetimes matter

A service lifetime is not just an optimization.

It defines the ownership and reuse semantics of a dependency.

For example:

* a configuration service is usually shared;
* a request-specific context should not leak between requests;
* a lightweight stateless service may be created whenever it is needed;
* a database unit of work may need to remain consistent within one execution scope.

Choosing the lifetime therefore affects:

* state sharing;
* isolation;
* resource ownership;
* disposal;
* dependency compatibility;
* request and execution boundaries.

## Singleton

A singleton service has one instance associated with the root service container.

Register it with `addSingleton`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addSingleton(
      'CONFIGURATION_SERVICE',
      () => new ConfigurationService(),
    )
  })

const container = await app.build()
```

Resolving the service repeatedly returns the same instance:

```ts
const first = container.resolve('CONFIGURATION_SERVICE')
const second = container.resolve('CONFIGURATION_SERVICE')

console.log(first === second)
// true
```

### When to use singleton

Singletons are appropriate for services whose state can safely be shared across the application.

Typical examples include:

* configuration;
* application-wide infrastructure;
* stateless clients;
* caches;
* logging infrastructure.

A singleton should not contain state that is specific to a single request, user, or execution scope.

### Singleton lifetime

Conceptually:

```text
Application
│
└── Root Container
    │
    └── Singleton
        └── Instance A
             │
             ├── Scope 1
             ├── Scope 2
             └── Scope 3
```

All scopes see the same singleton instance.

---

## Scoped

A scoped service has one instance per service scope.

Register it with `addScoped`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped(
      'USER_CONTEXT',
      (scope) => new UserContext(scope),
    )
  })
```

Create a scope before resolving the service:

```ts
const container = await app.build()

const scope = container.createScope()

const first = scope.resolve('USER_CONTEXT')
const second = scope.resolve('USER_CONTEXT')

console.log(first === second)
// true
```

The same service resolved from another scope is a different instance:

```ts
const firstScope = container.createScope()
const secondScope = container.createScope()

const first = firstScope.resolve('USER_CONTEXT')
const second = secondScope.resolve('USER_CONTEXT')

console.log(first === second)
// false
```

The lifetime can therefore be represented as:

```text
Root Container
│
├── Scope 1
│   └── Scoped Service → Instance A
│
├── Scope 2
│   └── Scoped Service → Instance B
│
└── Scope 3
    └── Scoped Service → Instance C
```

Each scope owns its own scoped instances.

### When to use scoped services

Scoped services are useful when state must be shared during one execution boundary but isolated from other executions.

Examples include:

* request context;
* unit of work;
* transaction state;
* user-specific execution state;
* other stateful services whose lifetime should follow an execution scope.

The important concept is not specifically "HTTP request".

A scope can represent any execution boundary that needs isolated dependency state.

## Scoped resolution

A scoped service requires an active scope.

Conceptually:

```ts
const container = await app.build()

const scope = container.createScope()

const service = scope.resolve('USER_SERVICE')
```

The root container should not be treated as an execution scope for scoped dependencies.

This distinction allows Xeno.JS to keep scoped state isolated instead of turning it into application-wide state.

---

## Transient

A transient service receives a new instance whenever it is resolved.

Register it with `addTransient`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addTransient(
      'USER_SERVICE',
      (scope) => new UserService(
        scope.resolve('USER_REPOSITORY'),
      ),
    )
  })
```

Multiple resolutions create different instances:

```ts
const first = scope.resolve('USER_SERVICE')
const second = scope.resolve('USER_SERVICE')

console.log(first === second)
// false
```

The lifetime looks like:

```text
Scope
│
├── resolve()
│   └── Instance A
│
├── resolve()
│   └── Instance B
│
└── resolve()
    └── Instance C
```

### When to use transient services

Transient is useful when the service:

* has little or no internal state;
* is inexpensive to construct;
* should not be shared;
* represents a short-lived operation or object.

Transient does not mean "request scoped".

A transient can be resolved multiple times inside the same scope and each resolution may produce a new instance.

---

## Comparing lifetimes

| Lifetime  | Instance reuse             | Scope-dependent                               | Typical purpose                   |
| --------- | -------------------------- | --------------------------------------------- | --------------------------------- |
| Singleton | Application/container-wide | No                                            | Shared application infrastructure |
| Scoped    | Within one scope           | Yes                                           | Execution-specific state          |
| Transient | None                       | Resolution occurs through a scope when needed | Short-lived services              |

A useful mental model is:

```text
Singleton
    │
    └── shared everywhere

Scoped
    │
    ├── Scope A → instance A
    ├── Scope B → instance B
    └── Scope C → instance C

Transient
    │
    ├── resolve → instance A
    ├── resolve → instance B
    └── resolve → instance C
```

---

# Lifetimes and dependencies

Lifetimes become particularly important when one service depends on another service.

Consider:

```text
UserService
    │
    └── UserRepository
```

The lifetime of `UserRepository` must be compatible with the lifetime of `UserService`.

For example, if both are scoped:

```text
Scope
│
├── UserService
│
└── UserRepository
```

both belong to the same execution scope.

## Captive dependencies

A **captive dependency** occurs when a longer-lived service captures a shorter-lived service.

For example:

```text
Singleton
   │
   └── Scoped Service
```

The singleton would retain a dependency that is supposed to belong to an individual scope.

That can cause scope-specific state to effectively escape its intended lifetime.

Xeno.JS detects this kind of lifetime mismatch during dependency resolution.

The safest rule is:

> A service should not retain a dependency whose lifetime is shorter than its own.

Conceptually:

```text
Singleton
  ├── Singleton       ✓
  ├── Transient       ✓*
  └── Scoped          ✗

Scoped
  ├── Singleton       ✓
  ├── Scoped          ✓
  └── Transient       ✓*

Transient
  ├── Singleton       ✓
  ├── Scoped          ✓
  └── Transient       ✓
```

`*` The exact runtime behavior also depends on how the dependency is resolved and retained. The important invariant is that a longer-lived object must not capture shorter-lived scoped state.

---

# Lifetimes and explicit dependency injection

Xeno.JS uses explicit factory-based dependency injection.

A registration receives a service scope:

```ts
services.addScoped(
  'USER_SERVICE',
  (scope) => {
    const repository = scope.resolve('USER_REPOSITORY')

    return new UserService(repository)
  },
)
```

The factory is therefore where the dependency graph is assembled.

This makes lifetime relationships visible in the registration itself:

```text
USER_SERVICE
    │
    └── USER_REPOSITORY
```

and:

```text
addScoped(USER_SERVICE)
        │
        └── resolve(USER_REPOSITORY)
```

This is one reason Xeno.JS does not need decorator metadata or reflection to determine how dependencies should be constructed.

---

# Lifetimes and scopes

A service scope is an execution context for scoped dependencies.

```ts
const scope = container.createScope()
```

Within that scope:

```ts
const first = scope.resolve('USER_SERVICE')
const second = scope.resolve('USER_SERVICE')
```

A scoped service is reused:

```text
Scope A
│
├── resolve(USER_SERVICE)
│       └── UserService A
│
└── resolve(USER_SERVICE)
        └── UserService A
```

A new scope gets a different instance:

```text
Scope A                 Scope B
│                       │
└── UserService A       └── UserService B
```

This gives Xeno.JS a clean mechanism for isolating execution-specific state without making that state globally accessible.

---

# Lifetimes and request execution

HTTP is one possible source of execution scopes, but scopes are not fundamentally tied to HTTP.

For example, an application can conceptually execute:

```text
HTTP request
    │
    └── Service Scope
         ├── Request Context
         ├── User Context
         ├── Unit of Work
         └── Application Services
```

The same architecture can be used for another entry point:

```text
CLI command
    │
    └── Service Scope
```

or:

```text
Background job
    │
    └── Service Scope
```

This is important for applications with multiple entry points.

The lifetime model belongs to the application runtime rather than to a specific transport.

---

# Async execution and scope context

Xeno.JS uses asynchronous execution context internally to support contextual dependency resolution.

This allows execution-specific information to remain associated with the active scope while asynchronous operations continue.

Conceptually:

```text
Execution
│
├── Scope
│   │
│   ├── Service A
│   ├── Service B
│   └── Context
│
└── async operations
        │
        └── same execution context
```

This is particularly useful when application services, pipelines, middleware, and other infrastructure participate in the same execution.

The important distinction is:

* **scope** defines the lifetime boundary;
* **async execution context** helps preserve that execution context across asynchronous work.

---

# Lifetimes and disposal

Some services own resources that need cleanup.

The lifetime of such a service should correspond to the lifetime of the resource it owns.

For example:

```text
Scope
│
└── Unit of Work
     │
     └── database resources
```

When the corresponding scope ends, disposable services can participate in the cleanup lifecycle.

This is one reason lifetime selection should consider **resource ownership**, not only object reuse.

A service that owns a resource should not casually be registered with a lifetime that outlives that resource.

---

# Choosing a lifetime

When registering a service, ask these questions:

### 1. Should every execution share the same instance?

If yes, consider **singleton**.

```text
Application-wide state
        ↓
    Singleton
```

### 2. Should the service be shared only inside one execution scope?

If yes, consider **scoped**.

```text
Execution
    ↓
  Scoped
```

### 3. Should every resolution create a new instance?

If yes, consider **transient**.

```text
Resolution
    ↓
 Transient
```

### 4. Does the service contain mutable state?

If yes, carefully consider whether that state should be:

* application-wide;
* scope-specific;
* or isolated per resolution.

### 5. Does the service own a resource?

If yes, choose a lifetime that matches the resource's ownership boundary.

### 6. What are its dependencies?

Always consider the dependency graph, not only the service itself.

---

# Common patterns

## Application-wide infrastructure

```ts
services.addSingleton(
  'LOGGER',
  () => new Logger(),
)
```

The logger can be shared across the application.

## Request or execution state

```ts
services.addScoped(
  'REQUEST_CONTEXT',
  (scope) => new RequestContext(scope),
)
```

Each execution receives its own context.

## Short-lived application service

```ts
services.addTransient(
  'USER_SERVICE',
  (scope) =>
    new UserService(
      scope.resolve('USER_REPOSITORY'),
    ),
)
```

Each resolution creates a new service instance.

---

# Lifetime mistakes to avoid

## Making request-specific state singleton

Avoid:

```text
Singleton
    │
    └── Request-specific state
```

This can turn isolated execution state into shared application state.

Prefer:

```text
Scope
    │
    └── Request-specific state
```

## Treating transient as scoped

A transient service is not automatically reused within a scope.

If two parts of the same scope need the same instance, the service generally belongs in the scoped lifetime.

## Using scoped services from the root container

Scoped services require a scope.

Create an execution scope before resolving scoped dependencies.

## Ignoring dependency lifetimes

Always inspect the complete dependency graph:

```text
A
└── B
    └── C
```

The lifetime of `A` must be considered together with the lifetimes of `B` and `C`.

---

# Lifetime decision tree

A practical decision process is:

```text
Does the instance need application-wide sharing?
│
├── Yes → Singleton
│
└── No
    │
    Does it need to be shared within one execution?
    │
    ├── Yes → Scoped
    │
    └── No → Transient
```

Then verify:

```text
Chosen lifetime
      │
      ├── Dependency lifetimes
      ├── Mutable state
      ├── Resource ownership
      └── Disposal requirements
```

---

# Lifetimes with AppBuilder

Service lifetime configuration normally happens through `AppBuilder`:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addSingleton(
      'CONFIGURATION_SERVICE',
      () => new ConfigurationService(),
    )

    services.addScoped(
      'USER_CONTEXT',
      (scope) => new UserContext(scope),
    )

    services.addTransient(
      'USER_SERVICE',
      (scope) =>
        new UserService(
          scope.resolve('USER_REPOSITORY'),
        ),
    )
  })

const container = await app.build()
```

`AppBuilder` is responsible for assembling the application, while the service container owns service registration, resolution, scopes, and lifetime behavior.

---

# Lifetimes and modules

Modules can register services with any supported lifetime:

```ts
return {
  async configure(container) {
    container.addSingleton(
      'USER_CONFIGURATION',
      () => new UserConfiguration(),
    )

    container.addScoped(
      'USER_SERVICE',
      (scope) =>
        new UserService(
          scope.resolve('USER_REPOSITORY'),
        ),
    )
  },
}
```

This keeps lifetime decisions close to the module that owns the service registration.

---

# Frequently Asked Questions

## Is scoped the same as request-scoped?

Not exactly.

A scope is a general execution boundary. An HTTP request can create or participate in a scope, but the lifetime model itself is not defined by HTTP.

Scopes can also be useful for CLI commands, background jobs, tests, and other execution models.

## Is singleton always better for performance?

No.

Singleton reduces repeated construction, but sharing an instance also means sharing its state and lifetime.

The correct lifetime depends on ownership, isolation, and dependency semantics.

## Does transient mean stateless?

No.

A transient service can contain state. The important property is that a new instance is created for each resolution.

Whether that state is useful or safe depends on the service itself.

## Can a singleton depend on a scoped service?

No. A singleton must not capture a scoped dependency because the scoped dependency has a shorter lifetime.

Xeno.JS detects this captive-dependency situation.

## Can a scoped service depend on a singleton?

Yes.

The singleton outlives the scope, so the scoped service can safely reference it.

## Can a scoped service depend on another scoped service?

Yes.

Both services belong to the same scope and therefore share the same scope boundary.

## Can a transient service depend on a scoped service?

Yes, provided the transient service is resolved within an active scope and does not escape that scope in a way that violates the dependency's lifetime.

## Where are lifetimes defined?

They are defined at registration time:

```ts
services.addSingleton(...)
services.addScoped(...)
services.addTransient(...)
```

The registration therefore makes the intended lifetime explicit.

## Do decorators determine service lifetimes?

No.

Xeno.JS uses explicit programmatic registration. The lifetime is selected directly through the service-container registration API.

---

# Summary

Xeno.JS provides three service lifetimes:

```text
Singleton
    → one instance for the container

Scoped
    → one instance per scope

Transient
    → new instance per resolution
```

The important part is not memorizing the three methods.

It is understanding the ownership boundary represented by each lifetime:

```text
Application
    │
    └── Singleton

Execution
    │
    └── Scope
         │
         └── Scoped

Resolution
    │
    └── Transient
```

When choosing a lifetime, consider **state, isolation, resource ownership, disposal, and dependency lifetimes together**.

For the broader dependency injection model, see [Dependency Injection](./dependency-injection).

For scopes and execution context, see [Context & Scopes](./context-and-scopes).

## For service registration and resolution, see [Service Container](./service-container).

[Non verificato] I dettagli sul comportamento di disposal e sul collegamento concreto tra HTTP execution e scope dipendono dall'implementazione/runtime corrente e vanno mantenuti allineati ai test del repository quando questa pagina viene aggiornata.
