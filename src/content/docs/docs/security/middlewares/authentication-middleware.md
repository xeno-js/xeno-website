---
title: Authentication Middleware
description: Configure Xeno.JS HTTP authentication and understand credential extraction, identity mapping, guest requests, and authentication failures.
keywords:
- Xeno.JS authentication middleware
- AuthenticationMiddleware
- addAuth
- addMiddlewares
- token extractor
- RequestContext identity
- 401 Unauthorized
tags:
- security
- middleware
- authentication
- identity
faqs:
  - question: How do I enable HTTP authentication?
    answer: Configure an authentication provider with XenoAppBuilder.addAuth() and install the HTTP middleware stack with addMiddlewares().
  - question: Does a missing credential always return 401?
    answer: No. With a configured auth service, Xeno calls getUser() and uses the guest identity if no user is found. Protect sensitive operations with authorization rules.
  - question: What happens when a supplied token is invalid?
    answer: The middleware returns the authentication error status, or 401 Unauthorized when no status is supplied, and does not continue the pipeline.
  - question: Where does the middleware read the credential?
    answer: It delegates extraction to the configured token extractor. The default extractor checks a Bearer Authorization header and then the configured authentication cookie.
  - question: Does authentication middleware perform authorization?
    answer: No. It establishes identity in the request context; application authorization rules decide which operations that identity may perform.
---

## Introduction

The authentication middleware runs at the HTTP boundary. It extracts a credential from the incoming request, delegates credential validation to the configured authentication service, and writes the resulting identity to the current request context.

Authentication answers **who is making the request**. It does not decide whether that identity can execute a command, query, or route. Use application authorization policies for access decisions.

The flow separates transport from identity verification:

```text
HTTP request
    │
    ├── Token extractor: reads a credential from headers or cookies
    │
    ├── Authentication service: validates the credential or resolves a session
    │
    ├── ClaimsIdentityMapper: maps claims to Identity
    │
    └── RequestContext: makes the identity available downstream
```

## Configure Authentication

Register an authentication provider with `addAuth()` and enable the HTTP middleware stack with `addMiddlewares()`:

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
app.addMiddlewares()

