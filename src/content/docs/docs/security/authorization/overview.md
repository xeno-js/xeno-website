---
title: Authorization
description: Learn how to configure intent-based authorization for Xeno.JS commands and queries using user, tenant, role, permission, and custom authorization strategies.
keywords:
- Xeno.JS
- authorization
- AuthPolicy
- roles
- permissions
- tenant
- user identity
- CQRS
- authorization strategy
tags:
- security
- authorization
- cqrs
- policies
- roles
- permissions
faqs:
- question: How do I enable authorization in Xeno.JS?
  answer: Configure authorization policies or custom authorization strategies through AppBuilder.addPipeline(), then build the application.
- question: Does Xeno.JS authorization apply to commands and queries?
  answer: Yes. The configured authorization pipeline is added to both the command and query pipelines.
- question: How are authorization policies associated with requests?
  answer: Policies are registered by intent name. Xeno.JS normalizes intent names to lowercase when registering and resolving policies.
- question: What does userId authorization check?
  answer: It verifies that the authenticated request identity contains a valid GUID user ID. It does not compare the identity user ID with an arbitrary user ID contained in the request.
- question: What does tenantId authorization check?
  answer: It verifies that the authenticated request identity contains a valid GUID tenant ID. It does not automatically compare that tenant ID with a resource or request tenant ID.
- question: How are multiple roles evaluated?
  answer: A roles policy succeeds when the authenticated identity contains at least one of the configured roles.
- question: How are multiple permissions evaluated?
  answer: A permissions policy succeeds when the authenticated identity contains at least one of the configured permissions.
- question: What happens when multiple authorization policy types are configured?
  answer: Each configured authorization strategy runs sequentially. All configured strategy types must succeed for the request to continue.
---

## How do I protect a command or query with authorization?

Xeno.JS provides **intent-based authorization** for CQRS requests.

You define an authorization policy for a request intent and Xeno.JS evaluates the policy against the authenticated request identity before the request reaches the next pipeline stage.

The built-in policy dimensions are:

* `userId`
* `tenantId`
* `roles`
* `permissions`

You can also add custom authorization strategies for application-specific rules.

The basic flow is:

```text
Command or Query
      │
      ▼
AuthorizationPipeline
      │
      ├── user identity check
      ├── tenant identity check
      ├── role check
      ├── permission check
      └── custom strategies
      │
      ▼
Next pipeline stage
      │
      ▼
Handler
```

Authorization is an **application-layer** concern. HTTP authentication establishes the request identity; authorization decides whether that identity may execute the application request.

---

## Enable authorization

Authorization is opt-in.

Configure it through `AppBuilder.addPipeline()`:

```ts
const app = new AppBuilder()

app.addPipeline((options) => {
  options.authorization.policies = {
    CreateInvoice: {
      userId: true,
      tenantId: true,
      roles: ['admin', 'billing'],
      permissions: ['invoice:create'],
    },
  }
})

const container = await app.build()
```

When authorization policies or custom authorization strategies are configured, Xeno.JS adds an `AuthorizationPipeline` to the CQRS pipelines.

The same authorization pipeline is used for:

* commands;
* queries.

You do not configure separate authorization policies for the command bus and query bus.

---

## Configure a policy

A policy is associated with a request intent:

```ts
options.authorization.policies = {
  CreateInvoice: {
    userId: true,
    tenantId: true,
    roles: ['admin', 'billing'],
    permissions: ['invoice:create'],
  },
}
```

The policy describes which identity requirements must be satisfied when the `CreateInvoice` intent is executed.

Conceptually:

```text
CreateInvoice
    │
    ├── userId
    ├── tenantId
    ├── roles
    └── permissions
```

The policy registry normalizes intent names to lowercase.

Therefore these intent names resolve to the same policy:

```text
CreateInvoice
createinvoice
CREATEINVOICE
```

The request intent must still identify the same application operation.

---

## Policy dimensions

Xeno.JS supports four built-in policy dimensions.

