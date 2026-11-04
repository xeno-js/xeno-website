---
title: Custom Authentication
description: Configure a custom authentication service and token extractor through Xeno.JS AuthModuleOptions.
keywords:
- Xeno.JS
- custom authentication
- authentication service
- token extractor
- AuthClaims
- IServiceExtractor
- IExtendendAuthService
- authentication provider
tags:
- security
- authentication
- custom authentication
- middleware
faqs:
- question: Can I use a custom provider instead of Supabase?
  answer: Yes. Configure authService and, optionally, tokenExtractor in the AuthModuleOptions passed to XenoAppBuilder.addAuth().
- question: What does a custom token extractor do?
  answer: A custom token extractor retrieves the authentication credential from the incoming HTTP request headers.
- question: What does a custom authentication service do?
  answer: A custom authentication service validates the extracted credential and returns AuthClaims that Xeno.JS maps to the request identity.
- question: What interface must a custom authentication service implement?
  answer: The service returned by authService must implement IExtendendAuthService, which extends IBaseAuthService and IAuthService.
- question: Can I use a custom token extractor with SSR mode?
  answer: Yes. For a custom provider, AuthModuleOptions.tokenExtractor takes precedence over the default BearerTokenExtractor. The Supabase SSR integration supplies its own extractor when its SSR options are configured.
- question: What claims must a custom authentication service return?
  answer: AuthClaims requires a sub string and defines email, name, tenantId, roles, and permissions with optional values.
---

## How do I replace Supabase with my own authentication provider?

Xeno.JS does not select Supabase by default. `addAuth()` configures the authentication service explicitly; use the Supabase plugin for Supabase or provide your own service through `AuthModuleOptions`.

A custom authentication integration has two separate responsibilities:

1. **Token extraction** — retrieve the credential from the incoming HTTP request.
2. **Credential validation** — validate that credential and return the authenticated user's claims.

Configure the authentication service and optionally provide a token extractor through `addAuth()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
// Import the application-specific MyAuthService and MyTokenExtractor implementations.

const app = new XenoAppBuilder()

app.addAuth((options) => {
  options.authService = () => new MyAuthService()
  options.tokenExtractor = () => new MyTokenExtractor()
})

app.addMiddlewares()

await app.build()
```

You do not need to configure Supabase credentials when using a custom authentication service.

---

## Authentication flow

With a custom provider, the request authentication flow is:

```text
HTTP request
      │
      ▼
Configured token extractor
      │
      ▼
AuthenticationMiddleware
      │
      ▼
Custom authentication service
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

The extractor answers:

> Where do I get the credential?

The authentication service answers:

> Is this credential valid, and which identity does it represent?

Keeping these responsibilities separate allows the authentication provider and the HTTP credential format to change independently.

The middleware writes the resulting identity to the request context. In the default Node context, `AsyncLocalStorage` carries that request context through asynchronous work.

---

## Configure custom authentication

`addAuth()` accepts a setup action that receives the authentication module options and configuration service. The relevant options are:

```ts
import type {
  IExtendendAuthService,
  IServiceExtractor,
  IServiceScope,
  Optional,
} from '@xeno-js/shared'

interface AuthModuleOptions<TRegistry> {
  authService: (scope: IServiceScope<TRegistry>) => IExtendendAuthService
  tokenExtractor?: (
    scope: IServiceScope<TRegistry>,
  ) => IServiceExtractor<Request['headers'], string | undefined>
  defaultCookieName?: Optional<string>
}
```

`authService` is required; `tokenExtractor` is optional.

| Property             | Responsibility                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `authService`        | Creates the scoped authentication service that validates credentials and returns authentication data   |
| `tokenExtractor`     | Creates the extractor used to retrieve a credential from request headers; optional                     |
| `defaultCookieName`  | Cookie name checked by the default bearer extractor; defaults to `sb-access-token`                      |

Example:

```ts
app.addAuth((options) => {
  options.authService = () => new MyAuthService()
  options.tokenExtractor = () => new MyTokenExtractor()
})
```

`authService` is required. The authentication module registers its result as a scoped service and passes the active service scope to its factory. Resolve any scoped dependencies from that scope. A custom token extractor is registered as a singleton; keep it stateless and do not capture request-scoped services in its factory.

---

## Create a custom token extractor

The extractor implements `IServiceExtractor`.

Its contract is:

```ts
interface IServiceExtractor<TRequest, TResponse = unknown> {
  extract(request: TRequest): TResponse
}
```

For authentication, Xeno.JS expects an extractor with this shape:

```ts
IServiceExtractor<
  Request['headers'],
  string | undefined
