---
title: "Xeno.JS vs NestJS: Different Approaches to TypeScript Application Architecture"
description: "Looking for a NestJS alternative? Compare Xeno.JS and NestJS for TypeScript application architecture, dependency injection, CQRS, pipelines, HTTP, and transport independence."
keywords: "Xeno.JS vs NestJS, NestJS alternative, TypeScript application architecture, TypeScript backend architecture, TypeScript dependency injection, CQRS TypeScript, TypeScript CQRS, Node.js application architecture, DDD TypeScript, NestJS architecture"
canonical: "https://www.xeno-js.it/blog/xeno-js-vs-nestjs"
category: "Software Architecture"
tags:
- "typescript"
- "nodejs"
- "nestjs"
- "xenojs"
- "architecture"
- "cqrs"
- "dependency-injection"
- "ddd"
author: "Xeno.JS"
pubDate: 2026-10-01
type: "article"
featured: true
og:
  title: "Xeno.JS vs NestJS: TypeScript Application Architecture"
  description: "A practical comparison of Xeno.JS and NestJS, focusing on application architecture, dependency injection, CQRS, pipelines, and HTTP boundaries."
  type: "article"
  image: "/images/blog/xeno-js-vs-nestjs.png"
twitter:
  card: "summary_large_image"
  title: "Xeno.JS vs NestJS: TypeScript Application Architecture"
  description: "Compare Xeno.JS and NestJS approaches to TypeScript application architecture."
  image: "/images/blog/xeno-js-vs-nestjs.png"
faqs:
- question: "What is Xeno.JS?"
  answer: "Xeno.JS is an application architecture framework for TypeScript. It provides explicit dependency injection, CQRS, pipelines, request context, scopes, modules, and application composition while remaining independent from the HTTP transport."
- question: "Is Xeno.JS an alternative to NestJS?"
  answer: "Xeno.JS and NestJS solve different architectural problems. NestJS is a broad backend framework, while Xeno.JS focuses on the application architecture layer, including dependency injection, CQRS, pipelines, context, modules, and application composition. Xeno.JS can also be used alongside an HTTP framework."
- question: "What is the difference between Xeno.JS and NestJS?"
  answer: "NestJS is a broad backend framework where HTTP and server-side application concerns are part of the framework model. Xeno.JS focuses specifically on application architecture and can sit underneath an HTTP framework such as Fastify, Hono, or Express."
- question: "Can I use Xeno.JS with Fastify?"
  answer: "Yes. Xeno.JS is designed to remain independent from the HTTP transport, so an application can use Fastify or another HTTP framework at the transport layer while Xeno.JS structures the application layer underneath it."
- question: "Does Xeno.JS support CQRS?"
  answer: "Yes. Xeno.JS provides commands, queries, a mediator, and composable pipelines for application-level CQRS execution."
- question: "Does Xeno.JS use dependency injection?"
  answer: "Yes. Xeno.JS provides explicit dependency injection with registered services, scopes, and configurable service lifetimes without relying on decorator-driven metadata."
- question: "Should I replace NestJS with Xeno.JS?"
  answer: "Not necessarily. Xeno.JS is not intended to be a drop-in replacement for every capability provided by NestJS. It is useful when the main requirement is an explicit, transport-independent application architecture."

related:
- "/docs/introduction/overview"
- "/docs/fundamentals/app-builder"
- "/docs/fundamentals/service-container"
- "/docs/application/cqrs"

schema:
  type: "Article"
  headline: "Xeno.JS vs NestJS: Different Approaches to TypeScript Application Architecture"
  description: "A practical comparison of Xeno.JS and NestJS for TypeScript application architecture."
  mainEntityOfPage: "https://www.xeno-js.it/blog/xeno-js-vs-nestjs"
---

## Xeno.JS vs NestJS: Different Approaches to TypeScript Application Architecture

If you are building a large TypeScript or Node.js application, you have probably encountered **NestJS**.

