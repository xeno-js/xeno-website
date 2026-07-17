---
title: 'Custom Authorization Strategies: Extending Access Control Boundaries'
description:
  'Advanced guide to authoring and registering custom authorization strategies
  in Xeno by extending BaseAuthorizationStrategy and injecting factories via
  AppBuilder.'
keywords:
  [
    'Custom Authorization',
    'IStrategy',
    'BaseAuthorizationStrategy',
    'Identity context',
    'AppBuilder bootstrap',
    'Mediator Pipeline',
    'Xeno',
  ]
author: 'Xeno'
---

## Implementing Custom Authorization Strategies

For enterprise applications, rigid role-based or permission-based matrices are
often insufficient to cover complex business logic—such as dynamic resource
ownership checks, time-based operational windows, or fine-grained data-layer
access constraints. Xeno addresses this by providing a fully extensible
authorization pipeline that accepts custom security strategies.

---

## How Custom Authorization Strategies Expand Access Control

Custom authorization strategies in Xeno allow engineers to implement complex,
domain-specific security constraints beyond standard role or permission checks.
By implementing the IStrategy interface or inheriting from
BaseAuthorizationStrategy, developers can execute arbitrary logic blocks that
intercept and validate CQRS message propagation dynamically.

The framework routes messages through an internal authorization pipeline stack
before passing the payload to an application handler. Rather than locking you
into specific validation schemas, the mediator bus treats security checks as an
array of decoupled strategy objects. By plug-in custom components that implement
the generic `IStrategy<IRequest>` contract, developers can evaluate fine-grained
access rules at the message layer, ensuring that core domain rules remain
separate from transport mechanics.

### Key-Value Specification of Strategic Access Primitives

- **IStrategy Contract** — The baseline framework interface requiring an
  asynchronous `execute(request)` execution path that returns a functional
  result monad.

- **BaseAuthorizationStrategy Abstraction** — An abstract base class that
  encapsulates request context lookup boundaries, automatically ensuring user
  authentication before firing checks.

- **Pipeline Interception Mechanics** — Custom strategies run sequentially
  within the main execution stack, allowing developers to short-circuit invalid
  or unauthorized transactions before they modify data stores.

---

## Accessing Identity Context Within Bespoke Strategies

Bespoke authorization strategies securely extract verified tenant, user, or
capability metrics directly from the active asynchronous execution context
layer. When extending BaseAuthorizationStrategy, the core framework
automatically applies pre-flight context checks, providing immediate access to
the authenticated Identity envelope inside the execution check loop.

When you extend the abstract `BaseAuthorizationStrategy`, the base
implementation automatically resolves the current thread state via the injected
`IContextAccessor<RequestContext>`. If it detects an unauthenticated user or an
absent context scope, it returns an explicit `UNAUTHORIZED` result, preventing
execution failures further down the stack. If authentication checks pass, it
extracts the validated `Identity` properties and forwards them into your custom
`performAuthorizationCheck` implementation.

### Key-Value Specification of Identity Claims Sub-Context

- **auth.userId** — The verified identifier of the current active user account,
  useful for validating resource ownership.

- **auth.tenantId** — The active tenant organization token used to enforce data
  isolation boundaries in multi-tenant SaaS systems.

- **auth.claims** — A flexible, extensible record dictionary containing
  arbitrary claims appended by your identity provider during login.

### Programmatic Implementation of a Custom Strategy

The following example shows how to write a custom strategy that limits command
execution to the actual resource owner (e.g., verifying that a user can only
edit their own profile data):

```typescript
// src/application/security/resource-ownership.strategy.ts
import { BaseAuthorizationStrategy, Result, AppError } from '@xeno/core'
import type {
  IRequest,
  Identity,
  ResultType,
  IContextAccessor,
  RequestContext,
} from '@xeno/core'

// Define a type contract requiring messages to supply a target owner parameter
interface IOwnedResourceRequest extends IRequest {
  readonly props: { readonly userId: string }
}

export class ResourceOwnershipStrategy extends BaseAuthorizationStrategy<IOwnedResourceRequest> {
  constructor(requestContext: IContextAccessor<RequestContext>) {
    super(requestContext) // Propagates context accessor functionality upwards
  }

  /**
   * Abstract implementation containing the customized access evaluation rules.
   * @param request The incoming command or query instance.
   * @param auth The authenticated user identity context extracted from AsyncLocalStorage.
   * @param isPublic Flag showing if the target route completely bypasses standard guards.
   */
  protected async performAuthorizationCheck(
    request: IOwnedResourceRequest,
    auth: Identity,
    isPublic?: boolean,
  ): Promise<ResultType<void>> {
    // 1. Immediately clear path execution if the endpoint is marked public
    if (isPublic) {
      return Result.ok()
    }

    const targetResourceOwner = request.props?.userId

    // 2. Deny access if the command payload misses ownership attributes
    if (!targetResourceOwner) {
      return Result.fail(
        AppError.badRequest(
          request.intent,
          'Authorization aborted: Target owner attribute is missing.',
        ),
      )
    }

    // 3. Compare active identity context signatures against payload constraints
    const isOwner = auth.userId === targetResourceOwner
    const isSystemAdmin = auth.roles?.includes('super_admin') ?? false

    if (!isOwner && !isSystemAdmin) {
      // Short-circuit pipeline execution by returning an explicit forbidden monadic result
      return Result.fail(
        AppError.forbidden(
          request.intent,
          'Access Denied: You do not own this resource asset.',
        ),
      )
    }

    // 4. Return an empty successful Result monad to proceed down the pipeline stack
    return Result.ok()
  }
}
```

---

## Registering Custom Strategies in the AppBuilder Bootstrap

Programmatic registration of custom security strategies uses the
customAuthorizationStrategy array within the AppBuilder pipeline configuration
setup. This paradigm allows developers to provide isolated inline factory
functions that resolve infrastructure dependencies from the service container
during the application bootstrap phase.

To attach custom strategies to the global mediator tracking loop, map them using
the `customAuthorizationStrategy` configuration array inside the
`.addPipeline()` initialization path. The bootstrapper parses these factory
handlers, registers them within internal singleton dependency scopes, and
includes them alongside standard role or permission checks inside the
`AuthorizationPipeline` behavior array.

### Wiring Custom Security Strategies inside Bootstrapping

The code configuration below demonstrates how to instantiate your custom
strategy class using inline factory callbacks within the fluent `AppBuilder`
assembly sequence:

```typescript
// src/infrastructure/bootstrap.ts
import { AppBuilder, TOKENS } from '@xeno/core'
import { ResourceOwnershipStrategy } from '../application/security/resource-ownership.strategy'
import type { AppRegistry } from './xeno-registry/app-registry'

export const initializeApplicationHost = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder
    // 1. Bind execution state boundaries to AsyncLocalStorage threads
    .addContext()

    // 2. Attach and configure core framework entry points
    .addMiddlewares()

    // 3. Inject custom strategy behaviors into the authorization stack
    .addPipeline((options) => {
      // Toggle standard context checks
      options.authorization.userId = true
      options.authorization.tenantId = true

      // Register the custom strategy using an inline factory mapping function
      options.authorization.customAuthorizationStrategy = [
        (container) => {
          // Resolve required dependencies out of the active service container scope
          const contextAccessor = container.resolve(TOKENS.CONTEXT_ACCESSOR)

          // Instantiate and return the bespoke strategy object
          return new ResourceOwnershipStrategy(contextAccessor)
        },
      ]
    })

  // Compile module definitions and return the type-safe ServiceContainer
  return await builder.build()
}
```
