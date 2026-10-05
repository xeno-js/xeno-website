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
  answer: Configure the Supabase project URL and key with AppBuilder.addAuth(), optionally configure the application redirect URL and cookie options, enable the middleware, and build the application.
- question: Does Xeno.JS support Supabase bearer tokens?
  answer: Yes. The authentication extractor can read an Authorization Bearer token from the HTTP request.
- question: Does Xeno.JS support Supabase authentication cookies?
  answer: Yes. The standard authentication extractor can fall back to the configured authentication cookie, whose default name is sb-access-token.
- question: Does Xeno.JS support Supabase SSR authentication?
  answer: Yes. Xeno.JS provides a Supabase SSR integration that can read the Authorization header and Supabase SSR authentication cookies, including chunked cookies.
- question: Should I trust a Supabase session object supplied by the client?
  answer: No. The application should rely on the configured authentication service to establish the authenticated server-side identity.
---

## How do I configure Supabase authentication with Xeno.JS?

Xeno.JS provides a built-in Supabase authentication integration.

The integration configures the Supabase authentication service and connects it to Xeno.JS request authentication. HTTP middleware extracts the credential from the request, the authentication service validates it, and the resulting claims are mapped to the request identity.

The basic setup is:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

const container = await app.build()
```

`addAuth()` configures the authentication service.

`addMiddlewares()` enables the HTTP middleware that extracts the credential and establishes the authenticated request identity.

For a general explanation of the authentication model, see [Authentication Overview](./overview).

---

## Prerequisites

You need:

* a Supabase project;
* the Supabase project URL;
* a Supabase key;
* an application configuration source for these values;
* Xeno.JS authentication and middleware enabled.

For SSR applications, you also need to configure the SSR-specific authentication options described below.

Keep Supabase credentials in application configuration or environment variables rather than hard-coding them in source code.

---

## Configure the Supabase project

At minimum, configure:

* `SUPABASE_URL` — the Supabase project URL;
* `SUPABASE_KEY` — the key used by the Xeno.JS Supabase integration.

Example:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

const container = await app.build()
```

The Supabase URL and key are used to create the server-side Supabase authentication client.

---

## Configure the application URL

If your authentication flow needs a redirect URL, configure `redirectTo`.

For example:

```ts
app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
  options.redirectTo = config.get('APP_URL')
})
```

A typical configuration uses:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
APP_URL=https://app.example.com
```

`redirectTo` represents the application URL used by the authentication integration when a provider or authentication flow requires a redirect.

---

## Configure authentication cookies

Xeno.JS supports cookie-based authentication in addition to bearer-token authentication.

Cookie behavior can be configured through `cookieOpts`.

For example:

```ts
app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!

  options.redirectTo = config.get('APP_URL')

  options.cookieOpts = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  }
})
```

These options control how the authentication cookies are handled by the server-side integration.

Use secure cookie settings in production. In particular, `secure: true` ensures that the cookie is sent only over HTTPS.

---

## How Xeno.JS extracts the authentication credential

Supabase authentication can reach Xeno.JS through either an HTTP authorization header or authentication cookies.

### Bearer token

The standard authentication extractor looks for:

```http
Authorization: Bearer <token>
```

For example:

```http
GET /api/orders HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJ...
```

The extracted token is passed to the configured authentication service.

The authentication service is responsible for validating the credential and producing authentication claims.

---

## Cookie-based authentication

The standard extractor can also fall back to the configured authentication cookie.

The default authentication cookie name is:

```text
sb-access-token
```

Therefore, an authenticated request may carry its credential through a cookie rather than the `Authorization` header.

The important distinction is:

```text
HTTP request
    │
    ├── Authorization: Bearer <token>
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

The extractor determines **where the credential comes from**.

The authentication service determines **whether the credential is valid and which claims it represents**.

---

## Supabase SSR authentication

For server-side rendering, Xeno.JS provides a dedicated Supabase SSR integration.

The server-side integration uses `@supabase/ssr` and creates the Supabase server client with request-scoped cookie access.

The SSR extractor can read:

* an `Authorization` bearer token;
* Supabase authentication cookies;
* chunked Supabase authentication cookies.

This matters because Supabase SSR sessions may be represented by cookies whose data is split across multiple cookie values.

Do not treat the standard bearer-token extractor and the SSR extractor as interchangeable implementation details. Choose the authentication configuration according to how your application receives the Supabase credential.

