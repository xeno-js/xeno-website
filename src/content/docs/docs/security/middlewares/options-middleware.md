---
title: OPTIONS Middleware
description: Configure and troubleshoot CORS preflight OPTIONS requests in Xeno.JS.
keywords:
- Xeno.JS OPTIONS middleware
- CORS preflight
- addMiddlewares
- enablePreflight
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers
tags:
- security
- middleware
- cors
- preflight
faqs:
  - question: How do I enable OPTIONS preflight handling?
    answer: Use addMiddlewares() and set cors.enablePreflight to true. The handler is added to the middleware pipeline when routes are configured.
  - question: Does enablePreflight depend on cors.enabled?
    answer: No. enablePreflight controls OPTIONS handling, while cors.enabled controls the regular CORS middleware.
  - question: Why is an OPTIONS request not handled by the middleware?
    answer: The OPTIONS middleware is added only when cors.enablePreflight is true and the application has routes configured.
  - question: How do I allow a custom request header?
    answer: Add the header name to cors.allowHeaders. Xeno also includes its standard headers in the preflight response.
---

## Introduction

Browsers send a CORS preflight request using the HTTP `OPTIONS` method before some cross-origin requests. The request asks whether the target resource accepts the intended method and headers.

Xeno.JS handles these requests with `OptionsMiddleware`. It returns a `204 No Content` response with the allowed methods and headers instead of forwarding that `OPTIONS` request through the rest of the middleware chain. The middleware is configured through `XenoAppBuilder.addMiddlewares()`.

## Enable Preflight Handling

`XenoAppBuilder` enables preflight handling by default. It runs only when preflight handling is enabled and at least one route has been configured with `addRoutes()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { NativeRouteDefinition } from '@xeno-js/shared'

declare const routes: NativeRouteDefinition[]

const app = new XenoAppBuilder()

app.addRoutes(routes)
app.addMiddlewares((options) => {
  options.cors = {
    enablePreflight: true,
    enabled: true,
    allowOrigins: ['https://app.example.com'],
    allowHeaders: ['X-Request-Id', 'X-Client-Version'],
  }
})

const application = await app.build()
```

In this example, `routes` is the application's `NativeRouteDefinition[]`. Register the real route definitions used by your application; without routes, Xeno does not add `OptionsMiddleware` to the pipeline.

`cors.enablePreflight` and `cors.enabled` control separate middleware:

- `enablePreflight` enables the `OPTIONS` preflight handler.
- `enabled` enables the regular CORS middleware for other requests.

For browser-based cross-origin requests, configure both unless you intentionally want preflight handling without the regular CORS middleware.

## Preflight Response

For an `OPTIONS` request, Xeno:

1. Reads `Access-Control-Request-Method`; if it is missing, it checks the route policy as though the requested method were `GET`.
2. Gets the allowed methods for the request path from the registered routes.
3. Checks the route's CORS policy for origin and credentials settings.
4. Returns `204 No Content` with `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.

The allowed request headers include Xeno's standard headers and the headers configured in `cors.allowHeaders`. Xeno removes duplicate entries before returning them.

The middleware does not dynamically copy `Access-Control-Request-Headers` from the browser. It returns the configured allow-header list, so add every application-specific request header to `cors.allowHeaders`.

The origin and credential values come from the route policy when defined; otherwise Xeno uses the middleware-level CORS configuration. A wildcard origin is returned as `*` only when credentials are disabled. When credentials are enabled, Xeno returns the request origin instead.

The `Allow-Origin` middleware runs before the OPTIONS handler and validates the incoming origin against the route policy or configured allowed origins.

## Configure Allowed Methods and Headers

Allowed methods come from the methods registered for each route path. Make sure that the route definitions include the method the browser intends to call. The browser sends that method in the `Access-Control-Request-Method` header; the OPTIONS response lists the methods registered for the path.

Add application-specific headers through `cors.allowHeaders`:

```ts
app.addMiddlewares((options) => {
  options.cors = {
    enabled: true,
    enablePreflight: true,
    allowOrigins: ['https://app.example.com'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-Id',
      'X-Client-Version',
    ],
  }
})
```

Xeno also adds standard headers such as `Content-Type`, `Authorization`, `Origin`, and its request tracing headers. You do not need to repeat them unless doing so improves clarity.

## Common Issues

### The `OPTIONS` request reaches the application handler

Check that `cors.enablePreflight` is `true` and that the application has registered routes through `addRoutes()`. If either condition is missing, Xeno does not add `OptionsMiddleware`.

### The browser reports that a method is not allowed

Check that the requested method is registered for the same path used by the preflight request. Xeno builds the `Access-Control-Allow-Methods` value from the registered route methods; `cors.allowHeaders` does not configure methods.

The preflight response advertises methods; it does not execute the requested application route. The actual request must still be handled by the HTTP server and route, and must pass the application's middleware and authorization checks.

### The browser reports that a request header is not allowed

Add the requested header name to `cors.allowHeaders`. Header names are returned as a comma-separated list in `Access-Control-Allow-Headers`.

### The origin is missing or rejected

Check `cors.allowOrigins` and any route-specific CORS policy. When the application-level origin list is empty, Xeno derives a default from `APP_URL`, or from `http://localhost:<PORT>` when `APP_URL` is not set. An origin rejected by the origin-validation middleware does not proceed to the OPTIONS handler.

### Credentialed requests fail with a wildcard origin

Browsers do not accept `Access-Control-Allow-Origin: *` for credentialed requests. Configure explicit allowed origins and enable credentials where required. Xeno responds with the request origin rather than `*` when credentials are enabled.

### Preflight works, but the actual request still fails

Preflight handling does not replace the regular CORS middleware. Check `cors.enabled`, the configured origin policy, and the actual response path. Also ensure that the application route and HTTP server handle the requested method.

## Related Documentation

- [Security Overview](../overview)
- [Request Context Middleware](./request-context-midleware)
- [Rate Limiting](./rate-limit)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
