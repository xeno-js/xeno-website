---
title: "Xeno.JS Architecture Overview"
description: "Understand the architecture of Xeno.JS, how its application, domain, infrastructure, and presentation layers interact, and how the Core, Shared, Vue, and CLI packages fit together."
canonical: "https://www.xeno-js.it/docs/introduction/architecture-overview"
publishedAt: "2026-09-30"
updatedAt: "2026-11-04"
author:
name: "Xeno.JS Team"
url: "https://www.xeno-js.it"
type: "documentation"
section: "introduction"
category: "architecture"
topics: "Xeno.JS Architecture, TypeScript Application Architecture, Application Architecture, TypeScript Architecture, Clean Architecture, Domain-Driven Design, CQRS, Dependency Injection, Application Layer, Domain Layer, Infrastructure Layer"
keywords: "Xeno.JS architecture, Xeno.JS application architecture, TypeScript application architecture, TypeScript architecture framework, application architecture framework, TypeScript Clean Architecture, TypeScript DDD architecture, TypeScript CQRS architecture, TypeScript dependency injection architecture, application layer TypeScript, domain layer TypeScript, infrastructure layer TypeScript, framework agnostic TypeScript architecture"
sidebar:
  group: "Introduction"
  order: 3
breadcrumbs:

- name: "Docs"
  url: "https://www.xeno-js.it/docs"

- name: "Introduction"
  url: "https://www.xeno-js.it/docs/introduction"

- name: "Architecture Overview"
  url: "https://www.xeno-js.it/docs/introduction/architecture-overview"
related:
  next:

  - "/docs/introduction/core-principles"
prerequisites:
  - "/docs/introduction/what-is-xeno-js"
  - "/docs/introduction/why-xeno-js"
relatedTopics:
  - "/docs/introduction/what-is-xeno-js"
  - "/docs/introduction/why-xeno-js"
  - "/docs/introduction/core-principles"
faqs:

- question: "How is Xeno.JS structured?"
  answer: "Xeno.JS separates application architecture into presentation, application, domain, and infrastructure concerns, while shared domain and application contracts are provided by @xeno-js/shared."

- question: "What is the application layer in Xeno.JS?"
  answer: "The application layer coordinates use cases through commands, queries, handlers, and pipelines. XenoAppBuilder composes the runtime and its dependencies; XenoApplication exposes runtime service and scope APIs."

- question: "What is @xeno-js/shared?"
  answer: "@xeno-js/shared provides framework-neutral domain primitives and application contracts used across the Xeno.JS ecosystem, including aggregates, entities, value objects, domain events, results, errors, commands, and queries."

- question: "What is @xeno-js/core?"
  answer: "@xeno-js/core is the main application architecture package for Node.js. It provides application composition, dependency injection, service lifetimes, scopes, CQRS, pipelines, request context, modules, repositories, data sources, and infrastructure integrations."

- question: "How does Xeno.JS handle CQRS?"
  answer: "Xeno.JS treats commands and queries as application-level primitives. The mediator resolves the appropriate handler within the current service scope and executes it through the configured pipeline behaviors."

- question: "Does Xeno.JS support Vue?"
  answer: "Yes. @xeno-js/vue applies the Xeno application model to Vue applications; its runtime contracts are separate from the Node.js XenoApplication API described here."

- question: "What is the role of the Xeno.JS CLI?"
  answer: "@xeno-js/cli provides project scaffolding and developer tooling; it is not part of the application runtime."

answerSummary: "Xeno.JS separates presentation, application, domain, and infrastructure responsibilities while keeping infrastructure behind application-facing contracts. @xeno-js/shared provides framework-neutral concepts, @xeno-js/core provides the Node.js composition and runtime APIs, @xeno-js/vue applies the application model to Vue, and @xeno-js/cli provides project tooling."

directAnswer:
question: "How does Xeno.JS architecture work?"
answer: "Xeno.JS organizes applications around explicit presentation, application, domain, and infrastructure responsibilities. The application coordinates use cases; infrastructure implements the contracts those use cases need, and XenoAppBuilder wires the components into the runtime."

