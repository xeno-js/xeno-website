---
title: "Xeno.JS Architecture Overview"
description: "Understand the architecture of Xeno.JS, how its application, domain, infrastructure, and presentation layers interact, and how the Core, Shared, Vue, and CLI packages fit together."
canonical: "https://www.xeno-js.it/docs/introduction/architecture-overview"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
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
  answer: "The application layer coordinates use cases through commands, queries, handlers, pipelines, dependency injection, scopes, request context, and application composition."

- question: "What is @xeno-js/shared?"
  answer: "@xeno-js/shared provides framework-neutral domain primitives and application contracts used across the Xeno.JS ecosystem, including aggregates, entities, value objects, domain events, results, errors, commands, and queries."

- question: "What is @xeno-js/core?"
  answer: "@xeno-js/core is the main application architecture package for Node.js. It provides application composition, dependency injection, service lifetimes, scopes, CQRS, pipelines, request context, modules, repositories, data sources, and infrastructure integrations."

- question: "How does Xeno.JS handle CQRS?"
  answer: "Xeno.JS treats commands and queries as application-level primitives. The mediator resolves the appropriate handler within the current service scope and executes it through the configured pipeline behaviors."

- question: "Does Xeno.JS support Vue?"
  answer: "Yes. @xeno-js/vue applies the Xeno application architecture model to Vue applications, including application composition, dependency injection, pipelines, context, and data sources."

- question: "What is the role of the Xeno.JS CLI?"
  answer: "@xeno-js/cli scaffolds Xeno projects and generates application components such as commands and queries using the architecture defined by the Xeno ecosystem."

answerSummary: "Xeno.JS uses an application-centered architecture that separates presentation, application, domain, and infrastructure concerns. @xeno-js/shared provides framework-neutral contracts and domain primitives, @xeno-js/core provides the Node.js application runtime and composition model, @xeno-js/vue extends the model to Vue, and @xeno-js/cli scaffolds the architecture."

directAnswer:
question: "How does Xeno.JS architecture work?"
answer: "Xeno.JS organizes applications around explicit application, domain, infrastructure, and presentation boundaries. The application layer coordinates commands, queries, handlers, pipelines, dependencies, scopes, and context, while infrastructure provides concrete implementations and presentation provides the application entry points."

keyFacts:
- "Xeno.JS is organized around explicit presentation, application, domain, and infrastructure concerns."
- "@xeno-js/shared provides framework-neutral domain primitives and application contracts."
- "@xeno-js/core provides the main application architecture runtime for Node.js."
- "AppBuilder acts as the composition root for configuring and bootstrapping the application."
- "ServiceContainer provides explicit dependency registration, resolution, lifetimes, and scopes."
- "CQRS is implemented through commands, queries, handlers, a mediator, and pipeline behaviors."
- "Request context connects asynchronous execution with request-specific context and service scope."
- "@xeno-js/vue applies the application architecture model to Vue applications."
- "@xeno-js/cli scaffolds projects and generates architecture-aligned application components."
---

## Introduction

Xeno.JS is built around an **application-centered architecture**.

The application is not defined by its HTTP server, UI framework, database, or other infrastructure.

Instead, these concerns connect to an application layer that coordinates use cases and their dependencies.

At a high level:

```text
Presentation
     │
     ▼
Application
     │
     ▼
Domain
     │
     ▼
Infrastructure
```

This separation is the architectural foundation of Xeno.JS.

---

## The Xeno.JS architecture

A typical Xeno.JS application can be understood through four main concerns:

```text
┌─────────────────────────────────────────────┐
│                 Presentation                │
│          HTTP / CLI / Worker / UI           │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                 Application                 │
│                                             │
│ Commands / Queries / Handlers / Pipelines   │
│ DI / Scopes / Context / Modules             │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                    Domain                   │
│                                             │
│ Entities / Aggregates / Value Objects       │
│ Domain Events / Rules / Contracts           │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                Infrastructure               │
│                                             │
│ DB / Repositories / Data Sources / Cache    │
│ HTTP Clients / Auth / Logging / Resilience  │
└─────────────────────────────────────────────┘
```

These are architectural responsibilities, not necessarily four physical folders that every application must reproduce exactly.

