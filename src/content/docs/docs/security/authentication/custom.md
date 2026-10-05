---
title: Custom Authentication
description: Replace the built-in Supabase authentication service and token extractor with a custom authentication provider in Xeno.JS.
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
- question: Can I replace Supabase authentication in Xeno.JS?
  answer: Yes. AppBuilder supports a custom authentication service and a custom HTTP token extractor through options.customAuth.
- question: What does a custom token extractor do?
  answer: A custom token extractor retrieves the authentication credential from the incoming HTTP request headers.
- question: What does a custom authentication service do?
  answer: A custom authentication service validates the extracted credential and returns AuthClaims that Xeno.JS maps to the request identity.
- question: What interface must a custom authentication service implement?
  answer: The service configured through customAuth.authExtendedService must implement IExtendendAuthService, which extends IBaseAuthService and IAuthService.
- question: Can I use a custom token extractor with SSR mode?
  answer: Yes, but when a custom extractor is configured it takes precedence over the built-in bearer and Supabase SSR token extractors.
- question: What claims must a custom authentication service return?
  answer: AuthClaims requires sub and also supports email, name, tenantId, roles, and permissions.
---

## How do I replace Supabase with my own authentication provider?

Xeno.JS uses Supabase by default when authentication is configured, but you can replace it with your own authentication service.

A custom authentication integration has two separate responsibilities:

1. **Token extraction** — retrieve the credential from the incoming HTTP request.
2. **Credential validation** — validate that credential and return the authenticated user's claims.

Configure both through `customAuth`:

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

You do not need to configure Supabase credentials when using a custom authentication service.

---

## Authentication flow

With a custom provider, the request authentication flow is:

```text
HTTP request
      │
      ▼
Custom token extractor
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

---

## Configure `customAuth`

The authentication configuration exposes:

```ts
customAuth: {
  authHeaderExtractor: () =>
    IServiceExtractor<Request['headers'], string | undefined>

  authExtendedService: () =>
    IExtendendAuthService
}
```

There are two required components.

| Property              | Responsibility                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `authHeaderExtractor` | Creates the service that extracts the credential from HTTP headers                               |
| `authExtendedService` | Creates the authentication service that validates the credential and returns authentication data |

Example:

```ts
app.addAuth((options) => {
  options.customAuth = {
    authHeaderExtractor: () => new MyTokenExtractor(),
    authExtendedService: () => new MyAuthService(),
  }
})
```

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

* the authentication credential;
* `undefined` when no credential is present.

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
    const authorization = headers.authorization

    if (!authorization) {
      return undefined
    }

    if (!authorization.startsWith('Token ')) {
      return undefined
    }

    return authorization.slice('Token '.length)
  }
}
```

Register it through `customAuth`:

```ts
app.addAuth((options) => {
  options.customAuth = {
    authHeaderExtractor: () => new MyTokenExtractor(),
    authExtendedService: () => new MyAuthService(),
  }
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

The authentication middleware relies on these methods:

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

---

## Implement the authentication service

A provider-specific service can implement the contract directly:

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

The exact implementation of these methods depends on your authentication provider.

The important requirement for HTTP authentication is that `authenticate()` returns valid `AuthClaims`.

---

## Return `AuthClaims`

Xeno.JS defines authentication claims as:

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

`sub` is the user identifier.

The remaining fields provide identity and authorization information that can be propagated into the application request context.

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

The `sub` and `tenantId` values are parsed as GUID values during this mapping.

This means your custom authentication provider should return identifiers in the format expected by the application's Xeno.JS identity model.

---

## Build the application

A complete composition root can look like this:

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

Authentication middleware must be enabled with `addMiddlewares()`.

Without the middleware module, the custom extractor is not used to authenticate incoming HTTP requests.

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
    return headers['x-api-token']
  }
}
```

Register it:

```ts
app.addAuth((options) => {
  options.customAuth = {
    authHeaderExtractor: () => new ApiTokenExtractor(),
    authExtendedService: () => new MyAuthService(),
  }
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

The provider-specific verification library is your responsibility.

Xeno.JS consumes the resulting `AuthClaims`; it does not require the authentication provider to use a particular token format.

---

## Custom authentication with an external identity service

The authentication service can also delegate validation to an external identity provider.

For example:

```ts
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

## Custom authentication takes precedence over Supabase

When `customAuth` is configured, Xeno.JS uses the custom authentication service instead of creating the built-in Supabase authentication service.

This means you should not configure custom authentication as an additional authentication provider expecting both services to participate.

Choose one authentication implementation:

```text
Default
    ↓
Supabase authentication service
```

or:

```text
Custom
    ↓
IExtendendAuthService implementation
```

The custom service becomes the authentication service used by the authentication flow.

---

## Custom token extraction takes precedence over built-in extractors

Xeno.JS normally selects a token extractor based on the middleware configuration.

Without a custom extractor:

```text
SSR enabled
    → Supabase SSR token extractor

SSR disabled
    → Bearer token extractor
       + configured authentication cookie
```

When `customAuth.authHeaderExtractor` is configured:

```text
customAuth.authHeaderExtractor
        ↓
custom token extractor
```

The custom extractor is used instead of the built-in extractor.

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

If the custom authentication service returns a failed `ResultType` from `authenticate()`, Xeno.JS treats the request authentication as failed.

The authentication middleware returns an unauthorized HTTP response instead of continuing to the application action.

Therefore, your authentication service should return an appropriate failed result when:

* the token is invalid;
* the token is expired;
* the token cannot be verified;
* the credential is revoked;
* the authentication provider rejects the credential.

Do not convert invalid credentials into successful claims.

---

## Missing credentials

A request may reach the authentication service without an explicit token.

The authentication flow can then use:

```ts
getUser()
```

to resolve the current authenticated user.

If no authenticated user can be resolved, the request receives the guest identity rather than fabricated authentication claims.

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

### `customAuth` is configured but Supabase is still being used

Check that `customAuth` is configured inside `addAuth()`:

```ts
app.addAuth((options) => {
  options.customAuth = {
    authHeaderExtractor: () => new MyTokenExtractor(),
    authExtendedService: () => new MyAuthService(),
  }
})
```

Do not configure the custom service elsewhere and expect `AppBuilder` to discover it automatically.

---

### The custom extractor is not called

Make sure:

```ts
app.addMiddlewares()
```

is configured.

Also verify that the custom extractor is returned by the factory:

```ts
authHeaderExtractor: () => new MyTokenExtractor()
```

The property expects a factory that creates an `IServiceExtractor`; it is not the extractor instance itself.

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

If the extractor returns `undefined`, the authentication flow may resolve the current user through `getUser()` instead of calling `authenticate()` with a token.

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

* [Authentication Overview](./overview)
* [Supabase Authentication](./supabase)
* [Authentication Middleware](../middleware/authentication)
* [Authentication Extractors](../middleware/extractors)
* [Authorization Overview](../authorization/overview)
* [Authorization Policies](../authorization/policies)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
