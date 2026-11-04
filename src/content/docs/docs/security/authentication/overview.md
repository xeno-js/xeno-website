---
title: Authentication
description: Learn how to configure authentication in Xeno.JS and establish the authenticated identity for application requests.
keywords:
- Xeno.JS
- authentication
- AuthService
- AuthClaims
- XenoAppBuilder
- Supabase
- custom authentication
- token extractor
- identity
tags:
- security
- authentication
- app-builder
- middleware
- identity
faqs:
- question: What does authentication do in Xeno.JS?
  answer: Authentication validates a request credential and establishes the authenticated identity that can be used by the application and authorization pipeline.
- question: How do I enable authentication in Xeno.JS?
  answer: Configure an authentication plugin or service with XenoAppBuilder.addAuth() and enable the HTTP middleware layer with addMiddlewares().
- question: Does Xeno.JS provide a built-in authentication provider?
  answer: Xeno.JS provides a separate Supabase integration package and supports custom authentication services configured through AuthModuleOptions.
- question: What is the difference between a token extractor and an authentication service?
  answer: A token extractor retrieves the credential from the incoming request, while the authentication service validates that credential and produces the authenticated claims.
- question: Where is the authenticated identity stored?
  answer: After successful authentication, Xeno.JS maps the authentication claims to the request identity and makes that identity available through the request context.
- question: Can I use a custom authentication provider?
  answer: Yes. Configure authService and, optionally, tokenExtractor through XenoAppBuilder.addAuth().
---

## Introduction

Authentication answers a fundamental security question:

> **Who is making this request?**

In Xeno.JS, the HTTP authentication middleware extracts a credential from the incoming request, asks the configured authentication service to validate it, and places the resulting identity in the request context. If there is no credential, the gatekeeper can resolve the current user through `getUser()` or return a guest identity.

The authentication flow is:

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
Authentication service
      │
      ▼
Auth claims
      │
      ▼
Request identity
      │
      ▼
Application execution
```

Authentication establishes **identity**. It does not decide whether that identity is allowed to perform a particular application operation.

Authorization is responsible for that decision.

## Add Authentication

Authentication is configured through `XenoAppBuilder`.

A basic application configuration looks like this:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

const application = await app.build()
```

There are two important pieces here:

- `withSupabase()` configures the Supabase authentication plugin, and `addAuth()` queues it with the builder.
- `addMiddlewares()` enables the HTTP middleware that extracts the request credential and authenticates the request.

Without the authentication middleware, configuring an authentication service does not by itself authenticate incoming HTTP requests.

## How Authentication Works

Xeno.JS separates two responsibilities that are often combined in application code.

### 1. Credential extraction

The **token extractor** answers:

> Where does the credential come from?

For example, an HTTP authentication credential may come from:

```http
Authorization: Bearer <access-token>
```

or from a cookie, depending on the selected authentication integration.

The extractor is responsible for retrieving the credential from the transport.

It does not decide whether the credential is valid.

### 2. Credential validation

The **authentication service** answers:

> Is this credential valid, and which identity does it represent?

The authentication service validates the credential and returns authentication claims.

Conceptually:

```text
Request
   │
   ├── extractor ──────► credential
   │
   └── auth service ◄─── credential
             │
             ▼
         AuthClaims
```

Keeping these responsibilities separate allows the same authentication model to work with different credential formats and authentication providers.

## Authentication Claims

A successful authentication produces claims describing the authenticated identity.

The `AuthClaims` contract requires `sub` and defines the following fields:

```ts
import type { AuthClaims } from '@xeno-js/shared'

const claims: AuthClaims = {
  sub: '550e8400-e29b-41d4-a716-446655440000',
  email: 'user@example.com',
  name: 'Jane Doe',
  tenantId: '550e8400-e29b-41d4-a716-446655440001',
  roles: ['admin'],
  permissions: ['orders:read'],
}
```

`email`, `name`, `tenantId`, `roles`, and `permissions` can each have an `undefined` value. Xeno.JS maps `sub` to `Identity.userId` and `tenantId` to `Identity.tenantId`; both values are parsed as GUIDs, so provide valid GUID strings when the application needs those identifiers.