keyFacts:
- "Xeno.JS is organized around explicit presentation, application, domain, and infrastructure concerns."
- "@xeno-js/shared provides framework-neutral domain primitives and application contracts."
- "@xeno-js/core provides the main application architecture runtime for Node.js."
- "XenoAppBuilder is the composition root: it queues and initializes modules and configures service registrations."
- "build() returns the configured runtime application by default; the builder retains the service container internally."
- "The runtime application exposes root service access through getServices() and scoped execution through runInScope()."
- "CQRS is implemented through commands, queries, handlers, a mediator, and pipeline behaviors."
- "Request context connects asynchronous execution with request-specific context and service scope."
- "@xeno-js/vue applies the application architecture model to Vue applications."
- "@xeno-js/cli provides project scaffolding and developer tooling; it is not an application runtime layer."
---

## Introduction

Xeno.JS is built around an **application-centered architecture**.

The application is not defined by its HTTP server, UI framework, database, or other infrastructure.

Instead, these concerns connect to an application layer that coordinates use cases and their dependencies.

The dependency direction is not a single stack in which infrastructure depends
on the domain. Presentation calls application use cases; application logic may
use domain concepts; infrastructure implements contracts required by the
application. The composition root connects those implementations:

```text
Presentation ───────► Application ───────► Domain
                          ▲
                          │ implements contracts used by
                    Infrastructure

             XenoAppBuilder wires the components
```

This separation is the architectural foundation of Xeno.JS.

---

## The Xeno.JS architecture

A typical Xeno.JS application can be understood through four main concerns:

```text
┌─────────────────────────────────────────────┐
│                 Presentation                │
│          HTTP / Worker / Vue UI             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 Application                 │
│                                             │
│ Commands / Queries / Handlers / Pipelines   │
│ Executed by the runtime with DI, scopes,    │
│ context, and configured modules             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                    Domain                   │
│                                             │
│ Entities / Aggregates / Value Objects       │
│ Domain Events / Rules / Contracts           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                Infrastructure               │
│                                             │
│ DB / Repositories / Data Sources / Cache    │
│ HTTP Clients / Auth / Logging / Resilience  │
└─────────────────────────────────────────────┘

Application logic uses domain concepts and contracts.
Infrastructure implements contracts and is wired at the composition root.
```

These are architectural responsibilities, not necessarily four physical folders that every application must reproduce exactly.

The important property is that **the boundaries are explicit**.

---

## 1. Presentation

The presentation layer is where an application receives an external interaction.

Examples include:

- HTTP requests
- CLI commands
- background workers
- other application entry points
- Vue UI interactions

Presentation translates an external interaction into an application operation.

For example:

```text
HTTP request
     │
     ▼
Presentation
     │
     ▼
Command / Query
     │
     ▼
Application
```

The presentation layer should not become the place where the application's business rules are implemented.

Its responsibility is to connect the outside world to the application.

---

### Transport independence

HTTP is one possible entry point, not the boundary that defines a use case.
When HTTP services are configured, the runtime application can dispatch an
incoming request through its registered adapter and dispatcher. Other
application work can run through the application runtime without an HTTP
request.

Conceptually:

```text
HTTP request ──► Presentation ──► Application use case
                                      ▲
                                      │
Other execution ──► runInScope() ─────┘
```

The application use case remains separate from the transport-specific entry
point.

---

## 2. Application

The application layer is the center of execution in Xeno.JS.

It coordinates **what the application does**.

Application execution is organized around concepts such as:

- commands
- queries
- handlers
- pipelines
- dependency injection
- service scopes
- request context
- modules
- application composition

A simplified execution flow is:

```text
Command / Query
       │
       ▼
    Mediator
       │
       ▼
   Pipeline
       │
       ▼
    Handler
       │
       ▼
 Application Result
```

This is one of the most important aspects of the Xeno.JS architecture.

The framework does not treat CQRS as an isolated utility.

Commands, queries, handlers, dependency resolution, scopes, and pipelines participate in the application's execution model.

---

## 3. Commands and Queries

Xeno.JS represents application operations through commands and queries.

A command represents an operation that changes application state.

A query represents an operation that retrieves information.

Conceptually:

```text
Command
   │
   ▼
Command Pipeline
   │
   ▼
Command Handler


Query
   │
   ▼
Query Pipeline
   │
   ▼
Query Handler
```

The mediator is responsible for finding the appropriate handler and executing the request through the configured pipeline.

This keeps the application entry point independent from the concrete handler implementation.

For example:

```text
HTTP Controller
      │
      ▼
CreateUserCommand
      │
      ▼
Mediator
      │
      ▼
CreateUserHandler
      │
      ▼
Domain / Repository
```

The controller does not need to know how the use case is implemented.

---

## 4. Pipelines

Application execution can require behavior that should not be implemented repeatedly inside every handler.

