---
title: "Xeno Registry"
description: "Learn how XenoRegistry types built-in and application-specific services for Xeno.JS dependency injection."
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
  - "/docs/dependency-injection/service-container"
faqs:
  - question: "What is the Xeno Registry?"
    answer: "XenoRegistry is a TypeScript type that combines the built-in ApplicationRegistry with an application's additional service keys and their types."
  - question: "What is the difference between the Xeno Registry and the Service Container?"
    answer: "XenoRegistry is a compile-time type contract for service keys and types; the Service Container stores runtime registrations and resolves instances."
  - question: "Where is the Xeno Registry defined?"
    answer: "Define an application-specific type or interface by extending XenoRegistry; a registry.ts file is a common place to keep that type."
  - question: "Should the Xeno Registry store runtime state?"
    answer: "XenoRegistry is a type and has no runtime storage. Runtime state belongs to services, context, or other application mechanisms."
  - question: "How does the Xeno Registry relate to dependency injection?"
    answer: "The registry type constrains service keys and value types in typed registration and resolution APIs; runtime factories and the Service Container perform registration and resolution."
answerSummary: "XenoRegistry is the compile-time type for built-in and application-specific service keys. Runtime registrations and service resolution are handled by the Service Container."
directAnswer:
  question: "What is the Xeno Registry?"
  answer: "XenoRegistry is a TypeScript type that combines the built-in ApplicationRegistry with application-specific service keys and types."
keyFacts:
  - "XenoRegistry is a type alias, not a runtime registry object or class."
  - "XenoRegistry combines ApplicationRegistry with an application's additional service keys."
  - "The registry type constrains service registration and resolution at compile time."
  - "The Service Container stores runtime registrations and resolves service instances."
  - "The Registry and Service Container have different responsibilities."
  - "The Registry should not be used to store runtime application state."
---

## Introduction

`XenoRegistry` is a TypeScript type that defines the keys and service types available to the application's typed dependency-injection APIs.

It combines the built-in `ApplicationRegistry` with application-specific service keys. It does not store runtime registrations or service instances; the Service Container handles those at runtime.

The type works with the [App Builder](./app-builder) and the [Service Container](../dependency-injection/service-container) to check registrations and resolutions against the application contract.

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

The application registry type makes those keys and their service types explicit. It is a compile-time contract, not a runtime store of registrations.

The relationship is:

```text
XenoRegistry Type
    │
    ├── Built-in service keys and types
    └── Application-specific service keys and types
             │
             ▼
       Type-checks registration
             │
             ▼
       Service Container
             │
             └── Runtime registrations and instances
```

The registry type describes **which service keys and types are valid**.

The Service Container is responsible for **registering and resolving dependencies at runtime**.

## Registry vs. Container

The Registry and the Service Container have different responsibilities.

| Component         | Responsibility                                   |
| ----------------- | ------------------------------------------------ |
| XenoRegistry      | Defines the compile-time service keys and their types |
| App Builder       | Composes the application and its registrations   |
| Service Container | Stores registrations and resolves dependencies at runtime |

This separation keeps application composition explicit.

`XenoRegistry` is a type, not a separate runtime object. It constrains the keys and service types accepted by the container; the container itself stores the registrations and resolves the instances.

## The Xeno Registry

`XenoRegistry` is a type alias over the built-in `ApplicationRegistry`, with an optional type parameter for application-specific service keys and value types.

A project can define an application-specific type using this alias. It is not a class and is not constructed at runtime.

For example:

```ts
import type { XenoRegistry } from "@xeno-js/shared"

interface InventoryRegistry extends XenoRegistry {
  STOCK_REPOSITORY: {
    getAvailableQuantity(sku: string): number
  }
  RESERVATION_SERVICE: {
    reserve(sku: string, quantity: number): void
  }
}
```

The first two generic parameters represent the database context and transaction types used by the built-in registry. They default to `unknown`. The third parameter adds application-specific keys and their value types.

The registry is a compile-time shape. Runtime registrations still belong to the builder and its container. The third type parameter adds keys that do not replace keys already defined by `ApplicationRegistry`.

An application may keep this type in a dedicated `registry.ts` module:

```text
src/
├── bootstrap.ts
└── registry.ts
```

The file name and project layout are conventions; the type can be declared wherever the application keeps its composition contracts.

## Application-Specific Tokens

A registry becomes useful when an application introduces dependencies that are specific to its own architecture.

For example, an inventory application can add a repository key and its contract to the registry type:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/shared'

interface StockRepository {
  getAvailableQuantity(sku: string): number
}

interface InventoryRegistry extends XenoRegistry {
  STOCK_REPOSITORY: StockRepository
}

const builder = new XenoAppBuilder<InventoryRegistry>()

const availableStock = new Map<string, number>([['SKU-100', 8]])

builder.addServices((services) => {
  services.addSingleton('STOCK_REPOSITORY', () => ({
    getAvailableQuantity: (sku) => availableStock.get(sku) ?? 0,
  }))
})

const application = await builder.build()
const stockRepository = application.getServices().STOCK_REPOSITORY
const availableQuantity = stockRepository.getAvailableQuantity('SKU-100')
```

The registry type associates `STOCK_REPOSITORY` with `StockRepository`. The builder registers a runtime implementation under that key, and `getServices()` exposes it using the same registry key.

Built-in services use the keys declared in `ApplicationRegistry`. When the logger is registered, `TOKENS.LOGGER` has the value `logger`, so both forms access the same service:

```ts
import { TOKENS } from '@xeno-js/shared'

const {logger} = application.getServices()
const loggerByToken = application.getServices().LOGGER
```

Conceptually:

```text
          Registry
             │
     ┌───────┴────────┐
     ▼                ▼
 STOCK_REPOSITORY   StockRepository
     key               type
     └───────┬────────┘
             ▼
       App Composition
             │
             ▼
      Concrete Services
```

This lets TypeScript check that registration and resolution use the declared service contract while the composition layer supplies its implementation.

## The Registry as Part of the Composition Root

The registry belongs to the application's composition model.

A typical Xeno.JS application has a flow similar to:

```text
registry.ts (type)
     │
     ▼
bootstrap.ts (runtime registrations)
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

The registry type defines the application's service keys and types.

The bootstrap process uses the type while composing the application and registering runtime implementations.

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
           "STOCK_REPOSITORY"
                   │
                   ▼
            Service Container
                   │
                   ▼
          StockRepository implementation
                   │
                   ▼
             Application Service
```

The application service does not need to know how the repository was constructed.

The composition layer registers an implementation under the typed service key.

For more information about resolving dependencies, see [Dependency Injection](./dependency-injection).

## Registry and Infrastructure

The registry type can describe an application-facing contract independently of its infrastructure implementation.

For example, an application may define a repository contract while infrastructure provides a concrete database implementation.

The composition can then connect the two:

```text
Application
    │
    ▼
Repository Contract
    │
    │ exposed through the application service key
    ▼
Registry Service Key
    │
    ▼
Infrastructure Registration
    │
    ▼
Database Repository
```

The composition layer can then register an implementation that satisfies the declared contract. The registry type constrains its key and service shape; it does not select or instantiate that implementation.

## Customizing the Registry

The registry type should describe application-specific service keys and their types rather than runtime state.

A useful rule is:

> **Use the registry type to describe service keys and contracts, not to store runtime state.**

Runtime state belongs to the appropriate service, context, scope, or other application mechanism.

Keeping the type focused makes the application contract easier to review.

## Registry in a Project

An application can keep its registry type in a `registry.ts` file and import it from the composition module.

For example:

```text
my-app/
├── src/
│   ├── bootstrap.ts
│   └── registry.ts
```

This is an organizational convention, not a required Xeno.JS runtime file or folder layout. The registry type can be declared wherever the application keeps its composition contracts.

## Summary

`XenoRegistry` is the compile-time contract for the built-in and application-specific service keys used by typed registration and resolution.

It provides:

* type-safe service keys and corresponding service types;
* an extension point for application-specific service contracts;
* compile-time integration with the App Builder and Service Container.

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

Once the Registry is understood, the next step is to understand how the application composition is assembled through the [App Builder](./app-builder).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
