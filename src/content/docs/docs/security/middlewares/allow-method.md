---
title: Allow-Method Middleware
description: Understand how Xeno.JS validates HTTP methods against registered routes and returns 405 responses.
keywords:
- Xeno.JS allowed methods
- MethodCheckMiddleware
- addMiddlewares
- addRoutes
- HTTP 405
- Allow header
tags:
- security
- middleware
- http
- methods
faqs:
  - question: How do I configure the allowed HTTP methods?
    answer: Register routes with addRoutes(). Xeno derives the allowed methods from each route's method; there is no separate allow-method option.
  - question: Is method checking enabled by default?
    answer: The middleware module adds method checking when routes are configured and addMiddlewares() is enabled.
  - question: What happens when a method is not allowed?
    answer: If a request reaches MethodCheckMiddleware with a method that is not allowed, Xeno returns HTTP 405 and an Allow header. In the regular HTTP server flow, an unmatched path/method is handled earlier by the route matcher and returns 404.
  - question: Does disabling CORS disable method checking?
    answer: No. Method checking is a separate middleware and does not depend on cors.enabled.
---

## Introduction

`MethodCheckMiddleware` checks a request's path and HTTP method against the routes registered with `XenoAppBuilder.addRoutes()`. When the middleware receives a method that is not allowed for the path, it stops the middleware pipeline and returns `405 Method Not Allowed`.

The middleware derives its policy from route definitions rather than from a separate allow-method configuration. For a rejected request, the response includes an `Allow` header with the methods registered for that path.

In the normal HTTP server flow, the route matcher looks up the path and method before the route handler invokes the middleware pipeline. If no route matches, the HTTP adapter returns `404 Not Found`; the request does not reach `MethodCheckMiddleware`.

Method checking and CORS are separate controls:

- `MethodCheckMiddleware` decides whether the request method is registered for the path.
- `cors.enabled` controls the regular CORS response middleware.
- `cors.enablePreflight` controls whether the OPTIONS middleware handles preflight requests.

## Enable Method Checking

Register routes and enable the middleware stack with `addMiddlewares()`:

```ts
import { HttpRouteParamHelper, XenoAppBuilder } from '@xeno-js/core'
import type { NativeRouteDefinition } from '@xeno-js/shared'
import type { MyRegistry } from './registry'
import type { CreateOrderPayload } from './order/application'

const ordersRoutes: NativeRouteDefinition<MyRegistry>[] = [
  {
    path: '/api/v1/orders',
    method: 'GET',
    handler: async (ctx) => {
      const input = await HttpRouteParamHelper.extractInput<{
        page?: number
        pageSize?: number
      }>(ctx.req, '/api/v1/orders')
      return ctx.handle('GET_ORDERS_CONTROLLER', input)
    },
  },
  {
    path: '/api/v1/orders/:id',
    method: 'GET',
    handler: async (ctx) => {
      const input = await HttpRouteParamHelper.extractInput<{ id: string }>(
        ctx.req,
        '/api/v1/orders/:id',
      )
      return ctx.handle('GET_ORDER_BY_ID_CONTROLLER', input)
    },
  },
  {
    path: '/api/v1/orders',
    method: 'POST',
    handler: async (ctx) => {
      const input = await HttpRouteParamHelper.extractInput<CreateOrderPayload>(
        ctx.req,
        '/api/v1/orders',
      )
      return ctx.handle('CREATE_ORDER_CONTROLLER', input)
    },
  },
]

const app = new XenoAppBuilder()

app.addRoutes(ordersRoutes)
app.addMiddlewares()

const application = await app.build()
```

This example registers `GET` and `POST` for `/api/v1/orders`, and `GET` for `/api/v1/orders/:id`. `MyRegistry`, the controller tokens, and `CreateOrderPayload` come from the application; define them to match the services and input types in your project.

Xeno collects the methods from these route definitions when it builds the middleware module. Register routes before calling `build()`; the builder resolves queued modules during that call.

The middleware module adds `MethodCheckMiddleware` only when the application has routes. Calling `addMiddlewares()` without registering routes does not add this method check.

There is no `allowMethods` option in `addMiddlewares()`. To permit another method for a path, register a route with that method.

## How Method Validation Works

When `MethodCheckMiddleware` receives a request, it:

1. Checks the request path and method against the registered route definitions.
2. Continues to the next middleware when the pair is registered.
3. Returns `405 Method Not Allowed` when the method is not allowed for the path.

For regular HTTP server requests, the route matcher first looks up a route by path and method. If the caller requests a different, unregistered path (for example, `GET /api/v1/customers`) or an unregistered method for that path, the route matcher returns no match and the HTTP adapter responds with `404 Not Found` and a route-not-found error. That request does not reach the middleware pipeline. The `405` response applies when a request reaches `MethodCheckMiddleware` and the middleware rejects its method.

The method registry groups methods by route path. It normalizes the path and removes the query string or fragment before checking it. Dynamic route segments using `:name` or `{name}` patterns are matched against a single path segment.

Xeno does not infer extra methods from a registered method. For example, registering `GET` does not automatically register `HEAD`; add a route for each method the application intends to accept.

If the middleware rejects a request, it returns an error response with the `NOT_ALLOWED` error code and the rejected path. Its `Allow` header contains the methods registered for the matching path, joined by commas.

## Middleware Order

The method check runs after request-context and origin validation, and after the OPTIONS handler when that handler is enabled. It runs before the regular CORS middleware, rate limiting, authentication, and CSRF middleware.

When `cors.enablePreflight` is enabled and routes exist, the OPTIONS middleware handles an `OPTIONS` request first and returns its preflight response. Without preflight handling, the route matcher can create a synthetic `OPTIONS` route for a path that exists; the request then continues to method checking, where `OPTIONS` must be allowed by the middleware's route registry.

Disabling `cors.enabled` does not disable method checking. Likewise, allowing a request method does not configure CORS response headers or authorize the caller; those responsibilities remain with their corresponding middleware and application authorization policies.

## Common Issues

### A request through the middleware returns `405 Method Not Allowed`

Check that `addRoutes()` registers the path and method used by the request. The method check uses the route definitions, not the CORS settings or HTTP server configuration. In the normal HTTP server flow, a path/method pair that the route matcher cannot find returns `404` before the middleware runs.

Also check dynamic route patterns and path spelling. The method registry strips query strings and fragments and normalizes trailing slashes.

### A request to a different route returns `404 Not Found`

This is expected when the route matcher cannot find a registered route for the requested path and method. Add the route with `addRoutes()` or correct the URL. The HTTP adapter returns the route-not-found response before `MethodCheckMiddleware` runs.

### Registering `GET` does not allow `HEAD`

The method registry uses the methods explicitly present in route definitions. Register `HEAD` separately if the application needs to accept it.

### Disabling CORS did not change the `405` response

This is expected. `cors.enabled` controls the CORS response middleware; method checking remains active when routes and the middleware module are configured.

### An OPTIONS request is rejected

For browser preflight requests, check that `cors.enablePreflight` is enabled and routes are registered. Without preflight handling, a synthetic `OPTIONS` route may reach method checking and be rejected unless `OPTIONS` is allowed for that path. See [OPTIONS Middleware](./options-middleware) for preflight behavior.

## Related Documentation

- [OPTIONS Middleware](./options-middleware)
- [Allow-Origin Middleware](./allow-origin)
- [Security Overview](../overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
