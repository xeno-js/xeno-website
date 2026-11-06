---
title: Cookie Response Middleware
description: Configure Xeno.JS SSR cookie handling and understand how request cookies are read and queued response cookies are sent.
keywords:
- Xeno.JS cookie middleware
- CookieResponseMiddleware
- CookieHandler
- SSR cookies
- isSSR
- Supabase SSR cookies
- Set-Cookie
tags:
- security
- middleware
- cookies
- ssr
faqs:
  - question: How do I enable the cookie response middleware?
    answer: Set isSSR to true in addMiddlewares(). To queue cookies, the request scope must also have a cookie handler, such as the default handler configured by the Supabase SSR integration.
  - question: Does this middleware create authentication cookies by itself?
    answer: No. The cookie handler or an SSR auth library queues cookie changes; CookieResponseMiddleware appends those pending cookies to the response's Set-Cookie header.
  - question: How do I read and set cookies in an SSR auth flow?
    answer: Use the request-scoped ISsrCookieHandler. Its getAll() reads incoming cookies, setAll() queues response cookies, and the middleware sends them after the request finishes.
  - question: Is this the CSRF cookie middleware?
    answer: No. CookieResponseMiddleware propagates SSR cookies such as authentication session updates. CSRF token-cookie creation and validation use separate CSRF middleware.
---

## Introduction

Server-side authentication libraries may need to read cookies from the incoming request and update cookies in the response. A login, token refresh, or session update can produce one or more `Set-Cookie` values that the HTTP server must return to the browser.

Xeno separates cookie management from response transport:

- The request-scoped `ISsrCookieHandler` reads incoming cookies and buffers cookie updates during the request.
- `CookieResponseMiddleware` collects the buffered values after the downstream middleware and route handler finish, then appends them to the response's `Set-Cookie` header.

The middleware does not create authentication cookies or decide their contents. An SSR authentication integration or application code queues those changes through the cookie handler.

This is separate from `CsrfCookieMiddleware`, which generates a CSRF token cookie and validates tokens on state-changing requests.

## Enable SSR Cookie Handling

Set `isSSR` to `true` in `addMiddlewares()`. When using the Supabase SSR integration, configure `options.ssr` in `withSupabase()` as well; that integration registers the request-scoped cookie handler used by the response middleware.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(
  withSupabase((options, config) => {
    options.url = config.getOrThrow('SUPABASE_URL')
    options.key = config.getOrThrow('SUPABASE_KEY')
    options.ssr = {
      cookieOptions: {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      },
    }
  }),
)

app.addMiddlewares((options) => {
  options.isSSR = true
})

const application = await app.build()
```

Use the SSR integration when the server must read and update Supabase session cookies. The `options.ssr.cookieOptions` values are forwarded to the Supabase SSR client and also configure defaults for cookies serialized by Xeno's default handler. Keep `secure: true` in HTTPS deployments; for local HTTP development only, configure `secure: false`.

`isSSR` enables `CookieResponseMiddleware`, but it does not register a cookie handler by itself. A handler must be supplied by an auth integration or registered in the request scope. The Supabase SSR integration configures a default handler unless you provide a custom `options.ssr.cookieHandler`.

## Cookie Handler API

The request-scoped handler implements `ISsrCookieHandler`:

| Method | Behavior |
| --- | --- |
| `getAll()` | Reads the incoming `Cookie` header from the current network context and returns parsed `{ name, value }` pairs. |
| `setAll(cookies)` | Queues cookie values and attributes to be added to the outgoing response. |
| `getPendingCookies()` | Serializes and returns the queued cookies as `Set-Cookie` values. |

In the Supabase SSR integration, the server client uses `getAll()` to read the incoming browser session and calls `setAll()` when it needs to update cookies. `CookieResponseMiddleware` then transports the queued values to the HTTP response.

The handler uses the current request's service scope, so cookie state is isolated per request. Avoid storing a request's pending cookies in a shared singleton; use the scoped handler supplied by the SSR integration or implement a custom `ISsrCookieHandler` with equivalent request isolation.

## How the Response Middleware Works

For each request, `CookieResponseMiddleware`:

1. Calls the next middleware and waits for the response.
2. Gets the active request scope from `IRequestContext`.
3. Resolves `TOKENS.COOKIE_HANDLER` and reads its pending cookie values.
4. Appends them to the response's `Set-Cookie` header, preserving existing cookies and other response headers.
5. Returns the updated response.

If the response already contains a `Set-Cookie` string, Xeno converts it to an array before appending the pending values. Each cookie remains a separate `Set-Cookie` value; do not combine multiple cookies into one comma-separated header.

When there is no active scope or no pending cookie, the middleware leaves the response unchanged. It also leaves the response unchanged if resolving the handler or reading pending cookies fails. Errors from the downstream middleware still propagate.

The middleware runs after the downstream response is produced. It can therefore append queued cookies to normal responses and error responses that return through the middleware chain. It cannot change a response that bypasses the Xeno middleware pipeline.

## Default Cookie Serialization

Xeno's default `CookieHandler` reads request cookies from the network context and serializes queued cookie values. Its serializer applies these defaults unless overridden:

| Attribute | Default |
| --- | --- |
| `Path` | `/` |
| `HttpOnly` | `true` |
| `Secure` | `true` in production; otherwise `false` |
| `SameSite` | `Lax` |

You can set default attributes in the Supabase SSR configuration:

```ts
options.ssr = {
  cookieOptions: {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    domain: 'example.com',
  },
}
```

The serializer also supports `maxAge`, `expires`, `domain`, `partitioned`, and `priority`. Per-cookie values passed to `setAll()` override handler defaults. Cookie names and values are URI-encoded when serialized; incoming values are URI-decoded when possible.

Choose attributes to match the deployment:

- `httpOnly: true` prevents client-side JavaScript from reading authentication cookies.
- `secure: true` restricts cookie transmission to HTTPS.
- `sameSite: 'lax'` is the default; `'strict'` tightens cross-site sending and `'none'` permits cross-site use in browsers that support it. `SameSite=None` requires `Secure`.
- `domain` broadens which hosts receive the cookie. Omit it for a host-only cookie unless sharing across subdomains is an explicit requirement.

## Use a Custom Cookie Handler

The Supabase SSR configuration accepts a custom handler when the application needs to integrate with its own request and response cookie system:

```ts
import type { ISsrCookieHandler } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