Examples include:

- validation
- authorization
- logging
- performance measurement
- idempotency
- concurrency handling
- exception handling
- query behavior

Xeno.JS models these concerns through pipelines.

```text
Request
   │
   ▼
┌───────────────────┐
│ Validation        │
├───────────────────┤
│ Authorization     │
├───────────────────┤
│ Logging           │
├───────────────────┤
│ Performance       │
├───────────────────┤
│ Handler           │
└───────────────────┘
```

The exact pipeline configuration is application-dependent.

The architectural principle is that cross-cutting execution can be composed around the use case instead of being duplicated across individual entry points.

---

## 5. Dependency Injection and Composition

Xeno.JS uses explicit dependency injection.

Dependencies are registered in the application's composition root rather than discovered through decorators or implicit runtime scanning.

The central composition mechanism is `XenoAppBuilder`.

Conceptually:

```text
XenoAppBuilder
    │
    ├── configuration
    ├── modules
    ├── services
    ├── pipelines
    ├── infrastructure
    └── application components
              │
              ▼
       ServiceContainer
              │ retained by builder
              ▼
       XenoApplication
        (build result)
```

A simplified composition looks like:

```typescript
const app = new XenoAppBuilder()

  .addServices((services) => {
    services.addScoped(
      'USER_REPOSITORY',
      (scope) => new UserRepository(
        scope.resolve('USER_DATA_SOURCE')
      )
    )
  })

const application = await app.build()

await application.runInScope(async (services) => {
  const repository = services.USER_REPOSITORY
})
```

The important property is not the fluent API itself.

It is that the **dependency graph is explicitly composed**.

`build()` initializes queued modules and, unless a custom application factory
is configured, returns an `XenoApplication`. The builder retains the service
container; runtime code should use the returned application's APIs.

---

## 6. Service Lifetimes and Scopes

Xeno.JS distinguishes dependency lifetimes such as:

- singleton
- scoped
- transient

This allows dependencies to have an explicit lifecycle.

For example:

```text
Application
     │
     ├── Singleton
     │
     ├── Scoped ─────── Request / Execution Scope
     │
     └── Transient
```

A scoped service belongs to the current application execution scope.

This becomes particularly important when an application uses request-specific dependencies such as:

- request context
- transaction state
- scoped repositories
- request-specific services

The service container also tracks dependency resolution and detects conditions such as circular dependencies and captive scoped dependencies.

Singleton factories resolve from the root scope. The container rejects a
scoped dependency reached during singleton construction. Scoped services must
be resolved inside an active scope; use `runInScope()` when an operation needs
to create one.

---

## 7. Request Context

Xeno.JS connects request context with the service scope.

With the default Node configuration, asynchronous request context is propagated
through `AsyncLocalStorage`.

Conceptually:

```text
Incoming Request
       │
       ▼
Request Context
       │
       ├── Identity
       ├── Network Context
       └── Service Scope
               │
               ▼
       Application Execution
```

The context allows request-specific information to remain available throughout asynchronous application execution without passing it manually through every method.

The context execution disposes its service scope when the operation completes,
including when the operation fails. `XenoApplication.runInScope()` provides
this lifecycle for work that does not start from an HTTP request.

This makes request boundaries an explicit part of the application runtime.

---

## 8. Domain

The domain represents the business concepts and rules of the application.

Xeno.JS and `@xeno-js/shared` provide domain-oriented primitives including:

- entities
- aggregates
- value objects
- domain events
- domain errors
- domain contracts
- result types

The purpose of the domain is to express business concepts without depending
on application runtime, transport, or infrastructure details.

A simplified model is:

```text
Domain
├── Entities
├── Value Objects
├── Aggregates
├── Domain Events
├── Domain Errors
└── Domain Contracts
```

The domain is therefore different from the application layer.

The application coordinates a use case.

The domain expresses the business model used by that use case.

---

## 9. Infrastructure

Infrastructure contains concrete implementations and integrations required by the application.

Examples in the Xeno.JS ecosystem include:

- databases
- repositories
- data sources
- HTTP clients
- caching
- authentication
- logging
- resilience
- configuration

Application code uses contracts; infrastructure depends on those contracts to
provide concrete implementations. The composition root wires an implementation
for runtime use:

```text
Application ──uses──► Application contract
                            ▲
                            │ implements
                    Infrastructure
                            ▲
                            │ wired by
                     XenoAppBuilder
```

