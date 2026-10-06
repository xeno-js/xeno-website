---
title: Security
description: Configure authentication, authorization, HTTP security middleware, and security helpers in Xeno.JS.
keywords:
- Xeno.JS
- security
- authentication
- authorization
- Supabase
- middleware
- CSRF
- CORS
- rate limiting
- roles
- permissions
- multi-tenancy
- security helpers
tags:
- security
- authentication
- authorization
- middleware
- http
- supabase
faqs:
- question: What security capabilities does Xeno.JS provide?
  answer: Xeno.JS provides authentication, authorization strategies, HTTP security middleware, request metadata extraction, CSRF protection, CORS and method controls, rate limiting, and security-oriented HTTP helpers.
- question: Does Xeno.JS provide authentication by itself?
  answer: Xeno.JS provides an authentication abstraction with a built-in Supabase integration and supports custom authentication services and token extractors.
- question: What is the difference between authentication and authorization?
  answer: Authentication establishes the caller identity at the HTTP boundary, while authorization determines whether that identity is allowed to execute an application request.
- question: Which authorization strategies does Xeno.JS provide?
  answer: Xeno.JS provides user ID, tenant ID, role, and permission strategies, together with support for custom authorization strategies.
- question: Is CSRF protection enabled by default?
  answer: No. CSRF protection is enabled when a csrf configuration is supplied to addMiddlewares().
- question: Is CORS enabled by default?
  answer: Yes. AppBuilder defaults cors to true and withCredentials to true. The allowed origin defaults to APP_URL or the local application URL when APP_URL is not configured.
- question: Does Xeno.JS provide rate limiting by default?
  answer: Yes. The default middleware configuration contains a rate limit of 3 requests per 100 seconds unless it is changed through addMiddlewares().
---

## Introduction

Xeno.JS provides security controls at two different boundaries:

* the **HTTP boundary**, where incoming requests are inspected and authenticated;
* the **application boundary**, where authenticated identities are authorized to execute application requests.

These responsibilities are deliberately separate.

```text
HTTP request
    │
    ├── Request context / metadata
    │
    ├── Origin validation
    │
    ├── CORS / OPTIONS handling
    │
    ├── HTTP method validation
    │
    ├── Authentication
    │       └── credential → Identity
    │
    ├── Rate limiting
    │
    ├── CSRF validation
    │
    ▼
Application request
    │
    └── Authorization
            ├── user ID
            ├── tenant ID
            ├── roles
            ├── permissions
            └── custom strategies
```

The security documentation therefore follows the same separation:

```text
security/
├── authentication/
├── authorization/
├── middleware/
└── helpers/
```

---

## Configure security

### How do I enable Xeno.JS security middleware?

The HTTP security layer is enabled through `AppBuilder.addMiddlewares()`.

A minimal authenticated application looks like this:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

const container = await app.build()
```

There are two important calls:

```ts
app.addAuth(...)
```

configures the authentication service.

```ts
app.addMiddlewares(...)
```

installs the HTTP middleware stack and connects it to the authentication service when authentication has been configured.

If `addMiddlewares()` is called without `addAuth()`, Xeno configures the authentication middleware with a `NoAuthGateKeeper`. In other words, the middleware chain exists, but it does not require a real authentication service.

---

## Authentication vs authorization

These two mechanisms solve different problems.

### Authentication

Authentication answers:

> Who is making this request?

The HTTP authentication middleware:

1. extracts a credential;
2. passes it to the configured gatekeeper;
3. authenticates the credential;
4. maps the resulting claims to an identity;
5. stores the identity in the request context.

The flow is:

```text
HTTP credential
      │
      ▼
Token extractor
      │
      ▼
AuthenticationMiddleware
      │
      ▼
GateKeeper
      │
      ▼
Authentication service
      │
      ▼
Identity
      │
      ▼
