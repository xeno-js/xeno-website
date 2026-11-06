---
title: CSRF Middleware
description: Enable and configure Xeno.JS CSRF protection, understand the cookie and token validation flow, and send protected requests from a browser.
keywords:
- Xeno.JS CSRF middleware
- CsrfMiddleware
- CsrfCookieMiddleware
- addMiddlewares
- x-csrf-token
- double-submit cookie
- withCsrf
tags:
- security
- middleware
- csrf
- cookies
faqs:
  - question: Is CSRF protection enabled by default?
    answer: No. Configure the csrf option in addMiddlewares(); Xeno then adds the CSRF cookie and validation middleware.
  - question: Which methods require a CSRF token?
    answer: POST, PUT, PATCH, and DELETE require matching cookie and header tokens that validate for the authenticated user.
  - question: How does the browser get a CSRF token?
    answer: After authentication, a response sets the CSRF cookie when one is not already present. The client reads its value and sends it in the configured request header.
  - question: How can I exempt a route?
    answer: Set security.withCsrf to false or apply the withoutCsrf() helper to that route. Exempt only endpoints that do not use ambient browser credentials.
  - question: Is CSRF protection a replacement for authentication?
    answer: No. Authentication establishes the user identity; CSRF protection checks that a state-changing browser request carries a valid token associated with that identity.
---

## Introduction

Cross-Site Request Forgery (CSRF) occurs when a browser sends a user's automatically attached credentials to an application because another site caused the browser to submit a request. A request can therefore be authenticated even when the user did not intentionally initiate the action.

CSRF protection adds proof that the request came from code that can read a token issued for the authenticated user. Xeno uses a signed, user-bound token in a cookie and requires the same token in a request header for state-changing methods. A malicious site can often cause a browser to send cookies, but it cannot normally read the application's CSRF cookie and copy its value into the required header.

CSRF protection complements authentication; it does not identify the user or grant permissions. Xeno enables it only when the application supplies `csrf` configuration to `XenoAppBuilder.addMiddlewares()`.

## Configure CSRF Protection

Configure a server-side secret and, optionally, the cookie and header settings:

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
    withCredentials: true,
    allowOrigins: [config.getOrThrow('CLIENT_URL')],
  }
  options.csrf = {
    secret: config.getOrThrow('CSRF_SECRET'),
    cookieName: '__Host-xeno-csrf',
    headerName: 'x-csrf-token',
    cookieMaxAgeSeconds: 3600,
    sameSite: 'lax',
  }
})

const application = await app.build()
```

The route list and configuration keys in this example belong to the application. Keep `CSRF_SECRET` on the server, load it from a secret manager or protected environment configuration, and use a strong randomly generated value. Do not send it to the browser or commit it to source control. All application instances that validate the same user's tokens must use the same secret.

CSRF configuration options:

| Option | Default | Purpose |
| --- | --- | --- |
| `secret` | Required | Secret used to sign and validate user-bound tokens. |
| `cookieName` | `__Host-xeno-csrf` | Name of the CSRF cookie read from the incoming `Cookie` header. |
| `headerName` | `x-csrf-token` | Request header from which Xeno reads the submitted token. |
| `cookieMaxAgeSeconds` | `3600` | Cookie lifetime in seconds. |
| `sameSite` | `lax` | Cookie `SameSite` value: `strict`, `lax`, or `none`. |

When `csrf` is omitted, Xeno does not add either CSRF middleware. Adding CSRF configuration enables both token-cookie handling and validation; there is no separate `enabled` flag.

## How the Token Flow Works

Xeno registers two middleware stages when CSRF is configured:

```text
Request context
    │
    ├── AuthenticationMiddleware establishes identity
    │
    ├── CsrfCookieMiddleware
    │       └── after the response, sets a user-bound CSRF cookie if absent
    │
    └── CsrfMiddleware
            └── validates state-changing requests before continuing
```

The order matters: authentication runs before the CSRF middleware stages and stores the identity in the `RequestContext`, so token generation and validation use the authenticated `userId`. In the Node.js context, `AsyncLocalStorage` carries this request-specific context through asynchronous middleware execution.

The normal browser flow is:

1. The user authenticates with the application.
2. The browser makes an authenticated request, typically a `GET` that loads the application or its session.
3. If the request context contains an authenticated `userId` and no CSRF cookie was received, `CsrfCookieMiddleware` generates a token and appends a `Set-Cookie` header to the response.
4. The client reads the CSRF cookie value.
5. For each `POST`, `PUT`, `PATCH`, or `DELETE`, the browser sends the cookie automatically and the client copies the same token into the configured header.
6. `CsrfMiddleware` checks the cookie, header, user identity, and token signature before calling the next middleware.

The cookie middleware runs after the downstream request finishes. A first state-changing request without a token is therefore rejected; start by making an authenticated request that can establish the CSRF cookie, then submit the state change.

The cookie middleware does not replace an existing CSRF cookie when a user is already authenticated. When a browser switches accounts, clear the old CSRF cookie and make an authenticated request as the new user to receive a token bound to that identity.

## How Xeno Validates Tokens

For `POST`, `PUT`, `PATCH`, and `DELETE`, Xeno performs these checks:

1. Reads the token from the configured request header and from the configured cookie.
2. Returns `403 Forbidden` if either value is missing.
3. Returns `403 Forbidden` if the header and cookie values differ.
4. Requires an authenticated identity with a `userId`.
5. Validates the token signature against that user ID and the configured secret.
6. Calls the next middleware only when every check succeeds.

Xeno generates a token from a random nonce and an HMAC-SHA256 signature bound to the `userId`. Validation compares the supplied signature in constant time. The token is stateless: the service does not need to store a separate token record for each request.

Missing tokens, mismatched tokens, missing identity, or an invalid signature produce `403 Forbidden`; the response error details distinguish the failure. `GET`, `HEAD`, and `OPTIONS` are not checked by `CsrfMiddleware`.

## Send Tokens from a Browser

The CSRF cookie is not marked `HttpOnly`, so browser application code can read its value and echo it in the request header. The cookie value is URI-encoded when Xeno writes it; decode it before setting the header:

```ts
function readCookie(name: string): string | undefined {
  const prefix = `${name}=`
  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined
}