For example, an application may depend on a repository contract while infrastructure provides the concrete database-backed repository.

This keeps infrastructure details out of the application and domain model.

---

## 10. Data Sources and Repositories

Xeno.JS distinguishes between application-facing persistence abstractions and infrastructure-level data access.

A simplified flow is:

```text
Application
     │ uses
     ▼
Repository Contract
     ▲
     │ implemented by
Repository Implementation
     │
     ▼
Data Source
     │
     ▼
Database

XenoAppBuilder wires the implementation during composition.
```

The application uses the contract for the capability it needs. Infrastructure
determines how that capability is implemented, and composition connects the
implementation to the application.

---

## 11. Modules

Xeno.JS uses modules to compose optional application capabilities.

`XenoAppBuilder` queues modules and initializes them during `build()`. It sorts
queued modules by ascending priority and configures them sequentially. With
Node configuration, the builder queues the default context module if none was
configured; with Vite configuration, the application must configure a context
plugin explicitly.

Conceptually:

```text
AppBuilder
    │
    ├── Context Module
    ├── Pipeline Module
    ├── Logger Module
    ├── Auth Module
    ├── Database Module
    ├── Cache Module
    ├── HTTP Module
    └── Custom Modules
```

This allows infrastructure and application capabilities to be enabled explicitly rather than requiring every application to use the same runtime configuration.

The application composition therefore becomes part of the architecture itself.

---

## 12. The Xeno.JS Ecosystem

The architecture is distributed across several packages.

They have different responsibilities.

```text
                         Xeno.JS

                    @xeno-js/shared
                           │
              Domain primitives & contracts
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      @xeno-js/core                @xeno-js/vue
      Node.js runtime              Vue integration

                     @xeno-js/cli
             project and component tooling
```

### `@xeno-js/shared`

`@xeno-js/shared` contains framework-neutral concepts shared across the ecosystem.

Its source structure includes domain primitives such as:

- aggregates
- entities
- value objects
- domain events
- errors
- results

It also defines application contracts for commands and queries.

The package therefore provides a common architectural language without owning the Node.js runtime or Vue runtime.

### `@xeno-js/core`

`@xeno-js/core` is the main Node.js application architecture package.

It provides:

- application composition
- dependency injection
- service lifetimes
- service scopes
- CQRS
- mediator execution
- pipelines
- request context
- modules
- repositories
- data sources
- infrastructure integrations

The package contains the runtime mechanisms that execute the application architecture.

### `@xeno-js/vue`

`@xeno-js/vue` applies the Xeno application model in Vue applications. Its
specific runtime contracts are separate from the Node.js `XenoApplication`
described here.

### `@xeno-js/cli`

`@xeno-js/cli` is the developer tooling layer.

It is responsible for:

- creating Xeno projects
- selecting project types
- generating architecture-aligned files
- generating commands
- generating queries
- scaffolding Core applications
- scaffolding Vue applications

The CLI does not execute the application architecture at runtime.

It **creates the starting structure that the other packages execute**.

---

## 13. How the Packages Relate

The relationship can be summarized as:

```text
                  ┌───────────────────┐
                  │   @xeno-js/shared │
                  │                   │
                  │ Domain primitives │
                  │ Application       │
                  │ contracts         │
                  └─────────┬─────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
   ┌────────────────────┐      ┌────────────────────┐
   │   @xeno-js/core    │      │   @xeno-js/vue     │
   │   Node.js runtime  │      │  Vue integration   │
   └────────────────────┘      └────────────────────┘

                  ┌──────────────────┐
                  │   @xeno-js/cli   │
                  │ project tooling  │
                  └──────────────────┘
```

The important distinction is:

> **Shared defines common concepts. Core and Vue execute those concepts in their respective environments. CLI creates projects and components around them.**

---

## 14. A Complete Application Flow

Putting the architecture together, a backend request can be understood as:

```text
HTTP Request ──► Presentation ──► Command / Query ──► Mediator
                                                        │
                                                        ▼
                                                Configured Pipeline
                                                        │
                                                        ▼
                                                     Handler
                                                        │
                                     ┌──────────────────┴───────────┐
                                     ▼                              ▼
                               Domain Logic              Application Contract
                                                                    ▲
                                                                    │ implemented by
                                                         Infrastructure Adapter
                                                                    │
                                                                    ▼
                                                        Data Source / Database
```

The request runs in an application scope. When a use case needs an
infrastructure capability, it uses an application-facing contract whose
implementation was selected during composition. The response then travels
back through the application boundary to the presentation layer.

