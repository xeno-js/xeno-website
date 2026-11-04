---
title: Supabase Authentication
description: Configure Supabase authentication with Xeno.JS, including bearer tokens, authentication cookies, SSR cookies, and middleware integration.
keywords:
- Xeno.JS
- Supabase
- authentication
- Supabase SSR
- bearer token
- authentication cookie
- SSR cookies
- middleware
tags:
- security
- authentication
- supabase
- middleware
faqs:
- question: How do I configure Supabase authentication with Xeno.JS?
  answer: Register withSupabase() with XenoAppBuilder.addAuth(), configure the Supabase project URL and key, enable middleware for HTTP requests, and build the application.
- question: Does Xeno.JS support Supabase bearer tokens?
  answer: Yes. The authentication extractors read a Bearer access token from the Authorization header.
- question: Does Xeno.JS support Supabase authentication cookies?
  answer: Yes. CSR mode can fall back to a cookie named by csr.cookieName, which defaults to sb-access-token; SSR mode reads cookies using ssr.cookiePrefix.
- question: Does Xeno.JS support Supabase SSR authentication?
  answer: Yes. The SSR integration reads a Bearer token or matching Supabase SSR cookies, including numbered cookie chunks.
- question: Should I trust a Supabase session object supplied by the client?
  answer: No. The application should rely on the configured authentication service to establish the authenticated server-side identity.
---

## How do I configure Supabase authentication with Xeno.JS?

Xeno.JS provides a built-in Supabase authentication integration.

The integration configures the Supabase authentication service and connects it to Xeno.JS request authentication. HTTP middleware extracts the credential from the request, the authentication service validates it, and the resulting claims are mapped to the request identity.

The basic setup is:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

await app.build()
```

`withSupabase()` creates the Supabase authentication plugin. `addAuth()` queues that plugin with the builder; the selected CSR or SSR module registers the scoped authentication service when `build()` resolves the queued modules.

`addMiddlewares()` enables the HTTP middleware that extracts the credential and establishes the authenticated request identity. It is required for authentication of incoming HTTP requests.

For a general explanation of the authentication model, see [Authentication Overview](./overview).

---

## Prerequisites

You need:

- `@xeno-js/core` and `@xeno-js/supabase`;
- `@supabase/ssr` when using SSR mode;
- a Supabase project;
- the Supabase project URL;
- a Supabase key appropriate to the application runtime;
- an application configuration source for these values;
- Xeno.JS authentication and middleware enabled.

For SSR applications, you also need to configure the SSR-specific authentication options described below.

Install `@xeno-js/core`, `@xeno-js/supabase`, and `@supabase/supabase-js`. Add `@supabase/ssr` when using SSR mode. Keep keys in application configuration or environment variables rather than hard-coding them. Do not expose a privileged service-role key to an untrusted client.

---

## Configure the Supabase project

At minimum, configure:

- `SUPABASE_URL` — the Supabase project URL;
- `SUPABASE_KEY` — the key used by the Xeno.JS Supabase integration.

Example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

await app.build()
```

`withSupabase()` reads `SUPABASE_URL` and `SUPABASE_KEY` by default, and throws during builder configuration if either value is missing. The values create the Supabase client; `ssr` selects the server-side client while omitting it selects the standard client.

---

## Configure the application URL

If Supabase OAuth sign-in needs a redirect URL, configure `redirectTo`.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
  options.redirectTo = config.get('SUPABASE_REDIRECT_TO')
}))
```

A typical configuration uses:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
SUPABASE_REDIRECT_TO=https://app.example.com/auth/callback
```

`redirectTo` defaults to `SUPABASE_REDIRECT_TO` and is passed to Supabase when `signInWithProvider()` starts an OAuth sign-in. It is not a general application URL setting.

---

## Configure authentication cookies

Xeno.JS supports cookie-based authentication in addition to bearer-token authentication.

