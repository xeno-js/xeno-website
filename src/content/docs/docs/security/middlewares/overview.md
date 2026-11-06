---
title: Middleware Overview
description: Configure Xeno.JS HTTP middleware with XenoAppBuilder, understand the request pipeline, and review the available security options.
keywords:
- Xeno.JS middleware
- XenoAppBuilder addMiddlewares
- MiddlewareConfig
- CORS
- CSRF
- rate limiting
- trusted proxies
tags:
- security
- middleware
- http
faqs:
  - question: How do I add the HTTP middleware stack?
    answer: Call addMiddlewares() on XenoAppBuilder before build(). Pass a callback to configure middleware options.
  - question: Does addMiddlewares() register arbitrary custom middleware?
    answer: No. It configures Xeno's built-in HTTP middleware stack, including request context, origin validation, CORS, authentication, rate limiting, and optional CSRF and SSR cookie handling.
  - question: Do I need to register routes before adding middleware?
    answer: Register routes with addRoutes() before build(). Method checking and OPTIONS preflight handling are installed only when routes exist.
  - question: Is CSRF protection enabled by default?
    answer: No. Supply a csrf configuration in addMiddlewares() to enable the CSRF cookie and validation middleware.
  - question: What does cors.allowHeaders configure?
    answer: It adds application-specific request headers to the headers advertised by the OPTIONS preflight response. Xeno also includes its standard headers.
---

## Introduction

HTTP middleware applies cross-cutting behavior to requests before and after route handlers run. Examples include creating request context, checking origins, authenticating credentials, limiting request rates, and validating CSRF tokens.

In Xeno.JS, `XenoAppBuilder.addMiddlewares()` queues and configures the built-in HTTP middleware module. The builder resolves queued modules during `build()`, creates a middleware pipeline, and connects it to the HTTP dispatcher. Application code configures this stack through `MiddlewareConfig`; `addMiddlewares()` is not an API for inserting an arbitrary middleware class into the pipeline.

Middleware configuration belongs to the HTTP boundary. It does not replace route registration, authentication service setup, or application-layer authorization.

## Add the Middleware Stack

Call `addMiddlewares()` before `build()`. Pass a setup callback to configure its options:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'
import { ordersRoutes } from './order/order.route'

const app = new XenoAppBuilder()

app.addRoutes(ordersRoutes)
app.addAuth(
  withSupabase((options, config) => {
    options.url = config.getOrThrow('SUPABASE_URL')
    options.key = config.getOrThrow('SUPABASE_KEY')
  }),
)
app.addMiddlewares((options, config) => {
  options.cors = {
    enabled: true,
    enablePreflight: true,
    allowOrigins: [config.getOrThrow('CLIENT_URL')],
    allowHeaders: ['X-Client-Version'],
  }
  options.rateLimit = {
    enabled: true,
    maxRequests: 100,
    windowSeconds: 60,
  }
})

const application = await app.build()
```

`ordersRoutes` represents the application's `NativeRouteDefinition[]`. `addRoutes()` and `addAuth()` queue their modules; `addMiddlewares()` queues the middleware module. During `build()`, Xeno resolves queued modules by priority and constructs the HTTP pipeline. Configure routes, authentication, and middleware before building the application.

The builder queues the middleware module only once. Subsequent calls to `addMiddlewares()` return the same builder without applying another setup callback. Put the complete middleware configuration in a single call.

Without a callback, `addMiddlewares()` uses the builder's defaults. When authentication is not configured, the stack still includes an authentication middleware, but it uses `NoAuthGateKeeper` and establishes a guest identity rather than authenticating credentials.

## Middleware Pipeline

When configured, the HTTP middleware pipeline runs in this order:

```text
RequestContextMiddleware
    ↓
CookieResponseMiddleware              (when isSSR is true)
    ↓
AllowOriginMiddleware
    ↓
OptionsMiddleware                    (when preflight is enabled and routes exist)
    ↓
MethodCheckMiddleware                (when routes exist)
    ↓
CORSMiddleware                       (when cors.enabled is true)
    ↓
RateLimitMiddleware                  (when rateLimit.enabled is true)
    ↓
AuthenticationMiddleware
    ↓
CsrfCookieMiddleware                 (when csrf is configured)
    ↓