const csrfToken = readCookie('__Host-xeno-csrf')
if (!csrfToken) {
  throw new Error('CSRF cookie is missing; make an authenticated request to establish it.')
}

const response = await fetch('https://api.example.com/api/v1/orders', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken,
  },
  body: JSON.stringify({ productId: 'item-123', quantity: 1 }),
})
```

Replace the URL and request body with the application's endpoint and input. The header name in the client must match `csrf.headerName`; the cookie name must match `csrf.cookieName`.

For cross-origin browser requests, configure CORS with the exact client origin and credentials enabled, and use `credentials: 'include'` in `fetch`. Xeno includes `x-csrf-token` in its standard preflight allow-header list. Cross-origin cookies are also subject to browser cookie rules: the cookie is always `Secure`, and a genuinely cross-site setup may require `sameSite: 'none'` and HTTPS.

The default cookie is host-only because Xeno does not set a `Domain` attribute. JavaScript on a different hostname cannot read that cookie, even when the frontend and API are subdomains of the same site. Use a same-host deployment or a same-origin frontend/API proxy when the browser client must read and echo the cookie; configuring CORS alone does not grant JavaScript access to another host's cookie.

## Configure Cookie Attributes

By default, Xeno writes a cookie with these attributes:

```http
Set-Cookie: __Host-xeno-csrf=<encoded-token>; Path=/; Secure; SameSite=lax; Max-Age=3600
```

The cookie uses `Path=/`, always includes `Secure`, and does not include `HttpOnly` or `Domain`. Configure the token lifetime and `SameSite` behavior through `csrf.cookieMaxAgeSeconds` and `csrf.sameSite`. The `__Host-` prefix is intended for secure host-only cookies; use HTTPS in deployments that rely on this cookie.

Choose `SameSite` based on the browser deployment:

- `lax` is the default and is suitable for many same-site applications.
- `strict` applies a tighter cross-site sending policy and may affect navigation flows.
- `none` allows cross-site cookie use in browsers, but requires `Secure`; Xeno always sets `Secure`.

`SameSite` is an additional browser control, not a replacement for token validation. The middleware also requires a matching header token and a valid user-bound signature.

## Protect or Exempt Individual Routes

When CSRF is configured, `POST`, `PUT`, `PATCH`, and `DELETE` routes require a valid token by default. You do not need to add `withCsrf: true` to each protected route.

An application can explicitly disable the CSRF check for a route with `security.withCsrf: false` or the `withoutCsrf()` helper:

```ts
import { withoutCsrf } from '@xeno-js/core'
import type { NativeRouteDefinition } from '@xeno-js/shared'
import type { MyRegistry } from './registry'

declare const webhookRoute: NativeRouteDefinition<MyRegistry>

const routes: NativeRouteDefinition<MyRegistry>[] = [
  withoutCsrf(webhookRoute),
]
```

`webhookRoute` represents a route already defined by the application. Exempt a route only when its security model does not rely on ambient browser credentials, such as a webhook authenticated by a separately verified signature. Do not exempt a route merely to work around a missing or misconfigured CSRF token.

## Common Issues

### A state-changing request returns `403 Forbidden` with “CSRF token missing”

Check that the browser first made an authenticated request that established the CSRF cookie. Then verify that the browser sends the cookie and the configured header on the state-changing request. For cross-origin calls, include `credentials: 'include'` and configure CORS credentials and the exact client origin.

### The request returns “CSRF token mismatch”

The header and cookie must contain exactly the same decoded token. Confirm that the client reads the configured cookie name, decodes its URI-encoded value, and sends it using the configured header name.

### The request returns “CSRF token invalid”

Check that the request has an authenticated `userId`, that the token belongs to the current identity, and that every application instance uses the same `CSRF_SECRET`. A token issued to a different user or signed with a different secret fails validation.

### The browser does not send the CSRF cookie

Check the cookie's `Secure`, `SameSite`, and `Max-Age` attributes and the browser's cookie policy. Cross-origin requests need credentials enabled in both the browser request and CORS response. Cross-site requests may require `sameSite: 'none'` over HTTPS.

### The frontend cannot read the cookie

The CSRF cookie is host-only and Xeno does not configure a `Domain` attribute. A page on a different hostname cannot access it through `document.cookie`; use a same-host frontend/API setup or a same-origin proxy. `Access-Control-Allow-Origin` does not change cookie domain scoping.

### A route does not require a CSRF token

Check that `csrf` is configured in `addMiddlewares()` and that the route does not explicitly set `security.withCsrf` to `false` or use `withoutCsrf()`. Only `POST`, `PUT`, `PATCH`, and `DELETE` are validated by this middleware.

## Related Documentation

- [Authentication Overview](../authentication/overview)
- [Allow-Origin Middleware](./allow-origin)
- [CORS Middleware](./cors-middleware)
- [OPTIONS Middleware](./options-middleware)
- [Security Overview](../overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
