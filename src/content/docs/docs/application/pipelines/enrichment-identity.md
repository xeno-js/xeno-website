---
title: Identity Enrichment Pipeline
description: Learn how to enrich the current identity in Xeno.JS before command and query handlers run.
keywords:
- Xeno.JS identity enrichment
- Xeno.JS enrichment pipeline
- request identity
- CQRS identity pipeline
- withEnrichmentIdentity
- IStrategy
- authentication
- authorization
tags:
- application
- pipelines
- identity
- enrichment
- cqrs
faqs:
- question: How do I enable identity enrichment in Xeno.JS?
  answer: Pass withEnrichmentIdentity() to XenoAppBuilder.addPipeline().
- question: Does identity enrichment run for commands and queries?
  answer: Yes. The enrichment behavior is added as a common pipeline behavior, so it runs for both commands and queries.
- question: What does the default identity enrichment strategy do?
  answer: The default strategy is a noop strategy that leaves the identity unchanged.
- question: When does identity enrichment run?
  answer: It runs before the next pipeline behavior and before the handler, after authentication has populated identity and before authorization checks.
- question: Can I use a custom strategy to add claims or user metadata?
  answer: Yes. Provide a custom IStrategy<Identity> in withEnrichmentIdentity() and update the current request identity through the request context.
---

## Introduction

Use the Identity Enrichment Pipeline to enrich the current request identity before command and query execution continues.

This is useful when authentication gives you a base identity and you want to attach additional metadata (for example, tenant, roles, flags, or profile details) before authorization and handler logic run.

When enabled, Xeno.JS:

1. reads the current identity from request context;
2. executes the configured enrichment strategy;
3. continues with the next pipeline behavior.

If no strategy is configured, Xeno.JS uses a noop strategy that does not modify identity.

## Before you start

You need:

- an `XenoAppBuilder` instance;
- the CQRS pipeline enabled with `addPipeline()`;
- authentication configured if you expect an initial identity to be present;
- a custom `IStrategy<Identity>` if you need enrichment logic.

For context and identity APIs, see [Context and Scopes](../../fundamentals/context-scopes).

## Enable identity enrichment

Enable the plugin with `withEnrichmentIdentity()`:

```ts
import { XenoAppBuilder, withEnrichmentIdentity } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(
    withEnrichmentIdentity(),
  )

const application = await app.build()
```

You do not need to instantiate `IdentityEnrichmentPipeline` manually.

## Configure a custom enrichment strategy

Use `withEnrichmentIdentity()` to provide a custom strategy:

```ts
import type { Identity, IStrategy, ResultType } from '@xeno-js/shared'
import { Result, XenoAppBuilder, withEnrichmentIdentity } from '@xeno-js/core'

class AttachTenantStrategy implements IStrategy<Identity> {
  public async execute(identity: Identity): Promise<ResultType<void>> {
    identity.tenantId = 'tenant-acme'
    identity.roles = [...(identity.roles ?? []), 'member']
    return Result.ok()
  }
}

const app = new XenoAppBuilder()
  .addPipeline(
    withEnrichmentIdentity((options) => {
      options.strategy = new AttachTenantStrategy()
    }),
  )

const application = await app.build()
```

The strategy receives the current `Identity` object from request context (or an empty object when no identity exists yet).

## Understand execution order

Identity enrichment is added as a **common** pipeline behavior:

- it runs for **commands**;
- it runs for **queries**.

In CQRS pipeline ordering, enrichment runs before authorization.

Conceptually:

```text
Exception
  ↓
Logging
  ↓
Identity enrichment
  ↓
Authorization
  ↓
Command/Query handler
```

## Behavior when no strategy is configured

If the plugin is enabled without a custom strategy, Xeno.JS uses `NoopIdentityEnrichmentStrategy`.

That default strategy always returns success and leaves identity unchanged.

## Common use cases

Use identity enrichment when you need to:

- normalize identity fields before authorization;
- map provider-specific claims to application-level claims;
- attach tenant information resolved from identity attributes;
- add derived flags used by downstream policies or handlers.

Keep the strategy focused on identity transformation. Prefer authorization policies for allow/deny decisions.

## Best practices

- Keep enrichment deterministic and fast.
- Do not perform long-running I/O inside the strategy when avoidable.
- Treat missing identity fields explicitly.
- Keep authorization rules in the authorization layer; enrich identity data here.

## Related documentation

- [Logging Pipeline](./logging)
- [Validation Pipeline](./validation)
- [Idempotency Pipeline](./idempotency)
- [Context and Scopes](../../fundamentals/context-scopes)
- [Creating Commands](../cqrs/command)
- [Creating Queries](../cqrs/query)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
