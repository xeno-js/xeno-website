---
title: Command Cache Invalidation Pipeline
description: Invalidate cached CQRS query results after successful commands in Xeno.JS, with examples for contextual keys, patterns, and cache failures.
keywords:
  - Xeno.JS cache invalidation
  - CQRS cache invalidation
  - command cache invalidation
  - query cache
  - TypeScript
  - Redis
tags:
  - application
  - pipelines
  - cqrs
  - caching
faqs:
  - question: How do I enable command cache invalidation?
    answer: Pass withQueryCaching() to addPipeline(). Xeno.JS adds query caching and command cache invalidation together.
  - question: When are command cache entries invalidated?
    answer: After the downstream command pipeline returns a successful Result and the command declares cacheInvalidation.
  - question: Are invalidation keys scoped automatically?
    answer: No. Keys and patterns are passed directly to the cache provider and must match the stored keys, including tenant and user prefixes or public suffixes.
  - question: Does a cache failure fail the command?
    answer: An invalidation error is logged as a warning and the successful command result is returned. Remaining invalidation operations are not attempted.
---

## What is command cache invalidation?

The command cache invalidation pipeline removes cached entries after a successful command. A command declares exact `keys`, `patterns`, or both in `cacheInvalidation`. This lets a write invalidate query results that depend on the changed data.

The command result and the cache update are separate operations. Invalidation is best effort, so it does not guarantee that every later read is fresh.

## Enable the pipeline

Pass `withQueryCaching()` to `addPipeline()`. The CQRS module adds both query caching and command invalidation; there is no separate invalidation plugin.

```ts
import { XenoAppBuilder, withQueryCaching } from '@xeno-js/core'

const application = await new XenoAppBuilder()
  .addPipeline(withQueryCaching())
  .build()
```

If no cache is registered, Xeno.JS configures the default in-memory cache. Use `addCache()` to select or configure a provider, such as [Redis](/docs/cache/redis). Calling `addCache()` alone does not enable these pipeline behaviors.

## Invalidate a query by key

Query caching transforms the logical `cacheKey` into a contextual storage key. Build the command's exact invalidation key with the same `ICacheKeyBuilder` and identity context used by the query:

```ts
import { Command, Query } from '@xeno-js/core'
import type { ICacheKeyBuilder } from '@xeno-js/core'

interface User {
  id: string
  name: string
}

export class GetUserQuery extends Query<User> {
  constructor(public readonly userId: string) {
    super('GetUserQuery', {
      cacheKey: `user:${userId}`,
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: false,
    })
  }
}

export class UpdateUserCommand extends Command<User> {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    keyBuilder: ICacheKeyBuilder,
  ) {
    super('UpdateUserCommand', {
      keys: [keyBuilder.buildContextualKey(`user:${userId}`)],
    })
  }
}
```

Register handlers under `GetUserQuery` and `UpdateUserCommand`, and execute them through the mediator. Resolve the key builder while the relevant identity is active. This example creates a new scope with the default guest identity:

```ts
import { TOKENS } from '@xeno-js/core'

// application is built with both handlers registered.
await application.runInScope(async (services) => {
  const keyBuilder = services[TOKENS.CACHE_KEY_BUILDER]
  const mediator = services[TOKENS.MEDIATOR]
  const command = new UpdateUserCommand('42', 'Ada', keyBuilder)
  const result = await mediator.send(command, new AbortController().signal)

  if (!result.isOk()) {
    throw result.getErrorOrThrow()
  }
})
```

The example invalidates the public entry for the default guest. `runInScope()` creates a new context and uses the guest identity unless an explicit context is passed as its second argument. Inside an existing request, resolve the builder from the active scope instead. The identity used to build the command key must match the identity used to cache the query, including any changes made by identity enrichment. The command handler must complete the write before returning a successful result. For handler registration and scopes, see [Creating Commands](/docs/application/cqrs/command).

## Match the stored cache key

`QueryCachingPipeline` applies the configured key builder to `cacheOptions.cacheKey`. `CommandCacheInvalidationBehavior` does not apply the key builder: it passes each declared string directly to the cache.

With the built-in key builder, the logical key `user:42` produces:

| Query scope | Identity | Stored key |
| --- | --- | --- |
| Contextual | No tenant | `user:42:public` |
| Contextual | Tenant `acme` | `tenant:acme:user:42` |
| User-scoped | User `7`, no tenant | `user:7:user:42:public` |
| User-scoped | User `7`, tenant `acme` | `tenant:acme:user:7:user:42` |

Use `buildContextualKey()` for a query with `isUserScoped: false` and `buildUserScopedKey()` for a query with `isUserScoped: true`. If the identity has no user ID, `buildUserScopedKey()` falls back to the contextual key. A custom key builder can use a different format.

An exact key for the current identity does not invalidate entries for other users or tenants. Identify every affected cached view, including lists and other user-scoped entries, and choose a strategy that respects tenant boundaries. Do not accept arbitrary invalidation keys or patterns from external callers.

## Invalidate matching keys

`patterns` are passed unchanged to the cache provider's `removePattern()` method:

```ts
super('UpdateUserCommand', {
  keys: ['tenant:acme:user:42'],
  patterns: ['tenant:acme:users:page:*'],
})
```

This example targets the `acme` tenant and assumes that paginated list entries actually use the shown stored-key prefix. Adapt the pattern to the key builder and provider in use.

The built-in in-memory cache supports `*` as a wildcard and treats other regex metacharacters literally. Redis uses its own glob matching and the current Redis provider calls `KEYS` followed by `DEL`; broad patterns can be expensive on large databases. Check custom provider semantics and restrict patterns to the intended namespace. Avoid building patterns from untrusted input.

Although `ICache` declares `removePattern()`, the pipeline checks for a callable method at runtime and silently skips patterns if it is absent. Exact keys are still processed.

## Execution and failures

For a command that reaches this behavior:

1. The behavior awaits the next command pipeline step.
2. A failed result or missing `cacheInvalidation` skips removal. If the downstream step throws, removal is not attempted.
3. On success, exact keys are removed sequentially, followed by patterns.
4. A removal error stops the remaining operations and logs `[Cache Invalidation ERROR]` at warning level. Earlier removals remain applied, and the original successful result is returned.

Successful removals are logged at debug level. Check the configured logger's level if those messages are not visible.

The behavior is appended after the other sorted command behaviors. A preceding behavior can short-circuit without calling it. For example, an idempotency replay can return a stored result without running the handler or invalidation again.

## Consistency and common problems

- **A successful result does not prove that invalidation completed.** Monitor cache warnings and use an appropriate TTL or a separate recovery mechanism where stale data matters.
- **Invalidation is not atomic with the database write.** Ensure the write has committed before returning success. A concurrent query can also repopulate stale data after a removal; use a stronger application-specific strategy when required.
- **Logical keys are not necessarily storage keys.** Match the tenant, user, and public components shown above, or use the configured key builder.
- **A direct handler call bypasses the mediator pipeline.** Send the command through the mediator and enable `withQueryCaching()`.
- **In-memory caches are local to the cache instance.** Separate application instances need a shared cache or another coordination mechanism if they must invalidate each other's entries.

For cache reads, TTLs, and bypass options, see [Caching Pipeline](/docs/application/pipelines/caching).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
