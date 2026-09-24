---
title: 'AllowOriginMiddleware: Request Origin Validation in Xeno'
description: 'Learn how Xeno AllowOriginMiddleware checks incoming request origins against a configured whitelist supporting exact matches, subdomains, wildcards, and global asterisks.'
keywords: [
  'AllowOriginMiddleware',
  'CORS origin validation',
  'IAllowOrigin',
  'MiddlewareConfig allowOrigins',
  '403 Forbidden',
  'Xeno',
]
author: 'Xeno'
sidebar:
  order: 7
---

## What Is AllowOriginMiddleware?

`AllowOriginMiddleware` is a Xeno Presentation middleware that validates whether the origin of an incoming request is authorized to access the resource. It evaluates the sanitized request origin stored in the execution context against a configurable whitelist (`IAllowOrigin`). If the origin is not permitted, the middleware short-circuits the pipeline and returns a structured `403 Forbidden` response.

---

## How Does AllowOriginMiddleware Work?

For each request, the middleware executes the following sequence:

1. It reads the execution context via `IContextAccessor` to retrieve the sanitized request origin (`network.origin`).
2. It calls the injected whitelist service through `IAllowOrigin.isAllowed(origin)`.
3. The whitelist evaluation handles:
   - **Global Asterisk (`*`)**: Accepts any incoming valid origin.
   - **Exact Matches**: Compares the normalized origin against specific domain entries (e.g., `https://tuodominio.com`).
   - **Wildcard Subdomains**: Supports subdomain patterns (e.g., `*.tuodominio.com`) with secure prefix validation.
   - **Missing Origins (`undefined`)**: Automatically permits requests lacking an `Origin` header (such as direct top-level browser navigation or OAuth redirect callbacks).
4. If the origin passes validation, the middleware forwards execution by calling `next()`.
5. If the origin is denied, it logs a warning through `ILogger` and returns a standardized error response via `HttpHelper.error`.

---

## How Is It Configured?

`MiddlewareModule` registers `AllowOriginMiddleware` automatically when `MiddlewareConfig.allowOrigins` is configured and non-empty.

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder.addMiddlewares((config) => {
  // The origin whitelist allows specific origins and wildcard subdomains
  config.allowOrigins = ['[https://your-domain.com](https://your-domain.com)', '*.your-domain.com', 'http://localhost:5173']
})

const container = await builder.build()

```

When `allowOrigins` is omitted or empty, the middleware is excluded from the composite execution chain.

---

## What Happens When Validation Fails?

When an origin is rejected by the policy, the middleware generates a structured error response containing:

* `ERROR_CODES.FORBIDDEN` as the error code;

* the standard forbidden error message;

* details indicating that the specific origin is not allowed;

* the request path;

* tracking metadata including `correlationId`, `requestId`, and `spanId`;

* `STATUS_CODES.FORBIDDEN` as the HTTP status.

The controller and all downstream application logic are skipped entirely.

---

## Where Does It Run in the Middleware Chain?

`MiddlewareModule` appends `AllowOriginMiddleware` early in the execution pipeline, immediately after `OptionsMiddleware` and before method checks, CSRF validation, rate limiting, and authentication:

```text
RequestContextMiddleware -> OptionsMiddleware (optional) -> AllowOriginMiddleware (when allowOrigins is defined) -> MethodCheckMiddleware -> CsrfMiddleware -> RateLimitMiddleware -> AuthenticationMiddleware -> Controller or Handler

```

---

## Dependencies and Constraints

`AllowOriginMiddleware` receives these constructor dependencies:

* `IAllowOrigin`, used to evaluate the origin against the whitelist;
* `IContextAccessor<RequestContext>`, used to read network metadata and the request origin;
* `ILogger`, used to record access violations.

Current implementation constraints include:

* origin validation relies entirely on the pre-sanitized `network.origin` property populated during header extraction;
* requests without an origin header are permitted to support browser navigation flows and OAuth redirects.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
