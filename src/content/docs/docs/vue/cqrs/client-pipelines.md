---
title: 'Client-Side Behaviors & CQRS Pipelines in Vue'
description: 'Explore Xeno.JS Vue CQRS pipeline behaviors. Learn how Exception, Logging, Performance, Validation, and Caching pipelines protect the browser runtime.'
keywords: 'Vue CQRS, Pipeline Behaviors, Frontend Middleware, QueryCachingPipeline, ValidationPipeline, Zod Vue, Performance Tracking, Xeno.JS Vue'
author: 'Xeno'
sidebar:
  order: 3
---

## Client-Side Behaviors & CQRS Pipelines

In a conventional Vue.js application, cross-cutting concerns—such as error catching, input validation, performance monitoring, and response caching—are typically hardcoded into individual Vue components or duplicated across Pinia stores. This scatters infrastructure logic across the presentation layer, making the application brittle and nearly impossible to audit.

Xeno.JS Vue eradicates this technical debt by adapting the backend **Pipeline Behavior Pattern** for the browser. By routing all intents through the `ClientMediator`, Xeno.JS executes a strict sequence of interceptors (Pipelines) *before* and *after* your business Handlers run.

---

## The Composite Pipeline Architecture

During the application bootstrap phase, the `XenoAppBuilder` registers multiple `IPipeline` instances and wraps them inside a `CompositePipeline`. 

When a Vue Composable dispatches a Command or Query, the `CompositePipeline` recursively executes these behaviors in a Russian-doll model (`next()`). This guarantees that network requests are only fired if the payload is valid, and that exceptions are caught before they can crash the UI thread.

Here are the five native pipeline behaviors provided by Xeno.JS Vue:

### 1. Exception Pipeline: Safety & Monadic Mapping
The browser runtime is unpredictable; third-party scripts, network drops, or corrupted payloads can throw unexpected JavaScript `Error` objects. 

The `ExceptionPipeline` sits at the very top of the execution stack. It wraps the entire transaction in a safe `try/catch` boundary. If a downstream Handler or a Remote Data Source throws an unhandled exception, this pipeline intercepts it, formats it into a standardized `AppError` (with a `SYSTEM_ERROR` code), and returns a functional `Result.fail()` monad. 
This guarantees that your Vue components never experience unhandled promise rejections.

### 2. Logging Pipeline: Local Telemetry
Understanding the execution flow in a client's browser is vital for debugging complex SPAs. 
The `LoggingPipeline` intercepts the request and utilizes the injected `ILogger` to emit structured telemetry. It logs the intent (e.g., `Handling COMMAND CREATE_USER`) before execution, and records either a success message or a detailed error trace depending on the final `Result` monad.

### 3. Performance Pipeline: Main-Thread Protection
Long-running synchronous tasks or sluggish API calls severely degrade Core Web Vitals (specifically INP - Interaction to Next Paint). 

The `PerformancePipeline` utilizes the browser's native `performance.now()` API to track the exact execution duration of your Handlers. If an operation exceeds a configured millisecond threshold (defaulting to 500ms), it automatically emits a `warn` log. This allows architects to pinpoint API bottlenecks or heavy client-side computations directly from the browser console.

### 4. Validation Pipeline: Client-Side Fail-Fast (Zod)
Sending invalid data over the network wastes bandwidth and increases server load. The `ValidationPipeline` integrates directly with the `ZodValidatorService` to evaluate the Command or Query payload against statically defined Zod schemas. 

If the payload violates the schema, the pipeline short-circuits execution entirely. It immediately returns a `Result.fail` containing the specific validation errors, ensuring that malformed data never triggers an HTTP request.

### 5. QueryCaching Pipeline: Zero-Latency Reads
Fetching immutable or slow-changing data repeatedly creates a poor user experience. The `QueryCachingPipeline` provides an aggressive, in-memory caching layer tailored strictly for Queries (`REQUEST_TYPE.QUERY`).

Before hitting the Handler (and consequently, the network), this pipeline inspects the `cacheOptions` attached to the Query:
*   **Cache Key Resolution**: It uses the `CacheKeyBuilder` to generate a unique key, which can be contextually scoped or uniquely tied to the active User Identity (`isUserScoped`).
*   **Cache Hit**: If a valid entry exists in the `ICache` and `bypassCache` is false, it intercepts the flow and returns the data immediately via `Result.ok()`, yielding a zero-millisecond response.
*   **Cache Miss & Write**: If no entry is found, it calls `next()` to execute the network request. Upon a successful response, it automatically caches the payload using the specified Time-To-Live (TTL).

---

## Configuring Pipelines via AppBuilder

Xeno.JS Vue makes it incredibly simple to toggle and configure these behaviors globally during the application bootstrap. By hooking into the `.addPipeline()` method, you dictate exactly how strict the frontend execution should be.

```typescript
// src/bootstrap.ts
import { XenoAppBuilder } from '@xeno-js/vue';
import type { MyRegistry } from './registry';
import { CreateUserSchema, GetAnalyticsSchema } from './schemas';

const builder = XenoAppBuilder.create<MyRegistry>()
  .addPipeline((opts, config) => {
    // 1. Enable zero-latency reads for Queries
    opts.queryCaching = true; 
    
    // 2. Set the performance warning threshold (e.g., 300ms)
    opts.threshold = 300; 
    
    // 3. Register Zod schemas for the Validation Pipeline
    opts.schemas = {
      'CREATE_USER_COMMAND': CreateUserSchema,
      'GET_ANALYTICS_QUERY': GetAnalyticsSchema
    };
  });

export async function bootstrap() {
  return await builder.build();
}

```

By abstracting these five pillars of application stability into pipelines, Xeno.JS Vue ensures that your developers can focus 100% of their effort on writing business logic and rich UI experiences, resting assured that the framework is guarding the execution environment.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