---

## Configure Supabase SSR

A complete SSR-oriented configuration can include:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!

  options.redirectTo = config.get('APP_URL')

  options.cookieOpts = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  }
})

app.addMiddlewares()

const container = await app.build()
```

The SSR configuration also supports the SSR-specific authentication options exposed by Xeno.JS.

Conceptually, the configuration is:

```ts
interface AuthSsrConfig<TOptions> extends AuthConfig<TOptions> {
  ssrOpts?: (container) => ISsrCookieHandler
  cookieOpts: CookieHandlerOptions
  customAuth?: {
    authHeaderExtractor: () => IServiceExtractor<
      Request['headers'],
      string | undefined
    >
    authExtendedService: () => IExtendendAuthService
  }
}
```

`ssrOpts` allows the application to provide the SSR cookie handling implementation.

`cookieOpts` configures authentication cookie behavior.

`customAuth` is available when the application needs to replace the built-in authentication service or credential extractor. See [Custom Authentication](./custom).

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

Cookie reads and writes are associated with the current HTTP request and response.

This allows server-side authentication state to participate in the same Xeno.JS authentication flow as bearer-token authentication.

For the underlying Supabase server-side authentication model, consult the current [Supabase SSR documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client).

---

## Enable authentication middleware

Configuring `addAuth()` does not by itself make an HTTP request authenticated.

The HTTP middleware must also be enabled:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

const container = await app.build()
```

The authentication middleware connects the incoming HTTP credential to the configured authentication service.

The resulting identity is stored in the request context and can then be consumed by application-level authorization.

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

A typical application composition root can look like this:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!

  options.redirectTo = config.get('APP_URL')

  options.cookieOpts = {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  }
})

app.addMiddlewares()

const container = await app.build()
```

The responsibilities are intentionally separated:

| Configuration          | Responsibility                              |
| ---------------------- | ------------------------------------------- |
| `options.url`          | Supabase project URL                        |
| `options.key`          | Supabase authentication key                 |
| `options.redirectTo`   | Application redirect URL                    |
| `options.cookieOpts`   | Authentication cookie behavior              |
| `app.addMiddlewares()` | Enables HTTP authentication processing      |
| `app.build()`          | Builds the configured application container |

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
Authorization: Bearer <token>
```

This is common for:

* APIs;
* service-to-service HTTP clients;
* clients that already manage access tokens;
* non-browser clients.

In this case, Xeno.JS extracts the bearer token and passes it to the authentication service.

---

## When should I use SSR cookies?

Use the SSR integration when the application relies on Supabase's server-side cookie-based session model.

This is particularly relevant for applications where:

* authentication state is stored in cookies;
* server-side rendering needs access to the authenticated session;
* the request and response participate in cookie management;
* Supabase SSR cookies may be chunked.

The SSR integration handles these cookies through the server-side Supabase client.

---

## Troubleshooting

### Authentication is not running

Make sure both authentication and middleware are configured:

```ts
app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()
```

Configuring `addAuth()` without enabling the middleware does not establish authentication for incoming HTTP requests.

---

### The bearer token is not detected

Verify that the request contains the expected header:

```http
Authorization: Bearer <token>
```

Also verify that the token is sent to the Xeno.JS HTTP execution path so that the authentication middleware can process the request.

---

### Cookie authentication is not detected

Check:

1. the authentication cookie is present in the request;
2. the cookie name matches the configured authentication cookie;
3. the cookie is available to the request path and domain;
4. HTTPS is used when secure cookies are enabled;
5. SSR applications use the SSR authentication configuration when the session is managed through Supabase SSR cookies.

The default authentication cookie name is:

```text
sb-access-token
```

---

### SSR authentication does not see the session

For SSR applications, verify that:

* the request contains the Supabase authentication cookies;
* the server-side Supabase integration is configured;
* the application is using the SSR extractor when required;
* cookie access is associated with the current request and response.

If the Supabase session uses chunked cookies, make sure the complete cookie set reaches the server.

---

## Related documentation

* [Authentication Overview](./overview)
* [Custom Authentication](./custom)
* [Authentication Middleware](../middleware/authentication)
* [Authentication Extractors](../middleware/extractors)
* [Authorization Overview](../authorization/overview)
* [Authorization Policies](../authorization/policies)
* [Supabase SSR documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
