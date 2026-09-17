---
title: 'Authorization Pipeline Architecture & Policy Configuration'
description:
  'Learn how Xeno configures authorization policies by request intent and
  evaluates user, tenant, role, permission, and custom strategies in the CQRS
  pipeline.'
keywords:
  [
    'Authorization',
    'Access Control',
    'UserAuthorizationStrategy',
    'TenantAuthorizationStrategy',
    'RoleAuthorizationStrategy',
    'PermissionAuthorizationStrategy',
    'AuthPolicy',
    'AuthorizationPipeline',
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

## Understanding the CQRS Authorization Flow

The Xeno authorization subsystem evaluates Commands and Queries inside the CQRS
mediator pipeline. Authorization is based on the request `intent` and the
identity stored in the active `RequestContext`; it is independent of HTTP route
configuration.

`AuthenticationMiddleware` may populate the request identity before a
Controller sends a Command or Query. When the mediator reaches
`AuthorizationPipeline`, each configured strategy evaluates the request intent
and the identity available through `IContextAccessor<RequestContext>`.

If a strategy fails, `AuthorizationPipeline` returns a failed `Result` and does
not call the next pipeline behavior or Handler. If all strategies succeed, it
delegates to the next behavior.

> [!WARNING]
>
> Xeno does not define a `publicRoutes` bypass in `MiddlewareConfig`. Route
> accessibility and Command or Query authorization are separate concerns. A
> request can be reachable through HTTP and still fail a policy evaluation.

---

## Mapping the Four Foundational Authorization Pipeline Strategies

Xeno provides four built-in authorization strategies and supports custom
strategies. Strategies are created from the configured policy fields and are
evaluated before Handler execution.

The framework organizes access validation into distinct pipeline behaviors that
are evaluated sequentially before a message reaches its target Handler. The
strategies read the active identity through the context accessor and return
`Result.fail(AppError)` when requirements are unmet.

### Key-Value Specification of Foundational Strategies

- **UserAuthorizationStrategy** — When the policy for an intent sets `userId`,
  verifies that the context contains a valid user identifier.

- **TenantAuthorizationStrategy** — When the policy sets `tenantId`, verifies
  that the context contains a valid tenant identifier.

- **RoleAuthorizationStrategy** — When the policy contains roles, succeeds when
  the identity has at least one required role.

- **PermissionAuthorizationStrategy** — When the policy contains permissions,
  succeeds when the identity has at least one required permission.

- **Custom authorization strategies** — Execute application-specific rules
  supplied through `customAuthorizationStrategy`.

---

## Configuring Authorization Policies via AppBuilder

Authorization configuration occurs through the `authorization` property passed
to `AppBuilder.addPipeline()`. The `policies` dictionary maps each Command or
Query `intent` to an `AuthPolicy`. The bootstrap process registers a policy
registry and creates only the built-in strategies required by the configured
policy fields.

The policy is looked up by request intent. If `userId` or `tenantId` is defined,
the corresponding strategy validates the identity value and GUID format. Role
and permission strategies require at least one matching value from the identity.
The strategies use `TOKENS.CONTEXT_ACCESSOR` to read the active
`RequestContext`.

### Programmatic Security Configuration

To configure authorization, assign an `AuthPolicy` dictionary inside the
`.addPipeline()` block during application bootstrapping:

```typescript
// src/infrastructure/bootstrap-auth.ts
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './infrastructure/app-registry'

export const bootstrap = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder
    .addContext()
    .addPipeline((options) => {
      options.authorization.policies = {
        CREATE_USER_COMMAND_HANDLER_TOKEN: {
          userId: true,
          tenantId: true,
          roles: ['admin'],
          permissions: ['users:create'],
        },
        GET_USER_QUERY_HANDLER_TOKEN: {
          tenantId: true,
        },
      }
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

For applications requiring more than identity and tenant checks, Xeno supports
policy-driven role and permission controls, as well as custom strategy
factories. Policies are associated with message intent tokens and can define
role lists, permission lists, or identity requirements.

- **[Role and Permission Policies](./role-permission-policy)** — Configured via
  the `authorization.policies` dictionary. This schema maps request intent
  strings to `AuthPolicy` values. A policy can require roles, permissions, a
  user ID, or a tenant ID. The bootstrapper instantiates only the strategies
  required by the configured policies.

- **[Custom Strategy Factories](./custom-authorization)** — Registered using the
  `customAuthorizationStrategy` array. Each callback receives the current
  service scope and returns an `IStrategy<IRequest>`. The resulting strategies
  are appended to the `AuthorizationPipeline`.

## Authorization Results and Constraints

`AuthorizationPipeline` evaluates strategies in registration order. The first
failed strategy stops evaluation and returns its `AppError`; later strategies
and the Handler are not executed. A successful strategy returns `Result.ok()`.

The current implementation has these constraints:

- authorization policies are keyed by request `intent`, not HTTP path;
- the policy registry normalizes intent keys to lowercase when registering and
  retrieving policies;
- `userId` and `tenantId` checks validate GUID values;
- role and permission checks use an "at least one matching value" rule;
- an absent policy field does not activate its corresponding built-in strategy;
- authentication and authorization are separate: the authentication flow
  populates `Identity`, while authorization evaluates it;
- `customAuthorizationStrategy` is configured as a factory array and is not a
  route-level bypass mechanism.

Detailed configuration manifests, contract structures, and runtime examples for
these policy engines are provided in dedicated implementation sub-manuals within
this section.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
