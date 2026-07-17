---
title: 'Xeno Core Architectural Fundamentals'
description:
  'An architectural deep-dive into the foundational pillars of Xeno, including
  XenoRegistry, ServiceContainer, AppBuilder, unified request contexts,
  functional monads, and CQRS primitives.'
keywords:
  [
    'Xeno Fundamentals',
    'Inversion of Control',
    'Dependency Injection container',
    'XenoRegistry',
    'NodeRequestContext',
    'Result monad',
    'CQRS primitives',
    'Middleware execution stack',
  ]
author: 'Xeno'
sidebar:
  order: 1
---

## Architectural Fundamentals of Xeno

This document introduces the core programmatic primitives and design patterns
that compose the Xeno framework. These foundational elements decouple your
domain rules from underlying transport mechanisms and infrastructural
modifications. Detailed, individual implementation specifications for each
component are found in dedicated sub-manuals within this directory.

---

## How does the Strongly-Typed Service Registry Ensure Type Safety?

The strongly-typed service registry in Xeno establishes compile-time type safety
across the application dependency graph. By mapping unique runtime tokens to
static type interfaces, it eliminates accidental mismatched dependency injection
and provides strict compilation boundaries between domain abstractions and
infrastructure implementations.

In many Node.js architectures, dependencies are registered using strings or
loose symbols, increasing the risk of runtime errors when refactoring or
renaming services. Xeno solves this by requiring an explicit application
registry definition [XenoRegistry](./xeno-registry). This mapping structure
leverages TypeScript's type system to ensure that every dependency resolved via
a token is structurally compatible with its declared interface, preventing type
pollution across layer boundaries.

- **Nominal Branding Pattern** — Uses structural phantom properties to lock
  injection tokens to strict compile-time types, blocking accidental cross-token
  resolution.
- **Unified Registry Context** — Collects database schema typings, mappers,
  handers, repositories, and controllers into a single type contract evaluated
  before compilation.
- **Refactoring Resilience** — Any signature change within a service interface
  immediately flags missing implementations or invalid resolutions across the
  codebase.

---

## Managing Lifetimes Natively inside the Inversion of Control Container

The Xeno Inversion of Control container coordinates explicit lifecycle
management without relying on experimental decorators or metadata reflection. It
deterministically tracks singleton, scoped, and transient dependencies,
preventing architectural degradation such as captive dependencies through
structural validation during runtime dependency tree evaluation.

The [ServiceContainer](./service-container) is a zero-magic dependency injection
engine that replaces reflection black-boxes with predictable functional
factories. By utilizing pure code configurations instead of class decorators, it
optimizes compilation performance and eliminates non-standard runtime behaviors.
It natively governs three explicit dependency lifetimes:

- **Singleton Lifetime** — Constructs one shared instance per container. This
  instance is managed at the root layer and exists for the entire lifespan of
  the application process.
- **Scoped Lifetime** — Restricts an instance to a single, isolated execution
  scope. Typically instantiated per inbound request or asynchronous execution
  thread and disposed upon operation completion.
- **Transient Lifetime** — Instantiates a fresh, unshared object reference on
  every subsequent invocation or resolution request from the container.

### Core Safeguards and Resource Management

- **Captive Dependency Prevention** — The container performs active path
  checking. If a singleton factory attempts to resolve a scoped dependency, the
  execution halts instantly with an explicit runtime exception to block memory
  leaks and stale state tracking.
- **Sequential Resource Disposal** — Scopes implement the `IDisposable`
  contract. When an asynchronous thread terminates, the container runs through
  tracked resources in reverse order, executing database rollbacks or closing
  open transport sockets gracefully.

---

## Orchestrating Application Bootstrapping via the Fluent AppBuilder

The AppBuilder primitive provides a centralized, programmatic interface to
orchestrate application bootstrapping and initialize core infrastructure
modules. Through a fluent configuration sequence, it systematically configures
cross-cutting concerns like logging, database pooling, authentication
strategies, and pipeline behaviors before building the root container.

