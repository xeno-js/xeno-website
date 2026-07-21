---
title: 'Authorization Pipeline Architecture & Policy Configuration'
description:
  'An architectural guide to the Xeno authorization subsystem, detailing
  pipeline strategies, user/tenant context verification, and programmatic policy
  mapping.'
keywords:
  [
    'Authorization',
    'Access Control',
    'UserAuthorizationStrategy',
    'TenantAuthorizationStrategy',
    'AppBuilder Security',
    'CQRS Pipeline',
    'Xeno',
  ]
author: 'Xeno'
---

## Architectural Overview of the Authorization Subsystem

The application safety architecture of Xeno enforces strict access management
patterns directly within the execution track of the mediator bus. By placing
security evaluation directly behind messaging boundaries, the framework ensures
that business handlers remain completely decoupled from presentation-layer
network rules while maintaining strict control over data mutations and data
access boundaries.

---

## Understanding the Ingress Authorization Flow and Public Bypass Rules

The Xeno authorization subsystem intercepts execution threads within the
mediator bus to enforce structural access policies. This pipeline automatically
bypasses safety checks for any path explicitly registered in the public route
registry of the request context middleware layer.

When an inbound request enters the presentation layer, the
`RequestContextMiddleware` evaluates whether the requested route and HTTP method
correspond to an open endpoint declared within the `publicRoutes` dictionary. If
the route matches a public definition, the framework sets the `isPublic` flag to
`true` inside the current execution context.

The authorization pipeline stack continuously monitors this flag. Any command or
query message processed under an active public context completely bypasses
security evaluation gates only for user id authorization and tenant id
authorization. This design allows open endpoints—such as public health checks,
login portals, or anonymous status streams—to run without throwing authorization
exceptions for user id or tenant id or requiring mock authorization payloads. On
protected routes, the middleware verifies that the identity context is fully
populated by the security gatekeeper before dispatching the message down the
mediator pipelines.

> [!WARNING]
>
> The others authorization that doas not include the user/tenant id
> authorization such as Roles/Permissions or custom authorization not bypass the
> security under an active public context

---

## Mapping the Four Foundational Authorization Pipeline Strategies

Xeno structures access management into four foundational pipeline strategies
evaluated before handler execution. These deterministic behaviors validate
client identities across user boundaries, tenant environments, cryptographic
role configurations, and custom domain-specific authorization conditions
injected via programmatic host builders.

The framework organizes access validation into distinct pipeline behaviors that
are evaluated sequentially before a message hits its target application handler.
These strategies pull verified identity claims directly from the active
asynchronous local storage context and throw detailed validation failures if
requirements are unmet.

### Key-Value Specification of Foundational Strategies

- **User Authorization Strategy** — Verifies that an incoming request possesses
  a verified, non-empty user identifier signature within the current request
  context.

- **Tenant Authorization Strategy** — Enforces data layer isolation by
  confirming that a valid tenant identifier footprint accompanies the executing
  transaction.

- **Role Authorization Strategy** — Evaluates group membership profiles against
  declarative token rules mapped to specific handler intents.

- **Permission Authorization Strategy** — Assesses fine-grained capability
  scopes to grant or deny execution paths for targeted business actions.

---

## Configuring UserId and TenantId Authorization via AppBuilder

Programmatic configuration of user and tenant authorization hooks occurs
directly through the fluent AppBuilder pipeline method. Toggling these boolean
switches tells the internal bootstrapping engine to inject matching verification
strategies into the container's core authorization stack.

The `UserAuthorizationStrategy` and `TenantAuthorizationStrategy` form the
baseline security guard rails for multi-tenant enterprise software. When
enabled, these strategies intercept the mediator bus execution thread, access
the active context via the `CONTEXT_ACCESSOR` token, and assert that the
required context keys are present. If a protected command or query executes
while `userId` or `tenantId` are absent or undefined, the pipeline
short-circuits, returning an explicit `UNAUTHORIZED` application result.

### Programmatic Security Configuration

To enable baseline identity tracking guards, activate the corresponding
properties inside the `.addPipeline()` block during application bootstrapping:

```typescript
// src/infrastructure/bootstrap-auth.ts
import { AppBuilder } from '@xeno/core'
import type { AppRegistry } from './xeno-registry/app-registry'

export const bootstrap = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder
    // 1. Initialize AsyncLocalStorage request context boundaries
    .addContext()

    // 2. Initialize Middleware with public routes that bypass the user/tenant id authz
    .addMiddleware((opts) => {
      opts.publicRoutes = {
        // Allows public access to the main authentication endpoint
        '/api/v1/auth/login': { POST: 'isPublic' },
        '/api/v1/auth/register': { POST: 'isPublic' },
      }
    })

    // 2. Configure the CQRS behavioral pipeline stack
    .addPipeline((options) => {
      // Enforce mandatory verification of user IDs on protected routes
      options.authorization.userId = true

      // Enforce mandatory verification of tenant IDs for multi-tenant data safety
      options.authorization.tenantId = true
    })

  return await builder.build()
}
```

---

## Introducing Advanced Role-Based, Permission-Based, and Custom Strategies

Complex access logic can be implemented by leveraging declarative intent
policies and custom strategy factories. These advanced execution paths evaluate
specific permission tokens or custom evaluation functions, providing granular
access control detailed further in dedicated sub-manuals.

For applications requiring more than simple identity existence checks, Xeno
supports policy-driven access controls. These advanced structures match specific
message intent tokens to targeted role definitions or fine-grained capabilities.

- **[Role and Permission Policies](./role-permission-policy)** — Configured via
  the `authorization.policies` dictionary. This schema maps incoming handler
  intent strings to mandatory role lists (e.g., `['admin']`) or capability keys
  (e.g., `['read']`), prompting the bootstrapper to dynamically instantiate the
  `RoleAuthorizationStrategy` and `PermissionAuthorizationStrategy`.

- **[Custom Strategy Factories](./custom-authorization)** — Registered using the
  `customAuthorizationStrategy` array. This hook allows developers to inject
  completely custom, domain-specific evaluation functions directly into the main
  `AuthorizationPipeline` loop.

Detailed configuration manifests, contract structures, and runtime examples for
these policy engines are provided in dedicated implementation sub-manuals within
this section.