The important point is that the HTTP request is only the **entry point**.

The application architecture does not depend on HTTP being the thing that defines the use case.

---

## 15. Frontend Application Flow

The same architectural idea can be applied in a Vue application.

A simplified flow is:

```text
                     Vue UI
                       │
                       ▼
                Application Action
                       │
                       ▼
                  Mediator / Pipe
                       │
                       ▼
                  Application
                       │
                       ▼
                 Remote Data Source
                       │
                       ▼
                    Backend
```

This allows frontend code to use application-oriented concepts instead of
placing all application behavior directly inside Vue components. The exact Vue
runtime composition is not described by the Node.js builder and application
contracts covered in this guide.

---

## 16. The Composition Root

One of the most important architectural concepts in Xeno.JS is the **composition root**.

This is where the application decides:

- which services exist
- which implementations they use
- which lifetimes they have
- which modules are enabled
- which pipelines are configured
- which infrastructure is available

In Xeno.JS, `XenoAppBuilder` provides the primary mechanism for this composition.

The builder queues configuration actions and modules; `build()` initializes
the modules in ascending priority order and returns the configured runtime
application. The default runtime is `XenoApplication`, which exposes
`getServices()` for root resolution and `runInScope()` for scoped work.

```text
                    Composition Root
                         │
                   XenoAppBuilder
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
   Dependencies       Modules          Pipelines
        │                │                 │
        └────────────────┼─────────────────┘
                         ▼
                  Service Container
                         │
              build() returns the runtime
                         ▼
                  XenoApplication
```

This is where the application's architecture becomes executable configuration.

---

## 17. Why the Architecture Is Application-Centered

The architecture can be summarized by moving from the outside inward:

```text
Transport
    ↓
Presentation
    ↓
Application ──uses──► Domain
    │
    └──uses application contracts implemented by Infrastructure
```

Infrastructure implements contracts used by the application; it is not a
lower layer that the domain depends on.

The application defines what it needs.

Infrastructure supplies implementations.

This gives the application a stable center while allowing external technologies to change around it.

For example:

```text
                ┌── PostgreSQL
                │
Application ────┼── Redis
                │
                ├── External API
                │
                └── Another implementation
```

The composition root selects the concrete implementation. The application
uses the contract, not the provider-specific technology.

---

## 18. The Architectural Boundary

The most important boundary in Xeno.JS is not a particular folder.

It is the boundary between:

```text
             Application Intent
                     │
                     ▼
             ┌───────────────┐
             │  Application  │
             └───────┬───────┘
                     │ uses
                     ▼
             Application contract
                     ▲
                     │ implements
             ┌───────┴────────┐
             │ Infrastructure │
             └───────┬────────┘
                     ▲
                     │ configured by
                XenoAppBuilder
```

The application should express **what it needs**.

Infrastructure should determine **how that need is fulfilled**.

This is what allows Xeno.JS to remain independent from a specific transport, database, or infrastructure implementation.

---

## 19. Architecture in One Diagram

The complete Xeno.JS model can therefore be reduced to:

```text
┌──────────────────────────────────────────────────────────────┐
│                         ENTRY POINTS                         │
│                                                              │
│        HTTP       Worker       Vue / Browser                  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       PRESENTATION                           │
│                                                              │
│          Translate external interactions into use cases      │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       APPLICATION                            │
│                                                              │
│  Commands • Queries • Handlers • Mediator • Pipelines        │
│  Runtime scopes and request context are provided by Core     │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                          DOMAIN                              │
│                                                              │
│  Entities • Aggregates • Value Objects • Events • Rules      │
└──────────────────────────────────────────────────────────────┘

     Application-facing contracts
                 ▲
                 │ implemented by
┌──────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                          │
│                                                              │
│  Database • Repositories • Data Sources • Cache • Auth       │
│  HTTP Clients • Logging • External Services                  │
└──────────────────────────────────────────────────────────────┘
                 ▲
                 │ wired during composition
            XenoAppBuilder


                    SHARED ARCHITECTURAL LANGUAGE

                         @xeno-js/shared
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
          @xeno-js/core                  @xeno-js/vue
            Node.js runtime              Vue integration

                         @xeno-js/cli
                       project tooling
```

This diagram summarizes the runtime layers. The CLI is developer tooling, not
an application entry point or runtime layer.

This is the mental model to keep while reading the rest of the documentation.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