Cookie behavior has separate settings for the standard client and SSR mode.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!

  options.ssr = {
    cookieOptions: {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
  }
}))
```

In SSR mode, `ssr.cookieOptions` configures cookie attributes. Xeno.JS defaults to `path: '/'`, `httpOnly: true`, `sameSite: 'lax'`, and `secure: true`. In CSR mode, use `csr.cookieName` to configure the cookie name that the request extractor checks; it does not configure Supabase client storage.

Use secure cookie settings in production. In particular, `secure: true` marks cookies for HTTPS-only transport. For local HTTP development, override it with `false`; do not disable it in production.

---

## How Xeno.JS extracts the authentication credential

Supabase authentication can reach Xeno.JS through a Bearer authorization header or, depending on the selected mode, a cookie.

### Bearer token

The standard authentication extractor looks for:

```http
Authorization: Bearer <access-token>
```

For example:

```http
GET /api/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer <access-token>
```

The extracted token is passed to the configured authentication service.

The authentication service is responsible for validating the credential and producing authentication claims.

---

## Cookie-based authentication

In CSR mode, the standard extractor can also fall back to a cookie named by `csr.cookieName`.

The default cookie name is:

```text
sb-access-token
```

Therefore, an authenticated request may carry its credential through a cookie rather than the `Authorization` header.

The cookie value in CSR mode is treated as the access token. This setting configures the request extractor; it does not change the Supabase client's storage settings.

The important distinction is:

```text
HTTP request
    │
    ├── Authorization: Bearer <access-token>
    │
    └── authentication cookie
             │
             ▼
       token extraction
             │
             ▼
       authentication service
             │
             ▼
          AuthClaims
             │
             ▼
        request Identity
```

The extractor determines **where the credential comes from**. In SSR mode, `ssr.cookiePrefix` configures the cookie name prefix used by the SSR extractor; it defaults to `sb-access-token`, and numbered chunks use names such as `sb-access-token.0`.

The authentication service determines **whether the credential is valid and which claims it represents**.

---

## Supabase SSR authentication

For server-side rendering, Xeno.JS provides a dedicated Supabase SSR integration.

The server-side integration requires `@supabase/ssr` and creates the Supabase server client with cookie access through the active Xeno.JS service scope.

The SSR extractor can read:

- an `Authorization` bearer token;
- the cookie name configured by `ssr.cookiePrefix` (default: `sb-access-token`);
- chunked Supabase authentication cookies.

This matters because Supabase SSR sessions may be represented by cookies whose data is split across multiple cookie values.

The SSR extractor checks the bearer header first, then reads the matching cookie. It joins numbered chunks and extracts `access_token` from the cookie payload. Set `ssr.cookiePrefix` to the cookie name used by your Supabase SSR client; the default is `sb-access-token`.

Do not treat the standard bearer-token extractor and the SSR extractor as interchangeable implementation details. Choose the authentication configuration according to how your application receives the Supabase credential.

---

## Configure Supabase SSR

A complete SSR-oriented configuration can include:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
  options.redirectTo = config.get('SUPABASE_REDIRECT_TO')
  options.ssr = {
    cookiePrefix: 'sb-access-token',
    cookieEncoding: 'base64url',
    cookieOptions: {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
  }
}))

app.addMiddlewares()

await app.build()
```

Defining `options.ssr` selects the SSR module. The Supabase integration also exposes these mode-specific settings:

- `ssr.options` — options forwarded to the Supabase SSR client;
- `ssr.cookieEncoding` — cookie encoding (`raw` or `base64url`);
- `ssr.cookieHandler` — a custom request cookie handler; if omitted, Xeno.JS resolves its default handler from the active service scope;
- `ssr.cookieOptions` — cookie attributes used by the SSR integration;
- `ssr.cookiePrefix` — cookie name or prefix read by the SSR token extractor;
- `csr.options` — options forwarded to the standard Supabase client;
- `csr.cookieName` — cookie name checked by the standard token extractor.

Authentication services and the default cookie handler are scoped to the active service scope. Do not retain these request-specific instances in a singleton. In the default Node context, Xeno.JS propagates request context through `AsyncLocalStorage`; SSR cookie access therefore belongs to the current request, not a shared singleton.

---

## How SSR cookie handling works

The Xeno.JS Supabase server integration creates the Supabase server client through `@supabase/ssr`.

The important application-level behavior is:

```text
HTTP request
    │
    ├── Authorization header
    │
    └── Supabase SSR cookies
             │
             ▼
       SSR token extraction
             │
             ▼
       Supabase authentication
             │
             ▼
          AuthClaims
             │
             ▼
        request Identity
```

The default handler reads cookies from the current network context and buffers cookie updates for the HTTP response path. A custom `ssr.cookieHandler` can replace it when the application supplies its own request/response cookie integration.

This allows server-side authentication state to participate in the same Xeno.JS authentication flow as bearer-token authentication.

