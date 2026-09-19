---
title: 'Xeno Shared Overview: The Universal Architectural Foundation'
description: 'An in-depth guide to @xeno-js/shared. Discover the core primitive types, constants, CQRS base classes, and isomorphic utilities that power the Xeno framework across Node.js and Vue.'
keywords: 'Xeno Shared, Xeno utilities, CQRS interfaces, TypeScript primitives, Isomorphic JavaScript, Dependency Injection tokens, Xeno framework, DDD'
author: 'Xeno'
---

# Xeno Shared: Architectural Overview

## What is `@xeno-js/shared`?

**Xeno Shared** (`@xeno-js/shared`) is the structural backbone of the entire Xeno framework ecosystem. It is an isomorphic, highly optimized library that provides the foundational primitive types, canonical constants, and pure utility functions required to build enterprise-grade applications. 

Rather than duplicating logic between the client and the server, Xeno Shared acts as a **single source of truth**. It enforces structural consistency and strict architectural boundaries, ensuring that your data contracts and utility behaviors remain perfectly synchronized across your entire stack.

## Where is it Used?

`@xeno-js/shared` is fundamentally **environment-agnostic**. It is designed to execute predictably and deterministically in both Node.js (V8) and modern browser runtimes.

1. **Backend Integration (`@xeno-js/core`)**: It provides the base HTTP server contracts, database abstraction layers (`Repository`, `UnitOfWork`), and server-side authentication mappers.
2. **Frontend Integration (`@xeno-js/vue`)**: It supplies the browser-compatible `ClientMediator`, resilience pipelines, local caching interfaces, and unified API response DTOs.
3. **Monorepo Workspaces**: In a typical full-stack Xeno architecture, this package is the shared dependency that allows your Vue frontend and Node.js backend to communicate using the exact same TypeScript interfaces and domain symbols without code duplication.

## What Does it Expose?

The package is strictly categorized into functional domains to prevent architectural drift. Here is what it exposes to downstream applications:

### 1. Universal Contracts & Types
Xeno Shared defines the structural interfaces required for Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS) patterns.
* **CQRS Primitives**: `ICommand`, `IQuery`, `IRequest`, and `IHandler` interfaces ensure that every operation in the system follows a predictable execution path.
* **Data Transfer Objects (DTOs)**: Canonical structures like `ResponseDto<T>`, `SuccessResponseDto`, `ErrorResponseDto`, and `IPaginatedResult` guarantee that APIs communicate using a standardized envelope.
* **Dependency Injection**: The `InjectionToken<T>` phantom type enables type-safe, collision-free dependency resolution inside the `XenoRegistry`.

### 2. Isomorphic Infrastructure Base Classes
Instead of reinventing the wheel for every environment, Xeno exposes abstract bases and ready-to-use adapters.
* **Pipelines & Mediator**: Provides the `CompositePipeline` and built-in cross-cutting behaviors such as `ExceptionPipeline`, `LoggingPipeline`, `PerformancePipeline`, and `QueryCachingPipeline`.
* **Data Access**: Base abstract classes like `ReadDao` and `Repository` establish a strict contract for reading and writing domain entities.
* **Pre-configured Adapters**: Exports modular adapters like `AxiosHttpClient`, `CockatielResilienceFactory`, `ConsoleLogger`, and `ZodValidatorService`.

### 3. Agnostic Constants
To eliminate magic strings and numbers, the package exports frozen constant dictionaries that define application semantics.
* **HTTP & Flow Control**: `STATUS_CODES` and `ERROR_CODES` map internal failures to standard network responses natively.
* **Log & Intent**: `LOG_LEVEL` and `REQUEST_TYPE` (`COMMAND` / `QUERY`) standardize observability.
* **Resiliency Defaults**: `RESILIENCE_DEFAULTS` provides Battle-tested fallback and jitter configurations for Thundering Herd mitigation.
* **IoC Tokens**: `TOKENS` contains the official registry keys used by the Xeno App Builders.

### 4. Pure Utilities & Guards
A suite of zero-dependency, immutable (`Object.freeze`) helper modules designed for high-performance operations.
* **Runtime Safety**: `Guards` provides `isDefined`, `isNullOrEmpty`, and invariant assertions (`throwIfNegative`) combined with TypeScript type-narrowing.
* **Asynchronous Control**: `PromiseHelper` exposes precise millisecond delays and randomized exponential backoff (`delayWithJitter`).
* **Security & Formatting**: `SanitizeHelper` prevents Log Injection (CWE-117) and unsafe URIs, while `StringHelper` and `MathHelper` handle fault-tolerant parsing and zero-division protection.
* **Identifier Management**: `GuidHelper` natively handles cryptographic UUID v4 generation and structural validation.

---

By leveraging `@xeno-js/shared`, developers inherit a deterministic, thoroughly tested foundation that drastically reduces the maintenance burden of full-stack TypeScript architectures.


---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)