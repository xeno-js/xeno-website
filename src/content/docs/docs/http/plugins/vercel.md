---
title: Vercel Functions
description: Learn how to deploy a Xeno.JS application with the Vercel Node.js function integration.
keywords:
- Xeno.JS
- Vercel Functions
- xeno-js/vercel
- XenoVercel
- serverless
- Node.js runtime
- XenoAppBuilder
tags:
- http
- serverless
- vercel
- plugins
faqs:
- question: What does @xeno-js/vercel provide?
  answer: It provides XenoVercel.handle(), which connects Vercel Node.js request and response objects to a Xeno.JS application.
- question: Do I register an HTTP server plugin or call listen()?
  answer: No. Vercel invokes the function and owns the listener; configure routes and pass an application getter to XenoVercel.handle().
- question: How do I avoid rebuilding the application on every request?
  answer: Reuse an XenoAppBuilder at module scope and call its build() method from the application getter; the builder shares its build promise within that function instance.
- question: Does the integration configure authentication and CORS?
  answer: No. Configure the required Xeno.JS middleware and authentication during application composition.
- question: Which Vercel runtime does the request and response example use?
  answer: It uses the Node.js runtime and the VercelRequest and VercelResponse contract, not the Web Request and Response edge contract.
---

## Introduction

`@xeno-js/vercel` connects a Xeno.JS application to a Vercel Function.
Vercel receives the HTTP request and invokes your function; Xeno.JS matches
the route and dispatches to the configured application controller.

Unlike the [Node.js](./node) and [Fastify](./fastify) integrations,
`@xeno-js/vercel` does not provide an `addHttpServer()` plugin. Use
`XenoVercel.handle()` as the function entry point. Do not start a listener
with `app.listen()` in that function.

The setup is:

1. Install the integration and its core peer dependency.
2. Register routes and services with `XenoAppBuilder`.
3. Export a Vercel Node.js handler that passes the request, response, and an
   asynchronous application getter to `XenoVercel.handle()`.

## Installation

```bash
npm install @xeno-js/core @xeno-js/vercel @vercel/node
```

The package declares Node.js `>=20` and `@xeno-js/core` as a peer
dependency. It also depends on `@vercel/node`; the example installs it
directly because the application imports its request and response types.
Choose compatible package versions and a Node.js version supported by
Vercel.

## Create a function

The following example defines one function and one matching Xeno.JS route.
The controller returns a fixed order; replace it with application services
for a real endpoint.

Create `api/order-status.ts`:

```ts
import { HttpHelper, XenoAppBuilder } from '@xeno-js/core'
import type {
  IController,
  NativeRouteDefinition,
  ResponseDto,
  XenoRegistry,
} from '@xeno-js/core'
import { XenoVercel } from '@xeno-js/vercel'
import type { VercelRequest, VercelResponse } from '@vercel/node'

interface OrderSummary {
  id: string
  status: string
}

interface OrdersRegistry extends XenoRegistry {
  ORDER_STATUS_CONTROLLER: IController<void, OrderSummary>
}

class OrderStatusController implements IController<void, OrderSummary> {
  async handle(): Promise<ResponseDto<OrderSummary>> {
    return HttpHelper.success({ id: '42', status: 'received' })
  }
}

const routes: NativeRouteDefinition<OrdersRegistry>[] = [
  {
    method: 'GET',
    path: '/api/order-status',
    handler: async (ctx) => ctx.handle('ORDER_STATUS_CONTROLLER'),
  },
]

const builder = new XenoAppBuilder<OrdersRegistry>()
  .addRoutes(routes)
  .addServices((services) => {
    services.addScoped(
      'ORDER_STATUS_CONTROLLER',
      () => new OrderStatusController(),
    )
  })

function getApp() {
  return builder.build()
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<VercelResponse> {
  return XenoVercel.handle(req, res, getApp)
}
```

Deploy this as a Vercel Node.js Function. A request to
`GET /api/order-status` reaches the function and matches the Xeno.JS route.
On success, the response has status `200` and this JSON body:

```json
{
  "success": true,
  "data": { "id": "42", "status": "received" },
  "meta": {}
}
```

The builder queues the route and controller registrations. `getApp()` builds
the application when the function handles a request, and the adapter invokes
the route and controller. The example uses `ctx.handle()` and the default
request scope; it does not configure the full HTTP middleware or
authentication. Configure the protections required by your application
before exposing real endpoints.

See Vercel's [Node.js runtime documentation](https://vercel.com/docs/functions/runtimes/node-js)
for function discovery, runtime versions, and deployment configuration.

## Reuse the application

`XenoVercel.handle()` calls the supplied `getApp()` for each invocation.
It does not cache the application itself. In the example, the builder lives
at module scope and `getApp()` returns `builder.build()`. The builder reuses
its build promise, so concurrent calls in the same function instance share
initialization and later calls can reuse the resulting application.

This reuse is local to that function instance. Vercel can start multiple
instances or replace them, so do not depend on module state for
cross-instance coordination or durability. In-memory caches, counters,
and rate limits do not provide a shared global store across instances; use
an appropriate shared service when the application requires one.

