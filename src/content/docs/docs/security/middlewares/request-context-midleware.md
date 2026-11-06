---
title: Request Context Middleware
description: Learn how to enable request context for Node.js HTTP requests and Vue applications.
keywords:
- request context middleware
- Xeno.JS request context
- addMiddlewares
- addContext
- withPiniaContext
- AsyncLocalStorage
tags:
- security
- middleware
- request-context
faqs:
  - question: How do I enable request context middleware in a Node.js application?
    answer: Call addMiddlewares() on XenoAppBuilder. The middleware module adds RequestContextMiddleware to the HTTP pipeline, and build() supplies the default Node context when none is configured.
  - question: Do Vue applications use the Node request context?
    answer: No. Configure the context with addContext(withPiniaContext()) from @xeno-js/vue; this supplies the Vue-specific context implementation.
  - question: Do I need to instantiate RequestContextMiddleware manually?
    answer: No. In a Node.js HTTP application, addMiddlewares() wires it into the middleware pipeline.
---

## Introduction

The request context makes request-specific metadata available while Xeno.JS processes an HTTP request. The core `RequestContextMiddleware` extracts metadata from the request headers, resolves the client IP, creates the context, and runs the rest of the middleware and route pipeline inside it.

The setup depends on the runtime:

- **Node.js HTTP application:** call `addMiddlewares()`. The core middleware module adds `RequestContextMiddleware`; the default Node context uses `AsyncLocalStorage`.
- **Vue application:** configure the context with `addContext(withPiniaContext())`. The Vue package provides a Pinia-backed implementation instead of the Node context.

These are different context implementations. `withPiniaContext()` configures the context provider; it does not install the core HTTP middleware stack.

## Enable Request Context in Node.js

`XenoAppBuilder` uses the Node configuration service by default. Enable the HTTP middleware stack with `addMiddlewares()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addMiddlewares()

const application = await app.build()
```

During `build()`, the builder adds the default Node context if you have not configured another context. The middleware module then creates the core `RequestContextMiddleware` and places it first in the HTTP middleware pipeline. You do not need to construct or register that middleware yourself.

The middleware creates correlation, request, and span identifiers when the incoming request does not provide them. It also extracts request metadata and the client IP before calling the next middleware. The Node context carries this data through asynchronous work with `AsyncLocalStorage` and manages the service scope for the request.

You can configure the rest of the HTTP middleware stack through the `addMiddlewares()` callback:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addMiddlewares((options) => {
  options.trustedProxies = ['10.0.0.5']
  options.trustedIpHeader = 'x-forwarded-for'
})

const application = await app.build()
```

Set trusted proxy options only when the application runs behind proxies you control. Each `trustedProxies` entry must match a proxy's socket IP address; the resolver does not interpret CIDR ranges. These options affect how the middleware resolves the client IP; they do not enable request context by themselves.

## Configure Request Context in Vue

Vue applications use the context implementation from `@xeno-js/vue`. Select the Vite configuration service and pass the plugin to `addContext()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPiniaContext } from '@xeno-js/vue'

const app = new XenoAppBuilder(undefined, 'vite')

app.addContext(withPiniaContext())

const application = await app.build()
```

`withPiniaContext()` supplies a Vue-specific `IRequestContext` to the core `ContextModule`. The implementation reads and updates request and identity state through the Vue Pinia context store; it does not use Node's `AsyncLocalStorage`.

The builder does not substitute the Node context when configured for Vite. Add the Vue context plugin before calling `build()`. If the Vue application also hosts a Node HTTP server, configure that server's HTTP middleware separately; `addContext(withPiniaContext())` only selects the context implementation.

Ensure Pinia is installed and active before the Vue context store is used.

The plugin accepts an optional request-ID reuse window:

```ts
app.addContext(withPiniaContext({ requestIdWindowMs: 3000 }))
```

The value configures the Vue context store. Omit the option to use the store's default.

## Access the Current Context

After the context module has been configured, resolve the context accessor from the built application:

```ts
const { contextAccessor } = application.getServices()

const context = contextAccessor.getContext()
```

For Node.js, the accessor reads the context active in the current asynchronous execution. In Vue, the Vue implementation reads it from the Pinia context store.

See [Context and Scopes](../../fundamentals/context-scopes) for accessing identity and scoped services, and [App Builder](../../fundamentals/app-builder) for the application bootstrap lifecycle.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