| Property      | Checks                                             |
| ------------- | -------------------------------------------------- |
| `userId`      | Authenticated identity contains a valid user ID    |
| `tenantId`    | Authenticated identity contains a valid tenant ID  |
| `roles`       | Identity contains at least one required role       |
| `permissions` | Identity contains at least one required permission |

The checks are independent strategies.

If a policy contains multiple dimensions, every applicable strategy must succeed.

For example:

```ts
CreateInvoice: {
  userId: true,
  tenantId: true,
  roles: ['billing'],
  permissions: ['invoice:create'],
}
```

means:

```text
valid user ID
    AND
valid tenant ID
    AND
billing role
    AND
invoice:create permission
```

If any strategy fails, the authorization pipeline stops and the request does not continue.

---

## User authorization

### Require an authenticated user identity

Use:

```ts
CreateProfile: {
  userId: true,
}
```

This requires the authenticated request identity to contain a valid GUID user ID.

The check is performed against:

```ts
context.identity.userId
```

It does **not** compare that value with an ID contained in the command or query.

For example:

```ts
CreateProfile: {
  userId: true,
}
```

means:

> The authenticated identity must contain a valid user ID.

It does **not** mean:

> The authenticated user must match `request.userId`.

If the application needs ownership authorization, such as:

```text
currentUser.id === profile.ownerId
```

that is an application-specific rule and should be implemented with a custom authorization strategy or application logic.

---

## Tenant authorization

### Require an authenticated tenant identity

Use:

```ts
CreateInvoice: {
  tenantId: true,
}
```

This requires the authenticated request identity to contain a valid GUID tenant ID.

The check is performed against:

```ts
context.identity.tenantId
```

It does **not** automatically compare the identity tenant ID with a tenant ID contained in:

* the command;
* the query;
* a route parameter;
* a database entity.

For example:

```ts
CreateInvoice: {
  tenantId: true,
}
```

means:

> The authenticated identity must contain a valid tenant ID.

It does not by itself enforce:

```text
identity.tenantId === invoice.tenantId
```

Resource-level tenant isolation remains an application-specific rule.

This distinction is important for multi-tenant applications.

---

## Role authorization

### Require one of several roles

Configure:

```ts
DeleteUser: {
  roles: ['admin', 'support'],
}
```

The role strategy succeeds when the authenticated identity contains **at least one** of the configured roles.

Therefore:

```text
roles: ['admin', 'support']
```

means:

```text
admin OR support
```

not:

```text
admin AND support
```

For example, an identity containing:

```ts
{
  roles: ['support'],
}
```

satisfies:

```ts
roles: ['admin', 'support']
```

An identity containing:

```ts
{
  roles: ['viewer'],
}
```

does not.

If the required role is missing, authorization fails with a forbidden result.

---

## Permission authorization

### Require one of several permissions

Configure:

```ts
CreateInvoice: {
  permissions: ['invoice:create', 'invoice:admin'],
}
```

The permission strategy succeeds when the authenticated identity contains **at least one** configured permission.

Therefore:

```text
permissions: ['invoice:create', 'invoice:admin']
```

means:

```text
invoice:create OR invoice:admin
```

For example:

```ts
{
  permissions: ['invoice:create'],
}
```

satisfies the policy.

An identity containing only:

```ts
{
  permissions: ['invoice:read'],
}
```

does not.

Missing required permissions produce a forbidden authorization result.

---

## Combine authorization requirements

You can combine multiple policy dimensions:

```ts
options.authorization.policies = {
  CreateInvoice: {
    userId: true,
    tenantId: true,
    roles: ['admin', 'billing'],
    permissions: ['invoice:create'],
  },

  ReadInvoice: {
    tenantId: true,
    permissions: ['invoice:read', 'invoice:admin'],
  },
}
```

The semantics are:

```text
CreateInvoice

valid user ID
    AND
valid tenant ID
    AND
(admin OR billing)
    AND
(invoice:create)
```

and:

```text
ReadInvoice

valid tenant ID
    AND
(invoice:read OR invoice:admin)
```

This gives you a simple model:

* **different policy dimensions** are combined with AND semantics;
* **multiple roles** use OR semantics;
* **multiple permissions** use OR semantics.

---

## What happens when a policy is not defined?