Request context
```

If authentication fails, `AuthenticationMiddleware` returns an unauthorized response instead of continuing the middleware chain.

See:

* [Authentication Overview](./authentication/overview)
* [Supabase Authentication](./authentication/supabase)
* [Custom Authentication](./authentication/custom)

---

## Authorization

Authorization answers:

> Is this authenticated identity allowed to execute this application request?

Authorization is configured through the CQRS pipeline:

```ts
app.addPipeline((options) => {
  options.authorization = {
    policies: {
      CreateInvoice: {
        userId: true,
        tenantId: true,
        roles: ['admin', 'billing'],
        permissions: ['invoice:create'],
      },
    },
  }
})
```

The authorization pipeline evaluates the configured strategies before passing the request to the next application pipeline stage.

```text
Authenticated Identity
        │
        ▼
AuthorizationPipeline
        │
        ├── user ID strategy
        ├── tenant ID strategy
        ├── role strategy
        ├── permission strategy
        └── custom strategies
        │
        ▼
Application handler
```

All configured strategies are evaluated. If one fails, the authorization pipeline stops and returns the failure.

See:

* [Authorization Overview](./authorization/overview)
* [Authorization Policies](./authorization/policies)
* [Custom Authorization](./authorization/custom)

---

## HTTP security middleware

`addMiddlewares()` builds a composite HTTP middleware containing the security controls configured for the application.

The current middleware composition is:

```text
Request context
      │
      ▼
Origin validation
      │
      ▼
OPTIONS handling       (when enabled)
      │
      ▼
CORS                   (when enabled)
      │
      ▼
HTTP method checks     (when routeRegistry is configured)
      │
      ▼
Authentication
      │
      ▼
Rate limiting
      │
      ▼
CSRF cookie generation
      │
      ▼
CSRF validation
      │
      ▼
Application execution
```

Some stages are conditional.

| Control            | Enabled by                     |
| ------------------ | ------------------------------ |
| Request context    | `addMiddlewares()`             |
| Origin validation  | `addMiddlewares()`             |
| OPTIONS handling   | `optionsMiddleware: true`      |
| CORS               | `cors: true`                   |
| HTTP method checks | `routeRegistry`                |
| Authentication     | `addAuth()`                    |
| Rate limiting      | configured `rateLimite` values |
| CSRF               | `csrf` configuration           |

The exact middleware chain is built by Xeno when the middleware module is configured.

---

## Default security configuration

`AppBuilder` starts with the following relevant middleware defaults:

```ts
{
  isSSR: false,

  rateLimite: {
    maxRequests: 3,
    windowSeconds: 100,
  },

  csrf: undefined,

  optionsMiddleware: false,

  routeRegistry: undefined,

  trustedIpHeader: undefined,

  trustedProxies: [],

  allowOrigins: [],

  allowHeaders: [],

  cors: true,

  withCredentials: true,

  authCookieName: 'sb-access-token',
}
```

This means that some security behavior is already active without additional configuration.

In particular:

* CORS is enabled;
* credentials are enabled;
* origin validation is enabled;
* rate limiting has a default configuration;
* CSRF is not enabled until configured;
* route-specific method checks are not enabled until a route registry is supplied;
* SSR token extraction is not selected unless `isSSR` is enabled.

---

## Configure authentication

Authentication is configured independently from the other HTTP controls.

For the built-in Supabase integration:

```ts
app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})
```

The authentication service is registered before the middleware module is configured.

When `addAuth()` has been called, `addMiddlewares()` connects `AuthenticationMiddleware` to the configured authentication service.

Without `addAuth()`, the middleware uses `NoAuthGateKeeper`.

See [Authentication Overview](./authentication/overview).

---

## Configure CORS and origins

### Allowed origins

The middleware configuration accepts an explicit origin list:

```ts
app.addMiddlewares((options) => {
  options.allowOrigins = [
    'https://app.example.com',
  ]
})
```

If `allowOrigins` is empty, Xeno derives the default origin from:

1. `APP_URL`, when configured;
2. otherwise `http://localhost:<PORT>`.