>
```

The extractor receives the request headers and returns either:

- the authentication credential;
- `undefined` when no credential is present.

### Example: custom `Authorization` header

Suppose your provider uses:

```http
Authorization: Token <credential>
```

instead of the standard bearer format.

You can implement:

```ts
import type { IServiceExtractor } from '@xeno-js/shared'

export class MyTokenExtractor
  implements IServiceExtractor<Request['headers'], string | undefined>
{
  extract(headers: Request['headers']): string | undefined {
    const authorization = headers.get('authorization')

    if (!authorization) {
      return undefined
    }

    if (!authorization.startsWith('Token ')) {
      return undefined
    }

    const token = authorization.slice('Token '.length).trim()
    return token || undefined
  }
}
```

Register it through `AuthModuleOptions.tokenExtractor`:

```ts
app.addAuth((options) => {
  options.authService = () => new MyAuthService()
  options.tokenExtractor = () => new MyTokenExtractor()
})
```

The extractor should only be responsible for retrieving the credential. It should not validate the token or construct the application identity.

---

## Create a custom authentication service

The custom authentication service must implement `IExtendendAuthService`.

`IExtendendAuthService` combines the base authentication contract with session/provider operations:

```ts
interface IExtendendAuthService
  extends IBaseAuthService, IAuthService {}
```

### Base authentication contract

The base service contract exposes these methods:

```ts
interface IBaseAuthService {
  isAuthenticated(): Promise<boolean>

  getUser(): Promise<ResultType<Maybe<AuthClaims>>>

  authenticate(token: string): Promise<ResultType<AuthClaims>>
}
```

The important method for request authentication is:

```ts
authenticate(token: string): Promise<ResultType<AuthClaims>>
```

It receives the credential returned by the token extractor and must return the authenticated user's claims.
When no token is extracted, the gatekeeper calls `getUser()` instead. `isAuthenticated()` remains part of the service contract but the HTTP authentication middleware does not call it in this flow.

The extended interface also requires `signInWithProvider()`, `getSession()`, `signOut()`, and `exchangeCodeForSession()`. Implement these methods even if the HTTP middleware does not use them; application features may resolve the extended authentication service for those operations.

---

## Implement the authentication service

A provider-specific service must implement the full contract. The following is a skeleton, not a production implementation:

```ts
import type {
  IExtendendAuthService,
  ResultType,
  AuthClaims,
  Maybe,
  Optional,
  Provider,
  Session,
} from '@xeno-js/shared'

export class MyAuthService implements IExtendendAuthService {
  async isAuthenticated(): Promise<boolean> {
    // Check whether the current authentication state is valid.
    return false
  }

  async getUser(): Promise<ResultType<Maybe<AuthClaims>>> {
    // Resolve the current authenticated user when no explicit token
    // is supplied to the authentication flow.
    //
    // Return the provider's AuthClaims through ResultType.
    throw new Error('Implement getUser()')
  }

  async authenticate(token: string): Promise<ResultType<AuthClaims>> {
    // Validate the token with your authentication provider.
    //
    // Return AuthClaims through ResultType.
    throw new Error('Implement authenticate()')
  }

  async signInWithProvider(
    provider: Provider,
  ): Promise<ResultType<{ url: string }>> {
    // Implement provider-specific sign-in if your application uses it.
    throw new Error('Implement signInWithProvider()')
  }

  async getSession(): Promise<ResultType<Maybe<Session>>> {
    // Return the current provider session.
    throw new Error('Implement getSession()')
  }

  async signOut(): Promise<ResultType<void>> {
    // Invalidate the current provider session.
    throw new Error('Implement signOut()')
  }

  async exchangeCodeForSession(
    code: string,
  ): Promise<ResultType<Optional<Session>>> {
    // Exchange an authentication callback code for a session.
    throw new Error('Implement exchangeCodeForSession()')
  }
}
```

Replace every placeholder with provider-specific behavior before registering the service. In particular, do not ship methods that always return `false` or throw placeholder errors.

The important requirement for HTTP authentication is that `authenticate()` returns valid `AuthClaims`.

---

## Return `AuthClaims`

Xeno.JS defines the claims shape as:

```ts
interface AuthClaims {
  readonly sub: string
  readonly email: Optional<string>
  readonly name: Optional<string>
  readonly tenantId: Optional<string>
  readonly roles: Optional<string[]>
  readonly permissions: Optional<string[]>
}
```

`sub` is the user identifier. It is required and must be a GUID string because the identity mapper converts it to the request identity's `userId`.

The remaining fields provide identity and authorization information that can be propagated into the application request context.
Treat provider claims as untrusted until the provider has validated them. For JWTs, verify the signature and the expected issuer, audience, and expiry before using identity or authorization claims.

For example:

```ts
{
  sub: user.id,
  email: user.email,
  name: user.name,
  tenantId: user.tenantId,
  roles: user.roles,
  permissions: user.permissions,
}
```

Do not return an arbitrary application user object from `authenticate()`.

Return the authentication claims expected by Xeno.JS.

---

## How claims become the request identity

After successful authentication, Xeno.JS maps `AuthClaims` to the request `Identity`.

The mapping is:

```text
AuthClaims
    │
    ├── sub         → userId
    ├── email       → email
    ├── name        → name
    ├── tenantId    → tenantId
    ├── roles       → roles
    └── permissions → permissions
