---
title: 'CsrfMiddleware: Dual-Token CSRF Validation & Configuration in Xeno'
description: 'Learn how to configure and use Xeno CsrfMiddleware for dual-token CSRF protection, validating header tokens against cookies using ICsrfTokenService within AppBuilder.'
keywords: [
   'CsrfMiddleware',
   'CSRF protection',
   'CSRF configuration',
   'ICsrfTokenService',
   'AppBuilder',
   'state-changing requests',
   '403 Forbidden',
   'Xeno',
]
author: 'Xeno'
sidebar:
  order: 3
---

## What Is CsrfMiddleware?

`CsrfMiddleware` is an enterprise-grade presentation middleware in Xeno that protects state-changing HTTP requests against Cross-Site Request Forgery (CSRF) attacks. Rather than comparing incoming requests against a static, globally configured string, `CsrfMiddleware` enforces a **dual-token validation pattern**. It inspects both the request header token (`network.csrf`) and the browser cookie token (`network.csrfCookie`) via the active request context, delegating final cryptographic validation to the injected `ICsrfTokenService`.

If any validation step fails—whether a token is missing, mismatched, or cryptographically invalid—the middleware instantly halts the `CompositeMiddleware` execution chain and returns a structured `403 Forbidden` response. Safe, non-state-changing requests bypass this validation entirely and proceed downstream.

---

## Which HTTP Methods Does It Validate?

The middleware targets state-changing operations explicitly across these HTTP methods:

* `POST`;
* `PUT`;
* `DELETE`;
* `PATCH`.

The HTTP method is converted to uppercase to ensure case-insensitive evaluation. Safe methods such as `GET`, `HEAD`, and `OPTIONS` bypass `CsrfMiddleware` evaluation completely and are forwarded directly via `next()`.

---

## How Does CSRF Dual-Token Validation Work?

For any state-changing request (`POST`, `PUT`, `DELETE`, `PATCH`), `CsrfMiddleware` executes a rigorous, step-by-step verification pipeline:

1. **Context and Token Extraction**: It accesses the current request context via `IRequestContext.getContext()`, retrieving the header token (`network.csrf`), the cookie token (`network.csrfCookie`), and the authenticated user identity (`identity.userId`).
2. **Presence Verification**: It validates that both `headerToken` and `cookieToken` are fully defined using `Guards.isDefined`. If either token is absent, it immediately short-circuits with a `403 Forbidden` response (`CSRF token missing`).
3. **Token Symmetry Match**: It compares `headerToken` and `cookieToken` directly. If the values do not match precisely, it rejects the request (`CSRF token mismatch`).
4. **Cryptographic Validation**: It verifies that an authenticated user ID exists and invokes `this._csrfTokenService.validate(headerToken, identity.userId)`. If the token fails cryptographic verification against the user's session state, it rejects the request (`CSRF token invalid`).
5. **Downstream Propagation**: If all verification layers clear successfully, it calls `next()` to forward execution to downstream pipeline behaviors and application handlers.

---

## How Is It Configured via AppBuilder?

`CsrfMiddleware` is provisioned automatically within the presentation pipeline when the CSRF validation subsystem is enabled. Configuration is managed programmatically during host bootstrapping by supplying the necessary token service and binding security parameters inside the application setup cycle.

To configure CSRF protection, you provide the `csrf` object configuration block within the `.addMiddlewares()` method on your `AppBuilder` instance. This defines the cookie name, maximum age, header binding rules, and secret properties:

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder
  .addContext()
  .addMiddlewares((config, env) => {
    // Enable and configure the CSRF middleware subsystem
    config.csrf = {
      secret: env.getOrThrow('CSRF_SECRET'),
      cookieName: '__Host-xeno-csrf',
      cookieMaxAgeSeconds: 3600,
      headerName: 'x-csrf-token',
      sameSite: 'lax',
    }
  })

const container = await builder.build()

```

When `config.csrf` is defined, `MiddlewareModule` automatically registers both `CsrfMiddleware` (for request validation) and `CsrfCookieMiddleware` (for issuing the security cookie to authenticated clients) into the composite execution chain.

---

## What Happens When Validation Fails?

When any CSRF check fails, the middleware generates a standardized error response using `HttpHelper.error`. The resulting `ResponseDto` payload contains:

* `ERROR_CODES.FORBIDDEN` as the machine-readable error code;
* the standard localized forbidden error message;
* specific diagnostic failure details (`'CSRF token missing'`, `'CSRF token mismatch'`, or `'CSRF token invalid'`);
* the target request path;
* tracing identifiers (`correlationId`, `requestId`, and `spanId`) extracted from the context or dynamically generated via `GuidHelper`;
* a content type header matching the request format indicator (defaulting to `application/json`);
* `STATUS_CODES.FORBIDDEN` as the HTTP response status.

Because the middleware returns immediately without invoking `next()`, downstream controllers, application handlers, and subsequent middleware are never executed for the rejected request.

---

## Where Does It Run in the Middleware Chain?

`MiddlewareModule` positions `CsrfMiddleware` after optional method-check validations and prior to rate-limiting and authentication middleware.

The effective composite execution order follows this structure:

```text
RequestContextMiddleware
	-> OptionsMiddleware (optional)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (active on state-changing methods)
	-> RateLimitMiddleware (when rate-limit options are defined)
	-> AuthenticationMiddleware
	-> Controller or Handler

```

---

## Dependencies and Constraints

`CsrfMiddleware` receives these constructor dependencies via Dependency Injection:

* `IRequestContext<RequestContext, ApplicationRegistry<unknown>>`: Manages access to request-scoped metadata, network parameters, and user identity credentials.
* `ICsrfTokenService`: Provides asynchronous cryptographic validation logic to confirm token authenticity against user scopes.

### Current Implementation Constraints:

* Both `network.csrf` and `network.csrfCookie` must be pre-extracted and populated in the network context by upstream infrastructure adapters.
* Validation checks are enforced exclusively on `POST`, `PUT`, `DELETE`, and `PATCH` methods.
* The middleware relies on companion components like `CsrfCookieMiddleware` to issue the initial CSRF cookie bindings to clients.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)