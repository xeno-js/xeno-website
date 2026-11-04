---
title: "XenoApplication"
description: "Learn how to use the XenoApplication runtime returned by XenoAppBuilder to access services, run scoped work, handle requests, and start an HTTP server."
canonical: "https://www.xeno-js.it/docs/fundamentals/xeno-application"
publishedAt: "2026-11-04"
updatedAt: "2026-11-04"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "fundamentals"
category: "application-runtime"
topics: "Xeno.JS Application, XenoApplication, App Builder, Services, Service Scopes, HTTP Server"
keywords: "Xeno.JS application, XenoApplication, Xeno.JS runtime, XenoAppBuilder, getServices, getScopedServices, runInScope, listen"
sidebar:
  group: "Fundamentals"
  order: 6
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "Fundamentals"
    url: "https://www.xeno-js.it/docs/fundamentals"
  - name: "XenoApplication"
    url: "https://www.xeno-js.it/docs/fundamentals/xeno-application"
related:
  next:
    - "/docs/fundamentals/context-scopes"
prerequisites:
  - "/docs/fundamentals/app-builder"
relatedTopics:
  - "/docs/fundamentals/dependency-injection"
  - "/docs/fundamentals/context-scopes"
faqs:
  - question: "What is XenoApplication?"
    answer: "XenoApplication is the default runtime object returned by XenoAppBuilder.build() when no custom application factory is configured."
  - question: "How do I access application services?"
    answer: "Call getServices() for root services, or getScopedServices() when an execution scope is active."
  - question: "How do I run work that needs scoped services?"
    answer: "Call runInScope() and resolve the required services from the callback argument."
  - question: "How do I start the HTTP server?"
    answer: "Register an HTTP server integration during composition, build the application, then call and await application.listen() with the server options."
  - question: "Can XenoApplication handle an HTTP request?"
    answer: "handle() dispatches a controller operation for an incoming request and requires the HTTP and middleware services used by that path to be configured."
answerSummary: "XenoApplication is the default runtime API for accessing root and scoped services, running scoped operations, dispatching requests, and starting the configured HTTP server."
directAnswer:
  question: "What is XenoApplication?"
  answer: "XenoApplication is the default runtime object produced by XenoAppBuilder.build(); it exposes application services and runtime operations."
keyFacts:
  - "XenoAppBuilder.build() returns a configured runtime application, not the Service Container."
  - "The default runtime application is XenoApplication."
  - "getServices() resolves services from the root container."
  - "getScopedServices() requires an active service scope."
  - "runInScope() creates a scope and request context for an operation."
  - "listen() requires an HTTP server integration to be registered."
---

## Introduction

`XenoApplication` is the runtime API used after the application has been composed.
`XenoAppBuilder.build()` initializes the queued modules and returns the configured
application. Unless a custom application factory is configured, the builder
returns an `XenoApplication` backed by its service container.

The builder and the application have different responsibilities:

| Component | Responsibility |
| --- | --- |
| `XenoAppBuilder` | Configures and initializes the application modules. |
| `XenoApplication` | Exposes services and operations used at runtime. |

Use the [App Builder](./app-builder) to configure the application. Use the
returned application to access registered services, run scoped work, dispatch
requests, or start the configured HTTP server.

## Application lifecycle

The runtime application is obtained after composition:

```text
XenoAppBuilder
      │
      ├── Configure services and integrations
      ├── Queue application modules
      ▼
    build()
      │
      ├── Initialize modules
      ▼
XenoApplication
      │
      ├── Access services
      ├── Run scoped operations
      └── Handle requests or listen
```

`build()` is asynchronous. Once it succeeds, use its return value as the
application runtime. It does not return the Service Container.

## Use the application returned by bootstrap

The `main.ts` example obtains the application from its bootstrap function, then
resolves services and start the server:

```ts
import 'dotenv/config'
import { bootstrap } from './bootstrap'

async function main() {
  const app = await bootstrap()
  const { logger, configurationService } = app.getServices()

  logger.info('Initializing app...')

  const port = configurationService.getNumber('PORT', 3000)

  try {
    await app.listen({
      port,
      host: 'localhost',
      onListening: (address) => {
        logger.info(
          `Xeno Node server is running on http://${address.host}:${address.port}`,
        )
      },
    })
  } catch {
    process.exit(1)
  }
}

main()
```

The bootstrap function's implementation is application-specific; this example
uses only the contract visible at the call site. `listen()` returns a promise,
so awaiting it lets the `try`/`catch` handle a rejected server startup.

## Access root services

Call `getServices()` to access services resolved from the application's root
container:

```ts
const { logger, configurationService } = app.getServices()
```

The returned object is a typed proxy: reading a property resolves the
corresponding registry key from the container. Root access is appropriate for
services that can be resolved outside a scope. A scoped service must instead be
resolved within an active service scope.

See [Dependency Injection](./dependency-injection) for registration and
lifetime details.

## Access services in an active scope

When a request or other execution has already established a scope, call
`getScopedServices()`:

```ts
const { logger } = app.getScopedServices()
logger.info('Operation in active scope')
```

The proxy resolves service keys through the active scope. If no scope is active,
`getScopedServices()` throws an error. For work that needs its own scope, use
`runInScope()` instead.

## Run a scoped operation

`runInScope()` creates a request context and service scope for an operation. Its
callback receives a proxy that resolves services through that scope:

```ts
await app.runInScope(async (services) => {
  services.logger.info('Run operation in scope')
})
```

The callback must return a promise. An optional second argument can provide
partial request context, such as identity, network, or tracing information.

The context execution owns the scope lifecycle. The scope is disposed when the
operation completes, including when the callback fails. See
[Context and Scopes](./context-scopes) for more about scoped service access.

## Handle an incoming request

`handle()` dispatches an operation for an incoming Xeno request:

Its generic contract accepts an `XenoIncomingRequest`, a token constrained to
`keyof TRegistry`, and optional input; it returns a
`Promise<ResponseDto<TOutput>>`.

The token identifies the controller operation in the application registry;
`input` is optional. The method adapts the incoming request and delegates to the
HTTP dispatcher, returning a `ResponseDto` in a promise.

Use this method only when the required HTTP adapter, dispatcher, and middleware
services are registered. For a network-facing server, configure the selected
HTTP integration and use `listen()`.

## Start the HTTP server

`listen()` resolves the registered HTTP server, creates its options, and awaits
the server's listen operation:

```ts
await app.listen({
  port: 3000,
  host: 'localhost',
})
```

The HTTP server must be configured during application composition. The
`NativeListenOptions` accepted by the method are passed through the server
options factory; transport-specific setup belongs to the selected integration.

## Choose the appropriate API

| Need | API |
| --- | --- |
| Resolve a root service | `getServices()` |
| Resolve a service in an existing scope | `getScopedServices()` |
| Create a scope for an operation | `runInScope()` |
| Dispatch an incoming request to an operation | `handle()` |
| Start the configured HTTP server | `listen()` |

Do not treat `XenoApplication` as the composition root. Configure dependencies
and integrations with `XenoAppBuilder`, then use the returned application for
runtime work.

## Summary

`XenoApplication` is the default runtime object returned by
`XenoAppBuilder.build()`. It provides distinct APIs for root service resolution,
scoped service resolution, scoped operations, request dispatch, and server
startup. Choose the API that matches the execution boundary so scoped services
remain inside an active scope.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