```

The `sub` and `tenantId` values are parsed as GUID values during this mapping. An absent or invalid value maps to an undefined identifier; return valid GUID strings for identifiers you expect authorization to consume.

This means your custom authentication provider should return identifiers in the format expected by the application's Xeno.JS identity model.

---

## Build the application

A complete composition root can look like this:

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

Authentication middleware must be enabled with `addMiddlewares()`.

Without the middleware module, the custom extractor is not used to authenticate incoming HTTP requests. If middleware runs without an authentication service, Xeno.JS assigns the guest identity; it does not enforce authentication by default.

---

## Custom authentication with a different credential format

The custom extractor can support authentication formats other than:

```http
Authorization: Bearer <token>
```

For example:

```http
X-API-Token: <token>
```

The extractor can read that header:

```ts
export class ApiTokenExtractor
  implements IServiceExtractor<Request['headers'], string | undefined>
{
  extract(headers: Request['headers']): string | undefined {
    return headers.get('x-api-token') ?? undefined
  }
}
```

Register it:

```ts
app.addAuth((options) => {
  options.authService = () => new MyAuthService()
  options.tokenExtractor = () => new ApiTokenExtractor()
})
```

The authentication service then receives the value returned by `extract()`:

```text
X-API-Token
     │
     ▼
ApiTokenExtractor
     │
     ▼
credential
     │
     ▼
MyAuthService.authenticate()
     │
     ▼
AuthClaims
```

---

## Custom authentication with JWTs

If your provider issues JWTs, the custom authentication service can validate the JWT and map its trusted claims to `AuthClaims`.

For example, conceptually:

```ts
import { Result } from '@xeno-js/shared'
import type { AuthClaims, ResultType } from '@xeno-js/shared'

async authenticate(token: string): Promise<ResultType<AuthClaims>> {
  const claims = await this.jwtVerifier.verify(token)

  return Result.ok({
    sub: claims.sub,
    email: claims.email,
    name: claims.name,
    tenantId: claims.tenantId,
    roles: claims.roles,
    permissions: claims.permissions,
  })
}
```

The provider-specific verification library is your responsibility. Verify the signature and the expected issuer, audience, and expiry; decoding a JWT payload alone does not authenticate it.

Xeno.JS consumes the resulting `AuthClaims`; it does not require the authentication provider to use a particular token format.

---

## Custom authentication with an external identity service

The authentication service can also delegate validation to an external identity provider.

For example:

```ts
import { Result } from '@xeno-js/shared'
import type { AuthClaims, ResultType } from '@xeno-js/shared'

async authenticate(token: string): Promise<ResultType<AuthClaims>> {
  const user = await this.identityProvider.validate(token)

  return Result.ok({
    sub: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
    roles: user.roles,
    permissions: user.permissions,
  })
}
```

The important boundary remains:

```text
credential
    ↓
provider-specific validation
    ↓
AuthClaims
    ↓
Xeno.JS Identity
```

The provider can be a JWT issuer, API gateway, OAuth/OIDC service, internal identity service, or another authentication system.

---

## Choose one authentication provider

Xeno.JS does not create a Supabase authentication service unless the Supabase plugin is explicitly configured. The builder queues only one authentication module: after one `addAuth()` call queues it, later calls to `addAuth()` are ignored.

Configure one provider per application. Do not expect multiple authentication services to participate in the same request.

For example, choose either the Supabase plugin:

```text
withSupabase(...)
    ↓
Supabase authentication service
```

or the custom configuration:

```text
addAuth(...)
    ↓
IExtendendAuthService implementation
```

The selected module provides the authentication service used by the authentication flow.

---

## Custom token extraction takes precedence over built-in extractors

The authentication module registers a token extractor. If `tokenExtractor` is omitted, Xeno.JS uses its default `BearerTokenExtractor`.

Default:

```text
BearerTokenExtractor
    → Authorization: Bearer <token>
    → cookie named by defaultCookieName (default: sb-access-token)
```

When `tokenExtractor` is configured:

```text
AuthModuleOptions.tokenExtractor
        ↓