CsrfMiddleware                       (when csrf is configured)
    ↓
Route handler
```

The pipeline unwinds after the route returns. Response middleware can then append headers or cookies. For example, `CORSMiddleware` adds CORS response headers after the downstream response is available, and `CookieResponseMiddleware` appends cookies queued during the request.

Some stages act as request gates and stop processing when a policy fails:

- origin validation returns `403 Forbidden` when an origin is denied;
- method checking returns `405 Method Not Allowed` when the request reaches the middleware with a disallowed method;
- rate limiting returns `429 Too Many Requests` after the configured limit is exceeded;
- CSRF validation returns `403 Forbidden` when a required token is missing, mismatched, or invalid.

For regular HTTP server requests, the route matcher selects a route by path and method before the handler invokes the middleware pipeline. If no route matches, the HTTP adapter returns `404 Not Found`; that request does not reach the pipeline.

## Middleware Options

`addMiddlewares()` receives a setup callback with the middleware options and the application's `IConfigurationService`:

```ts
app.addMiddlewares((options, config) => {
  options.cors = {
    allowOrigins: [config.getOrThrow('CLIENT_URL')],
  }
})
```

The following options are available.

### CORS options

| Option | Default | Behavior |
| --- | --- | --- |
| `cors.enabled` | `true` | Adds `CORSMiddleware`, which adds CORS response headers after the request continues through the pipeline. |
| `cors.enablePreflight` | `true` | Adds `OptionsMiddleware` when routes exist. It handles browser `OPTIONS` preflight requests. |
| `cors.withCredentials` | `true` | Sets the default `Access-Control-Allow-Credentials` value. A route-specific `security.withCredentials` policy takes precedence when defined. |
| `cors.allowOrigins` | `[]` | Application-level origin allowlist. When empty or omitted, Xeno uses `APP_URL`, or `http://localhost:<PORT>` with `3000` as the default port. |
| `cors.allowHeaders` | `Content-Type`, `Authorization`, `X-Requested-With`, `Accept`, `Origin` | Adds application-specific headers to the list returned by preflight handling. |

`cors.allowOrigins` and `cors.enabled` control different behavior. The origin-validation middleware checks requests independently of `cors.enabled`; turning off CORS response headers does not bypass origin validation.

`cors.allowHeaders` is used by `OptionsMiddleware` to build `Access-Control-Allow-Headers`. Xeno also includes standard headers such as `x-csrf-token`, `Authorization`, `Content-Type`, `Origin`, request-tracing headers, and other framework headers. It combines the built-in and configured entries and removes duplicates. Add each application-specific request header, such as `X-Client-Version`, to `allowHeaders`; Xeno does not dynamically copy the browser's `Access-Control-Request-Headers`.

Allowed methods come from the methods registered with `addRoutes()`, not from a CORS option. For cross-origin browser requests, the allowed origin, requested method, and request headers must all be covered. See [CORS Middleware](./cors-middleware), [Allow-Origin Middleware](./allow-origin), and [OPTIONS Middleware](./options-middleware).

### Rate-limit options

| Option | Default | Behavior |
| --- | --- | --- |
| `rateLimit.enabled` | `true` | Enables the request rate limiter. |
| `rateLimit.maxRequests` | `100` | Maximum requests allowed for a rate-limit key during the window. |
| `rateLimit.windowSeconds` | `60` | Rate-limit window duration in seconds. |

The rate limiter uses the configured cache. If rate limiting is enabled and no cache service has been registered, Xeno configures its in-memory cache. An in-memory cache is local to one process; multi-instance deployments need a shared cache to share counters. See [Rate Limiting](./rate-limit).

### CSRF options

CSRF protection is disabled by default. Supplying `options.csrf` enables both the cookie-issuing middleware and the state-changing request validator.

| Option | Default | Behavior |
| --- | --- | --- |
| `csrf.secret` | Required | Server-side secret used to sign and validate user-bound tokens. Keep it private and consistent across application instances. |
| `csrf.cookieName` | `__Host-xeno-csrf` | Cookie that carries the CSRF token. |
| `csrf.headerName` | `x-csrf-token` | Request header that must echo the cookie token. |
| `csrf.cookieMaxAgeSeconds` | `3600` | CSRF cookie lifetime in seconds. |
| `csrf.sameSite` | `lax` | Cookie `SameSite` policy: `strict`, `lax`, or `none`. |

