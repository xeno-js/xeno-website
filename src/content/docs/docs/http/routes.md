---
title: HTTP Routes
description: Learn how to define, register, and configure HTTP routes in Xeno.JS.
keywords:
- Xeno.JS
- HTTP routes
- NativeRouteDefinition
- addRoutes
- RouteHandlerContext
- HttpRouteParamHelper
- route policies
- CORS
- CSRF
tags:
- http
- routes
- configuration
faqs:
- question: How do I register HTTP routes in Xeno.JS?
  answer: Pass an array of NativeRouteDefinition objects to addRoutes() on XenoAppBuilder before calling build().
- question: How do I pass a request to a controller?
  answer: Call ctx.handle() in the route handler with the registered controller token and its input.
- question: How do I extract path, query, and body values?
  answer: Call HttpRouteParamHelper.extractInput() with the request and route pattern, then validate the resulting input.
- question: What happens when multiple routes match?
  answer: The route matcher selects the first matching route in registration order.
- question: Do route security policies enable middleware?
  answer: No. Configure the relevant middleware during application composition and use route policies to adjust its behavior.
---

## Introduction

An HTTP application needs to map incoming methods and paths to application
operations. Xeno.JS expresses these mappings as route definitions, separately
from the server integration and the controller implementation.

Each route specifies:

- an HTTP method;
- a path, optionally containing named parameters;
- a handler that receives the request and can dispatch to a controller;
- optional security settings for the route.

Register the definitions with `addRoutes()` during application composition.
The server integration receives requests; routes select the application
operation to run. For server setup, see [HTTP Server](./server).

## Define and register a route

The following example defines a route and a controller, registers both, and
starts a Node.js server. It uses a fixed response to keep the example focused
on the route; a real controller would delegate to application services.

```bash
npm install @xeno-js/core @xeno-js/node
```

```ts
import {
  HttpHelper,
  HttpRouteParamHelper,
  XenoAppBuilder,
} from '@xeno-js/core'
import type {
  IController,
  NativeRouteDefinition,
  ResponseDto,
  XenoRegistry,
} from '@xeno-js/core'
import { withNodeHttpServer } from '@xeno-js/node'

interface GetOrderInput {
  id: string
}

interface OrderSummary {
  id: string
  status: string
}

interface OrdersRegistry extends XenoRegistry {
  GET_ORDER_CONTROLLER: IController<GetOrderInput, OrderSummary>
}

class GetOrderController implements IController<GetOrderInput, OrderSummary> {
  async handle(input: GetOrderInput): Promise<ResponseDto<OrderSummary>> {
    return HttpHelper.success({ id: input.id, status: 'received' })
  }
}

const orderRoute: NativeRouteDefinition<OrdersRegistry> = {
  method: 'GET',
  path: '/api/orders/:id',
  handler: async (ctx) => {
    const input = await HttpRouteParamHelper.extractInput<GetOrderInput>(
      ctx.req,
      '/api/orders/:id',
    )
    return ctx.handle('GET_ORDER_CONTROLLER', input)
  },
}

async function main() {
  const app = await new XenoAppBuilder<OrdersRegistry>()
    .addRoutes([orderRoute])
    .addServices((services) => {
      services.addScoped('GET_ORDER_CONTROLLER', () => new GetOrderController())
    })
    .addHttpServer(withNodeHttpServer<OrdersRegistry>())
    .build()

  await app.listen({ host: '127.0.0.1', port: 3000 })
}

main().catch((error: unknown) => {
  console.error('Failed to start the application', error)
  process.exitCode = 1
})
```

A `GET` request to `/api/orders/42` matches the route. The handler extracts
an input containing `id: '42'` and passes it to the registered controller.
`HttpHelper.success` creates a `ResponseDto` with status `200` and a JSON
response body:

```json
{
  "success": true,
  "data": { "id": "42", "status": "received" },
  "meta": {}
}
```