Xeno.JS then maps the authentication claims to the request identity used by the application.

This identity is what authorization strategies consume later in the request lifecycle.

```text
Authentication
      │
      ▼
Authentication claims
      │
      ▼
Request identity
      │
      ▼
Configured authorization (if any)
```

## Configure Authentication with Supabase

The `@xeno-js/supabase` package provides a Supabase authentication integration.

The minimal configuration is:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

const application = await app.build()
```

The Supabase integration reads `SUPABASE_URL` and `SUPABASE_KEY` by default. It requires both values and selects the standard client unless you define its `ssr` options. `redirectTo`, when set, is passed to Supabase's OAuth sign-in operation.

For Supabase-specific configuration, including client options, SSR cookies, and token extraction, see:

**[Supabase Authentication](./supabase)**

## Use a Custom Authentication Service

You do not have to use the Supabase integration.

Xeno.JS supports a custom authentication service when your application uses another identity provider or has its own authentication mechanism.

Configure `authService` and, optionally, `tokenExtractor` through `addAuth()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addAuth((options) => {
  options.authService = () => new MyAuthService()
  options.tokenExtractor = () => new MyTokenExtractor()
})

app.addMiddlewares()

const application = await app.build()
```

The two components have different responsibilities:

```text
MyTokenExtractor
      │
      └── extracts the credential

MyAuthService
      │
      └── validates the credential
          and returns authentication claims
```

The custom authentication service implements the Xeno.JS authentication contract.

At its base, the authentication service provides operations such as:

```ts
import type { AuthClaims, Maybe, ResultType } from '@xeno-js/shared'

interface IBaseAuthService {
  isAuthenticated(): Promise<boolean>

  getUser(): Promise<ResultType<Maybe<AuthClaims>>>

  authenticate(token: string): Promise<ResultType<AuthClaims>>
}
```

The configured service must implement `IExtendendAuthService`, which also includes `signInWithProvider()`, `getSession()`, `signOut()`, and `exchangeCodeForSession()`. When the extractor returns no credential, Xeno.JS calls `getUser()`; `isAuthenticated()` is part of the contract but is not called by the HTTP authentication middleware.

The custom service factory receives the active service scope, and the service is scoped to the request. The optional token extractor is registered as a singleton and should not capture request-scoped services.

For the complete custom provider implementation, see:

**[Custom Authentication](./custom)**

## Authentication Middleware

Authentication is applied at the HTTP boundary by Xeno.JS middleware.

The resulting flow is:

```text
HTTP request
      │
      ▼
Credential extraction
      │
      ▼
Authentication
      │
      ▼
Authenticated identity
      │
      ▼
Request context
      │
      ▼
Application execution
```

When the configured service authenticates a supplied credential successfully, Xeno.JS maps the returned claims to an identity and makes it available through the request context.

When the service returns a failed result for a supplied credential, the middleware returns an error response and does not continue to the next middleware. It uses the error's status when provided, or `401 Unauthorized` otherwise.

When no credential is extracted, Xeno.JS calls `getUser()`. If that call fails or returns no user, the gatekeeper sets the guest identity and the middleware continues. The middleware therefore does not, by itself, require every request to be authenticated; use route protection or authorization rules where authentication is mandatory.

This makes authentication available to the application without requiring individual commands or services to manually parse HTTP headers or authentication cookies.

## Authentication and Authorization

Authentication and authorization solve different problems.

### Authentication

Authentication answers:

> **Who are you?**

```text
credential
    ↓
authenticated identity
```

### Authorization

Authorization answers:

> **Are you allowed to perform this operation?**

```text
authenticated identity
    ↓
authorization policy
    ↓
allowed / denied
```

For example, authentication may establish:

```ts
{
  sub: '550e8400-e29b-41d4-a716-446655440000',
  tenantId: '550e8400-e29b-41d4-a716-446655440001',
  roles: ['operator']
}
```

Authorization can then decide whether that identity may execute a specific command.

Do not put application authorization rules into the authentication service.

Authentication establishes identity. Authorization evaluates access.

See **[Authorization](../authorization/overview)** for application-level access control.

## Authentication and the Request Context

Once the gatekeeper resolves an identity, Xeno.JS associates it with the current request context. This includes the guest identity when no authenticated user is found.

This allows application code to work with the authenticated identity without depending directly on the HTTP transport.

In the default Node context, `AsyncLocalStorage` carries the `RequestContext` across asynchronous work. Authentication services are scoped to the active service scope; avoid retaining request-scoped services in singletons.

The architectural flow is therefore:

```text
HTTP
 │
 │ authentication
 ▼