The [AppBuilder](./app-builder) acts as the configuration coordinator for the
application kernel. It exposes a declarative API to incrementally mount
infrastructural modules, abstracting away the configuration sequence and
internal bootstrapping order required to activate complex framework layers.

- **Centralized Configuration Input** — Feeds environmental parameters,
  connection strings, and credential variables straight into dedicated
  architectural modules.
- **Agnostic Module Mounting** — Allows users to toggle components (e.g.,
  swapping an in-memory cache for a distributed Redis cluster) seamlessly at the
  host boundary.
- **Deterministic Service Scaffolding** — Guarantees that essential system-level
  prerequisites, such as logging configurations or database clients, are fully
  built before domain services are initialized.

---

## Isolating Execution States with NodeRequestContext and AsyncLocalStorage

[NodeRequestContext](./node-request-context) leverages native Node.js
AsyncLocalStorage to manage unified request-scoped execution boundaries across
complex asynchronous operations. It accurately encapsulates client identity,
distributed tracing variables, and multi-tenant metadata partitions matching
advanced SaaS architectural blueprints, eliminating cross-request state
pollution entirely.

The `NodeRequestContext` ensures that contextual attributes are available at any
point along an active asynchronous execution path without requiring explicit
parameter drilling through your application layers.

- **Identity Sub-Context** — Stores verified user identifiers, tenant
  signatures, allocated application roles, and permission claims retrieved by
  security providers.
- **Network Sub-Context** — Encapsulates request routing path parameters, origin
  identifiers, incoming transport structures, and public access criteria flags.
- **Tracing Sub-Context** — Anchors distributed transaction markers, epoch start
  timestamps, active span IDs, and parent tracing contexts to support detailed
  monitoring and observability hooks.
- **Logical Keyspace Partitioning** — Implements logical keyspace partitioning
  via tenant prefix keys matches matching advanced SaaS factory design patterns
  to secure multi-tenant data access.

---

## Designing Extensible Middlewares for Request Processing Chains

Middlewares in Xeno act as an interceptive processing stack for extracting
inbound request metadata, managing authorization policies, and setting up
isolated tracking boundaries. Operating outside specific transport delivery
engines, they offer an agnostic framework for executing cross-cutting behaviors
across any runtime engine.

The [middleware](./middleware) design pattern (`IMiddleware<THeaders>`) acts as
an outer wrapper for inbound execution logic. It processes raw transport
envelopes (e.g., HTTP headers, message broker metadata packets) and materializes
the context required by downstream application handlers.

- **Transport Abstraction** — Decoupled from transport packages like Fastify,
  Hono, or AWS Lambda. Middlewares rely on standardized input objects, ensuring
  compliance across different runtime hosts.
- **Metadata Extraction** — Maps incoming context metrics (such as client IP,
  user agents, format indicators, or correlation IDs) into strongly-typed
  tracking schemas.
- **Pipeline Short-Circuiting** — Interrupts execution flows early in the
  request processing chain if authentication tokens are missing or authorization
  policies fail, directly returning structured error payloads.

---

## Structuring Ingress Layers with the BaseController

The [BaseController](./base-controller) is an abstract presentation primitive
that standardizes incoming request capture and response serialization across
transport adapters. It acts as an isolation barrier, using context accessors and
decoupled mediator patterns to dispatch type-safe command or query messages down
the application pipeline stack.

Serving as the ingress entry point for the presentation layer, the
`BaseController` standardizes payload processing without tying your application
layers to specific framework implementations.

- **Protocol Abstraction** — Isolates business workflows from network frameworks
  like Fastify, Hono, or AWS Lambda using a transport-agnostic interface.
- **Monadic Response Mapping** — Formats operation outcomes cleanly into
  structured `ResponseDto` shapes using built-in serialization helpers.
