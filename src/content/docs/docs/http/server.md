---
title: HTTP Server
description: Learn how to configure and start an HTTP server for a Xeno.JS application.
keywords:
- Xeno.JS
- HTTP server
- XenoAppBuilder
- addHttpServer
- listen
- Node.js
- Fastify
- Hono
- Vercel
tags:
- http
- server
- configuration
faqs:
- question: How do I start a Xeno.JS HTTP server?
  answer: Register an HTTP server plugin and routes with XenoAppBuilder, build the application, and await application.listen().
- question: Which HTTP server integrations are available?
  answer: Xeno.JS provides server plugins for Node.js, Fastify, and Hono, plus a separate Vercel request handler for serverless deployments.
- question: How do I configure the host and port?
  answer: Pass host and port to listen(), or use HOST and PORT from the configuration service. The defaults are 0.0.0.0 and 3000.
- question: Can I register more than one HTTP server plugin?
  answer: No. XenoAppBuilder uses the first plugin passed to addHttpServer() and ignores subsequent calls.
---

## Introduction

An application needs an HTTP transport to receive requests, but its routes and
application services should not depend on a particular server implementation.
Xeno.JS lets you select a server integration when you compose the application.

For a server that listens on a network port:

1. Install a server integration.
2. Register its plugin and your routes with `XenoAppBuilder`.
3. Build the application.
4. Call and await `listen()`.

The server integration and the routes are separate configuration choices.
Changing the transport does not require you to redefine your Xeno.JS routes.
For serverless deployments, the platform may own the listener instead; see
[Vercel](#vercel) below.

## Start a Node.js server

Install the core package and the Node.js server integration:

```bash
npm install @xeno-js/core @xeno-js/node
```

Create and start the application:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withNodeHttpServer } from '@xeno-js/node'

async function main() {
  const app = await new XenoAppBuilder()
    .addRoutes([])
    .addHttpServer(withNodeHttpServer())
    .build()

  await app.listen({
    port: 3000,
    host: '127.0.0.1',
    onListening: ({ host, port }) => {
      console.info(`Server listening on ${host}:${port}`)
    },
  })
}

main().catch((error: unknown) => {
  console.error('Failed to start the application', error)
  process.exitCode = 1
})
```

This example registers an empty route list so that the HTTP services needed by
the server are available. It starts a listener but exposes no endpoints:
requests return `404`. Replace the empty array with your route definitions to
serve application requests. Binding to `127.0.0.1` restricts access to the
local machine; choose a different host if the deployment must accept external
connections.

`build()` initializes the configured modules and returns the application;
`listen()` starts the server. `onListening` runs after the listener starts.
Await startup so that rejected initialization or listening operations can be
handled by your entry point. Error reporting during listening depends on the
selected server integration.

## Configure the listener

Pass listener options to `app.listen()`:

| Option | Type | Purpose |
| --- | --- | --- |
| `port` | `number` | Port on which the server listens. |
| `host` | `string` | Host or network interface on which the server listens. |
| `onListening` | `({ host, port }) => void` | Callback invoked after the listener starts. |

You can omit either option or call `listen()` without arguments. Xeno.JS
resolves the host and port in this order:

1. The value passed to `listen()`.
2. `HOST` or `PORT` from the configuration service.
3. The defaults: `0.0.0.0` and `3000`.

The options factory reads the configuration values even when `listen()`
supplies explicit values. An invalid numeric `PORT` therefore raises a
configuration error instead of being ignored.

For example, with the default Node configuration service, set environment
variables before starting the process:

```text
HOST=127.0.0.1
PORT=8080
```

Then call:

```ts
await app.listen()
```

The default host `0.0.0.0` listens on all IPv4 interfaces. Set `HOST` or pass
`host` explicitly when that is not appropriate for your environment. The
configuration service reads environment values; loading a `.env` file is a
separate application setup step. For port `0`, Node.js and Fastify pass the
configured port to `onListening`, not the dynamically assigned port.

## Register routes

Pass an array of route definitions to `addRoutes()` before `build()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withNodeHttpServer } from '@xeno-js/node'
import { routes } from './routes'

const app = await new XenoAppBuilder()
  .addRoutes(routes)
  .addHttpServer(withNodeHttpServer())
  // Register the controllers and other services required by the routes.
  .build()

