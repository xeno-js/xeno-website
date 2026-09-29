---
title: 'HTTP Core: Managing Browser Network Requests'
description: 'Learn how Xeno.JS Vue implements enterprise-grade HTTP communication using Axios, delegating network resilience and retry policies to the backend.'
keywords: 'Vue HTTP, Axios Vue, Frontend Network, Xeno.JS Vue, HTTP Core, RemoteDataSource'
author: 'Xeno'
sidebar:
  order: 1
---

## HTTP Core: Managing Browser Network Requests

The browser operates in an inherently hostile networking environment. Standard Vue.js applications typically rely on bare `fetch` or `axios` calls scattered across components, which leads to duplicated configuration, inconsistent error handling, and tightly coupled UI logic.

Xeno.JS Vue mitigates this through the **HTTP Core** subsystem. By cleanly wrapping `Axios` as the transport layer, it ensures that your frontend interacts with remote APIs through isolated, predictable, and strongly-typed network ecosystems.

---

## The Architectural Anatomy of HTTP Core

In Xeno.JS Vue, you never inject raw HTTP clients directly into your UI components or CQRS Handlers. Instead, the framework constructs isolated network clients defined by strict boundaries.

When you configure an HTTP Core module via the `XenoAppBuilder`, Xeno.JS securely wires two components:
1.  **`AxiosHttpClient`**: The underlying transport engine handling base URLs, default headers, interceptors, and strict timeouts.
2.  **`RemoteDataSource`**: Your custom abstract class that consumes the HTTP Client, yielding type-safe `ResultType<T>` monads to your Application Handlers.

---

## Delegating Resilience to the Backend

Unlike previous iterations or heavy client-heavy frameworks, **Xeno.JS Vue deliberately delegates retry logic and circuit-breaking to the backend API**. 

Implementing complex resilience policies (like exponential backoff with jitter or circuit breakers) in the browser introduces unnecessary overhead and can lead to edge cases, such as the frontend bombarding a struggling backend service during a partial outage. 

Instead, Xeno.JS Vue acts as a pure, deterministic client:
* If the network connection drops or the backend returns a `500/503` status, the frontend immediately surfaces a clean `Result.fail()` monad.
* The UI can then gracefully inform the user to try again later, while the backend API manages its own internal retries and database circuit breakers safely behind the firewall.

---

## Configuring HTTP Core via XenoAppBuilder

Network clients are registered during the application bootstrap phase using the `.addHttpCore()` method. This method guarantees type safety by linking a specific dependency injection token directly to your `XenoVueRegistry`.

```typescript
// src/registry.ts
import type { RemoteDataSource } from "@xeno-js/shared"
import type { XenoVueRegistry } from "@xeno-js/vue"

export type MyRegistry = XenoVueRegistry<{
    // Register your service here <name>: <type | class | interface>
    BFF_REMOTE_DS: RemoteDataSource
}>

// src/bootstrap.ts
import { XenoAppBuilder } from '@xeno-js/vue';
import { BffRemoteDataSource } from './infrastructure/datasources/bff.datasource';
import type { MyRegistry } from './registry';

const builder = XenoAppBuilder.create<MyRegistry>()
  // The 'BFF_REMOTE_DS' token must match exactly what is defined in MyRegistry
  .addHttpCore('BFF_REMOTE_DS', (opts, config) => {
    
    // 1. Configure the Axios Transport Client
    opts.client = {
      baseURL: config.getOrThrow('VITE_API_BASE_URL'),
      timeoutMs: 10000, // Hard 10-second timeout per request
      keepAlive: true,
      decompress: true,
    };

    // 2. Bind the generic client instance to your domain-specific DataSource
    opts.factory = (http) => new BffRemoteDataSource(http);
  });

export async function bootstrap() {
  return await builder.build();
}

```

---

## Isolation by Design

Because Xeno.JS explicitly links `opts.client` and `opts.factory` under a unique registry token (e.g., `BFF_REMOTE_DS`), you can define multiple HTTP Cores with entirely different behaviors.

For instance, you might have one HTTP Core for your primary Backend-For-Frontend (BFF) with specific authorization headers and a 10-second timeout, and another completely isolated HTTP Core for an external third-party analytics tracker with a strict 2-second timeout and no credentials. Each operates in complete isolation, preventing cross-contamination of headers or configurations.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
