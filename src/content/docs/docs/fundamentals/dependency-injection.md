---
title: "Dependency Injection"
description: "Learn how Xeno.JS provides explicit, type-safe dependency injection through service registries, factories, scopes, and the Service Container."
keywords: "Xeno.JS dependency injection, TypeScript dependency injection, TypeScript DI, dependency injection Node.js, explicit dependency injection, type safe dependency injection, service container TypeScript, DI without decorators, Xeno.JS DI"
canonical: "https://www.xeno-js.it/docs/fundamentals/dependency-injection"

category: "Fundamentals"

tags:

  - "dependency-injection"
  - "typescript"
  - "architecture"
  - "service-container"
  - "ioc"
  - "nodejs"
  - "xenojs"

author: "Xeno.JS Team"
pubDate: 2026-10-01
type: "article"
featured: false

faqs:

- question: "What is dependency injection in Xeno.JS?"
  answer: "Dependency injection in Xeno.JS is the explicit composition of services through the Service Container. Services are registered with factories, and dependencies are resolved explicitly through the active service scope."

- question: "Does Xeno.JS support dependency injection?"
  answer: "Yes. Xeno.JS provides a typed Service Container with singleton, transient, and scoped registrations."

- question: "Does Xeno.JS use decorators for dependency injection?"
  answer: "No decorator-driven dependency discovery is required. Xeno.JS uses explicit programmatic registration and service resolution through factories and scopes."

- question: "Does Xeno.JS use constructor injection?"
  answer: "Xeno.JS does not automatically inspect constructors and inject parameters through runtime metadata. A registration factory receives the service scope and explicitly resolves the dependencies needed to construct the service."

- question: "What is an injection token in Xeno.JS?"
  answer: "An injection token identifies a registered service. Tokens are represented by keys of the application's registry, which associates each token with its TypeScript service type."

- question: "What is the Xeno Registry?"
  answer: "The Xeno Registry is a TypeScript contract that maps dependency injection tokens to service types. It allows the Service Container to provide type-safe registration and resolution."

- question: "How do I register a dependency in Xeno.JS?"
  answer: "Dependencies are registered through addSingleton, addTransient, or addScoped on the Service Container. Each registration receives a token and a factory function."

- question: "How do I resolve a dependency in Xeno.JS?"
  answer: "A dependency is resolved by calling resolve on the active service scope or container. Scoped services must be resolved through an active scope."

- question: "What happens if I resolve a scoped service from the root container?"
  answer: "Xeno.JS throws an error because scoped services require an active service scope."

- question: "Does Xeno.JS detect circular dependencies?"
  answer: "Yes. The Service Container tracks the current resolution path and throws a circular dependency error when a token is encountered again during the same resolution chain."

- question: "Does Xeno.JS detect captive dependencies?"
  answer: "Xeno.JS detects the specific case where a singleton resolution attempts to resolve a scoped service, because the scoped instance would otherwise be captured by the longer-lived singleton."

- question: "Can dependencies be resolved asynchronously?"
  answer: "Service resolution itself is synchronous. AsyncLocalStorage is used internally to isolate the resolution context across asynchronous execution flows."

- question: "Can Xeno.JS services be disposed automatically?"
  answer: "Yes. Services implementing the disposable contract can be tracked by the container or scope and disposed when the corresponding lifecycle boundary is disposed."

- question: "Can I use dependency injection without HTTP?"
  answer: "Yes. The Service Container is an application composition mechanism and is not intrinsically tied to HTTP. Scopes can represent other logical execution boundaries as well."

related:

- "/docs/overview"
- "/docs/xeno-registry"
- "/docs/app-builder"
- "/docs/service-container"
- "/docs/service-lifetimes"
- "/docs/modules"
- "/docs/context-and-scopes"

schema:
  type: "Article"
  headline: "Dependency Injection"
  description: "Learn how Xeno.JS provides explicit, type-safe dependency injection through service registries, factories, scopes, and the Service Container."
  mainEntityOfPage: "https://www.xeno-js.it/docs/dependency-injection"
---

## Dependency Injection

Xeno.JS uses **explicit dependency injection** to compose application services.

The dependency graph is defined through TypeScript code rather than discovered through decorators or runtime constructor metadata.

The basic model is:

```text
Application Registry
        │
        ▼
 Service Container
        │
        ▼
 Registration Factory
        │
        ▼
 Active Service Scope
        │
        ├── resolve dependency A
        ├── resolve dependency B
        └── create service
```

This makes dependency construction visible at the composition boundary.

---

## What dependency injection means in Xeno.JS

Dependency injection separates two responsibilities:

1. defining a service
2. deciding how that service receives its dependencies

For example, a service can remain an ordinary TypeScript class:

```ts
class UserService {
  constructor(
    private readonly repository: UserRepository,
  ) {}

  async getUser(id: string) {
    return this.repository.findById(id)
  }
}
```

Xeno.JS does not need to inspect this constructor at runtime.

Instead, the composition is declared explicitly:

```ts
container.addTransient('USER_SERVICE', (scope) => {
  const repository = scope.resolve('USER_REPOSITORY')

  return new UserService(repository)
})
```

The dependency is visible exactly where the service is composed.

---

## Explicit factories instead of hidden injection

The central difference is that Xeno.JS uses **factory-based dependency registration**.

A registration has three parts:

```ts
container.addTransient(
  'USER_SERVICE',
  (scope) => {
    const repository = scope.resolve('USER_REPOSITORY')

    return new UserService(repository)
  },
)
```

The first argument is the token:

```ts
'USER_SERVICE'
```

The second argument is the factory:

```ts
(scope) => {
  const repository = scope.resolve('USER_REPOSITORY')

  return new UserService(repository)
}
```

The factory receives the current `IServiceScope`.

Dependencies are then resolved explicitly from that scope.

This is intentionally different from a container that scans constructors and automatically determines their dependencies.

---

## Injection tokens

Xeno.JS uses registry keys as dependency injection tokens.

The `ApplicationRegistry` defines the relationship between a token and its service type.

Conceptually:

```ts
interface ApplicationRegistry {
  USER_REPOSITORY: UserRepository
  USER_SERVICE: UserService
}
```

The container can then use those keys for typed resolution:

```ts
const service = container.resolve('USER_SERVICE')
```

The TypeScript type of `service` is derived from the registry.

This means the token and the resolved service type remain connected at compile time.

---

## Extending the registry

Applications can extend the Xeno registry with their own services.

For example:

```ts
type AppRegistry = XenoRegistry<
  Dictionary,
  {
    USER_REPOSITORY: UserRepository
    USER_SERVICE: UserService
  }
>
```

The resulting registry becomes the type contract for the application's Service Container.

```ts
const container =
  new ServiceContainer<AppRegistry>()
```

Now registrations and resolutions are checked against the application registry.

```ts
container.addSingleton(
  'USER_REPOSITORY',
  () => new UserRepository(),
)
```

And:

```ts
const repository =
  container.resolve('USER_REPOSITORY')
```

The registry therefore acts as the compile-time contract for dependency injection.

---

## Registering dependencies

Xeno.JS provides three registration methods:

```ts
container.addSingleton(...)
container.addTransient(...)
container.addScoped(...)
```

Each method receives:

1. a registry token
2. a factory function

### Singleton

```ts
container.addSingleton(
  'CONFIGURATION',
  () => new ConfigurationService(),
)
```

The factory is evaluated once and the resulting instance is reused.

### Transient

```ts
container.addTransient(
  'USER_SERVICE',
  (scope) => {
    return new UserService(
      scope.resolve('USER_REPOSITORY'),
    )
  },
)
```

A new instance is produced on every resolution.

### Scoped

```ts
container.addScoped(
  'REQUEST_CONTEXT',
  () => new RequestContext(),
)
```

A scoped instance is created once within each scope.

For more details, see [Service Lifetimes](./service-lifetimes).

---

## Resolving dependencies

The `resolve()` method is the explicit dependency resolution mechanism.

From a container:

```ts
const logger = container.resolve('LOGGER')
```

From a scope:

```ts
const scope = container.createScope()

const context =
  scope.resolve('REQUEST_CONTEXT')
```

The difference is important.

The root container can resolve singleton and transient services.

A scoped service requires an active scope:

```ts
container.addScoped(
  'REQUEST_CONTEXT',
  () => new RequestContext(),
)
```

This is invalid:

```ts
container.resolve('REQUEST_CONTEXT')
```

Xeno.JS throws an error indicating that the scoped service requires an active scope.

The correct form is:

```ts
const scope = container.createScope()

const context =
  scope.resolve('REQUEST_CONTEXT')
```

---

## Dependency chains

Dependencies can resolve other dependencies.

For example:

```ts
container.addSingleton(
  'USER_REPOSITORY',
  () => new UserRepository(),
)

container.addTransient(
  'USER_SERVICE',
  (scope) => {
    return new UserService(
      scope.resolve('USER_REPOSITORY'),
    )
  },
)

container.addTransient(
  'USER_CONTROLLER',
  (scope) => {
    return new UserController(
      scope.resolve('USER_SERVICE'),
    )
  },
)
```

