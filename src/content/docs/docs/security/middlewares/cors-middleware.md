---
title: CORS Middleware
description: Configure CORS response headers for Xeno.JS routes and understand route-specific origin and credential policies.
keywords:
- Xeno.JS CORS middleware
- CORSMiddleware
- addMiddlewares
- cors.allowOrigins
- withCors
- Access-Control-Allow-Origin
- Access-Control-Allow-Credentials
tags:
- security
- middleware
- cors
- http
faqs:
  - question: How do I enable CORS response headers?
    answer: Call addMiddlewares() with cors.enabled set to true. XenoAppBuilder enables this middleware by default.
  - question: Does CORSMiddleware reject an untrusted origin?
    answer: No. AllowOriginMiddleware performs origin validation and can return 403; CORSMiddleware adds response headers after the request continues.
  - question: How do I set CORS options for one route?
    answer: Set security.allowOrigins and security.withCredentials on the route, or use the withCors() helper from @xeno-js/core.
  - question: Can a credentialed response use Access-Control-Allow-Origin *?
    answer: No. When credentials are enabled, Xeno returns the request origin instead of the wildcard.
---

## Introduction

`CORSMiddleware` adds CORS response headers after the downstream middleware and route handler return a response. It reads the request origin from the request context and checks the matched route's CORS policy to determine the allowed origin and credentials setting.

CORS headers and origin validation are separate responsibilities:

- `AllowOriginMiddleware` checks the request origin against the application allowlist or the route's `security.allowOrigins` policy. It can stop the request with `403 Forbidden`.
- `CORSMiddleware` adds `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`, and `Vary: Origin` to the response when an origin is present or the route allows `'*'`.
- `OptionsMiddleware` handles browser preflight `OPTIONS` requests and advertises methods and headers.

The middleware stack runs these controls independently. Enabling or disabling CORS response headers does not disable origin validation.

## Enable CORS Response Headers

`XenoAppBuilder` enables the CORS response middleware by default. Configure the application-level credentials setting and allowed origins through `addMiddlewares()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addMiddlewares((options) => {
  options.cors = {
    enabled: true,
    enablePreflight: true,
    withCredentials: true,
    allowOrigins: ['https://app.example.com'],
  }
})

const application = await app.build()
```

When `cors.allowOrigins` is empty or omitted, Xeno uses `APP_URL` as the application-level origin. If `APP_URL` is not configured, it uses `http://localhost:<PORT>`, with `3000` as the default port. `AllowOriginMiddleware` uses this allowlist to validate incoming requests.

`cors.withCredentials` controls the default value of `Access-Control-Allow-Credentials`. `cors.enablePreflight` is a separate setting that enables `OptionsMiddleware`; it does not control whether `CORSMiddleware` adds headers.

## Set a Route-Specific CORS Policy

A route can define its own `security.allowOrigins` and `security.withCredentials` values. The `withCors()` helper from `@xeno-js/core` applies those values to a route definition:

```ts
import { HttpRouteParamHelper, withCors, XenoAppBuilder } from '@xeno-js/core'
import type { NativeRouteDefinition } from '@xeno-js/shared'
import type { MyRegistry } from './registry'

const orderRoute: NativeRouteDefinition<MyRegistry> = {
  path: '/api/v1/orders/:id',
  method: 'GET',
  handler: async (ctx) => {
    const input = await HttpRouteParamHelper.extractInput<{ id: string }>(
      ctx.req,
      '/api/v1/orders/:id',
    )
    return ctx.handle('GET_ORDER_BY_ID_CONTROLLER', input)
  },
}

const app = new XenoAppBuilder()

app.addRoutes([
  withCors(orderRoute, ['https://app.example.com'], true),
])
app.addMiddlewares((options) => {
  options.cors = {
    enabled: true,
    enablePreflight: true,
    withCredentials: true,
    allowOrigins: ['https://app.example.com'],
  }
})

const application = await app.build()
```

`MyRegistry` and `GET_ORDER_BY_ID_CONTROLLER` represent application-specific types and a controller token. `withCors()` returns the route with `security.allowOrigins` and `security.withCredentials` set; its third argument defaults to `true`.

When a route defines its own origin policy, `AllowOriginMiddleware` uses that policy instead of the application-level list for that route. `CORSMiddleware` uses the route's credential setting when it is defined; otherwise it falls back to `cors.withCredentials`.

## Response Headers

When the request has an `Origin` header, or the route policy contains `'*'`, the middleware adds these headers to the response:

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
Vary: Origin
```

The middleware preserves headers already present on the response and merges the CORS values into them.

For a route whose `security.allowOrigins` contains `'*'`:

- when credentials are disabled, Xeno returns `Access-Control-Allow-Origin: *`;
- when credentials are enabled, Xeno returns the request's `Origin` value instead of `*`.

For a request without an `Origin` header, the middleware does not add CORS headers unless the route policy contains `'*'`. Non-browser clients can make requests without an `Origin`; whether they are permitted is determined by the origin-validation policy, not by these response headers.

## How the Middleware Works

For each request, `CORSMiddleware`:

1. Reads the origin from the current request context.
2. Calls the next middleware, allowing the route to produce a response.
3. Looks up the route policy for the request path and method.
4. Uses the route's `withCredentials` value when set; otherwise uses the application setting.
5. Adds CORS response headers when the request has an origin or the route allows `'*'`.

Because it adds headers after `next()` resolves, responses returned by downstream middleware, including error responses, also receive CORS headers when the origin or wildcard condition is met. A request rejected earlier by `AllowOriginMiddleware` never reaches `CORSMiddleware`.

## Common Issues

### The browser reports a CORS error even though `cors.enabled` is true

Check that the request origin is allowed by `cors.allowOrigins` or the route's `security.allowOrigins`. The origin-validation middleware runs before `CORSMiddleware` and rejects disallowed origins with `403 Forbidden`.

For browser preflight requests, also check `cors.enablePreflight`, and verify that the preflight response allows the requested method and headers. See [OPTIONS Middleware](./options-middleware).

### The response has no CORS headers

Check that `cors.enabled` is true and that the request includes an `Origin` header. Without an origin, CORS headers are added only when the matched route's `security.allowOrigins` includes `'*'`.

### The response returns the request origin instead of `*`

This is expected when the route allows `'*'` and credentials are enabled. Browsers do not accept a wildcard `Access-Control-Allow-Origin` value for credentialed requests. Disable credentials only if the endpoint does not need them.

### A route does not use the application-level origin list

Check whether the matched route defines `security.allowOrigins`. When present, that list replaces the global list for origin validation on that route and also informs the CORS response policy.

### The application allows the origin, but browser preflight fails

The regular CORS middleware adds headers to the response after the route runs; it does not handle preflight requests. Enable `cors.enablePreflight` and configure the allowed headers and route methods. See [OPTIONS Middleware](./options-middleware).

## Related Documentation

- [Allow-Origin Middleware](./allow-origin)
- [OPTIONS Middleware](./options-middleware)
- [Security Overview](../overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