declare const applicationCookieHandler: ISsrCookieHandler

const supabaseAuth = withSupabase((options, config) => {
  options.url = config.getOrThrow('SUPABASE_URL')
  options.key = config.getOrThrow('SUPABASE_KEY')
  options.ssr = {
    cookieHandler: applicationCookieHandler,
  }
})
```

`applicationCookieHandler` represents an application-provided handler. Its `getAll()` must read the current request's cookies, and its `setAll()` must retain that request's cookie updates until `getPendingCookies()` returns them to `CookieResponseMiddleware`. Since the Supabase plugin accepts a handler instance, the application must ensure the handler uses request-aware state and does not mix pending cookies across concurrent requests.

The Supabase integration uses the custom handler instead of registering its default handler. Keep `isSSR: true` enabled so Xeno adds the response middleware that appends the pending cookie values.

## Common Issues

### The response does not include updated authentication cookies

Check that `options.ssr` is configured in the authentication integration and that `isSSR` is `true` in `addMiddlewares()`. Confirm that the handler's `setAll()` is called and that the request has an active scope with `TOKENS.COOKIE_HANDLER` registered.

### `isSSR: true` is set, but no cookies are sent

`isSSR` only enables `CookieResponseMiddleware`; it does not create a handler. Configure the Supabase SSR integration or register a custom request-scoped handler. The middleware returns the response unchanged when no scope or pending cookies are available.

### Existing `Set-Cookie` values disappear

The middleware appends pending cookies and preserves existing response headers. If a custom HTTP adapter or response mapper rewrites headers after Xeno returns the response, verify that it preserves every `Set-Cookie` value as a separate header.

### Cookies work locally but not in production

Check the `Secure`, `SameSite`, `Domain`, and `Path` attributes against the deployed scheme and host. Secure cookies require HTTPS. Cross-site cookies generally require `SameSite=None; Secure`; browser privacy settings may impose additional restrictions.

### The browser does not send a cookie to a subdomain

Cookies are host-only unless a `Domain` attribute is set. Configure an appropriate domain only when sharing across subdomains is required, and consider the increased scope of that cookie.

### An authentication cookie is confused with the CSRF cookie

Authentication cookies are read and updated by the SSR auth integration through `ISsrCookieHandler`. The CSRF cookie is a separate token cookie managed by `CsrfCookieMiddleware`; see [CSRF Middleware](./csrf-middleware).

## Related Documentation

- [Supabase Authentication](../authentication/supabase)
- [Authentication Overview](../authentication/overview)
- [CSRF Middleware](./csrf-middleware)
- [Request Context Middleware](./request-context-midleware)
- [Security Overview](../overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