Request Context
 │
 │ identity
 ▼
Application
 │
 │ authorization
 ▼
Use Case
```

This is particularly useful for CQRS handlers and application services because they can consume identity information without directly depending on `Request`, `Response`, or HTTP headers.

## When Should You Use Custom Authentication?

Use the `@xeno-js/supabase` integration when Supabase is responsible for authenticating your application users.

Use a custom authentication service when your application needs to integrate with another authentication provider or an existing authentication system.

Typical examples include:

- an enterprise identity provider;
- an internal authentication service;
- a custom JWT issuer;
- an API gateway that provides application credentials;
- an existing authentication system that cannot be replaced.

The important requirement is that the custom implementation can turn the incoming credential into the authentication claims required by the application.

## Authentication Is Not Authorization

Do not assume that an authenticated request is automatically authorized to perform every operation.

For example, an authenticated identity might contain:

```ts
{
  sub: '550e8400-e29b-41d4-a716-446655440000',
  tenantId: '550e8400-e29b-41d4-a716-446655440001',
  roles: ['user']
}
```

This only establishes who the caller is.

An application can still require:

```text
role = admin
```

or:

```text
permission = orders:create
```

or a more specific business rule such as:

```text
the authenticated user owns this order
```

Those checks belong to authorization.

Xeno.JS provides built-in authorization strategies for common identity and access checks and allows custom authorization strategies for application-specific rules.

## Recommended Authentication Configuration

For a typical HTTP application, configure authentication together with the middleware layer:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSupabase } from '@xeno-js/supabase'

const app = new XenoAppBuilder()

app.addAuth(withSupabase((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
}))

app.addMiddlewares()

app.addPipeline()

const application = await app.build()
```

This gives the application the following security flow:

```text
HTTP request
     │
     ▼
Authentication middleware
     │
     ▼
Authenticated identity
     │
     ▼
Application pipeline
     │
     ▼
Authorization
     │
     ▼
Command / Query handler
```

The exact middleware configuration depends on the application's transport and security requirements. Authentication can be combined with CSRF protection, CORS controls, allowed HTTP methods, and rate limiting.

See the **[HTTP Security Middleware](../middleware/overview)** documentation for those controls.

## Common Configuration Mistakes

### Authentication is configured but requests are not authenticated

Make sure the middleware layer is enabled:

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

`addAuth()` configures the authentication service; `addMiddlewares()` enables the HTTP middleware that uses it. A missing credential may result in the guest identity rather than an error response, so ensure the relevant route or authorization policy requires an authenticated identity.

### The application parses the Authorization header inside handlers

Do not make application handlers responsible for extracting HTTP credentials.

Keep transport-specific credential extraction in the authentication middleware and expose the resulting identity through the request context.

This keeps the application layer independent from HTTP.

### Authentication logic contains business authorization rules

Avoid implementing rules such as:

```text
is this user an administrator?
does this user own this resource?
does this user belong to this tenant?
```

inside the authentication service.

The authentication service should establish the identity.

Use authorization policies and custom authorization strategies for access decisions.

### A custom provider only implements token extraction

A token extractor only retrieves the credential.

It does not validate the credential or establish the authenticated identity.

A custom authentication integration normally requires both:

```text
credential extractor
        +
authentication service
```

## Next Steps

Once authentication is configured, continue with the provider-specific or application-specific integration:

- **[Supabase Authentication](./supabase)** — configure the Supabase integration, cookies, SSR, and token extraction.
- **[Custom Authentication](./custom)** — implement your own authentication service and credential extractor.
- **[Authorization](../authorization/overview)** — use the authenticated identity to control access to application operations.
- **[HTTP Security Middleware](../middleware/overview)** — configure authentication together with CSRF, CORS, method restrictions, and rate limiting.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
