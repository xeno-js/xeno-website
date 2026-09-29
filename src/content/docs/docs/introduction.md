---
title: 'Introduction to Xeno.JS: The application framework for building scalable and testable application in typescript'
description: 'Explore Xeno.JS, an application architecture framework for TypeScript with explicit dependency injection, DDD, CQRS and modular application boundaries.'
keywords: 'Xeno.JS, Node.js backend framework, TypeScript framework, Domain-Driven Design, CQRS, Enterprise architecture, Explicit Dependency Injection, Clean Architecture, @xeno-js/core'
author: 'Xeno'
---
## What is the Xeno Framework?

**Xeno** is an application framework for building scalable and testable application in typescript. Built for both backend runtime environments and modern browser clients, Xeno aims to solve one of the most pervasive challenges in modern software engineering: the architectural divide between the server and the client.

By natively enforcing **Domain-Driven Design (DDD)**, **Command Query Responsibility Segregation (CQRS)**, and **Pure Dependency Injection (DI)** across the entire stack, Xeno empowers engineering teams to build robust, testable, and highly scalable applications. It is not a tool for rapid prototyping or weekend MVPs; Xeno is a structural foundation designed for mission-critical systems where long-term maintainability and the aggressive reduction of technical debt are paramount.

---

## The Architectural Problem

In contemporary full-stack development, backend and frontend teams often speak entirely different architectural languages. 
Backends are heavily structured with layered architectures, while frontends frequently devolve into "Spaghetti State"—where API fetching, business rules, and UI rendering are tightly coupled inside isolated components. 

This asymmetry leads to:
- **Duplicated Business Logic:** Validation and domain rules are written twice, often inconsistently.
- **Untestable UI Layers:** Testing frontend logic requires mounting the DOM and mocking complex browser APIs.
- **Unmanageable Technical Debt:** As systems grow, changing a database structure or migrating to a new UI framework requires rewriting core application logic.

---

## The Xeno Vision: Unifying the Full-Stack Experience

Xeno bridges this divide by providing a unified, isomorphic architectural contract. With Xeno, a Software Engineer applies the exact same structural design patterns whether they are writing a backend microservice in Node.js or a complex Single Page Application (SPA) in the browser.

By treating the frontend not merely as a document viewer, but as a complex distributed client, Xeno allows teams to share generic primitives, constants, pipeline behaviors, and error-handling monads across the network boundary. The result is a cohesive engineering culture, a shared ubiquitous language, and a drastically flattened learning curve for full-stack developers crossing the stack.

---

## Why Choose Xeno?

Xeno is engineered to protect the core business domain from infrastructural churn. It provides strategic advantages for technical leadership aiming to future-proof their software assets.

### 1. Eradicating Technical Debt via Strict Boundaries
Xeno forces developers to separate Presentation, Application, Domain, and Infrastructure layers. Your core business rules live in pure TypeScript classes, entirely decoupled from the HTTP transport layer (e.g., Fastify, Hono) or the UI rendering engine (e.g., Vue.js). If you need to swap your underlying database or migrate to a new frontend framework in five years, your domain logic remains untouched.

### 2. Zero-Magic Inversion of Control (IoC)
Unlike high-magic frameworks that rely on experimental decorators (`reflect-metadata`) or auto-scanning directories, Xeno utilizes an explicit, functional Dependency Injection container. Every service, repository, and handler is programmatically registered. This guarantees compile-time type safety, eliminates captive dependency memory leaks, and ensures deterministic execution at runtime.

### 3. Native CQRS and Middleware Pipelines
Xeno structures operations into Commands (state mutations) and Queries (idempotent reads). Both flow through an extensible Mediator bus wrapped in cross-cutting pipeline behaviors. This architecture natively supports:
- **Distributed Idempotency:** Preventing duplicate transactions in network-sensitive environments.
- **Concurrency Control:** Automated exponential backoff and jitter to mitigate Thundering Herd scenarios.
- **Aggressive Caching & Observability:** Unified caching layers and performance monitoring before operations reach the data stores.

### 4. Mission-Critical Resiliency
The network is inherently unreliable. Xeno provides out-of-the-box resiliency patterns (Circuit Breakers, Bulkheads, and Fallbacks) across the entire stack. Whether your backend is communicating with a third-party payment gateway, or your frontend is dealing with an unstable mobile connection, the framework handles transient faults safely and returns predictable functional Monads (`Result`), eliminating scattered `try/catch` blocks.

---

## The Ecosystem at a Glance

The Xeno ecosystem is modular and pay-for-what-you-use. It is composed of interconnected packages designed to work in harmony:
- **Core Engine:** The backend kernel providing the IoC container, context isolation via `AsyncLocalStorage`, and server-side CQRS pipelines.
- **Client Engine:** The frontend counterpart bringing dependency injection, resilient data-fetching, and decoupled handlers to the browser.
- **Shared Primitives:** The isomorphic foundation guaranteeing that contracts, error codes, and utilities are strictly synchronized across environments.
- **Scaffolding CLI:** An enterprise code generator that automates boilerplate creation, instantly spinning up architectural boundaries and keeping developers focused on business logic.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](./support-us)
