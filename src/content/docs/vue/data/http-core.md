---
title: 'HTTP Core & Resiliency: Hardening Browser Network Requests'
description: 'Learn how Xeno Vue implements enterprise-grade HTTP resiliency using Axios and Cockatiel to protect your frontend from transient network failures.'
keywords: 'Vue HTTP, Axios Vue, Cockatiel, Frontend Resilience, Circuit Breaker Vue, Exponential Backoff, Xeno Vue, HTTP Core'
author: 'Xeno'
sidebar:
  order: 1
---

## HTTP Core & Resiliency: Hardening Browser Network Requests

The browser operates in an inherently hostile networking environment. Mobile network drops, spotty Wi-Fi transitions, and downstream microservice latency can cause API requests to hang or fail abruptly. Standard Vue.js applications typically rely on bare `fetch` or `axios` calls, forcing developers to manually implement retry logic or leaving the UI vulnerable to infinite spinners and cascading timeouts.

Xeno Vue mitigates this through the **HTTP Core** subsystem. By fusing `Axios` (for transport) with `Cockatiel` (for advanced resilience policies), it ensures that your frontend degrades gracefully and recovers automatically from transient network faults.

---

## The Architectural Anatomy of HTTP Core

In Xeno Vue, you never inject raw HTTP clients directly into your UI components or CQRS Handlers. Instead, the framework constructs isolated, policy-driven network ecosystems.

When you configure an HTTP Core module via the `XenoAppBuilder`, Xeno securely wires three components:
1.  **`AxiosHttpClient`**: The underlying transport engine handling headers, interceptors, and strict timeouts.
2.  **`CockatielResilienceFactory`**: The policy engine that wraps network calls in Circuit Breakers, Bulkheads, and Retry algorithms.
3.  **`RemoteDataSource`**: Your custom abstract class that consumes the HTTP Client and Resilience policies, yielding type-safe `ResultType<T>` monads to your Application Handlers.

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

    // 2. Configure Cockatiel Resilience Policies
    opts.resilience = {
      retry: { 
        attempts: 3, 
        baseDelayMs: 100, 
        maxDelayMs: 2000 
      },
      circuitBreaker: { 
        consecutiveFailures: 5, 
        halfOpenTimeoutMs: 15000 
      },
      bulkhead: { 
        maxConcurrent: 10 
      }
    };

    // 3. Bind the generic instances to your domain-specific DataSource
    opts.factory = (http, resilience) => new BffRemoteDataSource(http, resilience);
  });

export async function bootstrap() {
  return await builder.build();
}

```

---

## Understanding Frontend Resilience Policies

By defining `opts.resilience`, Xeno automatically applies the following enterprise-grade defense mechanisms to your outgoing requests:

### Exponential Backoff Retry with Jitter

When a network call fails due to a transient issue (e.g., a `503 Service Unavailable` or a dropped connection), the framework does not immediately bombard the server with retries. Instead, it waits for an exponentially increasing duration (e.g., 100ms, then 200ms, then 400ms) capped by `maxDelayMs`. A randomized "jitter" is added to the delay to prevent a Thundering Herd scenario where multiple frontend clients retry simultaneously and overwhelm a recovering backend.

### Circuit Breaker

If the backend service goes completely offline, repeated retries only waste client CPU cycles and exacerbate the outage. The Circuit Breaker monitors the failure rate. If a DataSource hits the `consecutiveFailures` threshold (e.g., 5 failures in a row), the circuit "opens."
Subsequent API calls immediately fail-fast (returning a localized error to the UI) without hitting the network. After the `halfOpenTimeoutMs` elapses, a single test request is allowed through; if it succeeds, the circuit closes and normal traffic resumes.

### Bulkhead Isolation

The `bulkhead.maxConcurrent` policy limits the maximum number of simultaneous in-flight requests that a specific DataSource can maintain. This prevents aggressive UI interactions (like rapid button clicks or infinite scroll loops) from exhausting browser connection pools.

---

## Isolation by Design

Because Xeno explicitly links `opts.client`, `opts.resilience`, and `opts.factory` under a unique registry token (e.g., `BFF_REMOTE_DS`), you can define multiple HTTP Cores with entirely different behaviors.

For instance, you might have one highly-resilient HTTP Core for your primary API, and another HTTP Core with a strict, low-timeout, no-retry policy for an external analytics tracker. Each operates in complete isolation, preventing a failure in the analytics service from opening the circuit breaker of your primary billing API.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
