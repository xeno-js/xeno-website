---
title: "What is Xeno.JS?"
description: "Xeno.JS is an application architecture framework for TypeScript. Learn what it is, where it fits in a TypeScript application, and how it helps keep application architecture explicit."
canonical: "https://www.xeno-js.it/docs/introduction/what-is-xeno-js"
publishedAt: "2026-09-29"
updatedAt: "2026-09-29"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "introduction"
category: "fundamentals"
topics: "Xeno.JS, Typescript Application Framework, Application Architecture, TypeScript architecture, software architecture, domain-driven design, CQRS, dependency injection"
keywords: "what is Xeno.JS, Xeno.JS, TypeScript application architecture, TypeScript architecture framework, application architecture framework, TypeScript application framework, TypeScript dependency injection, TypeScript CQRS, TypeScript DDD, application architecture TypeScript, framework agnostic TypeScript architecture"
sidebar: 
  group: "Introduction"
  order: 1
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "Introduction"
    url: "https://www.xeno-js.it/docs/introduction"
  - name: "What is Xeno.JS?"
    url: "https://www.xeno-js.it/docs/introduction/what-is-xeno-js"
related:
  next:
    - "/docs/introduction/why-xeno-js"
    - "/docs/introduction/architecture-overview"
    - "/docs/introduction/core-principles"
  prerequisites: []
  relatedTopics:
    - "/docs/introduction/why-xeno-js"
    - "/docs/introduction/architecture-overview"
    - "/docs/introduction/core-principles"
faqs:
  - question: "What is Xeno.JS?"
    answer: "Xeno.JS is an application architecture framework for TypeScript. It provides explicit boundaries and application-level building blocks for structuring business logic, dependencies, domain logic, and infrastructure."
  - question: "Is Xeno.JS an HTTP framework?"
    answer: "No. Xeno.JS is primarily an application architecture framework. It is designed to work underneath the HTTP or transport framework used by an application."
  - question: "What problem does Xeno.JS solve?"
    answer: "Xeno.JS addresses the architectural complexity that appears as TypeScript applications grow by making application boundaries, dependencies, use cases, and cross-cutting execution explicit."
  - question: "Can Xeno.JS be used with Fastify, Express, or Hono?"
    answer: "Yes. Xeno.JS is designed to sit at the application layer, allowing an application to keep its preferred transport framework."
  - question: "Who is Xeno.JS for?"
    answer: "Xeno.JS is intended for TypeScript applications with meaningful business logic, growing architectural complexity, or a need for explicit application boundaries and dependencies."
answerSummary: "Xeno.JS is an application architecture framework for TypeScript. It provides explicit boundaries and application-level primitives for dependency injection, commands and queries, pipelines, request context, and application composition without requiring a specific HTTP framework."
directAnswer:
  question: "What is Xeno.JS?"
  answer: "Xeno.JS is an application architecture framework for TypeScript that helps structure application logic, domain logic, dependencies, and infrastructure around explicit boundaries."
keyFacts:
  - "Xeno.JS is designed for TypeScript applications."
  - "Xeno.JS focuses on application architecture rather than HTTP transport."
  - "Xeno.JS can be used with different transport frameworks."
  - "Xeno.JS provides explicit dependency injection and application composition."
  - "Xeno.JS includes commands, queries, pipelines, and request context."
  - "Xeno.JS is designed to keep application architecture explicit as systems grow."
---

## Introduction

Xeno.JS is an **application architecture framework for TypeScript**.

It helps you structure applications around explicit boundaries between application logic, domain logic, dependencies, and infrastructure.

Xeno.JS is not an HTTP framework and does not replace the framework you use to expose your application.

> **Your HTTP framework handles HTTP. Xeno.JS handles the application.**

You can use Xeno.JS with the transport, UI framework, or runtime that fits your application.

---

## The problem

As a TypeScript application grows, more responsibilities start to accumulate:

* business rules
* use cases
* database access
* external services
* authentication and authorization
* validation
* background jobs
* caching
* logging
* HTTP or other transports

Without clear architectural boundaries, these responsibilities tend to become increasingly coupled.

Controllers start containing business logic.
Domain logic starts depending on infrastructure.
Dependencies become difficult to understand.
Changing one part of the system can require changes across unrelated parts.

The problem is not TypeScript itself.

The problem is that the **application architecture is often implicit**.

Xeno.JS makes that architecture explicit in code.

---

## Where Xeno.JS fits

Xeno.JS sits at the application layer rather than at the transport layer.

A simplified view is:

```text
┌─────────────────────────────┐
│ HTTP / CLI / Worker / UI    │
├─────────────────────────────┤
│ Presentation                │
├─────────────────────────────┤
│ Xeno.JS Application Layer   │
│                             │
│ Commands / Queries          │
│ Application Services        │
│ Pipelines                   │
│ Dependency Injection        │
│ Request Context             │
├─────────────────────────────┤
│ Domain                      │
├─────────────────────────────┤
│ Infrastructure              │
└─────────────────────────────┘
```

The transport is responsible for receiving and returning data.

The application layer is responsible for executing application use cases.

The domain contains business rules.

Infrastructure provides the concrete implementations required by the application.

Xeno.JS provides the architectural primitives that connect these layers while keeping their boundaries explicit.

---

## What does Xeno.JS provide?

Xeno.JS brings together several application-level building blocks that are commonly assembled separately in TypeScript projects.

These include:

* explicit dependency injection
* application scopes and dependency lifetimes
* commands and queries
* execution pipelines
* request context
* application and domain contracts
* modular application composition

The goal is not simply to provide more utilities.

The goal is to give these pieces a **coherent application architecture**.

---

## Framework-agnostic by design

Xeno.JS does not require your application to adopt a specific HTTP framework.

You can keep the transport layer that already fits your system and use Xeno.JS underneath it.

For example:

```text
Fastify ──┐
Express ──┤
Hono ─────┼──> Xeno.JS application
CLI ──────┤
Worker ───┘
```

This separation allows the application architecture to remain independent from the way a request enters the system.

The same principle can also be applied on the frontend through the Xeno.JS ecosystem.

---

## A framework for the application, not just the transport

Traditional TypeScript frameworks often start from the transport:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Database
```

Xeno.JS starts from the application instead:

```text
Transport
   ↓
Application Use Case
   ↓
Domain
   ↓
Infrastructure
```

The distinction is important.

An HTTP framework answers questions such as:

> How do I receive an HTTP request?

Xeno.JS focuses on questions such as:

> How is this application use case executed?
> Which dependencies does it require?
> Which boundaries should it cross?
> Which cross-cutting behaviors should run around it?
> How can the application remain independent from its transport?

---

## When does Xeno.JS make sense?

Xeno.JS is particularly relevant when an application has meaningful business logic and its architecture needs to remain understandable as the system grows.

It can be useful when you want:

* explicit application boundaries
* explicit dependencies instead of hidden framework behavior
* a consistent model for commands and queries
* clear separation between domain and infrastructure
* reusable application logic across different transports
* an architecture that can evolve without coupling everything to a single framework

For a small application with very little business logic, introducing an application architecture framework may not be necessary.

Xeno.JS is designed for applications where **architecture itself becomes an important part of the problem**.

---

## The core idea

Xeno.JS is built around a simple idea:

> **Make application architecture explicit in code.**

Instead of allowing application boundaries to emerge implicitly as the codebase grows, Xeno.JS provides explicit primitives for defining those boundaries from the beginning.

The next pages explain the reasoning behind this approach and how the architecture is structured.

## Next steps

* [Why Xeno.JS?](./introduction/why-xeno-js)
* [Architecture Overview](./introduction/architecture-overview)
* [Core Principles](./introduction/core-principles)
* [Getting Started](./getting-started/installation)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