The important property is that **the boundaries are explicit**.

---

## 1. Presentation

The presentation layer is where an application receives an external interaction.

Examples include:

* HTTP requests
* CLI commands
* background workers
* other application entry points
* Vue UI interactions

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

Xeno.JS does not make HTTP the center of the architecture.

An application can use a transport such as Fastify, Express, or Hono while keeping its application logic in Xeno's application layer.

Conceptually:

```text
┌──────────┐
│ Fastify  │
└────┬─────┘
     │
┌────▼────────────────┐
│ Xeno Application    │
└────┬─────────────────┘
     │
     ▼
   Domain
```

The transport can therefore change without requiring the application model to change with it.

---

## 2. Application

The application layer is the center of execution in Xeno.JS.

It coordinates **what the application does**.

This layer contains concepts such as:

* commands
* queries
* handlers
* pipelines
* dependency injection
* service scopes
* request context
* modules
* application composition

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

* validation
* authorization
* logging
* performance measurement
* idempotency
* concurrency handling
* exception handling
* query behavior

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

The central composition mechanism is `AppBuilder`.

Conceptually:

```text
AppBuilder
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
```

A simplified composition looks like:

```typescript
const app = new AppBuilder()

  .addServices((services) => {
    services.addScoped(
      'USER_REPOSITORY',
      (container) => new UserRepository(
        container.resolve('USER_DATA_SOURCE')
      )
    )
  })

  .addPipeline()

  .addDb(/* configuration */)

  .addLogger()

await app.build()
```

The important property is not the fluent API itself.

It is that the **dependency graph is explicitly composed**.

---

## 6. Service Lifetimes and Scopes

Xeno.JS distinguishes dependency lifetimes such as:

* singleton
* scoped
* transient

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

* request context
* transaction state
* scoped repositories
* request-specific services

The service container also tracks dependency resolution and detects conditions such as circular dependencies and captive scoped dependencies.

---

## 7. Request Context

Xeno.JS connects request context with the service scope.

In the Node.js implementation, asynchronous request context is propagated through `AsyncLocalStorage`.

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

The scope is also disposed when the request execution finishes.

This makes request boundaries an explicit part of the application runtime.

---

## 8. Domain

The domain represents the business concepts and rules of the application.

Xeno.JS and `@xeno-js/shared` provide domain-oriented primitives including:

* entities
* aggregates
* value objects
* domain events
* domain errors
* domain contracts
* result types

The purpose of the domain layer is to express business concepts without making them dependent on a particular transport or infrastructure implementation.

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

* databases
* repositories
* data sources
* HTTP clients
* caching
* authentication
* logging
* resilience
* configuration

The conceptual relationship is:

```text
Application
     │
     │ depends on contracts
     ▼
  Contracts
     ▲
     │ implemented by
     │
Infrastructure
```

For example, an application may depend on a repository contract while infrastructure provides the concrete database-backed repository.

This keeps infrastructure details out of the application and domain model.

---

## 10. Data Sources and Repositories

Xeno.JS distinguishes between application-facing persistence abstractions and infrastructure-level data access.

A simplified flow is:

```text
Application
     │
     ▼
Repository Contract
     │
     ▼
Repository Implementation
     │
     ▼
Data Source
     │
     ▼
Database
```

This distinction prevents database-specific APIs from becoming the application's primary abstraction.

The application asks for the capability it needs.

Infrastructure determines how that capability is implemented.

---

## 11. Modules

Xeno.JS uses modules to compose optional application capabilities.

The `AppBuilder` can queue and initialize modules during application bootstrap.

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
             │                           │
     Node.js application          Vue application
          runtime                    runtime
             │                           │
             └─────────────┬─────────────┘
                           │
                           ▼
                     @xeno-js/cli
                 scaffolding & generators