The resulting graph is:

```text
USER_CONTROLLER
       │
       ▼
USER_SERVICE
       │
       ▼
USER_REPOSITORY
```

The container resolves the graph recursively through the factories.

---

## Circular dependencies

Dependency graphs can contain accidental cycles.

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

Xeno.JS tracks the current resolution path.

If the same token is encountered again during the active resolution chain, the container throws a circular dependency error.

For example:

```ts
container.addTransient('SERVICE_A', (scope) => {
  scope.resolve('SERVICE_B')

  return new ServiceA()
})

container.addTransient('SERVICE_B', (scope) => {
  scope.resolve('SERVICE_A')

  return new ServiceB()
})
```

Resolving `SERVICE_A` produces a resolution path similar to:

```text
SERVICE_A -> SERVICE_B -> SERVICE_A
```

This is preferable to allowing the cycle to fail later through a less descriptive runtime error.

---

## Captive dependencies

A **captive dependency** occurs when a service with a longer lifetime attempts to hold a dependency with a shorter lifetime.

The important case explicitly detected by the current Xeno.JS container is:

```text
Singleton
    │
    ▼
Scoped
```

For example:

```ts
container.addScoped(
  'REQUEST_CONTEXT',
  () => new RequestContext(),
)

container.addSingleton(
  'GLOBAL_SERVICE',
  (scope) => {
    return new GlobalService(
      scope.resolve('REQUEST_CONTEXT'),
    )
  },
)
```

The container rejects this resolution.

The reason is that the singleton would capture a scoped instance beyond the intended scope boundary.

Xeno.JS reports this as a captive dependency error and includes the resolution path.

---

## Dependency lifetime rules

The lifetime of the dependency is part of the dependency graph.

A simplified model is:

```text
Singleton
   │
   ├── Singleton       ✓
   ├── Transient       ✓
   └── Scoped          ✗
```

For scoped and transient services, Xeno.JS does not apply the same singleton-to-scoped rejection.

For example, a scoped service can resolve a transient service:

```ts
container.addTransient(
  'VALIDATOR',
  () => new Validator(),
)

container.addScoped(
  'USER_SERVICE',
  (scope) => {
    const validator =
      scope.resolve('VALIDATOR')

    return new UserService(validator)
  },
)
```

This is a valid composition.

The important rule is that a singleton must not capture a scoped dependency.

---

## Scopes and dependency injection

Scopes provide the lifetime boundary for scoped dependencies.

```ts
const scope = container.createScope()
```

A scoped service is cached within that scope:

```ts
const first =
  scope.resolve('REQUEST_CONTEXT')

const second =
  scope.resolve('REQUEST_CONTEXT')
```

Both resolutions return the same instance within the scope.

Another scope receives another instance:

```ts
const scopeA = container.createScope()
const scopeB = container.createScope()

const contextA =
  scopeA.resolve('REQUEST_CONTEXT')

const contextB =
  scopeB.resolve('REQUEST_CONTEXT')
```

The instances are isolated:

```text
Container
   │
   ├── Scope A
   │     └── REQUEST_CONTEXT #1
   │
   └── Scope B
         └── REQUEST_CONTEXT #2
```

Singleton instances remain shared between these scopes.

---

## Dependency injection and request execution

Scopes are particularly useful when application execution has a logical boundary such as an HTTP request.

The general execution model can be represented as:

```text
Incoming Request
       │
       ▼
Create Scope
       │
       ▼
Resolve Application Services
       │
       ▼
Execute Command / Query
       │
       ▼
Dispose Scope
```

The Service Container itself does not require HTTP to exist.

The same composition model can be used by other application entry points where a logical scope is useful.

---

## AsyncLocalStorage and resolution context

The Xeno.JS Service Container uses Node.js `AsyncLocalStorage` internally to maintain resolution context.

The resolution context tracks information such as:

* the current dependency resolution stack
* the active lifetime
* the execution flow in which resolution is occurring

This is used primarily for correctness mechanisms such as circular dependency detection and lifetime validation.

For example, two parallel resolution flows should not accidentally share the same dependency-resolution stack.

The repository contains tests specifically covering parallel asynchronous resolution isolation.

---

## Dependency injection and disposal

Xeno.JS can track disposable services.

A service implementing the disposable contract can participate in container or scope cleanup.

For example:

```ts
class DatabaseConnection {
  async dispose() {
    await this.close()
  }
}
```

Registered as a scoped service:

```ts
container.addScoped(
  'DB_CONNECTION',
  () => new DatabaseConnection(),
)
```

When the scope is disposed, tracked disposable resources are disposed.

```ts
await scope.dispose()
```