The middleware validates `POST`, `PUT`, `PATCH`, and `DELETE` requests. It requires matching cookie and header values, an authenticated `userId`, and a valid signature. A route can explicitly opt out with `security.withCsrf: false`. See [CSRF Middleware](./csrf-middleware).

### Request and cookie options

| Option | Default | Behavior |
| --- | --- | --- |
| `isSSR` | `false` | Adds `CookieResponseMiddleware` to append pending SSR cookies from the request-scoped cookie handler to the response. It does not register a cookie handler itself. |
| `trustedIpHeader` | `undefined` | Selects the header from which the client IP is extracted when the connecting proxy is trusted. The extractor otherwise checks `x-forwarded-for`, then `x-real-ip`. |
| `trustedProxies` | `[]` | Exact socket IP addresses of trusted proxies. Xeno uses a forwarded IP only when the connecting socket address matches an entry. |
| `authCookieName` | `sb-access-token` | Cookie name used by the default bearer-token extractor when no custom token extractor is registered. |

Only list proxies you control. `trustedProxies` currently matches exact addresses; it does not interpret CIDR ranges or `'*'`. See [Request Context Middleware](./request-context-midleware) for client IP resolution and [Cookie Response Middleware](./cookie-middleware) for SSR cookie handling.

## Configuration Example

This example shows a typical browser-facing API configuration. Keep secrets in protected application configuration, and replace the example application values with the deployment's actual origins and routes:

```ts
app.addMiddlewares((options, config) => {
  options.cors = {
    enabled: true,
    enablePreflight: true,
    withCredentials: true,
    allowOrigins: [config.getOrThrow('CLIENT_URL')],
    allowHeaders: ['X-Client-Version'],
  }

  options.rateLimit = {
    enabled: true,
    maxRequests: 60,
    windowSeconds: 60,
  }

  options.csrf = {
    secret: config.getOrThrow('CSRF_SECRET'),
    cookieName: '__Host-xeno-csrf',
    headerName: 'x-csrf-token',
    cookieMaxAgeSeconds: 3600,
    sameSite: 'lax',
  }

  options.trustedIpHeader = 'x-forwarded-for'
  options.trustedProxies = ['10.0.0.5']
})
```

Set CSRF only when the application uses cookie-based credentials and requires CSRF protection. Set trusted proxy options only when the listed proxy is the trusted network peer that connects to the application.

## Common Issues

### Middleware settings seem to have no effect

Check that `addMiddlewares()` runs before `build()` and that the options are configured in its callback. The builder queues the middleware module once; later calls do not apply another setup callback.

### A custom request header fails during browser preflight

Add the header to `cors.allowHeaders`. The preflight handler advertises Xeno's standard headers plus the configured list; it does not reflect arbitrary headers from the incoming preflight request.

### Changing `cors.enabled` does not stop an origin rejection

This is expected. `AllowOriginMiddleware` performs request-origin validation independently from `CORSMiddleware`, which adds response headers. Configure the origin allowlist or route-specific policy rather than relying on `cors.enabled`.

### A route returns `404` instead of a middleware error

The route matcher selects the path and method before the handler enters the middleware pipeline. Register the route with `addRoutes()` or correct the requested path and method.

### All clients behind a proxy share one rate-limit key

Check that the connecting proxy's socket IP exactly matches an entry in `trustedProxies` and that the proxy supplies the configured client IP header. Do not trust arbitrary forwarded headers from untrusted clients.

## Middleware Guides

- [Allow-Method Middleware](./allow-method)
- [Allow-Origin Middleware](./allow-origin)
- [Cookie Response Middleware](./cookie-middleware)
- [CORS Middleware](./cors-middleware)
- [CSRF Middleware](./csrf-middleware)
- [OPTIONS Middleware](./options-middleware)
- [Rate Limiting](./rate-limit)
- [Request Context Middleware](./request-context-midleware)

## Related Documentation

- [Security Overview](../overview)
- [Authentication Overview](../authentication/overview)
- [App Builder](../../fundamentals/app-builder)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