The registry describes valid service keys at compile time. `addServices()`
registers the controller at runtime; defining a key in the registry alone
does not register it. The controller resolves within the dispatch scope.
`addScoped()` reuses an instance within that scope; `addSingleton()` shares an
instance across the container, while `addTransient()` creates one per
resolution. Do not inject a scoped dependency into a singleton. See
[Dependency Injection](../fundamentals/dependency-injection) for lifetimes.

This example does not call `addMiddlewares()`. Xeno.JS supplies a minimal
dispatch context for the controller, but it does not enable the configured
CORS, authentication, rate limiting, or CSRF middleware. Configure those
explicitly when the application needs them.

## Route definition

`NativeRouteDefinition<TRegistry>` has the following properties:

| Property | Purpose |
| --- | --- |
| `method` | HTTP method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, or `OPTIONS`. |
| `path` | Route path, with optional named segments such as `:id` or `{id}`. |
| `handler` | Async function that receives a `RouteHandlerContext` and returns a `ResponseDto`. |
| `security` | Optional per-route settings consumed by the relevant middleware. |

Use the same registry type for the builder and your route definitions when
dispatching to application-specific controller tokens.

### Match paths and methods

The matcher compares both method and path. It ignores the query string when
matching, normalizes trailing slashes, and matches methods without case
sensitivity. For example, `GET /api/orders/42?include=items` matches
`GET /api/orders/:id`.

Both `:id` and `{id}` match one path segment. Static path matching is
case-sensitive. The first matching definition wins, including when a dynamic
route overlaps a static route. Register more specific routes first, for
example `/api/orders/recent` before `/api/orders/:id`, when both use the same
method.

