---
title: "Fundamentals"
description: "Learn the core concepts for composing and running a Xeno.JS application, including the Xeno Registry, App Builder, Service Container, dependency injection, service lifetimes, modules, and application context."
canonical: "https://www.xeno-js.it/docs/fundamentals/overview"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "fundamentals"
category: "architecture"
topics: "Xeno.JS Fundamentals, Xeno.JS Application Architecture, Xeno Registry, App Builder, Service Container, Dependency Injection, Service Lifetimes, Modules, Context and Scopes"
keywords: "Xeno.JS fundamentals, Xeno.JS architecture, Xeno.JS App Builder, Xeno.JS Service Container, Xeno.JS dependency injection, Xeno.JS service lifetimes, Xeno.JS modules, Xeno.JS context, Xeno.JS scopes"
sidebar:
  group: "Fundamentals"
  order: 1
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "Fundamentals"
    url: "https://www.xeno-js.it/docs/fundamentals"
  - name: "Overview"
    url: "https://www.xeno-js.it/docs/fundamentals/overview"
related:
  next:
    - "/docs/fundamentals/xeno-registry"
prerequisites: []
relatedTopics:
  - "/docs/introduction/architecture-overview"
  - "/docs/introduction/core-principles"
  - "/docs/getting_started/project-structure"
faqs:
  - question: "What are the Fundamentals of Xeno.JS?"
    answer: "The Fundamentals section explains the core building blocks used to compose and run a Xeno.JS application, including the Xeno Registry, App Builder, Service Container, dependency injection, service lifetimes, modules, and context and scopes."
  - question: "What does the App Builder do in Xeno.JS?"
    answer: "The App Builder is used to compose a Xeno.JS application by configuring services, context, middleware, pipelines, and infrastructure integrations before the application runtime is built."
  - question: "What is the Service Container in Xeno.JS?"
    answer: "The Service Container manages runtime dependencies and supports explicit service lifetimes such as singleton, scoped, and transient."
  - question: "Why are service lifetimes important?"
    answer: "Service lifetimes define how long dependency instances live and are an important part of application composition and resource management."
  - question: "What are Context and Scopes?"
    answer: "Context and scopes provide the execution context in which application operations and scoped dependencies can run."
answerSummary: "Xeno.JS Fundamentals explain how an application is composed and executed through the Registry, App Builder, Service Container, dependency injection, service lifetimes, modules, and context and scopes."
directAnswer:
  question: "What are the Fundamentals of Xeno.JS?"
  answer: "The Fundamentals are the core building blocks used to compose and run a Xeno.JS application, from dependency registration and application building to runtime dependency resolution, service lifetimes, modules, context, and scopes."
keyFacts:
  - "Xeno.JS Fundamentals focus on application composition and runtime foundations."
  - "The Xeno Registry defines the dependency vocabulary used by an application."
  - "The App Builder composes application capabilities before the runtime container is built."
  - "The Service Container manages runtime dependencies and service lifetimes."
  - "Xeno.JS supports singleton, scoped, and transient service lifetimes."
  - "Modules provide a way to organize application composition."
  - "Context and scopes define execution context and scoped dependency boundaries."
--- 

## Overview

Fundamentals introduces the core building blocks that Xeno.JS provides for composing an application.

While the [Architecture Overview](../introduction/architecture-overview) explains how Xeno.JS structures an application at a higher level, this section focuses on the mechanisms used to build that application: the registry, the application builder, dependency injection, service lifetimes, modules, and execution context.

The goal is to make the application's composition explicit and predictable.

---

## What You Will Learn

The Fundamentals section covers the following concepts:

* **Xeno Registry** — the central place for defining application-level tokens and registrations.
* **App Builder** — the entry point for composing and configuring a Xeno.JS application.
* **Service Container** — the runtime container responsible for resolving application dependencies.
* **Dependency Injection** — how services and dependencies are explicitly provided and resolved.
* **Service Lifetimes** — how services live and how their lifetime affects application behavior.
* **Modules** — how application functionality can be organized and composed into reusable units.
* **Context & Scopes** — how scoped execution and contextual state are managed during application execution.

---

## The Composition Model

A Xeno.JS application is assembled rather than implicitly discovered.

At startup, the application composition defines the services, modules, infrastructure integrations, middleware, pipelines, and other capabilities that are available to the application.

A simplified model looks like this:

```text
Application
    │
    ▼
Xeno Registry
    │
    ▼
App Builder
    │
    ├── Services
    ├── Modules
    ├── Middleware
    ├── Pipelines
    └── Infrastructure
    │
    ▼
Service Container
    │
    ├── Singleton services
    ├── Scoped services
    └── Transient services
    │
    ▼
Application Execution
    │
    └── Context & Scopes
```

The exact configuration depends on the application, but the underlying model remains explicit: the application defines what it needs and how those dependencies are composed.

---

## Xeno Registry

The **Xeno Registry** provides a common architectural vocabulary for registering and identifying application dependencies.

Rather than relying on implicit global state or convention-based discovery, dependencies can be represented through explicit tokens and registrations.

The registry becomes particularly useful as an application grows and more services, repositories, infrastructure components, and application capabilities need to be composed together.

See [Xeno Registry](./xeno-registry) for more information.

---

## App Builder

The **App Builder** is the main composition entry point for a Xeno.JS application.

It allows the application to progressively configure its runtime before producing the final application container.

Typical configuration can include:

* application context
* middleware
* pipelines
* database integrations
* cache
* authentication
* logging
* application services

This makes the composition root visible in one place instead of distributing application setup across unrelated parts of the codebase.

See [App Builder](./app-builder) for more information.

---

## Service Container

Once the application has been configured, Xeno.JS uses a **service container** to manage and resolve registered dependencies.

The container is responsible for turning the application's registrations into runtime instances and respecting the lifetime associated with each service.

This creates a clear distinction between:

1. **registration** — describing what the application provides;
2. **composition** — configuring those registrations;
3. **resolution** — obtaining the required dependency at runtime.

See [Service Container](./service-container) for more information.

---

## Dependency Injection

Dependency Injection is one of the mechanisms used to keep application dependencies explicit.

Instead of a component creating its own infrastructure dependencies, those dependencies can be provided by the application's composition.

For example, an application service can depend on an abstraction without deciding how that abstraction is instantiated:

```text
Application Service
        │
        ▼
   Dependency
   (abstraction)
        │
        ▼
 Service Container
        │
        ▼
 Concrete Implementation
```

This separates the responsibility of **using a dependency** from the responsibility of **composing the dependency**.

See [Dependency Injection](./dependency-injection) for more information.

---

## Service Lifetimes

Not every dependency should live for the same amount of time.

Xeno.JS supports explicit service lifetimes such as:

* **Singleton** — one instance shared by the application container.
* **Scoped** — one instance associated with an execution scope.
* **Transient** — a new instance created when the dependency is resolved.

Choosing a lifetime is therefore part of application composition, rather than an implementation detail hidden from the developer.

See [Service Lifetimes](./service-lifetimes) for more information.

---

## Modules

As an application grows, registering every capability directly in the main composition root can become difficult to maintain.

**Modules** provide a way to group related application configuration and registrations into cohesive units.

A module can encapsulate the composition required for a particular capability while still participating in the application's overall composition model.

See [Modules](./modules) for more information.

---

## Context & Scopes

Application execution often requires contextual information that should be available throughout a particular scope of execution.

Xeno.JS provides mechanisms for working with **context** and **scopes**, allowing contextual state and scoped dependencies to follow an execution boundary.

This is particularly important for request-oriented or otherwise scoped execution, where multiple components may need access to the same contextual information without passing it manually through every method call.

See [Context & Scopes](./context-and-scopes) for more information.

---

## How the Pieces Fit Together

The Fundamentals concepts are closely related:

```text
                 Xeno Registry
                       │
                       ▼
                  App Builder
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Modules      Services    Pipelines
          │            │
          │            ▼
          │     Dependency Injection
          │            │
          └────────────┤
                       ▼
                Service Container
                       │
              ┌────────┴────────┐
              ▼                 ▼
          Lifetimes          Scopes
                                │
                                ▼
                         Application Context
```

Together, these mechanisms provide the foundation on which the other Xeno.JS capabilities are composed.

The **Application** section builds on these fundamentals to explain how application logic is executed through commands, queries, mediation, pipelines, and behaviors.

---

## Where to Go Next

If you are new to Xeno.JS, the recommended order is:

1. [Xeno Registry](./xeno-registry)
2. [App Builder](./app-builder)
3. [Service Container](./service-container)
4. [Dependency Injection](./dependency-injection)
5. [Service Lifetimes](./service-lifetimes)
6. [Modules](./modules)
7. [Context & Scopes](./context-and-scopes)

These concepts form the foundation for understanding the rest of the framework.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
