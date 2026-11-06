---
title: Allow-Origin Middleware
description: Configure and troubleshoot request-origin validation in Xeno.JS.
keywords:
- Xeno.JS allowed origins
- AllowOriginMiddleware
- addMiddlewares
- cors.allowOrigins
- route origin policy
- CORS
tags:
- security
- middleware
- cors
- origins
faqs:
  - question: How do I configure allowed origins?
    answer: Set cors.allowOrigins in the addMiddlewares() callback. If it is empty, Xeno uses APP_URL or http://localhost:<PORT>.
  - question: Does cors.enabled disable origin validation?
    answer: No. AllowOriginMiddleware validates requests independently of the CORS response middleware.
  - question: Can I allow every origin?
    answer: A '*' entry allows every origin. Use it only when that broad policy is intentional, especially for routes that handle sensitive data.
  - question: Are requests without an Origin header rejected?
    answer: The global AllowOrigin configuration permits requests without an Origin header. A route-specific allowOrigins list requires the origin to match an entry.
---

## Introduction

`AllowOriginMiddleware` checks the request's `Origin` against the application's allowed origins or a route-specific origin policy. If the origin is not allowed, Xeno stops the middleware pipeline and returns `403 Forbidden`.

Origin validation and CORS response headers are related but separate:

- `AllowOriginMiddleware` decides whether the request may continue.
- `cors.enabled` controls whether the regular CORS middleware adds CORS response headers.
- `cors.enablePreflight` controls handling for preflight `OPTIONS` requests.

The origin validation middleware is added by `addMiddlewares()` and runs for incoming requests regardless of `cors.enabled`.

## Configure the Application Allowlist

Set `cors.allowOrigins` with the origins allowed to call the application:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addMiddlewares((options) => {
  options.cors = {
    enabled: true,
    allowOrigins: [
      'https://app.example.com',
      'https://admin.example.com',
    ],
  }
})

const application = await app.build()
```

An origin consists of the scheme, host, and optional port. Configure the origin as the browser sends it, for example `https://app.example.com` or `http://localhost:5173`.

When `cors.allowOrigins` is empty or omitted, Xeno derives the global allowlist from `APP_URL`. If `APP_URL` is not configured, it uses `http://localhost:<PORT>`, with `3000` as the default port.

The configured comparison trims surrounding whitespace and ignores letter case. The origin must otherwise match the configured value.

## Configure a Route-Specific Policy

An individual route can define its own `security.allowOrigins` policy. When the matching route defines this property, Xeno uses it instead of the application-level list for that route:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { NativeRouteDefinition } from '@xeno-js/shared'

declare const reportsHandler: NativeRouteDefinition['handler']

const reportsRoute: NativeRouteDefinition = {
  path: '/api/reports',
  method: 'GET',
  security: {
    allowOrigins: ['https://admin.example.com'],
  },
  handler: reportsHandler,
}

const app = new XenoAppBuilder()
app.addRoutes([reportsRoute])
app.addMiddlewares()

const application = await app.build()
```

`reportsHandler` represents the handler already implemented by the application; the example focuses on attaching the route security policy.

An empty route-specific list is still an explicit policy and allows no origin values. It does not fall back to the application-level list.

## Wildcard and Subdomain Entries

The `'*'` entry allows any origin:

```ts
app.addMiddlewares((options) => {
  options.cors = {
    allowOrigins: ['*'],
  }
})
```

Use a wildcard only when the resource is intentionally available to every origin. An allowed origin is not an authentication or authorization decision; sensitive operations still require authentication and authorization.

The application-level `AllowOrigin` matcher also supports a single-label subdomain suffix pattern such as `*.example.com`. It matches an origin such as `https://app.example.com`, but not a nested subdomain such as `https://dev.app.example.com`. This pattern does not constrain the scheme and does not match an origin with a port suffix. For a narrow trust boundary, prefer listing exact origins.

Route-specific `security.allowOrigins` uses direct list matching and supports `'*'`; do not assume the subdomain pattern behavior applies to route-specific policies.

## Requests Without an Origin

The global allow-origin matcher allows requests with no `Origin` header. This is common for server-to-server requests and some non-browser clients.

A route-specific `security.allowOrigins` list behaves differently: the middleware requires the missing origin (treated as an empty value) to match the list. Since a normal allowlist does not contain an empty string, such a request is rejected with `403 Forbidden`. Account for this if a route must serve both browser and non-browser callers.

## How Validation Works

For each request, the middleware:

1. Reads the origin from the request context.
2. Checks the matched route's `security.allowOrigins` when that property is defined; otherwise checks the application-level allowlist.
3. Calls the next middleware when allowed.
4. Logs a warning and returns `403 Forbidden` when denied.

The middleware runs before the CORS response middleware, rate limiting, authentication, and CSRF middleware. A rejected request does not reach those later stages.

Allowing an origin only controls this origin gate. It does not guarantee that the browser can read the response: the CORS response middleware and preflight handling must also be configured correctly. Conversely, setting `cors.enabled` to `false` does not bypass the origin gate.

The origin gate checks the policy for the incoming method. A browser preflight arrives as `OPTIONS`; if there is no explicit `OPTIONS` route, the route matcher does not apply the requested `GET` or `POST` route's security policy at this stage. Configure the global `cors.allowOrigins` to permit the browser origin for preflight requests as well.

## Common Issues

### A request is denied with `403 Forbidden`

Check the `Origin` value sent by the client, including its scheme and port, and compare it with `cors.allowOrigins`. For a route-specific policy, check `security.allowOrigins` on the matched route; when present, it takes precedence over the global list.

If the request has no `Origin` header, inspect whether the route defines an explicit allowlist. Such a route-specific list does not permit a missing origin by default.

### The browser still reports a CORS error after the origin is allowed

Origin validation only decides whether the request continues. Check `cors.enabled`, `cors.enablePreflight`, the configured credentials policy, and any required headers or methods. See [OPTIONS Middleware](./options-middleware) for preflight behavior.

### Local development works, but the deployed application rejects the frontend

Configure the deployed frontend's exact origin or set `APP_URL` to the intended global default. When `APP_URL` is unset, Xeno derives the default from the configured `PORT` (or `3000` if absent), which may not match the deployed frontend's origin.

### A route's global allowlist seems ignored

Check the route's `security.allowOrigins`. If it is defined, Xeno uses that route policy instead of the global list for the matching path and method.

For browser preflight requests, also check the global allowlist. The origin middleware evaluates the `OPTIONS` method before preflight handling, so it may not see the security policy attached to the requested `GET` or `POST` route.

## Related Documentation

- [OPTIONS Middleware](./options-middleware)
- [Request Context Middleware](./request-context-midleware)
- [Security Overview](../overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
