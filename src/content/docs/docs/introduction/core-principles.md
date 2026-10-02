---
title: "Xeno.JS Core Principles"
description: "The core architectural principles behind Xeno.JS, including explicit application boundaries, dependency direction, composition, lifetimes, execution pipelines, and framework independence."
canonical: "https://www.xeno-js.it/docs/introduction/core-principles"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
author:
name: "Xeno.JS Team"
url: "https://www.xeno-js.it"
type: "documentation"
section: "introduction"
category: "architecture"
topics: "Xeno.JS Principles, TypeScript Architecture Principles, Application Architecture, Domain-Driven Design, CQRS, Dependency Injection, Dependency Inversion, Explicit Architecture, Framework Independence"
keywords: "Xeno.JS principles, Xeno.JS architecture principles, TypeScript architecture principles, TypeScript application architecture, application architecture principles, TypeScript DDD principles, TypeScript CQRS principles, TypeScript dependency injection, explicit dependency injection, framework independent architecture"
sidebar:
  group: "Introduction"
  order: 4
breadcrumbs:
- name: "Docs"
  url: "https://www.xeno-js.it/docs"
- name: "Introduction"
  url: "https://www.xeno-js.it/docs/introduction"
- name: "Core Principles"
  url: "https://www.xeno-js.it/docs/introduction/core-principles"
related:
  next:
  - "/docs/getting-started/installation"
prerequisites:
  - "/docs/introduction/what-is-xeno-js"
  - "/docs/introduction/why-xeno-js"
  - "/docs/introduction/architecture-overview"
relatedTopics:
  - "/docs/introduction/what-is-xeno-js"
  - "/docs/introduction/why-xeno-js"
  - "/docs/introduction/architecture-overview"
faqs:
- question: "What are the core principles of Xeno.JS?"
  answer: "Xeno.JS is built around explicit application architecture, clear dependency boundaries, explicit composition, explicit lifetimes and scopes, composable application execution, domain independence, and framework-independent application logic."
- question: "Why does Xeno.JS favor explicit architecture?"
  answer: "Xeno.JS makes important architectural decisions visible in application code, including dependency registration, service lifetimes, application composition, and execution pipelines."
- question: "Does Xeno.JS depend on a specific HTTP framework?"
  answer: "No. Xeno.JS is positioned as an application architecture framework rather than an HTTP framework, so transport concerns can remain at the application boundary."
- question: "How does Xeno.JS separate domain and infrastructure?"
  answer: "Domain concepts and application contracts are kept separate from concrete infrastructure implementations such as databases, HTTP clients, caches, and other external services."
- question: "Why are dependency lifetimes explicit in Xeno.JS?"
  answer: "Explicit lifetimes and scopes make the lifecycle of dependencies part of the application composition model instead of leaving lifecycle decisions implicit."
- question: "Why does Xeno.JS use commands, queries, and pipelines?"
  answer: "Commands and queries provide explicit application-level operations, while pipelines provide a composable place for cross-cutting execution concerns such as validation, authorization, logging, caching, and error handling."
answerSummary: "Xeno.JS is guided by explicit application architecture: dependencies, boundaries, composition, lifetimes, execution pipelines, and domain responsibilities are made visible in code instead of being primarily inferred through framework conventions."
directAnswer:
  question: "What are the core principles of Xeno.JS?"
  answer: "Xeno.JS follows an explicit application architecture in which application boundaries, dependencies, lifetimes, composition, execution flow, and domain responsibilities are represented directly in the architecture and code."
keyFacts:
- "Application architecture is explicit rather than primarily convention-driven."
- "Application logic is separated from transport and infrastructure concerns."
- "Dependencies are registered and composed explicitly."
- "Dependency lifetimes and scopes are explicit architectural concerns."
- "Application execution is modeled through commands, queries, handlers, and pipelines."
- "Domain concepts remain independent from concrete infrastructure implementations."
- "Composition is centralized through an application composition root."
- "Frameworks and transports are treated as boundaries around the application rather than as the application architecture itself."
---

## Introduction

Xeno.JS is built around a simple architectural idea:

> **Make application architecture explicit in code.**

As an application grows, its architecture is shaped by decisions about dependencies, business logic, infrastructure, execution flow, state, and application boundaries.

Xeno.JS treats those decisions as first-class architectural concerns.

This does not mean that every application must follow the same structure. It means that when a structure is chosen, important boundaries should be visible, understandable, and composable.

---

## 1. Application architecture should be explicit

The first principle of Xeno.JS is explicitness.

A growing application eventually needs to answer questions such as:

* Which component owns this business rule?
* Which dependencies does this use case require?
* Where is a dependency created?
* How long does that dependency live?
* Which cross-cutting behaviors run before a use case?
* Which part of the application knows about the database?
* Which part knows about HTTP?
* Which part represents the domain?

Xeno.JS makes these architectural relationships explicit through application composition, dependency registration, scopes, commands, queries, pipelines, contracts, and modules.

The goal is not to eliminate abstraction.

The goal is to make important abstractions visible.

---

## 2. The application is independent from its transport

HTTP is a transport mechanism.

It is not the application itself.

The same application logic may be invoked through:

* an HTTP API;
* a CLI command;
* a background worker;
* a message consumer;
* a scheduled job;
* a browser application.

Xeno.JS therefore places application logic behind explicit boundaries rather than coupling it directly to a particular transport.

A controller, route, or other entry point should translate an external request into an application operation.

Conceptually:

```text
External Transport
       │
       ▼
Presentation / Entry Point
       │
       ▼
Application Operation
       │
       ▼
Domain + Infrastructure
```

This allows the application model to remain stable while the surrounding transport changes.

---

## 3. Dependencies should be explicit

Dependencies are part of architecture.

A service that requires a repository, logger, cache, authorization service, or other component should express that dependency explicitly.

Xeno.JS uses explicit dependency registration and resolution rather than relying primarily on automatic discovery.

This makes the composition of the application visible at its composition boundary.

The important distinction is:

```text
Implicit architecture
    ↓
"the framework discovers and connects things"

Explicit architecture
    ↓
"the application defines how things are connected"
```

The XenoRegistry and `ServiceContainer` are part of this model. The registry describes the application's dependency contract, while the container handles runtime registration, resolution, lifetimes, and scopes.

---

## 4. Composition belongs at the composition root

Application components should not be responsible for constructing the entire dependency graph themselves.

Composition should happen at a well-defined boundary.

In Xeno.JS, `AppBuilder` provides the main composition mechanism for configuring modules, services, infrastructure, pipelines, logging, database integrations, and other application capabilities before the application is built.

Conceptually:

```text
Application Components
        │
        │ declare dependencies
        ▼
Dependency Contracts
        │
        ▼
Composition Root
        │
        ├── implementations
        ├── lifetimes
        ├── modules
        └── infrastructure
```

This separates **using a dependency** from **deciding how that dependency is constructed**.

---

## 5. Lifetimes are architectural decisions

Not every dependency should live for the same amount of time.

An application may contain:

* long-lived services;
* request-scoped services;
* short-lived objects.

Xeno.JS makes these lifetimes explicit through its dependency injection model and scopes.

This becomes particularly important when application execution is asynchronous.

A request-scoped dependency should belong to the request in which it was created rather than accidentally becoming shared application state.

Xeno.JS uses asynchronous execution context to associate request-specific state and dependency scopes with the current execution flow.

The principle is therefore:

> **Dependency lifetime should be deliberate, not accidental.**

---

## 6. Application execution should be composable

An application operation rarely consists of only one function call.

A command or query may require:

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Validation
  ↓
Logging
  ↓
Caching
  ↓
Handler
  ↓
Result
```

Xeno.JS models this execution flow through commands, queries, handlers, and pipeline behaviors.

This gives cross-cutting concerns a defined place in the application execution model instead of requiring every handler to implement them independently.

For example, Xeno's command and query pipelines can host behaviors for validation, authorization, logging, exception handling, caching, idempotency, and concurrency-related concerns.

The principle is:

> **Application execution should have explicit extension points.**

---

## 7. Commands and queries represent application intent

The application layer should express what the application is being asked to do.

Commands represent operations that modify application state.

Queries represent operations that retrieve information.

This distinction is useful because the two operations often have different requirements.

For example:

```text
CreateOrderCommand
UpdateCustomerCommand
CancelSubscriptionCommand
```

are different in nature from:

```text
GetOrderQuery
SearchCustomersQuery
GetSubscriptionQuery
```

Xeno.JS makes these operations first-class application messages handled through its mediator and pipeline model.

The principle is not that every system must use CQRS at maximum complexity.

The principle is:

> **Application intent should be explicit.**

---

## 8. The domain should not depend on infrastructure

Business concepts should not need to know how data is persisted or how external systems are contacted.

A domain model should be able to express concepts such as:

* entities;
* value objects;
* aggregates;
* domain events;
* domain errors;
* business invariants.

Infrastructure can then provide concrete implementations for things such as:

* databases;
* repositories;
* external APIs;
* caches;
* messaging systems;
* logging providers.

Xeno.JS's shared and domain primitives are designed around this separation. Its repository and data-access abstractions also distinguish application/domain concepts from concrete persistence mechanisms.

Conceptually:

```text
        Application
             │
             ▼
          Domain
             │
             │ contracts
             ▼
      Infrastructure
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
      DB    API   Cache