The authorization strategies are created from the policy dimensions found in the configured policy registry.

At execution time, each built-in strategy looks up the policy for the current request intent.

If that policy does not define the dimension handled by the strategy, that strategy succeeds without applying a restriction.

For example:

```ts
options.authorization.policies = {
  CreateInvoice: {
    roles: ['billing'],
  },

  ReadInvoice: {
    permissions: ['invoice:read'],
  },
}
```

The role strategy applies to `CreateInvoice`.

The permission strategy applies to `ReadInvoice`.

A role strategy does not reject `ReadInvoice` merely because `ReadInvoice` has no `roles` configuration.

---

## Authorization and authentication

Authorization depends on the request identity.

The built-in authorization strategies obtain the identity from the request context.

The flow is:

```text
Authentication
      │
      ▼
Request Identity
      │
      ▼
Authorization
      │
      ▼
Application request
```

If the request context is unavailable, the built-in authorization strategies return an unauthorized result.

This means authentication and authorization have different responsibilities:

| Concern        | Responsibility                                       |
| -------------- | ---------------------------------------------------- |
| Authentication | Establish who the caller is                          |
| Authorization  | Decide whether that identity may execute the request |

For HTTP applications, authentication normally happens at the HTTP boundary before the CQRS request reaches the authorization pipeline.

---

## Authorization pipeline

The authorization pipeline executes its configured strategies sequentially.

Conceptually:

```text
Request
  │
  ▼
Strategy 1
  │
  ├── fail → stop
  │
  ▼
Strategy 2
  │
  ├── fail → stop
  │
  ▼
Strategy 3
  │
  ├── fail → stop
  │
  ▼
next()
```

If a strategy fails, the pipeline immediately returns the failure.

If every strategy succeeds, the request continues to the next pipeline behavior.

This means authorization is fail-fast.

---

## Authorization order in the CQRS pipeline

The authorization pipeline is added after the exception, logging, and performance pipelines and before validation and command/query-specific pipeline behaviors.

The effective high-level order is:

```text
Exception
   ↓
Logging
   ↓
Performance
   ↓
Authorization
   ↓
Validation
   ↓
Command / Query specific behaviors
   ↓
Handler
```

This applies to both command and query pipelines.

As a result, authorization can reject a request before application validation is executed.

This is useful when the request should not proceed into later application processing unless the caller is authorized.

---

## Configure authorization with validation

Authorization and validation are separate concerns.

For example:

```ts
const app = new AppBuilder()

app.addPipeline((options) => {
  options.authorization.policies = {
    CreateInvoice: {
      tenantId: true,
      permissions: ['invoice:create'],
    },
  }

  options.validation.zod = {
    schemas: {
      CreateInvoice: CreateInvoiceSchema,
    },
  }
})

const container = await app.build()
```

The responsibilities remain separate:

```text
Authorization
    =
    "May this identity execute CreateInvoice?"

Validation
    =
    "Is this CreateInvoice request structurally valid?"
```

Do not use authorization policies as a replacement for input validation.

---

## Authorization for queries

Authorization is not limited to commands.

Because the configured authorization pipeline is added to both the command and query pipelines, the same policy mechanism can protect queries.

For example:

```ts
options.authorization.policies = {
  GetInvoice: {
    tenantId: true,
    permissions: ['invoice:read'],
  },

  DeleteInvoice: {
    tenantId: true,
    permissions: ['invoice:delete'],
  },
}
```

This allows read and write operations to have independent authorization requirements.

---

## Resource ownership is not automatic

A common mistake is assuming that:

```ts
GetInvoice: {
  userId: true,
}
```

automatically prevents one user from reading another user's invoice.

It does not.

The built-in `userId` strategy verifies that the authenticated identity contains a valid user ID.

It does not load the invoice and compare:

```text
invoice.ownerId
```

with:

```text
identity.userId
```

Likewise:

```ts
GetInvoice: {
  tenantId: true,
}
```

does not automatically compare an invoice's tenant with the authenticated tenant.

For resource ownership or resource-level tenant isolation, use an application-specific authorization strategy.

---