- **Pipeline Invocation** — Exposes protected `_send` and `_query` channels to
  safely pass transactional messages across mediator boundaries.

---

## Processing Business Logics and Contracts via the BaseHandler

The [BaseHandler](./base-handler) is the fundamental execution layer for command
and query messages inside the Xeno framework. Connected natively to the mediator
bus, it intercepts payloads within a request-scoped lifecycle, extracting
identity contexts and monitoring cooperative cancellation paths to ensure
predictable data processing.

The `BaseHandler` processes inbound application intent messages, executing
domain constraints before delegating mutations down to persistence mechanisms.

- **Contextual Extraction** — Recovers user-scoped security states, application
  roles, and multi-tenant parameters safely without parameter drilling.
- **Cooperative Cancellation** — Monitors runtime `AbortSignal` state triggers
  to cleanly abort expensive storage transactions upon client disconnection.
- **Enclosed Monadic Outputs** — Enforces deterministic execution results by
  processing parameters and returning standard, compile-time verified functional
  `Result` envelopes.

---

## Defining Command and Query Primitives for Decoupled Message Routing

[Command and Query](./command-query) primitives isolate mutation workflows from
read-only data operations under a strict Command-Query Responsibility
Segregation layout. Explicit intent tokens bind message parameters to their
matching backend command or query handlers, facilitating automated validation,
idempotency locks, and query caching across pipelines.

The framework implements CQRS by splitting transactional requests into two
distinct, isolated message structures dispatched over an internal application
mediator bus:

- **ICommand Primitive** — Captures user intents that mutate state. Commands are
  routed through cross-cutting behavioral pipelines that enforce distributed
  idempotency constraints, execution timeouts, and relational transactional
  boundaries via a `UnitOfWork`.
- **IQuery Primitive** — Governs read-only data acquisition routines. Queries
  avoid write-heavy transaction overhead and integrate directly with specialized
  cache options (`ICacheableOptions`), automatically storing model responses
  under parameterized keys.

---

## Decoupling Data Persistence Layers using Repository and ReadDao

The [Repository and ReadDao](./base-repositories) primitives isolate state
mutation flows from idempotent data retrieval queries under a strict CQRS
layout. Operating behind explicit interfaces, they receive identity context
footprints to enforce multi-tenant logical keyspace partitioning across
persistent database engines and datasources.

By splitting persistence architectures into distinct mutation and query paths,
Xeno optimizes execution efficiency based on structural context.

- **State-Mutation Repository** — Manages comprehensive write lifecycle
  boundaries for domain aggregates, handling data creation, updates, and
  absolute erasure routines.
- **Read-Optimized DAO** — Streamlines data retrieval by bypassing heavy
  transaction locks and connecting queries to specialized cache policies.
- **Tenant Isolation Safe** — Forwards strongly-typed `UserContext` footprints
  to data sources, generating tenant-isolated SQL queries that protect
  multi-tenant boundaries.

---

## Implementing Deterministic Error Handling with the Functional Result Monad

The functional [Result monad](./result-app-error) replaces unstable runtime
exceptions with an explicit, deterministic contract for application failure
propagation. By wrapping outputs inside standardized success or failure
envelopes, it forces application layers to evaluate error codes and edge cases
safely through structured conditional code blocks.

Xeno discourages using arbitrary `try/catch` logic blocks for predictable
business rule violations. The `Result` construct models operation outcomes
explicitly, providing structural safety across design layer boundaries.

- **Result.ok(value)** — Signals a successful application path, encapsulating
  the resulting data model in an unmodifiable envelope.
- **Result.fail(error)** — Represents a business rule violation or system error,
  attaching a machine-readable, kebab-case error code alongside localized
  message variables.
- **Compile-Time Enforcement** — Callers are forced to actively check the
  outcome state of a `Result` type boundary before extracting the inner payload
  value, eliminating unhandled null pointers.