NestJS is a mature backend framework with dependency injection, modules, controllers, middleware, guards, pipes, interceptors, testing utilities, HTTP adapters, microservices, WebSockets, OpenAPI support, and much more.

So why would you need another framework?

The short answer is: **Xeno.JS is built around a different architectural boundary.**

> **Your HTTP framework handles HTTP. Xeno.JS handles the application.**

## Xeno.JS vs NestJS at a glance

| Concern                    | NestJS                                                     | Xeno.JS                                                                       |
| -------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- |
| HTTP                       | Core part of the backend framework                         | HTTP infrastructure and adapters without making HTTP the application boundary |
| HTTP middleware            | Middleware, guards, pipes, interceptors                    | Middleware and HTTP execution infrastructure                                  |
| CORS                       | Supported                                                  | Supported, including allowed origins and methods                              |
| CSRF                       | Available through integrations/configuration               | Built-in CSRF middleware                                                      |
| Cookies                    | Supported through HTTP integrations                        | Cookie handling middleware                                                    |
| Authentication             | Guards and authentication integrations                     | Authentication middleware and application authentication infrastructure       |
| Rate limiting              | Supported through framework mechanisms and integrations    | Rate-limiting middleware                                                      |
| Dependency Injection       | Yes                                                        | Yes                                                                           |
| Modules                    | Yes                                                        | Yes                                                                           |
| CQRS                       | Official CQRS package                                      | Core application execution model                                              |
| Pipelines                  | Guards, pipes, interceptors and other framework mechanisms | Application pipelines and behaviors                                           |
| Request context            | Request-scoped providers and execution context             | Request context and scopes                                                    |
| Transport independence     | Not the primary architectural goal                         | Core architectural goal                                                       |
| Vue / browser architecture | Not its primary focus                                      | Supported through `@xeno-js/vue`                                              |
| Application architecture   | Integrated into the backend framework                      | Primary concern                                                               |

The important difference is therefore **not how much HTTP functionality each framework provides**.

Xeno.JS provides HTTP infrastructure, middleware, authentication, security-related middleware, rate limiting, cookies, CORS, and adapters.

The architectural distinction is that **HTTP is not the boundary that defines the application model**.

With Xeno.JS, HTTP can remain one delivery mechanism for an application that is also accessible through workers, CLI commands, queues, scheduled jobs, or other entry points.


The important difference is not the number of features.

It is **where the application architecture lives**.

---

## What is NestJS?

NestJS is a broad server-side framework for building Node.js applications with TypeScript.

Its architecture provides modules, providers, dependency injection, controllers, middleware, guards, pipes, interceptors, lifecycle mechanisms, testing utilities, and integrations for areas such as HTTP, microservices, WebSockets, OpenAPI, databases, and CQRS.

This makes NestJS a complete environment for building backend applications.

For many projects, that is exactly the model you want.

But there is another way to structure a TypeScript application.

---

## What is Xeno.JS?

Xeno.JS is an **application architecture framework for TypeScript**.

Instead of making HTTP the center of the application model, Xeno focuses on the layer underneath the transport:

```text
HTTP / Fastify / Hono / Express / CLI / Worker
                         │
                         ▼
                  ┌─────────────┐
                  │   Xeno.JS   │
                  │             │
                  │ Commands    │
                  │ Queries     │
                  │ Pipelines   │
                  │ DI          │
                  │ Context     │
                  │ Modules     │
                  └──────┬──────┘
                         │
                         ▼
                      Domain
                         │
                         ▼
                  Infrastructure
```

The goal is to keep application logic independent from the mechanism used to deliver a request.

That distinction becomes increasingly useful as a TypeScript application grows beyond a simple HTTP API.

---

## Looking for a NestJS alternative?

If you are looking for a **NestJS alternative**, Xeno.JS is worth understanding as a different architectural model rather than as a drop-in replacement.

Xeno.JS does not try to reproduce every feature of NestJS.

Instead, it focuses on questions such as:

* Where should application logic live?
* How should dependencies be composed?
* How should commands and queries execute?
* Where should validation and authorization happen?
* How should request-scoped state be managed?
* How can application logic remain independent from HTTP?
* How can the same architectural model be used across different entry points?

The distinction can be summarized simply:

```text
NestJS
  └── Broad backend framework

Xeno.JS
  └── Application architecture layer
```

This does not make one model universally preferable to the other.

They address different architectural concerns.

---

## TypeScript application architecture beyond HTTP

As a TypeScript application grows, HTTP routing is often only one part of the system.

The application may also have:

* background workers;
* scheduled jobs;
* queues;
* CLI commands;
* event consumers;
* internal processes;
* browser clients;
* multiple external APIs.

If business and application logic are tightly coupled to the HTTP framework, introducing another entry point can become an architectural concern.

Xeno.JS starts from the opposite assumption:

```text
                  ┌───────────┐
                  │   HTTP    │
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │   Xeno    │
                  └─────┬─────┘
                        │
                  Application
                        │
                     Domain
```

HTTP is one way into the application.

It does not have to define the application itself.

---

### 1. Explicit dependency injection

Both NestJS and Xeno.JS provide dependency injection, but they emphasize different approaches.

Xeno.JS uses explicit programmatic registration.

For example:

```typescript
const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', (container) => {
      return new UserRepository(
        container.resolve('USER_DATA_SOURCE'),
      )
    })
  })

await app.build()
```

The dependency graph is visible in the composition code.

There is no requirement for decorator-driven provider discovery or metadata reflection.

This makes dependency registration part of the application's explicit composition root.

For teams that value explicit dependency graphs, this can be an important architectural property.

---

### 2. CQRS as part of the application model

NestJS also supports CQRS through its official CQRS package.

The difference is how CQRS fits into the broader architecture.

Xeno.JS treats commands and queries as part of the application execution model.

A command or query can pass through composable application pipelines before reaching its handler:

```text
Command / Query
       │
       ▼
Authorization
       │
       ▼
Validation
       │
       ▼
Idempotency
       │
       ▼
Concurrency
       │
       ▼
Caching / Resilience
       │
       ▼
    Handler
```

The purpose is to keep cross-cutting application behavior around the execution of a use case rather than repeatedly implementing it inside individual handlers.

CQRS itself is therefore not the differentiator.

Both ecosystems support it.

The architectural difference is **how CQRS fits into the application execution model**.

---

### 3. Application pipelines

Cross-cutting concerns become increasingly important as applications grow.

Validation, authorization, logging, performance monitoring, idempotency, concurrency handling, caching, and resilience can otherwise become scattered throughout application code.

Xeno.JS provides pipelines around commands and queries so these concerns can be composed around application execution.

Conceptually:

```text
Transport
    │
    ▼
Request Context
    │
    ▼
Command / Query
    │
    ▼
Application Pipeline
    │
    ├── Authorization
    ├── Validation
    ├── Idempotency
    ├── Concurrency
    ├── Caching
    └── Resilience
    │
    ▼
Handler
    │
    ▼
Domain / Infrastructure
```

This gives the application a defined execution boundary.

---

### 4. The transport is not the application

A typical Xeno.JS application can keep its HTTP layer outside the application architecture.

For example, Fastify can remain responsible for HTTP:

```typescript
fastify.get('/users/:id', async (request, reply) => {
  // Translate HTTP into an application operation.
})
```

The application operation can then be represented independently:

```text
HTTP request
     │
     ▼
Transport adapter
     │
     ▼
Command / Query
     │
     ▼
Xeno pipeline
     │
     ▼
Application handler
     │
     ▼
Domain / Infrastructure
```

Xeno.JS provides integrations for environments such as Fastify and Vercel while keeping its architectural focus on the application layer.

The point is not that Xeno replaces Fastify.

The point is that **Fastify and Xeno can have different responsibilities**.

Use the HTTP framework for HTTP.

Use the application architecture for the application.

---