The origin is checked independently by the origin middleware.

Therefore:

```ts
options.allowOrigins
```

controls **which request origins are accepted**, while:

```ts
options.cors
```

controls whether CORS response handling is enabled.

These are related but separate concerns.

---

### Credentials

Credentials are enabled by default:

```ts
options.withCredentials = true
```

When credentials are enabled, the middleware rejects a wildcard origin:

```ts
options.allowOrigins = ['*']
```

Use explicit origins when browser credentials are enabled.

---

## Configure CSRF protection

CSRF protection is opt-in.

Enable it by supplying `csrf` configuration:

```ts
app.addMiddlewares((options, config) => {
  options.csrf = {
    secret: config.get('CSRF_SECRET')!,
    cookieName: '__Host-xeno-csrf',
    headerName: 'x-csrf-token',
    cookieMaxAgeSeconds: 3600,
    sameSite: 'lax',
  }
})
```

The CSRF configuration supports:

```ts
interface CsrfConfig {
  secret: string
  cookieName?: string
  headerName?: string
  cookieMaxAgeSeconds?: number
  sameSite?: 'strict' | 'lax' | 'none'
  enforceOrigin?: boolean
}
```

When enabled, Xeno uses two middleware stages:

```text
CsrfCookieMiddleware
        │
        └── creates a user-bound CSRF cookie

CsrfMiddleware
        │
        └── validates state-changing requests
```

The CSRF middleware checks `POST`, `PUT`, `DELETE`, and `PATCH` requests.

For these methods it requires:

1. a CSRF token in the configured request header;
2. a CSRF token in the configured cookie;
3. matching header and cookie values;
4. a valid token associated with the authenticated user.

The default cookie name is:

```text
__Host-xeno-csrf
```

The default token lifetime is 3600 seconds.

CSRF protection therefore complements authentication. The authentication credential identifies the caller; the CSRF token protects cookie-authenticated state-changing requests from forged requests.

See [CSRF Protection](./middleware/csrf).

---

## Configure rate limiting

Rate limiting is configured through:

```ts
app.addMiddlewares((options) => {
  options.rateLimite = {
    maxRequests: 30,
    windowSeconds: 60,
  }
})
```

The configuration controls:

* `maxRequests` — maximum number of requests;
* `windowSeconds` — duration of the rate-limit window.

When the limit is exceeded, the middleware returns:

```text
429 Too Many Requests
```

and includes:

```http
Retry-After: <window-seconds>
```

Rate limiting uses the configured atomic cache and a rate-limit key derived from the request context and request path.

The default configuration is:

```ts
{
  maxRequests: 3,
  windowSeconds: 100,
}
```

Change this explicitly for production workloads according to the expected traffic pattern.

See [Rate Limiting](./middleware/rate-limit).

---

## Restrict HTTP methods

Route-specific method validation can be enabled with `routeRegistry`:

```ts
app.addMiddlewares((options) => {
  options.routeRegistry = {
    '/users': ['GET', 'POST'],
    '/users/:id': ['GET', 'PATCH', 'DELETE'],
  }
})
```

When a route registry is configured, Xeno installs method validation middleware.

OPTIONS handling can be enabled separately:

```ts
app.addMiddlewares((options) => {
  options.optionsMiddleware = true
})
```

This is useful when browser clients require CORS preflight handling.

See [HTTP Methods](./middleware/methods).

---

## Configure trusted client IP information

Xeno can be configured to use a trusted IP header:

```ts
app.addMiddlewares((options) => {
  options.trustedIpHeader = 'x-forwarded-for'
  options.trustedProxies = [
    '10.0.0.10',
  ]
})
```

These settings affect how client IP information is resolved in the request context.

Only configure proxy/header trust when the application infrastructure actually controls the corresponding proxy path.

Do not blindly trust arbitrary client-supplied forwarding headers.

---

## SSR authentication