const application = await app.build()
```

`ordersRoutes` represents the application's route definitions. `addAuth()` queues the authentication provider; `addMiddlewares()` queues the HTTP middleware module. The builder resolves queued modules during `build()`. Configuring an authentication provider without adding the middleware stack does not authenticate incoming HTTP requests.

The provider supplies an authentication service and may supply a token extractor. Without a provider, `addMiddlewares()` still installs `AuthenticationMiddleware`, but Xeno uses `NoAuthGateKeeper`, which ignores any supplied token and always establishes a guest identity. Do not treat this configuration as authentication for protected endpoints.

## Credential Extraction

The middleware does not parse credentials itself. It calls the configured token extractor with the request headers.

When no custom extractor is registered, Xeno uses `BearerTokenExtractor`. It checks:

1. An `Authorization` header with the `Bearer` scheme.
2. The configured authentication cookie, if no bearer token was found.

The default cookie name is `sb-access-token`. `authCookieName` in the middleware options changes this fallback when the middleware creates the default extractor. An authentication integration can register its own extractor and cookie handling; in that case, the integration's configuration controls extraction.

For example, a bearer token is sent as:

```http
Authorization: Bearer <access-token>
```

For Supabase-specific credential and cookie behavior, see [Supabase Authentication](../authentication/supabase).

## Validate Credentials and Establish Identity

When the extractor returns a token, the configured gatekeeper calls the authentication service's `authenticate(token)` method. If authentication succeeds, Xeno maps the returned claims to an `Identity` and updates the request context before continuing the middleware pipeline.

The default `ClaimsIdentityMapper` maps:

- `sub` to `Identity.userId`;
- `tenantId` to `Identity.tenantId`;
- `email`, `name`, `roles`, and `permissions` to the corresponding identity properties.

The mapper parses user and tenant identifiers as GUIDs. Provide valid GUID strings when the application relies on those identifiers.

When the extractor returns no token, a configured gatekeeper calls `getUser()` to resolve an existing session. If the service returns no user or fails to resolve one, the gatekeeper uses the guest identity and continues. Thus, the HTTP authentication middleware does not automatically require every request to have an authenticated identity.

The identity is stored in the `RequestContext` and is available to downstream middleware and application services. In the default Node.js context, `AsyncLocalStorage` carries request-specific context through asynchronous execution. Authentication services are request-scoped; do not retain them in singleton services.

## Authentication Failures

If a supplied token fails authentication, the middleware:

1. Logs a warning containing the request path and authentication error.
2. Returns an error response using the authentication error's status, or `401 Unauthorized` when no status is supplied.
3. Includes the error code, message, request path, and correlation identifiers in the response.
4. Stops the pipeline without calling the next middleware.

A missing token is different from an invalid token. When no token is extracted, Xeno attempts session lookup and then falls back to the guest identity; when a supplied token is rejected, the middleware returns an error response.

## Require an Authenticated User

`AuthenticationMiddleware` establishes identity but does not, by itself, reject guest requests. Decide at the application boundary which operations require an authenticated user, tenant, role, or permission.

For example, an authorization policy can require a user identity or a role before executing a command. Keep those access rules in the application authorization pipeline rather than treating successful execution of the HTTP authentication middleware as proof that the caller is authorized.

See [Authorization](../authorization/overview) for authorization strategies and policies.

## Configure a Custom Authentication Service

Xeno supports custom providers through `addAuth()`. Configure an `authService` and, when needed, a `tokenExtractor`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

// Implement these application-specific classes against Xeno's auth and extractor contracts.
const app = new XenoAppBuilder()

app.addAuth((options) => {
  options.authService = () => new MyAuthService()
  options.tokenExtractor = () => new MyTokenExtractor()
})

app.addMiddlewares()

const application = await app.build()
```

`MyAuthService` must implement Xeno's authentication service contract, and `MyTokenExtractor` must implement `IServiceExtractor<Request['headers'], Optional<string>>`. The auth service factory receives the active service scope; Xeno registers the authentication service as scoped. The token extractor is registered as a singleton, so it must not capture request-scoped services.

The authentication service validates a supplied token through `authenticate(token)`. When the extractor returns no token, the gatekeeper calls `getUser()` to resolve a session. `isAuthenticated()` is part of the service contract but is not called by the HTTP authentication middleware.

See [Authentication Overview](../authentication/overview) for the complete service contract and [Custom Authentication](../authentication/custom) for provider implementation details.

## Common Issues

### A route executes without a logged-in user

This is expected when no credential or session resolves to an authenticated user. The gatekeeper assigns a guest identity and continues. Add application authorization rules to operations that require an authenticated user.

### A valid-looking token returns `401 Unauthorized`

Check that the extractor reads the credential from the location used by the client, that the authentication service accepts the token, and that the configured provider and environment values are correct. A custom extractor must return the raw credential expected by the authentication service.

### Authentication middleware ignores the supplied token

Check whether `addAuth()` configured the provider before `build()`. Without an authentication provider, `NoAuthGateKeeper` deliberately ignores credentials and always returns a guest identity.

### The token is read from the wrong cookie

Check the authentication integration's token extractor configuration. `authCookieName` applies to the default bearer-token extractor created by the middleware; a provider that registers its own extractor may use different cookie options.

### Authentication succeeds but an operation is denied

Authentication only establishes identity. Inspect the application's authorization policies, including any user, tenant, role, or permission requirements.

## Related Documentation

- [Authentication Overview](../authentication/overview)
- [Supabase Authentication](../authentication/supabase)
- [Custom Authentication](../authentication/custom)
- [Authorization](../authorization/overview)
- [Request Context Middleware](./request-context-midleware)
- [Middleware Overview](./overview)
- [Security Overview](../overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