### 5. Application context and scopes

Large applications often need more than singleton services.

A request may have its own:

* identity;
* tenant information;
* transaction;
* scoped dependencies;
* request metadata;
* tracing information.

Xeno.JS provides explicit service lifetimes and request context using asynchronous execution context.

This allows request-specific state and scoped services to follow the execution boundary without requiring every method to receive request state explicitly.

The architectural model becomes:

```text
Request
   │
   ▼
Request Context
   │
   ├── Identity
   ├── Scoped Services
   ├── Transaction
   └── Request Metadata
   │
   ▼
Application Execution
```

This is particularly relevant for applications where execution context needs to cross multiple application and infrastructure boundaries.

---

## Do you need to replace NestJS?

Not necessarily.

If NestJS already provides everything your application needs, there may be no reason to replace it.

Xeno.JS is not designed as a drop-in replacement for every capability provided by NestJS.

It is more relevant when you want the **application layer itself to have an explicit architecture independent from the HTTP framework**.

For example:

```text
                  ┌───────────┐
                  │  Fastify  │
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │   Xeno    │
                  └─────┬─────┘
                        │
                   Application
                        │
                     Domain
```

The same architectural idea can be used with different entry points:

```text
Fastify ───────┐
               │
CLI ───────────┤
               ├──► Xeno.JS ──► Application ──► Domain
Worker ────────┤
               │
Queue ─────────┘
```

The HTTP layer becomes one delivery mechanism rather than the architectural center of the application.

---

## Xeno.JS is not trying to be another NestJS

Xeno.JS already provides infrastructure integrations, HTTP adapters, authentication, databases, caching, resilience, logging, a CLI, and Vue integration.

But its architectural center is different.

The goal is not to reproduce every capability of a mature backend framework.

The goal is to provide a consistent **application architecture for TypeScript**:

```text
Presentation
     │
     ▼
Application
     │
     ├── Commands
     ├── Queries
     ├── Handlers
     ├── Pipelines
     ├── Context
     └── Dependency Injection
     │
     ▼
Domain
     │
     ▼
Infrastructure
```

This also means Xeno.JS can coexist with technologies that already do their jobs well.

Use Fastify for HTTP.

Use Hono for edge-oriented HTTP applications.

Use Vue for the UI.

Use Drizzle for database access.

Use Redis for distributed caching.

Use the transport and infrastructure tools that fit your system.

Xeno.JS provides the application architecture connecting these pieces.

---

## When should you consider Xeno.JS?

Xeno.JS becomes particularly relevant when:

* your TypeScript application is becoming large;
* domain logic is becoming mixed with infrastructure code;
* dependency graphs are becoming difficult to understand;
* you want explicit dependency injection;
* you want CQRS as an application model;
* cross-cutting behavior is growing around your use cases;
* you have multiple entry points such as HTTP, workers, CLI, or queues;
* you want the application layer to remain independent from the transport;
* you want a consistent architectural model across backend and frontend.

It is not necessary for every TypeScript project.

A small CRUD API may not need an application architecture framework.

But as the system grows, architecture becomes less about choosing a router and more about deciding **where business logic, dependencies, execution context, and infrastructure boundaries live**.

That is the problem Xeno.JS is designed to solve.

---

## Conclusion

NestJS and Xeno.JS should not necessarily be viewed as direct replacements for each other.

NestJS is a mature, broad backend framework.

Xeno.JS is an application architecture framework focused on explicit dependency injection, CQRS, pipelines, request context, domain boundaries, and transport independence.

The key difference is the architectural boundary:

```text
NestJS
  └── Broad backend framework

Xeno.JS
  └── Application architecture layer
```

If you already have a framework that handles HTTP well, you do not necessarily need to replace it.

**You can keep it.**

Xeno.JS is designed to structure what happens after your transport enters the application.

[Learn more about Xeno.JS](https://www.xeno-js.it/)

[Explore Xeno.JS on GitHub](https://github.com/xeno-js/xeno-js)
