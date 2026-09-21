---
title: 'CORSMiddleware: Cross-Origin Resource Sharing Header Injection'
description: 'Learn how Xeno CORSMiddleware dynamically injects standard CORS headers into response DTOs across agnostic runtime adapters.'
keywords: [
  'CORSMiddleware',
  'CORS headers',
  'Access-Control-Allow-Origin',
  'MiddlewareConfig cors',
  'ResponseDto headers',
  'Xeno',
]
author: 'Xeno'
sidebar:
  order: 8
---

## What Is CORSMiddleware?

`CORSMiddleware` is a Xeno Presentation middleware responsible for enriching the application's unified `ResponseDto` envelope with standard Cross-Origin Resource Sharing (CORS) response headers. By leveraging Xeno's runtime-agnostic architecture, it operates purely on the response headers map rather than manipulating transport-specific objects (such as Node.js `res.setHeader`), ensuring full portability across serverless adapters (like Vercel) and traditional HTTP engines (like Fastify or Hono).

---

## How Does CORSMiddleware Work?

For each request, the middleware executes the following sequence:

1. It retrieves the current execution context via `IContextAccessor` to access the sanitized request origin (`network.origin`).
2. It awaits the downstream execution of the middleware chain and application handler by invoking `await next()`.
3. If an origin is present and defined in the request context, it populates or merges the standard CORS headers into the response object:
   - `Access-Control-Allow-Origin`: Dynamically mirrors the validated request origin.
   - `Access-Control-Allow-Credentials`: Set to `'true'` to support authenticated requests containing cookies or credentials.
   - `Vary`: Set to `'Origin'` to instruct caches and proxies to vary responses based on the client's origin header.
4. It returns the modified `ResponseDto` to the transport adapter.

---

## How Is It Configured?

`MiddlewareModule` registers `CORSMiddleware` automatically when `MiddlewareConfig.cors` is enabled.

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder.addMiddlewares((config) => {
  // Allow CORS headers to be sent to the client
  config.cors = true
})

const container = await builder.build()

```

---

## Where Does It Run in the Middleware Chain?

`CORSMiddleware` is appended to the execution pipeline after origin and security checks have successfully cleared, ensuring that CORS headers are correctly appended to both successful outcomes and error responses (such as `400` or `401` states) so that frontend clients can properly read diagnostic payloads:

```text
RequestContextMiddleware -> OptionsMiddleware -> AllowOriginMiddleware -> [Other Security Middlewares] -> CORSMiddleware -> Controller or Handler

```

---

## Dependencies and Constraints

`CORSMiddleware` receives these constructor dependencies:

* `IContextAccessor<RequestContext>`, used to retrieve the sanitized request origin from the active network context.

Current implementation constraints include:

* the middleware attaches headers exclusively to `ResponseDto.headers`; the downstream transport adapter (e.g., Vercel, Fastify, Hono) is responsible for flushing these headers onto the native transport response.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
