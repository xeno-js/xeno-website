---
title: 'Custom Authentication Service Integration Guide'
description:
  'Technical manual detailing how to extend, implement, and programmatically
  register a custom authentication service inside the Xeno dependency injection
  container using AppBuilder.'
keywords:
  [
    'Custom Authentication',
    'IAuthService',
    'GateKeeper',
    'AuthClaims',
    'AppBuilder Security',
    'Dependency Injection container',
    'Xeno',
  ]
author: 'Xeno'
---

## Integrating Custom Authentication Services

While Xeno provides native integration strategies for external vendors like
Supabase, enterprise architectures frequently necessitate completely bespoke
identity verification workflows. The framework supports an entirely decoupled
security architecture, allowing developers to plug custom identity validation
logic directly into the application kernel.

---

## Understanding Custom Authentication Services in Xeno

Custom authentication in Xeno enables developers to bypass default providers and
implement tailored identity validation workflows. By decoupling the core engine
from third-party ecosystems, the framework permits seamless integration with
bespoke OAuth tokens, internal LDAP repositories, or custom JWT verification
strategies.

At the runtime boundary, the core framework relies on the `IAuthService`
contract to evaluate credentials, regardless of the underlying vendor or
cryptographic implementation. When a custom provider is mapped to the container,
it integrates seamlessly into the system's `GateKeeper` engine. The `GateKeeper`
remains fully unaware of the technical details of your authentication logic; it
simply requests a token validation and handles the resulting functional `Result`
envelope to populate the unified execution context.

### Key-Value Specification of Custom Security Subsystems

- **IAuthService Contract** — The abstract interface definition that
  standardizes token validation across custom or third-party cryptographic
  handlers.

- **customAuthService Factory** — A specialized callback block executed during
  bootstrap that injects custom security logic directly into the root dependency
  registry.

- **AuthClaims Envelope** — The contract containing identity definitions (such
  as user identifiers, tenant contexts, and role capabilities) returned upon
  successful token verification.

---

## Implementing the IAuthService Custom Contract

Implementing the IAuthService contract requires defining a concrete class that
evaluates credential states and wraps cryptographic extraction routines. Custom
providers must return standard functional results encapsulating claims
signatures, guaranteeing complete compatibility with the framework's internal
multi-tenant validation pipelines.

A custom authentication service must satisfy the structural requirements of the
`IAuthService` contract by exposing two essential async workflows:
`authenticate` and `isAuthenticated`.

### Programmatic Implementation of a Bespoke Security Service

The following example outlines a custom JWT authentication service that
validates signatures via a proprietary internal public-key mechanism and maps
payloads directly to standard application claims:

```typescript
// src/infrastructure/security/custom-jwt-auth.service.ts
import { Result, AppError } from '@xeno/core'
import type { IAuthService, ResultType, AuthClaims } from '@xeno/core'

export class CustomJwtAuthService implements IAuthService {
  constructor(private readonly _jwtSecret: string) {}

  /**
   * Evaluates the cryptographic token and returns an internal AuthClaims envelope.
   * @param token The raw token extracted from the inbound transport header.
   */
  public async authenticate(token: string): Promise<ResultType<AuthClaims>> {
    try {
      // Execute local cryptographic verification routines
      const decodedPayload = this._verifyCustomToken(token)

      if (!decodedPayload) {
        return Result.fail(
          AppError.unauthorized(
            'CustomJwtAuthService',
            'Provided token structure is malformed.',
          ),
        )
      }

      // Map local token properties directly into strongly-typed framework claims
      const claims: AuthClaims = {
        sub: decodedPayload.userId,
        tenantId: decodedPayload.companyId ?? undefined,
        roles: decodedPayload.groups ?? [],
        permissions: decodedPayload.scopes ?? [],
      }

      return Result.ok(claims)
    } catch (error) {
      return Result.fail(
        AppError.create({
          code: 'AUTHENTICATION_FAILED',
          message: 'Token verification failed against the signature authority.',
          name: 'CustomJwtAuthService',
          status: 401,
          cause: error,
        }),
      )
    }
  }

  /**
   * Queries whether an active session boundary persists across the current execution path.
   */
  public async isAuthenticated(): Promise<boolean> {
    // Custom baseline check for session presence if applicable
    return true
  }

  private _verifyCustomToken(token: string): Record<string, any> | null {
    // In a real-world scenario, implement decoding or cryptography routines here
    if (token === 'invalid-mock-token') return null
    return {
      userId: 'usr_custom_9901',
      companyId: 'tenant_custom_1122',
      groups: ['admin'],
      scopes: ['read', 'write'],
    }
  }
}
```

---

## Registering the Custom Provider via AppBuilder

Registering a custom authentication service leverages the fluent addAuth
mechanism on the AppBuilder, passing an explicit factory callback. This callback
isolates scope initialization during bootstrap, binding your custom
implementation directly to the system auth token inside the core container.

When wiring up a custom identity handler, developers use the `.addAuth()` method
but assign their instantiated provider directly to the `customAuthService`
configuration parameter. This action directs the internal configuration engine
to bypass default vendor builders and substitute your custom service directly
under the framework's internal `TOKENS.AUTH_SERVICE` register.

### Integrating Custom Authentication via Bootstrapping

The code block below demonstrates how to cleanly supply a custom authentication
service factory to the `AppBuilder` configuration sequence during host
initialization:

```typescript
// src/infrastructure/bootstrap.ts
import { AppBuilder, TOKENS } from '@xeno/core'
import { CustomJwtAuthService } from './security/custom-jwt-auth.service'
import type { AppRegistry } from './infrastructure/app-registry'

export const bootstrapApplication = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder
    // 1. Setup request context boundaries using AsyncLocalStorage
    .addContext()

    // 2. Map framework middlewares and public routes
    .addMiddlewares((config) => {
      config.publicRoutes = {
        '/api/v1/public/status': { GET: 'isPublic' },
      }
    })

    // 3. Register your custom authentication service factory via SetupAction
    .addAuth((options, env) => {
      const secret = env.getOrThrow('JWT_SIGNING_SECRET')

      // Bind your custom factory handler.
      // The framework passes the active scope container to support dependency resolution.
      options.customAuthService = (scope) => {
        return new CustomJwtAuthService(secret)
      }
    })

    // 4. Configure other standard framework layers
    .addLogger((config) => {
      config.console = true
    })

  // Finalize configuration, evaluate module queues, and return the container context
  return await builder.build()
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
