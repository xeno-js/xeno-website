---
title: 'CsrfCookieMiddleware: Automated Security Cookie Provisioning in Xeno'
description: 'Discover how Xeno.JS CsrfCookieMiddleware automatically provisions secure CSRF tokens as browser cookies for authenticated sessions, detailing its underlying mechanics and AppBuilder configuration.'
keywords: [
   'CsrfCookieMiddleware',
   'Cookie middleware',
   'CSRF cookies',
   'Automated cookie provisioning',
   'Set-Cookie headers',
   'AppBuilder configuration',
   'Xeno',
]
author: 'Xeno'
sidebar:
  order: 4
---

## What Is `CsrfCookieMiddleware`?

`CsrfCookieMiddleware` is a specialized presentation-layer middleware in Xeno.JS responsible for automating the lifecycle of security cookies—specifically, **Cross-Site Request Routing Protection (CSRF) cookies**.

While incoming request headers and cookies are parsed and mapped into the request context via extractors (such as `HttpCookieExtractor`), `CsrfCookieMiddleware` operates proactively on the **outgoing response stream**. It ensures that once a user successfully establishes an authenticated session, a secure, cryptographically bound CSRF token cookie is automatically provisioned and sent back to the browser.

---

## How It Works Under the Hood

Unlike traditional middlewares that evaluate incoming payloads before they reach the controller, `CsrfCookieMiddleware` leverages a post-processing pattern. Here is how the execution flow operates step by step:

1. **Awaiting Downstream Execution**:
The middleware first yields control to the rest of the execution chain by awaiting `await next()`. This ensures that the controller, business handlers, and upstream authentication checks (like `AuthenticationMiddleware`) have already executed and populated the active `RequestContext`.
2. **Identity & Context Inspection**:
Once the downstream response is returned, the middleware queries the `RequestContext` via `IContextAccessor` to inspect two critical parameters:
* **`identity.userId`**: Confirms whether the user is actively authenticated. If no user ID is present (i.e., the user is a `GUEST`), the middleware bypasses cookie injection entirely, preserving public routing performance.
* **`network.csrfCookie`**: Checks if a valid CSRF cookie was already supplied by the incoming request. If it already exists, the middleware avoids redundant token generation.


3. **Token Generation via `ICsrfTokenService**`:
If the user is authenticated and lacks an active client cookie, the middleware delegates token creation to the injected `ICsrfTokenService`, generating a unique, user-scoped cryptographic token.
4. **Secure Cookie Construction & Header Appending**:
It formats the cookie string using enterprise security best practices (enforcing `Path=/`, `Secure`, configurable `SameSite` policies, and expiration bounds) and appends it to the `Set-Cookie` array within `ResponseDto.headers`, ensuring any existing cookies are safely preserved.

---

## Relationship with Cookie Extractors

The cookie workflow in Xeno.JS bridges inbound parsing and outbound provisioning:

* **Inbound (`HttpCookieExtractor`)**: When a browser sends a subsequent state-changing request (`POST`, `PUT`, `DELETE`), the low-level `HttpCookieExtractor` scans the raw `Cookie` header string, isolates the target cookie (e.g., `__Host-xeno-csrf`), decodes it safely using `decodeURIComponent`, and maps it into `network.csrfCookie`.
* **Outbound (`CsrfCookieMiddleware`)**: If that cookie is missing during an authenticated session lifecycle, `CsrfCookieMiddleware` steps in to generate and set it via `Set-Cookie`.

---

## How to Configure It via `AppBuilder`

`CsrfCookieMiddleware` is not instantiated manually; instead, it is provisioned automatically by the framework when you configure the `csrf` security block inside your application's bootstrap file using `.addMiddlewares()`:

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder
  .addContext()
  .addMiddlewares((config, env) => {
    // Activating the CSRF subsystem automatically queues CsrfMiddleware and CsrfCookieMiddleware
    config.csrf = {
      secret: env.getOrThrow('CSRF_SECRET'),
      cookieName: '__Host-xeno-csrf',
      cookieMaxAgeSeconds: 3600, // 1 hour expiration
      headerName: 'x-csrf-token',
      sameSite: 'lax',          // 'strict', 'lax', or 'none'
    }
  })

const container = await builder.build()

```

## Architectural Safeguards During Bootstrap

When `config.csrf` is defined, `MiddlewareModule` performs the following automated wiring:

1. Registers the `CsrfTokenService` binding it to the internal cryptographic engine (`CRYPTO_SERVICE`).
2. Mounts `CsrfCookieMiddleware` into the composite execution stack to handle outgoing cookie issuance.
3. Mounts `CsrfMiddleware` to validate incoming state-changing requests against the issued tokens.

---

## Dependencies and Constraints

* **Dependency Injection**: Requires an active `IContextAccessor`, an implementation of `ICsrfTokenService`, and valid `MiddlewareConfig['csrf']` parameters.
* **State Dependency**: Relies on `AuthenticationMiddleware` having previously resolved and populated the user's `userId` inside the request context.
* **Transport Independence**: Operates entirely on the unified `ResponseDto.headers` structure, leaving actual header flushing to the underlying transport adapter (e.g., Fastify, Hono, or Vercel).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
