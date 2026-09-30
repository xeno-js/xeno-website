---
title: "Xeno Registry"
description: "Learn how the Xeno Registry defines and organizes the dependency vocabulary and application-specific tokens used to compose a Xeno.JS application."
canonical: "https://www.xeno-js.it/docs/fundamentals/xeno-registry"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "fundamentals"
category: "dependency-injection"
topics: "Xeno.JS Registry, Xeno Registry, Dependency Injection, Dependency Tokens, Application Composition, Service Container, Application Architecture"
keywords: "Xeno.JS Registry, Xeno Registry, Xeno.JS dependency injection, Xeno.JS dependency tokens, Xeno.JS Service Container, Xeno.JS application composition, Xeno.JS dependency management"
sidebar:
  group: "Fundamentals"
  order: 2
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "Fundamentals"
    url: "https://www.xeno-js.it/docs/fundamentals"
  - name: "Xeno Registry"
    url: "https://www.xeno-js.it/docs/fundamentals/xeno-registry"
related:
  next:
    - "/docs/fundamentals/app-builder"
prerequisites:
  - "/docs/fundamentals"
relatedTopics:
  - "/docs/fundamentals/service-container"
  - "/docs/fundamentals/dependency-injection"
  - "/docs/fundamentals/service-lifetimes"
faqs:
  - question: "What is the Xeno Registry?"
    answer: "The Xeno Registry defines and organizes the dependency vocabulary used by a Xeno.JS application, including application-specific dependency tokens."
  - question: "What is the difference between the Xeno Registry and the Service Container?"
    answer: "The Registry defines the application's dependency vocabulary, while the Service Container manages runtime dependency resolution and service instances."
  - question: "Where is the Xeno Registry defined?"
    answer: "A generated Xeno.JS Core project includes a registry.ts file in the src directory where the application registry can be defined and extended."
  - question: "Should the Xeno Registry store runtime state?"
    answer: "No. The Registry should define application dependency vocabulary and tokens rather than being used as a store for runtime application state."
  - question: "How does the Xeno Registry relate to dependency injection?"
    answer: "The Registry provides the tokens and dependency vocabulary used as part of the application's dependency injection and composition model."
answerSummary: "The Xeno Registry defines the dependency vocabulary of a Xeno.JS application and provides the foundation for organizing application-specific dependency tokens during composition."
directAnswer:
  question: "What is the Xeno Registry?"
  answer: "The Xeno Registry is the mechanism used to define and organize the dependency vocabulary and application-specific tokens of a Xeno.JS application."
keyFacts:
  - "The Xeno Registry defines application dependency vocabulary."
  - "A generated Core project includes src/registry.ts."
  - "The application registry extends XenoRegistry."
  - "The Registry is part of the application's composition model."
  - "The Registry and Service Container have different responsibilities."
  - "The Registry should not be used to store runtime application state."
---

## Xeno Registry

The **Xeno Registry** is the mechanism used by Xeno.JS to define the application's dependency vocabulary.

It provides a centralized place for application-specific tokens and registrations, allowing different parts of an application to refer to dependencies explicitly rather than relying on implicit names or global state.

The registry works together with the [App Builder](./app-builder.md) and the [Service Container](./service-container.md) to turn those definitions into runtime dependencies.

## Why a Registry?

As an application grows, it can have many different dependencies:

* application services
* repositories
* data sources
* infrastructure services
* clients
* configuration
* authentication services
* loggers
* caches

Those dependencies need stable identifiers so that they can be registered and resolved consistently.

Instead of scattering dependency identifiers throughout the application, Xeno.JS provides a registry as the place where the application's dependency vocabulary can be defined.

The basic idea is:

```text
Application
    │
    ▼
Xeno Registry
    │
    ├── Dependency Token
    ├── Dependency Token
    ├── Dependency Token
    └── Dependency Token
            │
            ▼
      Service Container
            │
            ▼
      Runtime Instance
```

The Registry describes **what the application knows about**.

The Service Container is responsible for **resolving those dependencies at runtime**.

## Registry vs. Container

The Registry and the Service Container have different responsibilities.

| Component         | Responsibility                                   |
| ----------------- | ------------------------------------------------ |
| Xeno Registry     | Defines the application's dependency identifiers |
| App Builder       | Composes the application and its registrations   |
| Service Container | Resolves registered dependencies at runtime      |

This separation keeps application composition explicit.