custom token extractor
```

The configured extractor replaces the default. Supabase's SSR plugin supplies its own SSR extractor when SSR is enabled; Xeno.JS core does not select an SSR extractor based on an application mode.

This is important when using a custom provider with a non-standard header or credential format.

---

## Do not put authentication validation in the extractor

Avoid this design:

```ts
class MyTokenExtractor {
  extract(headers: Request['headers']) {
    // Parse token
    // Verify token
    // Load user
    // Build identity
    // ...
  }
}
```

The extractor should retrieve the credential.

Prefer:

```text
Extractor
    ↓
credential
    ↓
Authentication service
    ↓
validated AuthClaims
```

This keeps transport-specific logic separate from provider-specific authentication logic.

---

## Authentication errors

If the custom authentication service returns a failed `ResultType` from `authenticate()` for an extracted token, Xeno.JS treats the request authentication as failed.

The authentication middleware returns an error response using the error status, or `401 Unauthorized` when the error has no status, instead of continuing to the next middleware.

Therefore, your authentication service should return an appropriate failed result when:

- the token is invalid;
- the token is expired;
- the token cannot be verified;
- the credential is revoked;
- the authentication provider rejects the credential.

Do not convert invalid credentials into successful claims.

---

## Missing credentials

A request may reach the authentication service without an explicit token.

The authentication flow can then use:

```ts
getUser()
```

to resolve the current authenticated user.

If `getUser()` succeeds with no user, or returns a failed result, the gatekeeper returns the guest identity. The authentication middleware does not reject guest identities by itself; configure authorization or route protection where authenticated access is required.

This makes `getUser()` relevant for authentication mechanisms where the current user can be resolved without passing an explicit token to `authenticate()`.

---

## Security responsibilities

A custom authentication implementation should keep these responsibilities separate:

| Component              | Responsibility                                                 |
| ---------------------- | -------------------------------------------------------------- |
| Token extractor        | Retrieve the credential from the HTTP request                  |
| Authentication service | Validate the credential                                        |
| `AuthClaims`           | Represent the authenticated identity                           |
| Claims mapper          | Convert claims into Xeno.JS `Identity`                         |
| Authorization          | Decide whether the identity may execute an application request |

Authentication does not replace authorization.

For example, returning:

```ts
{
  sub: user.id,
  roles: ['admin'],
}
```

establishes identity and claims.

Whether that identity may execute a specific command is handled by the application's authorization configuration.

See [Authorization Overview](../authorization/overview) and [Authorization Policies](../authorization/policies).

---

## Troubleshooting

### The custom authentication service is not used

Check that `authService` is configured in the `addAuth()` setup action:

```ts
app.addAuth((options) => {
  options.authService = () => new MyAuthService()
})
```

The auth module requires `authService`; registering a class elsewhere does not make the builder discover it automatically. Also check that another `addAuth()` call did not queue the authentication module first, because subsequent calls are ignored.

---

### The custom extractor is not called

Make sure:

```ts
app.addMiddlewares()
```

is configured.

Also verify that the custom extractor is returned by the factory:

```ts
tokenExtractor: () => new MyTokenExtractor()
```

The property expects a factory that receives the service scope and creates an `IServiceExtractor`; it is not the extractor instance itself. The extractor instance is singleton-scoped, so do not capture request-scoped services in its factory.

---

### `authenticate()` is never called

Check the credential extraction first.

The flow is:

```text
HTTP headers
    ↓
extract()
    ↓
credential
    ↓
authenticate(token)
```

If the extractor returns `undefined`, the gatekeeper calls `getUser()` instead of `authenticate()`. A failed `getUser()` result becomes a guest identity, not an authentication error response.

---

### Authentication succeeds but authorization fails

Check the claims returned by your authentication service.

The following claims are propagated into the Xeno.JS identity:

```ts
{
  sub,
  email,
  name,
  tenantId,
  roles,
  permissions,
}
```

For example, if an authorization policy requires:

```ts
roles: ['admin']
```

your authenticated claims must contain the appropriate role.

Authentication establishes the identity; authorization evaluates whether that identity satisfies the configured policy.

---

### The user ID or tenant ID is not available to authorization

Check `sub` and `tenantId` in the returned `AuthClaims`.

Xeno.JS maps:

```ts
sub      → userId
tenantId → tenantId
```

Both values are parsed as GUIDs during identity mapping.

If the values are not valid GUIDs, they will not produce the expected `Identity` values.

---

## Related documentation

- [Authentication Overview](./overview)
- [Supabase Authentication](./supabase)
- [Authentication Middleware](../middleware/authentication)
- [Authentication Extractors](../middleware/extractors)
- [Authorization Overview](../authorization/overview)
- [Authorization Policies](../authorization/policies)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