The same principle applies to container-level resources such as singleton instances.

```ts
await container.dispose()
```

This makes service lifetime and resource ownership part of the same composition model.

---

## Dependency injection through AppBuilder

Most applications do not need to instantiate `ServiceContainer` manually.

`AppBuilder` exposes dependency registration through `addServices()`:

```ts
const app = new AppBuilder()

app.addServices((container) => {
  container.addSingleton(
    'USER_REPOSITORY',
    () => new UserRepository(),
  )

  container.addTransient(
    'USER_SERVICE',
    (scope) => {
      return new UserService(
        scope.resolve('USER_REPOSITORY'),
      )
    },
  )
})
```

The registrations are queued as part of application composition.

They are applied during:

```ts
await app.build()
```

The resulting container is then available to the application runtime.

---

## Custom modules and dependency injection

For larger applications, dependency registrations can be grouped into modules.

```ts
app.addModule(
  'UsersModule',
  async () => ({
    async configure(container) {
      container.addSingleton(
        'USER_REPOSITORY',
        () => new UserRepository(),
      )

      container.addTransient(
        'USER_SERVICE',
        (scope) => {
          return new UserService(
            scope.resolve('USER_REPOSITORY'),
          )
        },
      )
    },
  }),
)
```

This keeps related registrations together.

A module can therefore become the composition boundary for a feature:

```text
UsersModule
   │
   ├── UserRepository
   ├── UserService
   └── other feature dependencies
```

---

## Explicit DI vs decorator-driven DI

Xeno.JS deliberately keeps dependency registration explicit.

There is no requirement to annotate classes such as:

```ts
@Injectable()
class UserService {}
```

or to rely on constructor reflection to discover dependencies.

Instead:

```ts
container.addTransient(
  'USER_SERVICE',
  (scope) =>
    new UserService(
      scope.resolve('USER_REPOSITORY'),
    ),
)
```

The advantage of this model is that the dependency graph is visible in normal TypeScript code.

It also means there is less runtime metadata involved in dependency discovery.

---

## What Xeno.JS does not infer

Because the model is explicit, Xeno.JS does not need to infer:

* which constructor parameters are dependencies
* which class should implement an interface
* which decorator metadata describes a service
* which lifetime should be assigned automatically

The application declares these decisions at the composition boundary.

For example:

```ts
container.addScoped(
  'USER_SERVICE',
  (scope) => {
    const repository =
      scope.resolve('USER_REPOSITORY')

    return new UserService(repository)
  },
)
```

The code itself describes the composition.

---

## Dependency injection architecture

The complete model is:

```text
                 Xeno Registry
                      │
                      ▼
               Typed DI Contract
                      │
                      ▼
              Service Container
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Singleton    Scoped     Transient
          │           │           │
          └───────────┼───────────┘
                      ▼
               Service Factory
                      │
                      ▼
                Service Scope
                      │
                      ▼
              Application Service
```

This makes dependency injection part of the application architecture rather than a separate magic layer.

---

## Best practices

### Keep registration at the composition boundary

Prefer:

```ts
app.addServices((container) => {
  // registrations
})
```

over constructing infrastructure dependencies inside business logic.

### Resolve dependencies explicitly

Prefer:

```ts
const repository =
  scope.resolve('USER_REPOSITORY')
```

over hidden global access.

### Choose lifetimes deliberately

Use:

* `singleton` for shared application-wide resources
* `scoped` for state that belongs to one logical execution scope
* `transient` for short-lived services that should be recreated on resolution

### Avoid singleton-to-scoped dependencies

Do not create:

```text
Singleton → Scoped
```

because the singleton can outlive the scope.

### Keep the registry aligned with the application

The registry should describe the services that the application actually exposes through dependency injection.

### Use modules as the application grows

When registrations become feature-specific, move them into modules rather than allowing a single composition root to become unmanageable.

---

## Summary

Xeno.JS dependency injection is based on four ideas:

1. **Typed registry** — tokens and service types are connected through TypeScript.
2. **Explicit factories** — dependencies are resolved explicitly from the active scope.
3. **Explicit lifetimes** — singleton, scoped, and transient behavior is declared at registration time.
4. **Runtime validation** — the container detects missing registrations, circular dependencies, and singleton-to-scoped captive dependencies.

The central pattern is simple:

```ts
container.addTransient(
  'USER_SERVICE',
  (scope) => {
    return new UserService(
      scope.resolve('USER_REPOSITORY'),
    )
  },
)
```

There is no hidden dependency discovery here.

The application defines the dependency graph explicitly, and Xeno.JS provides the runtime that manages that graph.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