```

### `@xeno-js/shared`

`@xeno-js/shared` contains framework-neutral concepts shared across the ecosystem.

Its source structure includes domain primitives such as:

* aggregates
* entities
* value objects
* domain events
* errors
* results

It also defines application contracts for commands and queries.

The package therefore provides a common architectural language without owning the Node.js runtime or Vue runtime.

### `@xeno-js/core`

`@xeno-js/core` is the main Node.js application architecture package.

It provides:

* application composition
* dependency injection
* service lifetimes
* service scopes
* CQRS
* mediator execution
* pipelines
* request context
* modules
* repositories
* data sources
* infrastructure integrations

The package contains the runtime mechanisms that execute the application architecture.

### `@xeno-js/vue`

`@xeno-js/vue` brings the Xeno application model into Vue applications.

Its structure includes its own:

* application layer
* domain contracts
* infrastructure
* context
* data sources
* application pipelines
* application builder

It also re-exports the shared architectural language from `@xeno-js/shared`.

This means the frontend is not treated simply as a collection of UI components.

It can participate in the same application-oriented model.

### `@xeno-js/cli`

`@xeno-js/cli` is the developer tooling layer.

It is responsible for:

* creating Xeno projects
* selecting project types
* generating architecture-aligned files
* generating commands
* generating queries
* scaffolding Core applications
* scaffolding Vue applications

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
   │                    │      │                    │
   │ Node.js runtime    │      │ Vue runtime        │
   │ DI / CQRS / Scope  │      │ DI / CQRS / Pipes  │
   │ Context / Modules  │      │ Context / Sources  │
   └─────────┬──────────┘      └─────────┬──────────┘
             │                           │
             └─────────────┬─────────────┘
                           ▼
                  ┌──────────────────┐
                  │   @xeno-js/cli   │
                  │                  │
                  │ Scaffold / Gen   │
                  └──────────────────┘
```

The important distinction is:

> **Shared defines common concepts. Core and Vue execute those concepts in their respective environments. CLI creates projects and components around them.**

---

## 14. A Complete Application Flow

Putting the architecture together, a backend request can be understood as:

```text
                    HTTP Request
                         │
                         ▼
                  Presentation Layer
                         │
                         ▼
                  Command / Query
                         │
                         ▼
                      Mediator
                         │
                         ▼
                     Pipeline
              ┌──────────┼──────────┐
              │          │          │
         Validation  Authorization Logging
              │          │          │
              └──────────┼──────────┘
                         ▼
                       Handler
                         │
                         ▼
                    Domain Logic
                         │
                         ▼
                 Repository Contract
                         │
                         ▼
                Repository / DataSource
                         │
                         ▼
                      Database
```

The response then travels back through the application boundary to the presentation layer.

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

This allows the frontend to use application-oriented concepts instead of placing all application behavior directly inside Vue components.

The exact frontend composition is provided by `@xeno-js/vue`.

---

## 16. The Composition Root

One of the most important architectural concepts in Xeno.JS is the **composition root**.

This is where the application decides:

* which services exist
* which implementations they use
* which lifetimes they have
* which modules are enabled
* which pipelines are configured
* which infrastructure is available

In Xeno.JS, `AppBuilder` provides the primary mechanism for this composition.

```text
                    Composition Root
                         │
                    AppBuilder
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
        ▼                ▼                 ▼
   Dependencies       Modules          Pipelines
        │                │                 │
        └────────────────┼─────────────────┘
                         ▼
                  Application Runtime
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
Application
    ↓
Domain
    ↓
Infrastructure
```

But the dependencies are not intended to make infrastructure the center of the system.

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

The concrete technology can change without redefining the application's business use cases.

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
                     │
              explicit contracts
                     │
                     ▼
             ┌───────────────┐
             │ Infrastructure │
             └───────────────┘
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
│        HTTP       CLI       Worker       Vue / Browser        │
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
│  Dependency Injection • Scopes • Context • Modules           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                          DOMAIN                              │
│                                                              │
│  Entities • Aggregates • Value Objects • Events • Rules      │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                          │
│                                                              │
│  Database • Repositories • Data Sources • Cache • Auth       │
│  HTTP Clients • Logging • Resilience • External Services      │
└──────────────────────────────────────────────────────────────┘


                    SHARED ARCHITECTURAL LANGUAGE

                         @xeno-js/shared
                                │
                 ┌──────────────┴──────────────┐
                 ▼                             ▼
          @xeno-js/core                  @xeno-js/vue
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                         @xeno-js/cli
```

This is the mental model to keep while reading the rest of the documentation.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