## Custom authorization strategies

Built-in policies cover common identity-based authorization requirements.

For application-specific rules, configure custom authorization strategies:

```ts
app.addPipeline((options) => {
  options.authorization.customAuthorizationStrategy = [
    (container) => {
      return new InvoiceOwnershipStrategy(
        container.resolve(INVOICE_REPOSITORY),
        container.resolve(TOKENS.CONTEXT_ACCESSOR),
      )
    },
  ]
})
```

Custom strategies are added to the same authorization pipeline as the built-in strategies.

Typical custom rules include:

* resource ownership;
* organization membership;
* subscription state;
* account status;
* resource-specific tenant isolation;
* business-specific access rules.

See [Custom Authorization](./custom) for the implementation details.

---

## A complete example

The following example combines identity, tenant, role, and permission checks:

```ts
const app = new AppBuilder()

app.addPipeline((options) => {
  options.authorization.policies = {
    CreateInvoice: {
      userId: true,
      tenantId: true,
      roles: ['admin', 'billing'],
      permissions: ['invoice:create'],
    },

    ReadInvoice: {
      tenantId: true,
      permissions: ['invoice:read', 'invoice:admin'],
    },

    DeleteInvoice: {
      tenantId: true,
      roles: ['admin'],
      permissions: ['invoice:delete'],
    },
  }
})

const container = await app.build()
```

The resulting rules are:

| Intent          | Requirements                                                        |
| --------------- | ------------------------------------------------------------------- |
| `CreateInvoice` | valid user + valid tenant + `admin` OR `billing` + `invoice:create` |
| `ReadInvoice`   | valid tenant + `invoice:read` OR `invoice:admin`                    |
| `DeleteInvoice` | valid tenant + `admin` + `invoice:delete`                           |

All configured requirements for an intent must pass.

---

## Common mistakes

### Authorization is not running

Make sure the CQRS pipeline is enabled:

```ts
app.addPipeline((options) => {
  options.authorization.policies = {
    CreateInvoice: {
      permissions: ['invoice:create'],
    },
  }
})
```

Authorization is not enabled merely by defining an authentication provider.

---

### Authentication is configured but authorization is not

These are separate:

```text
Authentication
    ↓
creates Identity

Authorization
    ↓
checks Identity
```

Configure both when the application needs authenticated and protected operations.

---

### Expecting `userId` to enforce ownership

This:

```ts
{
  userId: true,
}
```

only requires a valid authenticated user ID.

It does not enforce:

```text
identity.userId === resource.ownerId
```

Use a custom strategy for ownership rules.

---

### Expecting `tenantId` to enforce resource isolation

This:

```ts
{
  tenantId: true,
}
```

only requires a valid authenticated tenant ID.

It does not automatically scope database queries or compare a resource's tenant ID.

Resource isolation must be enforced by the application's data access and authorization rules.

---

### Expecting multiple roles to require all roles

This:

```ts
roles: ['admin', 'billing']
```

means:

```text
admin OR billing
```

If the application requires a more complex relationship between roles, implement that rule explicitly.

---

### Expecting multiple permissions to require all permissions

This:

```ts
permissions: ['invoice:create', 'invoice:approve']
```

means:

```text
invoice:create OR invoice:approve
```

If both permissions are required simultaneously, use a custom authorization rule.

---

## When to use built-in policies

Use built-in policies when the requirement can be expressed as:

```text
valid user identity
valid tenant identity
required role
required permission
```

Examples:

```ts
GetDashboard: {
  userId: true,
}
```

```ts
ListInvoices: {
  tenantId: true,
}
```

```ts
ManageUsers: {
  roles: ['admin'],
}
```

```ts
CreateInvoice: {
  permissions: ['invoice:create'],
}
```

Use a custom authorization strategy when the rule depends on application data or business logic.

---

## Related documentation

* [Authorization Policies](./policies)
* [Custom Authorization](./custom)
* [Authentication Overview](../authentication/overview)
* [Authentication Middleware](../middleware/authentication)
* [Middleware Execution](../middleware/execution)
* [CQRS Overview](../../application/cqrs/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