If no route matches, the server returns `404`. The matcher has a special
fallback for `OPTIONS`: if no explicit `OPTIONS` route matches but another
route matches the path, it supplies a preflight route. This fallback does not
replace middleware configuration; see [Preflight requests](#preflight-requests).

### Organize route lists

Group routes by feature and add each list before `build()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { OrdersRegistry } from './registry'
import { orderRoutes } from './orders.routes'
import { productRoutes } from './products.routes'

const builder = new XenoAppBuilder<OrdersRegistry>()
  .addRoutes(orderRoutes)
  .addRoutes(productRoutes)

// Register controllers, middleware, and a server integration as needed.
const app = await builder.build()
```

Each call appends definitions; it does not replace the earlier list.
Registration order therefore matters across lists as well as within a list.
Use route arrays typed with the application's registry, and make sure that
the registry includes all controller tokens used by those arrays.

## Use the route handler

The handler receives a context with two members:

| Member | Purpose |
| --- | --- |
| `ctx.req` | A `XenoRequest`, extending the standard `Request` with `path`, optional `query`, and optional socket information. |
| `ctx.handle(token, input?)` | Dispatches to a registered controller and returns its `ResponseDto`. |

Call `ctx.handle()` with a token from the registry. The dispatcher runs the
configured middleware, resolves the controller in the active request scope,
and calls its `handle()` method. The token must resolve to a service with a
`handle` method at runtime. The generic dispatch signature checks the token
against the registry, but does not infer and validate the input and output
types from that controller's contract. Validate input and keep those types
aligned explicitly.

The handler may instead return a `ResponseDto` directly. In that case it
bypasses `ctx.handle()` and its middleware and controller dispatch path.
Do not use a direct response as a substitute for configured authentication,
authorization, rate limiting, or other middleware checks.

When the Node context is used, request-scoped execution uses
`AsyncLocalStorage` to make `RequestContext` available to dispatched work.
See [Context and Scopes](../fundamentals/context-scopes) for access to identity,
tracing, and scoped services.

## Extract request input

`HttpRouteParamHelper.extractInput<TInput>(ctx.req, routePattern)` combines
available body, query, and path values into one object. Pass the same pattern
used by the route so named path segments map to the intended keys.

For example:

```ts
const input = await HttpRouteParamHelper.extractInput<{
  id: string
  include?: string
}>(ctx.req, '/api/orders/:id')
```

For `/api/orders/42?include=items`, the extracted values include
`{ id: '42', include: 'items' }`. This excerpt belongs inside a route handler
where `ctx` is available.

The helper applies these rules:

1. For `POST`, `PUT`, and `PATCH`, it reads JSON or URL-encoded bodies according
   to `Content-Type`; other content types are read as text.
2. Object body fields are merged into the input. Non-object values are placed
   under `body`.
3. Query values override body fields with the same name.
4. Path parameters override both query and body fields with the same name.

The helper does not read a body for `GET`, `DELETE`, `HEAD`, or `OPTIONS`.
When no body value is available, the result can include `body: undefined`.
It decodes path parameters, strips control characters from extracted path
values and object body strings, and removes `__proto__`, `constructor`, and
`prototype` keys from object bodies. Query values come from `ctx.req.query`;
their parsing can depend on the server integration.

The type argument describes the expected shape; it does **not** validate,
convert, or guarantee the values. In particular, do not assume a query value
is a number without parsing and validating it. The helper also catches body
read or parsing errors and proceeds without the parsed body. Use explicit
validation before performing application operations; if a malformed body
must produce a specific error, handle body parsing separately rather than
relying on this helper to report the failure.

For separate extraction, `extractPathParams(routePattern, requestPath)` and
`extractQueryParams(requestUrl)` return string dictionaries. Invalid
percent-encoding in a path parameter can throw during decoding.

## Configure route security

Route security settings customize middleware behavior; they do not activate
middleware by themselves. Configure `addMiddlewares()` during bootstrap, then
apply policies to the relevant route definitions. Configure authentication
and authorization separately: CORS is not an authorization mechanism.

### CORS

`withCors()` returns a route definition with allowed origins and a credentials
setting. It defaults `withCredentials` to `true`, so pass it explicitly when
appropriate:

```ts
import { withCors } from '@xeno-js/core'

// Reuse orderRoute and OrdersRegistry from the route definition.
const publicOrderRoute = withCors<OrdersRegistry>(
  orderRoute,
  ['https://shop.example.com'],
  false,
)
```

Add `publicOrderRoute` to the builder instead of the original definition and
enable CORS through `addMiddlewares()`. A route's `allowOrigins` and
`withCredentials` override the corresponding global values for that route.
For wildcard origins, use `false` for credentials unless you deliberately
configure a more restrictive credentialed policy. Review the allowed origins
for the deployment.

### CSRF

When you configure CSRF middleware, state-changing `POST`, `PUT`, `PATCH`, and
`DELETE` requests require its checks by default. Use `withoutCsrf()` only for a
route where disabling that protection is justified and another suitable
security boundary exists, such as a verified webhook:

```ts
import { withoutCsrf } from '@xeno-js/core'

// Reuse an application-defined, authenticated webhook route.
const webhookRouteWithoutCsrf = withoutCsrf(webhookRoute)
```

`withCsrf()` sets the route's `withCsrf` policy to `true`; it does not enable
the middleware. In the current implementation, CSRF validation runs for the
state-changing methods listed above, not for `GET` even when its policy is
`true`. Configure the CSRF middleware and its secret before relying on these
policies.

### Preflight requests

For a matching path without an explicit `OPTIONS` route, the matcher provides
a fallback route that dispatches the preflight request. Configure CORS and
`enablePreflight` in `addMiddlewares()` to use the preflight middleware.
It uses `Access-Control-Request-Method` to inspect the target route's policy
and returns allowed methods and headers.

The origin check also runs for `OPTIONS` before the preflight middleware.
When using the fallback route, make sure the global allowed origins permit the
preflight origin as well as configuring the target route's policy. Test the
actual browser preflight for each deployed transport and route. An unmatched
path does not receive the fallback route.

For controller implementation, registration, and response helpers, see
[HTTP Controllers](./controller).
For a reference to request, route-policy, and HTTP utilities, see
[HTTP Helpers](./helper-http).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
