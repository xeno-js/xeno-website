---
title: Authentication
description: Learn how to configure authentication in Xeno.JS and establish the authenticated identity for application requests.
keywords:
- Xeno.JS
- authentication
- AuthService
- AuthClaims
- AppBuilder
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
  answer: Configure authentication with AppBuilder.addAuth() and enable the middleware layer with addMiddlewares().
- question: Does Xeno.JS provide a built-in authentication provider?
  answer: Yes. Xeno.JS provides a built-in authentication integration based on Supabase and also supports custom authentication services.
- question: What is the difference between a token extractor and an authentication service?
  answer: A token extractor retrieves the credential from the incoming request, while the authentication service validates that credential and produces the authenticated claims.
- question: Where is the authenticated identity stored?
  answer: After successful authentication, Xeno.JS maps the authentication claims to the request identity and makes that identity available through the request context.
- question: Can I use a custom authentication provider?
  answer: Yes. Xeno.JS allows an application to provide both a custom authentication service and a custom credential extractor.
---

## Introduction

Authentication answers a fundamental security question:

> **Who is making this request?**

In Xeno.JS, authentication takes a credential from the incoming request, validates it through an authentication service, and establishes the authenticated identity used by the rest of the application.

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

Authentication is configured through `AppBuilder`.

A basic application configuration looks like this:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

const container = await app.build()
```

There are two important pieces here:

* `addAuth()` configures the authentication service.
* `addMiddlewares()` enables the HTTP middleware that extracts the request credential and authenticates the request.

Without the authentication middleware, configuring an authentication service does not by itself authenticate incoming HTTP requests.

## How Authentication Works

Xeno.JS separates two responsibilities that are often combined in application code.

### 1. Credential extraction

The **token extractor** answers:

> Where does the credential come from?

For example, an HTTP authentication credential may come from:

```http
Authorization: Bearer <token>
```

or from an authentication cookie.

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

The claims can contain information such as:

```ts
{
  sub: 'user-id',
  email: 'user@example.com',
  name: 'Jane Doe',
  tenantId: 'tenant-id',
  roles: ['admin'],
  permissions: ['orders:read']
}
```

The exact claims depend on the authentication provider.

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
Authorization
```

## Configure Authentication with Supabase

Xeno.JS provides a built-in Supabase authentication integration.

The minimal configuration is:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

const container = await app.build()
```

The authentication options include:

```ts
interface AuthConfig<TOptions> {
  url: string
  key: string
  opts?: TOptions
  storageOpts?: {
    type?: 'local' | 'session' | 'memory' | 'cookie'
    cookieOpts?: CookieOptions
    storage?: IStorage
  }
  redirectTo?: string
}
```

These options configure the authentication provider and how authentication state is stored.

For example:

* `url` identifies the authentication service.
* `key` provides the client key required by the provider.
* `opts` provides provider-specific options.
* `storageOpts` controls the authentication state storage strategy.
* `redirectTo` configures the application redirect destination where supported.

For Supabase-specific configuration, including SSR cookies, session handling, and authentication cookies, see:

**[Supabase Authentication](./supabase)**

## Use a Custom Authentication Service

You do not have to use the built-in Supabase integration.

Xeno.JS supports a custom authentication service when your application uses another identity provider or has its own authentication mechanism.

Configure it through `customAuth`:

```ts
const app = new AppBuilder()

app.addAuth((options) => {
  options.customAuth = {
    authHeaderExtractor: () => new MyTokenExtractor(),
    authExtendedService: () => new MyAuthService(),
  }
})

app.addMiddlewares()

const container = await app.build()
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
interface IBaseAuthService {
  isAuthenticated(): Promise<boolean>

  getUser(): Promise<ResultType<Maybe<AuthClaims>>>

  authenticate(token: string): Promise<ResultType<AuthClaims>>
}
```

This allows Xeno.JS to work with authentication systems other than Supabase without changing the application authentication flow.

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

When authentication succeeds, the authenticated identity becomes available to the request context.

When authentication fails, the request does not continue as an authenticated request.

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
  sub: 'user-123',
  tenantId: 'tenant-456',
  roles: ['operator']
}
```

Authorization can then decide whether that identity may execute a specific command.

Do not put application authorization rules into the authentication service.

Authentication establishes identity. Authorization evaluates access.

See **[Authorization](../authorization/overview)** for application-level access control.

## Authentication and the Request Context

Once authentication succeeds, the resulting identity is associated with the current request context.

This allows application code to work with the authenticated identity without depending directly on the HTTP transport.

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

Use the built-in Supabase integration when Supabase is responsible for authenticating your application users.

Use a custom authentication service when your application needs to integrate with another authentication provider or an existing authentication system.

Typical examples include:

* an enterprise identity provider;
* an internal authentication service;
* a custom JWT issuer;
* an API gateway that provides application credentials;
* an existing authentication system that cannot be replaced.

The important requirement is that the custom implementation can turn the incoming credential into the authentication claims required by the application.

## Authentication Is Not Authorization

Do not assume that an authenticated request is automatically authorized to perform every operation.

For example, an authenticated identity might contain:

```ts
{
  sub: 'user-123',
  tenantId: 'tenant-456',
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
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.get('SUPABASE_URL')!
  options.key = config.get('SUPABASE_KEY')!
})

app.addMiddlewares()

app.addPipeline()

const container = await app.build()
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
app.addAuth((options) => {
  // authentication configuration
})

app.addMiddlewares()
```

`addAuth()` configures the authentication service; `addMiddlewares()` enables the HTTP middleware that uses it.

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

* **[Supabase Authentication](./supabase)** — configure the built-in Supabase integration, cookies, SSR, and token extraction.
* **[Custom Authentication](./custom)** — implement your own authentication service and credential extractor.
* **[Authorization](../authorization/overview)** — use the authenticated identity to control access to application operations.
* **[HTTP Security Middleware](../middleware/overview)** — configure authentication together with CSRF, CORS, method restrictions, and rate limiting.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
