---
title: 'Browser Context: Managing Telemetry and Tracing in Vue'
description: 'Learn how Xeno Vue handles execution context, distributed tracing, and telemetry extraction in the browser without Node.js AsyncLocalStorage.'
keywords: 'RequestContextAccessor, Browser Context, AsyncLocalStorage, Vue Telemetry, Distributed Tracing, Xeno Vue, Frontend Architecture'
author: 'Xeno'
sidebar:
  order: 3
---

## Browser Context: Managing Telemetry and Tracing

In a strict Domain-Driven Design and CQRS architecture, maintaining a consistent execution context is critical for logging, distributed tracing, and security. In a Node.js backend environment, Xeno leverages `AsyncLocalStorage` to securely isolate this metadata across asynchronous execution threads. 

However, modern browsers lack a direct equivalent to `AsyncLocalStorage`. To ensure architectural symmetry and provide downstream components (like HTTP Clients and Loggers) with the exact same interfaces they expect on the server, Xeno Vue implements a dedicated browser context layer via the `RequestContextAccessor`.

---

## The Role of `RequestContextAccessor`

The `RequestContextAccessor` bridges the gap between the server's thread-local storage and the browser's global execution environment. It implements the standard Xeno interfaces `IContextAccessor<RequestContext>`, `IIdentityAccessor`, and `INetworkContextAccessor`.

Whenever a Command, Query, or Logger requests the current execution context, this accessor dynamically generates a highly structured `RequestContext` object that captures the current state of the browser, ensuring every API call is tagged with precise telemetry.

---

## Deterministic Distributed Tracing

To prevent "orphaned" API calls and ensure full observability across the network boundary, the browser must act as the origin point for distributed tracing. 

Instead of waiting for the backend to generate tracing identifiers, the `RequestContextAccessor` proactively utilizes the cryptographic `GuidHelper.generate()` utility to create:
*   **`correlationId`**: A persistent UUID v4 marking the root interaction, ensuring that loggers and performance trackers can correlate client-side interactions with backend database transactions.
*   **`requestId`**: A unique UUID v4 generated per context retrieval, used natively by the resilience pipelines to prevent duplicate executions (Idempotency) or track concurrency blocks.

---

## Secure Metadata Extraction

Web browsers expose volatile, user-controlled environmental variables. Feeding raw browser data into logging pipelines or HTTP headers opens the application to Cross-Site Scripting (XSS) and Log Injection vulnerabilities.

The `RequestContextAccessor` securely parses the DOM environment using Xeno's native `SanitizeHelper`:
*   **User Agent**: Extracted from `navigator.userAgent` and strictly sanitized to strip control characters up to a safe length of 256 characters.
*   **Route Path**: Extracted from `window.location.pathname` and sanitized to prevent path traversal or injection sequences before being attached to the `network.path` context.
*   **Format Indicator**: Hardcoded to `'browser'` to inform backend API gateways of the exact payload origin.

---

## Identity Resolution and the `GUEST` Default

Before the user successfully logs in, the application still requires a valid identity footprint to evaluate basic authorization policies or render public pages. 

The `RequestContextAccessor` seamlessly populates the `identity` context using the default `GUEST` primitive. This guarantees that even unauthenticated network requests carry a strict, type-safe identity structure, preventing null-reference errors in downstream interceptors or BFF data sources.

---

## Initialization via `XenoAppBuilder`

The browser context is registered effortlessly during the application's bootstrap phase. Invoking the `.addContext()` method on the `XenoAppBuilder` automatically instantiates the `RequestContextAccessor` and binds it to the core dependency injection container.

```typescript
// src/bootstrap.ts
import { XenoAppBuilder } from '@xeno-js/vue';
import type { MyRegistry } from './registry';

const builder = XenoAppBuilder.create<MyRegistry>()
  // Initializes the RequestContextAccessor natively
  .addContext((opts, config) => {
    // Developers can optionally override the default accessor 
    // by providing a custom implementation matching IBaseAccessor<RequestContext>
  });

export async function bootstrap() {
  return await builder.build();
}

```

Once built, any CQRS pipeline behavior, remote data source, or custom logger registered in the container will securely resolve and utilize the structured `RequestContext` provided by this accessor, enabling flawless end-to-end telemetry synchronization between Vue and the Node.js backend.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)