await app.listen()
```

Here `routes` is an application-defined array of `NativeRouteDefinition`
objects. Each route specifies a method, a path, and a handler. Register its
controllers and dependencies in the same builder; use the application's
registry type with `XenoAppBuilder` and its route definitions when those
controllers use custom tokens.

Calling `addRoutes()` more than once appends definitions. Requests that do not
match a registered route receive a `404` response, except for the `OPTIONS`
fallback on a matching path. See [HTTP Routes](./routes) for route definitions,
input handling, and route policies.

## Configure request middleware

Use `addMiddlewares()` when controller dispatch needs the configured Xeno.JS
middleware, such as CORS or rate limiting:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withNodeHttpServer } from '@xeno-js/node'
import { routes } from './routes'

const app = await new XenoAppBuilder()
  .addRoutes(routes)
  .addMiddlewares((options) => {
    options.cors = {
      enabled: true,
      enablePreflight: true,
      allowOrigins: ['https://app.example.com'],
      withCredentials: true,
    }
    options.rateLimit = {
      enabled: true,
      maxRequests: 100,
      windowSeconds: 60,
    }
  })
  .addHttpServer(withNodeHttpServer())
  // Register the controllers and other services required by the routes.
  .build()

await app.listen()
```

Choose allowed origins and rate limits for your deployment rather than copying
these values unchanged. The middleware executes when a route delegates to a
controller through `ctx.handle()`; a route handler that returns directly does
not go through that dispatch path. For a path that matches another route, the
matcher supplies an `OPTIONS` fallback when no explicit `OPTIONS` route
matches; origin checks and preflight configuration still apply. Configure
proxy trust only for proxies you control, especially when using forwarded
client IP headers for rate limiting.

Without `addMiddlewares()`, route registration provides a minimal dispatch
context; it does not enable the configured CORS, authentication, or rate-limit
middleware. Middleware and route-specific security configuration are separate
from the choice of server plugin.

## Choose a server integration

Register one server plugin with `addHttpServer()`. The builder accepts the
first plugin and ignores later `addHttpServer()` calls; choose the integration
before building rather than attempting to replace it afterwards.

| Integration | Package | Registration | Use |
| --- | --- | --- | --- |
| Node.js | `@xeno-js/node` | `withNodeHttpServer()` | [Node.js native HTTP server](./plugins/node). |
| Fastify | `@xeno-js/fastify` | `withFastify()` | [Fastify HTTP server](./plugins/fastify). |
<!-- | Hono | `@xeno-js/hono` | `withHono()` | Hono server with local listening and an edge-function mode. | -->

Install the package for the selected integration. For example, to use Fastify:

```bash
npm install @xeno-js/core @xeno-js/fastify
```

Replace the Node plugin in the bootstrap with:

```ts
import { withFastify } from '@xeno-js/fastify'

builder.addHttpServer(
  withFastify((options) => {
    options.logger = false
    options.trustProxy = false
  }),
)
```

In this excerpt, `builder` is the application's `XenoAppBuilder`. The callback
configures upstream `FastifyServerOptions`; `host` and `port` remain Xeno.JS
`listen()` options. The integration defaults to `logger: false` and
`trustProxy: true`. Review proxy trust for your deployment rather than relying
on that default. Fastify's proxy setting and Xeno.JS middleware's
`trustedProxies` and `trustedIpHeader` are separate settings.

For Hono, `withHono()` uses local listening by default.
`withHono({ edgeFunction: true })` instead makes `listen()` return the Hono
application without opening a TCP listener. The hosting platform must use that
application; do not treat this mode as a conventional listening server.
The individual server integrations will be covered in the HTTP plugins guides.

### Vercel

`@xeno-js/vercel` provides `XenoVercel.handle(req, res, getApp)` rather than an
`addHttpServer()` plugin. In this deployment, Vercel invokes your function and
owns the listener. Build an application with `addRoutes(routes)` and any
required middleware and services, then pass the incoming Vercel request,
response, and asynchronous application getter to `XenoVercel.handle()`. Do not
call `app.listen()` for this integration. See the [Vercel Functions guide](./plugins/vercel)
for setup and deployment considerations.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
