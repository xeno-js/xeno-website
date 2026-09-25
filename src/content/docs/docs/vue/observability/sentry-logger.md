---
title: 'Sentry Logger: Remote Error Tracking & Observability'
description: 'Learn how to integrate Sentry into Xeno Vue for distributed tracing, session replays, and remote error tracking without impacting initial bundle sizes.'
keywords: 'Sentry Vue, Error Tracking, APM, Observability, Code-Splitting, Frontend Telemetry, Distributed Tracing, Xeno Vue'
author: 'Xeno'
sidebar:
  order: 1
---

## Sentry Logger: Remote Error Tracking & Observability

Unlike backend servers where logs can be easily streamed to `stdout` and collected by an aggregator, the end-user's browser is an operational black box. When an API call fails or an unhandled exception breaks the UI state, standard `console.error` logs are completely invisible to the engineering team.

Xeno Vue provides native, enterprise-grade integration with **Sentry** to capture remote exceptions, performance bottlenecks, and user session replays, bridging the observability gap between the client and the server.

---

## The Performance Challenge: Code-Splitting

A common issue with robust Application Performance Monitoring (APM) SDKs like `@sentry/vue` is their footprint. Bundling a heavy SDK directly into your application's entry point negatively impacts your Core Web Vitals (specifically increasing the Javascript payload and blocking the main thread during initial parsing).

Xeno Vue solves this architecturally through **lazy initialization**. 

The internal `LoggerModule` utilizes ECMAScript dynamic imports (`await import()`) to load the `SentryLoggerFactory` and the Sentry SDK *only* if Sentry is explicitly enabled in your `XenoAppBuilder` configuration. If you choose not to configure Sentry, the SDK is completely excluded from the browser bundle, resulting in a zero-byte performance tax for unconfigured applications.

---

## Configuring Sentry via XenoAppBuilder

To enable remote error tracking, you configure the `opts.sentry` object within the `.addLogger()` setup action during the application bootstrap.

```typescript
// src/bootstrap.ts
import { XenoAppBuilder, LOG_LEVEL } from '@xeno-js/vue';
import type { MyRegistry } from './registry';
import router from './router'; // Optional: Vue Router instance

const builder = XenoAppBuilder.create<MyRegistry>()
  .addLogger((opts, config) => {
    // 1. Enable terminal logging for local development
    opts.console = config.get('VITE_APP_ENV') === 'development';
    
    // 2. Set the global minimum log level (e.g., Only log WARN and ERROR)
    opts.level = LOG_LEVEL.WARN;

    // 3. Configure the Sentry Integration
    opts.sentry = {
      dsn: config.getOrThrow('VITE_SENTRY_DSN'),
      env: config.get('VITE_APP_ENV') ?? 'production',
      
      // Inject the Vue Router to enable Distributed Tracing across navigations
      router: router,
      
      // Fine-tune sampling rates for APM and Session Replays
      tracesSampleRate: 0.2, // Capture 20% of performance transactions
      replaysSessionSampleRate: 0.1, // Record 10% of user sessions
      replaysOnErrorSampleRate: 1.0, // Record 100% of sessions where an error occurs
    };
  });

export async function bootstrap() {
  return await builder.build();
}

```

### Peer Dependency Requirement

Because Sentry is integrated via an optional factory, the `@sentry/vue` package is treated as an **optional peer dependency**. You must install it manually in your project workspace:

```bash
npm install @sentry/vue

```

If you configure `opts.sentry` but fail to install the package, the dynamic import will fail-fast and throw a module resolution error during application bootstrap.

---

## Contextual Telemetry and Error Routing

When an exception is thrown in your application (or intercepted by the `ExceptionPipeline`), it is routed to the composite `BaseLogger`. If the log level meets the threshold (e.g., `WARN` or `ERROR`), the payload is handed to the `SentryLogger`.

### Context Enrichment via Scopes

To make debugging actionable, raw stack traces are insufficient. Xeno seamlessly marries the frontend's `RequestContext` with Sentry's tracking envelope.

Before capturing an exception, the `SentryLogger` isolates the event using `Sentry.withScope()`. It automatically extracts the context object (which contains the `correlationId`, `requestId`, `tenantId`, and network path) and binds it to the Sentry event via `scope.setExtras()`.

This ensures that when you view an error in the Sentry Dashboard, you can see the exact `correlationId`. You can then copy this ID and query your backend log aggregator (e.g., Datadog, ElasticSearch) to trace the exact database transactions that occurred during that specific user session.

### Distributed Tracing (Vue Router Integration)

Modern SPAs do not reload the page during navigation. To track performance bottlenecks (like slow API calls blocking page rendering), you need Distributed Tracing.

By passing your Vue `router` instance into the Sentry configuration, `SentryLoggerFactory` automatically activates the `browserTracingIntegration` plugin. This integration listens to Vue Router navigation guards, creating specific Sentry transactions for every page load and route change, allowing you to identify exactly which views are causing performance degradation.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