For the underlying Supabase server-side authentication model, consult the current [Supabase SSR documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

---

## Enable authentication middleware

Configuring `addAuth()` does not by itself make an HTTP request authenticated.

The HTTP middleware must also be enabled:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

await app.build()
```

The authentication middleware connects the incoming HTTP credential to the configured authentication service.

The resulting identity is stored in the request context and can then be consumed by application-level authorization. In the default Node runtime, `AsyncLocalStorage` carries the `RequestContext` across asynchronous work.

The overall flow is:

```text
HTTP credential
      │
      ▼
Token extractor
      │
      ▼
Authentication middleware
      │
      ▼
Supabase authentication service
      │
      ▼
AuthClaims
      │
      ▼
ClaimsIdentityMapper
      │
      ▼
Request Identity
```

Authentication establishes **who the caller is**.

Authorization determines **whether that identity is allowed to execute a specific application request**.

---

## Complete configuration example

A typical SSR application composition root can look like this:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
  options.redirectTo = config.get('SUPABASE_REDIRECT_TO')
  options.ssr = {
    cookiePrefix: 'sb-access-token',
    cookieEncoding: 'base64url',
    cookieOptions: {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
  }
}))

app.addMiddlewares()

await app.build()
```

The responsibilities are intentionally separated:

| Configuration          | Responsibility                              |
| ---------------------- | ------------------------------------------- |
| `options.url`          | Supabase project URL                        |
| `options.key`          | Supabase authentication key                 |
| `options.redirectTo`   | OAuth redirect destination                  |
| `options.ssr.cookieOptions`| SSR cookie attributes                   |
| `options.ssr.cookiePrefix` | SSR cookie name or prefix for extraction|
| `options.csr.cookieName`  | CSR fallback cookie name                 |
| `app.addMiddlewares()`      | Enables HTTP authentication processing |
| `app.build()`  | Resolves queued modules and returns the application |

---

## Do not trust client-side session state as identity

A session object stored or supplied by the client should not be treated as proof of authentication by application code.

The server-side authentication flow must establish the identity:

```text
credential
    │
    ▼
authentication service
    │
    ▼
validated AuthClaims
    │
    ▼
request Identity
```

Application authorization should consume the resulting request identity rather than trusting arbitrary identity data supplied in the request payload or client-side state.

This distinction is especially important when protecting commands, queries, or resources belonging to a specific user or tenant.

---

## When should I use bearer authentication?

Bearer authentication is appropriate when the client explicitly sends an access token:

```http
Authorization: Bearer <access-token>
```

This is common for:

- APIs;
- service-to-service HTTP clients;
- clients that already manage access tokens;
- non-browser clients.

In this case, Xeno.JS extracts the bearer token and passes it to the authentication service.

---

## When should I use SSR cookies?

Use the SSR integration when the application relies on Supabase's server-side cookie-based session model.

This is particularly relevant for applications where:

- authentication state is stored in cookies;
- server-side rendering needs access to the authenticated session;
- the request and response participate in cookie management;
- Supabase SSR cookies may be chunked.

The SSR integration handles these cookies through the server-side Supabase client.

---

## Troubleshooting

### Authentication is not running

Make sure both authentication and middleware are configured:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

await app.build()
```

Configuring `addAuth()` without enabling the middleware does not establish authentication for incoming HTTP requests.

---

### The bearer token is not detected

Verify that the request contains the expected header:

```http
Authorization: Bearer <access-token>
```

Also verify that the token is sent to the Xeno.JS HTTP execution path so that the authentication middleware can process the request.

---

### Cookie authentication is not detected

Check:

1. the authentication cookie is present in the request;
2. in CSR mode, the cookie name matches `csr.cookieName`; in SSR mode, it matches `ssr.cookiePrefix`;
3. the cookie is available to the request path and domain;
4. HTTPS is used when secure cookies are enabled;
5. SSR applications use the SSR authentication configuration when the session is managed through Supabase SSR cookies.

The default CSR cookie name and SSR cookie prefix are:

```text
sb-access-token
```

---

### SSR authentication does not see the session

For SSR applications, verify that:

- the request contains the Supabase authentication cookies;
- the server-side Supabase integration is configured;
- the application is using the SSR extractor when required;
- the request cookie names match `ssr.cookiePrefix`;
- the SSR cookie handler is resolved in the active request scope.

If the Supabase session uses chunked cookies, make sure the complete cookie set reaches the server.

---

## Related documentation

- [Authentication Overview](./overview)
- [Custom Authentication](./custom)
- [Authentication Middleware](../middleware/authentication)
- [Authentication Extractors](../middleware/extractors)
- [Authorization Overview](../authorization/overview)
- [Authorization Policies](../authorization/policies)
- [Supabase SSR documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
