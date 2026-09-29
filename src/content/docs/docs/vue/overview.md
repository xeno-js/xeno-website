---
title: 'Xeno.JD Vue Overview: Enterprise-Grade DDD & CQRS for the Browser'
description: 'Discover @xeno-js/vue, part of the Xeno.JS enterprise ecosystem. Learn how to bring strict Domain-Driven Design, explicit Dependency Injection, and CQRS natively to your Vue.js frontend.'
keywords: 'Xeno.JS, @xeno-js/vue, Vue.js architecture, CQRS frontend, DDD browser, Dependency Injection Vue, Frontend framework, Enterprise TypeScript'
author: 'Xeno'
---

# Xeno.JS Vue: Architectural Overview

## What is `@xeno-js/vue`?

**Xeno.JS Vue** (`@xeno-js/vue`) is an enterprise-grade, deterministic architectural framework that brings the strictness of Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) natively to the browser. It shifts operational logic, remote data fetching, and state mutations entirely away from Vue components and Pinia stores, ensuring the frontend architecture remains pristine, highly testable, and completely decoupled from the UI layer. Xeno.JS treats the browser as a complex distributed client, rather than a simple document viewer.

## Why Apply DDD and CQRS to the Frontend?

Modern frontend development often leads to "Spaghetti State," where API calls, business rules, and DOM manipulations are tightly coupled inside UI components. Xeno.JS Vue eliminates this by enforcing pure Dependency Injection (DI) and clean architectural boundaries. 

If your application requires offline-first synchronization, complex data orchestration from multiple backend-for-frontend (BFF) endpoints, or heavy client-side business rules, Xeno.JS isolates this complexity into dedicated Handlers. Vue components are relegated strictly to the Presentation Layer, observing state and dispatching commands without knowing how the data is fetched or mutated.

## What Does the Package Expose?

The package provides the exact abstractions needed to build a resilient, decoupled client-side architecture:

### 1. Explicit Dependency Injection
Xeno.JS Vue relies on programmatic configuration rather than hidden Vue plugins or implicit reactivity bindings.
* **`XenoAppBuilder`**: The fluent composition root used to construct the IoC container during application bootstrap. It explicitly registers loggers, authentication configurations, and remote data sources.
* **`XENO_SERVICES_KEY`**: The canonical Vue `InjectionKey` used to provide the finalized IoC container to the Vue component tree safely.
* **`ServicesUtils`**: A global utility that allows Vue Composables to cleanly resolve the `ClientMediator` and injected Handlers.

### 2. Frontend CQRS & Middleware Pipelines
The framework replicates the backend's strict pipeline execution model directly inside the browser.
* **`ClientMediator`**: The central nervous system of the frontend. It intercepts all commands and queries, running them through a sequence of middleware before invoking the business logic.
* **Cross-Cutting Behaviors**: Natively handles Authentication, CSRF validation, aggressive Query Caching, and Performance logging before an API call ever fires over the network.

### 3. Enterprise-Grade Resiliency
The browser is a hostile and unreliable environment. Xeno.JS Vue intercepts network failures before they crash the UI.
* **Resilient Transports**: Exposes configuration primitives (via `Cockatiel` and `Axios`) to wrap remote data sources with circuit breakers, exponential backoff retries with jitter, and bulkheads.
* **`Result` Monads**: All Handlers and Remote Data Sources return functional `Result` objects, eliminating scattered `try/catch` blocks inside Vue components and ensuring predictable error states for the user interface.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)