If bootstrap fails, the adapter logs the error and returns a `500` response;
the builder attempts to reset its failed build state. Do not convert a
failed initialization into a successful-looking application.

## Route requests to the function

For a simple endpoint, use a function file and Xeno.JS route whose path
matches the URL received by the function, as in the example above.
`addRoutes()` is required to register the route matcher and dispatch services.
An empty route list has no application endpoints.

To serve several paths through one function, configure Vercel routing or
rewrites for the deployment. The adapter matches using `req.url` and
`req.method` as received by the function, not the URL displayed in the
browser. Verify that each requested path reaches the function with the path
your Xeno.JS route expects. A rewrite's exact behavior depends on your
deployment configuration; test it against the deployed or locally emulated
function. See [Vercel rewrites](https://vercel.com/docs/routing/rewrites)
and [HTTP Routes](../routes).

Use the Node.js `VercelRequest` and `VercelResponse` handler contract shown
above. The package also mentions edge deployments, but the provided handler
requires these Node-style objects; it is not a Web `Request`/`Response`
handler. Edge runtime compatibility for this integration cannot be verified
from the current implementation.

## Configure middleware and services

Register middleware and application services on the builder before the first
call to `build()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { routes } from './routes.js'

const builder = new XenoAppBuilder()
  .addRoutes(routes)
  .addMiddlewares((options) => {
    options.cors = {
      enabled: true,
      enablePreflight: true,
      allowOrigins: ['https://shop.example.com'],
      withCredentials: false,
    }
    options.rateLimit = {
      enabled: true,
      maxRequests: 100,
      windowSeconds: 60,
    }
  })
  // Register controllers, authentication, and other application services.

const app = await builder.build()
```

This is a composition excerpt; use the application registry type and
register the controllers required by `routes`. Choose origins and limits for
your deployment. Route handlers that return directly do not run the
`ctx.handle()` middleware dispatch path. CORS is not authentication or
authorization. Without `addMiddlewares()`, route dispatch uses a minimal
synthetic guest context instead of the configured HTTP middleware.

When using forwarded client IPs, configure `trustedIpHeader` and
`trustedProxies` for the actual proxy topology rather than trusting
arbitrary headers. The current resolver compares socket addresses against
the configured entries exactly; `'*'` is not a wildcard for that check.
When no socket address is available, the resolver can use a forwarded
header, so ensure the deployment boundary supplies trustworthy values.
Verify client IP and rate-limit behavior in the deployed environment.

## Requests and responses

The adapter passes Vercel's request headers, body, query, URL, method, and
socket information to Xeno.JS. Body and query parsing depend on the Vercel
Node.js runtime; validate input in your application.
The adapter forwards `req.query` as supplied by Vercel, which can include
arrays or routing parameters. Do not assume every query value is a string.
`HttpRouteParamHelper.extractInput()` does not read `DELETE` bodies and its
generic type does not validate values. See [HTTP Helpers](../helper-http).

For a controller response, the adapter copies response headers, uses the
`ResponseDto` status, and sends `ResponseDto.data` as JSON. It converts the
headers through the Web `Headers` API before writing them to Vercel; verify
multi-value and cookie headers in your deployment rather than assuming
they preserve the original array representation. See
[API Responses](../api-response) for the response DTO.

The adapter also handles these cases:

- If no route matches, it returns `404` with `success: false` and an
  `error` containing `NOT_FOUND`, a message, and the requested path. This
  body does not include all fields of a controller error response.
- If a route returns no result at runtime, it responds with `204` and ends
  the response. The public route contract normally requires a `ResponseDto`;
  do not rely on this fallback in typed route implementations.
- If initialization or dispatch throws, it logs the error and returns a
  `500` system-error payload with generated correlation and request IDs.
  It includes the error message in `details` only when
  `NODE_ENV === 'development'`. Controller `this.fail()` responses follow
  their own configured error-details behavior.

The adapter passes the incoming request signal to Xeno.JS, but the current
HTTP adapter creates a new `Request` without forwarding that signal.
Do not assume a client disconnect cancels controller work.

## Context and lifetimes

With the default Node context, Xeno.JS uses `AsyncLocalStorage` to make the
request context available during controller dispatch. Scoped services resolve
within that execution; transient services are created per resolution and
singletons are shared by the application container in the function instance.
Do not inject scoped dependencies into a singleton. Avoid putting
request-specific mutable state in singletons, especially when an instance
handles concurrent requests.

Vercel manages function and listener lifecycles. The integration does not
expose a server to close with `httpServer.dispose()`; design external
connections and resources for the platform lifecycle instead of assuming
that a process will remain alive or shut down on a fixed schedule.

## Next steps

- Define paths and route policies in [HTTP Routes](../routes).
- Implement controller responses in [HTTP Controllers](../controller) and
  [API Responses](../api-response).
- Review [Context and Scopes](../../fundamentals/context-scopes) and
  [Dependency Injection](../../fundamentals/dependency-injection).
- Compare server integrations in [HTTP Server](../server).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us).