The Registry is not intended to replace the container. It provides the vocabulary that the container uses when dependencies are registered and resolved.

## The Xeno Registry

Xeno.JS provides a base `XenoRegistry` that can be extended by an application.

A project can define its own registry for application-specific dependency tokens.

For example:

```ts
import { XenoRegistry } from "@xeno-js/core";

export class MyRegistry extends XenoRegistry {
  // Application-specific tokens
}
```

The generated project structure uses this pattern so that application-specific registrations have a dedicated place.

For example, the scaffolded project may contain:

```text
src/
├── bootstrap.ts
├── main.ts
└── registry.ts
```

The `registry.ts` file is where the application's registry can be customized.

## Application-Specific Tokens

A registry becomes useful when an application introduces dependencies that are specific to its own architecture.

For example, an application might need to identify:

```text
UserRepository
PaymentService
EmailClient
StorageService
```

Instead of coupling consumers to concrete implementations, the application can expose stable dependency tokens and let the composition layer decide which implementation should be provided.

Conceptually:

```text
          Registry
             │
     ┌───────┼────────┐
     ▼       ▼        ▼
  UserRepo  Email   Storage
   Token     Token    Token
     │       │        │
     └───────┼────────┘
             ▼
       App Composition
             │
             ▼
      Concrete Services
```

This allows the application code to depend on the dependency contract while the composition layer decides how that dependency is implemented.

## The Registry as Part of the Composition Root

The registry belongs to the application's composition model.

A typical Xeno.JS application has a flow similar to:

```text
registry.ts
     │
     ▼
bootstrap.ts
     │
     ▼
App Builder
     │
     ▼
Service Container
     │
     ▼
Application
```

The registry defines the application's dependency vocabulary.

The bootstrap process then uses that vocabulary while composing the application.

This keeps dependency configuration close to the composition root instead of requiring individual application components to know how their dependencies are created.

## Registry and Dependency Injection

The Registry is closely related to Dependency Injection, but the two concepts should not be confused.

**Dependency Injection** describes how dependencies are provided to a component.

The **Registry** provides a consistent way to identify those dependencies within the application's composition model.

For example:

```text
                Registry
                   │
                   ▼
             "UserRepository"
                   │
                   ▼
            Service Container
                   │
                   ▼
          PostgreSQL Repository
                   │
                   ▼
             Application Service
```

The application service does not need to know how the repository was constructed.

The composition layer connects the token to the implementation.

For more information about resolving dependencies, see [Dependency Injection](./dependency-injection.md).

## Registry and Infrastructure

The Registry can be used to keep application code independent from infrastructure implementations.

For example, an application may define a repository contract while infrastructure provides a concrete database implementation.

The composition can then connect the two:

```text
Application
    │
    ▼
Repository Contract
    │
    │ identified through
    ▼
Registry Token
    │
    ▼
Infrastructure Registration
    │
    ▼
Database Repository
```

This is particularly useful when the same application architecture needs to work with different implementations.

The application does not need to change simply because the infrastructure implementation changes.

## Customizing the Registry

The registry should contain application-specific dependency definitions rather than becoming a general-purpose container for unrelated application state.

A useful rule is:

> **Use the registry to name dependencies, not to store runtime state.**

Runtime state belongs to the appropriate service, context, scope, or other application mechanism.

This keeps the registry focused and makes the application's dependency graph easier to understand.

## Registry in a Generated Project

Projects created through the Xeno CLI include a `registry.ts` file.

A generated Core project follows this general structure:

```text
my-app/
├── src/
│   ├── bootstrap.ts
│   ├── main.ts
│   └── registry.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

The generated registry extends `XenoRegistry` and provides the starting point for defining application-specific tokens.

As the application grows, this file can become part of the application's composition model alongside `bootstrap.ts`.

See [Project Structure](../getting-started/project-structure.md) for more information about the generated project.

## Summary

The Xeno Registry provides the dependency vocabulary of a Xeno.JS application.

Its main responsibilities are:

* defining application-specific dependency tokens;
* providing stable identifiers for dependencies;
* integrating those identifiers with application composition;
* keeping dependency definitions separate from their implementations;
* working together with the App Builder and Service Container.

The resulting model is explicit:

```text
Registry
   │
   ▼
App Builder
   │
   ▼
Service Container
   │
   ▼
Resolved Dependencies
```

Once the Registry is understood, the next step is to understand how the application composition is assembled through the [App Builder](./app-builder.md).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