For server-side rendering applications, enable SSR behavior:

```ts
app.addMiddlewares((options) => {
  options.isSSR = true
})
```

With SSR enabled, the default token extractor changes from the normal bearer extractor to the Supabase SSR token extractor.

The normal extractor is:

```text
Authorization: Bearer <token>
        │
        ▼
BearerTokenExtractor
```

The SSR extractor can process:

```text
Authorization header
        +
Supabase authentication cookies
```

including chunked authentication cookies.

See [Supabase Authentication](./authentication/supabase).

---

## Custom authentication

The authentication integration can be replaced with a custom authentication service and credential extractor.

```ts
app.addAuth((options) => {
  options.customAuth = {
    authHeaderExtractor: () => new MyTokenExtractor(),
    authExtendedService: () => new MyAuthService(),
  }
})
```

The two components have separate responsibilities:

```text
Token extractor
    =
    "Where does the credential come from?"

Authentication service
    =
    "How is the credential authenticated?"
```

The resulting authenticated claims are mapped to the request identity.

See [Custom Authentication](./authentication/custom).

---

## Configure authorization

Authorization belongs to the application pipeline.

For example:

```ts
app.addPipeline((options) => {
  options.authorization = {
    policies: {
      CreateInvoice: {
        userId: true,
        tenantId: true,
        roles: ['admin', 'billing'],
        permissions: ['invoice:create'],
      },
    },
  }
})
```

The policy can combine multiple strategy types.

```text
CreateInvoice
    │
    ├── user ID
    ├── tenant ID
    ├── roles
    └── permissions
```

Xeno creates only the strategy types required by the configured policies.

Custom authorization strategies can also be supplied.

Authorization runs in the CQRS/application pipeline, not in the HTTP middleware stack.

See [Authorization Policies](./authorization/policies).

---

## User and tenant identity

Authentication creates the request identity.

Authorization strategies can then consume identity fields such as:

```text
userId
tenantId
roles
permissions
```

A policy such as:

```ts
{
  CreateInvoice: {
    tenantId: true,
  },
}
```

is an authorization check against the authenticated identity.

It should not be interpreted as automatic resource ownership checking.

For example, requiring a tenant ID does not by itself mean that Xeno compares:

```text
identity.tenantId
```

with:

```text
invoice.tenantId
```

Application-specific ownership rules belong in application authorization logic or custom authorization strategies.

---

## Execute HTTP requests through the middleware stack

When application code needs to execute through the configured HTTP middleware, use the Xeno execution bridge:

```ts
ContainerUtils.runExecute(...)
```

The configured middleware chain must be involved in the execution path for HTTP concerns such as:

* authentication;
* CORS;
* origin validation;
* method checks;
* rate limiting;
* CSRF;
* request context.

Conceptually:

```text
HTTP request
      │
      ▼
runExecute(...)
      │
      ▼
configured middleware
      │
      ▼
application action
```

Do not bypass the configured middleware chain when an operation depends on HTTP security behavior.

See [Middleware Execution](./middleware/execution).

---

## Security boundaries

Xeno's security features should be understood as separate controls.

| Mechanism                   | Protects                                                     |
| --------------------------- | ------------------------------------------------------------ |
| Authentication              | Establishes caller identity                                  |
| Authorization               | Controls application request access                          |
| Origin validation           | Restricts request origins                                    |
| CORS                        | Controls browser cross-origin response behavior              |
| HTTP method checks          | Restricts methods available for registered routes            |
| CSRF                        | Protects state-changing cookie-authenticated requests        |
| Rate limiting               | Limits request frequency                                     |
| Trusted proxy configuration | Controls which infrastructure may provide client-IP metadata |
| Sanitization                | Produces safer representations of untrusted values           |
| IP masking                  | Reduces exposure of client IP information in logs/metadata   |

No single mechanism replaces the others.

For example:

```text
Authentication ≠ Authorization
Authentication ≠ CSRF
CORS ≠ CSRF
Sanitization ≠ Validation
Rate limiting ≠ Authorization
```

---

## Recommended configuration

A typical secured application can compose the controls explicitly:

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

app.addMiddlewares((options, config) => {
  options.allowOrigins = [
    config.get('APP_URL')!,
  ]

  options.withCredentials = true

  options.rateLimite = {
    maxRequests: 30,
    windowSeconds: 60,
  }

  options.csrf = {
    secret: config.get('CSRF_SECRET')!,
    cookieName: '__Host-xeno-csrf',
    headerName: 'x-csrf-token',
    cookieMaxAgeSeconds: 3600,
    sameSite: 'lax',
  }
})

app.addPipeline((options) => {
  options.authorization = {
    policies: {
      CreateInvoice: {
        userId: true,
        tenantId: true,
        permissions: ['invoice:create'],
      },
    },
  }
})

const container = await app.build()
```

This produces a security flow of:

```text
HTTP request
    │
    ▼
Origin validation
    │
    ▼
CORS / method handling
    │
    ▼
Authentication
    │
    ▼
Rate limiting
    │
    ▼
CSRF validation
    │
    ▼
Request identity
    │
    ▼
Authorization
    │
    ▼
Application handler
```

The exact controls used by an application should match its authentication transport, browser usage, proxy topology, and application authorization requirements.

---

## Troubleshooting

### Authentication is not being enforced

Check that both calls exist:

```ts
app.addAuth(...)
app.addMiddlewares(...)
```

`addAuth()` registers the authentication service.

`addMiddlewares()` installs the HTTP authentication middleware.

If `addAuth()` is omitted, Xeno uses `NoAuthGateKeeper`.

> Pay Attention: if you want to use only authentication service, yuo can add only `addAuth()` and not `addMiddlewares()`,
> the you can resolve the authentication service calling `const authService = container.resolve(TOKENS.AUTH_SERVICE)`

---

### CSRF protection is not running

Check that `csrf` is configured:

```ts
app.addMiddlewares((options) => {
  options.csrf = {
    secret: '...',
  }
})
```

CSRF is not enabled merely because authentication is enabled.

---

### CORS rejects the request

Check:

```ts
options.allowOrigins
```

and:

```ts
options.withCredentials
```

When credentials are enabled, `*` cannot be used as the allowed origin.

If `allowOrigins` is empty, check `APP_URL` and `PORT`, because Xeno derives a default origin from them.

---

### Requests are unexpectedly rate limited

Check:

```ts
options.rateLimite
```

The default is:

```ts
{
  maxRequests: 3,
  windowSeconds: 100,
}
```

For a higher-throughput API, configure the limit explicitly.

---

### Authorization does not run

Authentication and authorization are separate.

Make sure the application has configured the pipeline:

```ts
app.addPipeline((options) => {
  options.authorization = {
    policies: {
      CreateInvoice: {
        roles: ['admin'],
      },
    },
  }
})
```

Authentication alone creates an identity; it does not automatically authorize every application request.

---

## Security documentation

### Docs Authentication

* [Authentication Overview](./authentication/overview)
* [Supabase Authentication](./authentication/supabase)
* [Custom Authentication](./authentication/custom)

### Docs Authorization

* [Authorization Overview](./authorization/overview)
* [Authorization Policies](./authorization/policies)
* [Custom Authorization](./authorization/custom)

### HTTP middleware

* [Middleware Overview](./middleware/overview)
* [Authentication Middleware](./middleware/authentication)
* [CSRF Protection](./middleware/csrf)
* [CORS](./middleware/cors)
* [HTTP Methods](./middleware/methods)
* [Rate Limiting](./middleware/rate-limit)
* [Extractors](./middleware/extractors)
* [Middleware Execution](./middleware/execution)

### Helpers

* [HTTP Helpers](./helpers/http)
* [Sanitization Helpers](./helpers/sanitize)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