```

The infrastructure can change without requiring the domain model to become a database model.

---

## 9. Frameworks should be boundaries, not the architecture

Xeno.JS does not need to own every part of an application.

An application may use an HTTP framework, database library, ORM, authentication provider, message broker, or frontend framework.

Those technologies solve specific problems.

Xeno.JS provides the application architecture around them.

This is why Xeno.JS can sit underneath transport technologies rather than replacing them.

The distinction is important:

```text
Framework / Transport
        │
        ▼
Application Architecture
        │
        ▼
Domain
        │
        ▼
Infrastructure
```

The architecture should describe the application.

Individual frameworks should implement particular boundaries.

---

## 10. Prefer explicitness over hidden magic

Xeno.JS favors mechanisms that can be understood by reading the application structure.

Examples include:

* explicit service registration;
* explicit dependency contracts;
* explicit scopes;
* explicit application operations;
* explicit pipeline registration;
* explicit module composition.

This does not mean that Xeno.JS contains no abstraction or automation.

The distinction is that automation should support an architecture that remains understandable rather than making the architecture dependent on invisible framework behavior.

---

## 11. Shared architecture should use a shared language

Xeno.JS is organized as an ecosystem rather than a single runtime package.

The packages have different responsibilities:

```text
@xeno-js/shared
        │
        ├── domain primitives
        ├── application contracts
        └── shared architectural types
             │
       ┌─────┴─────┐
       ▼           ▼
@xeno-js/core   @xeno-js/vue
       │           │
       │           │
    Node.js      Vue
    runtime     runtime
       │
       └─────┬─────┘
             ▼
        @xeno-js/cli
      scaffolding/tooling
```

The objective is not to make backend and frontend identical.

It is to provide a common architectural vocabulary where the same concepts make sense across the ecosystem.

---

## 12. Architecture should remain understandable as the system grows

The ultimate purpose of these principles is not architectural complexity for its own sake.

A system should remain understandable when it grows.

New features should have identifiable places for:

* application operations;
* domain rules;
* dependencies;
* infrastructure implementations;
* cross-cutting behaviors;
* composition.

That makes architectural decisions easier to reason about as the number of features and dependencies increases.

The principle can be summarized as:

> **Growth should add functionality without making the architecture progressively invisible.**

---

## The Xeno.JS Mental Model

The principles above can be reduced to one model:

```text
                    ENTRY POINTS
       HTTP · CLI · Worker · Vue · Messages
                         │
                         ▼
                APPLICATION LAYER
        Commands · Queries · Handlers
        Pipelines · Dependencies · Context
                         │
                         ▼
                    DOMAIN
      Entities · Value Objects · Aggregates
             Events · Business Rules
                         │
                         ▼
                 INFRASTRUCTURE
        Database · APIs · Cache · Messaging
```

And around this model:

```text
Explicit Composition
Explicit Dependencies
Explicit Lifetimes
Explicit Execution Flow
Explicit Boundaries
```

These are the architectural foundations on which the Xeno.JS ecosystem is built.

---

## What These Principles Do Not Mean

These principles should not be interpreted as requirements to introduce maximum architectural complexity into every project.

A small application may not need:

* multiple modules;
* complex domain models;
* elaborate CQRS;
* many pipeline behaviors;
* multiple infrastructure adapters.

The purpose of Xeno.JS is not to force every application into the same level of abstraction.

Instead, the architecture provides explicit boundaries that can be used when the application needs them.

The important distinction is between **architectural capability** and **architectural complexity**.

---

## Summary

Xeno.JS is guided by a small set of architectural principles:

1. **Make application architecture explicit.**
2. **Keep application logic independent from transport.**
3. **Make dependencies explicit.**
4. **Compose the application at a defined composition root.**
5. **Treat dependency lifetimes and scopes as architectural concerns.**
6. **Make application execution composable through explicit pipelines.**
7. **Represent application intent explicitly through commands and queries.**
8. **Keep domain concepts independent from infrastructure.**
9. **Treat frameworks and transports as boundaries around the application.**
10. **Prefer understandable explicit mechanisms over hidden framework behavior.**
11. **Use a shared architectural language across the Xeno.JS ecosystem.**
12. **Keep the architecture understandable as the system grows.**

Together, these principles define the architectural mindset of Xeno.JS.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
