---
title: Cache Overview
description: Learn how to configure, resolve, and use the cache provided by Xeno.JS.
keywords:
- Xeno.JS
- cache
- caching
- in-memory cache
- Redis
- TOKENS.CACHE
- ICache
-XenoAppBuilder
tags:
- cache
- caching
- dependency-injection
- application
- typescript
faqs:
- question: How do I enable the cache in Xeno.JS?
  answer: Call app.addCache() and configure the cache options. Xeno.JS provides an in-memory cache by default.
- question: Which cache implementations does Xeno.JS provide?
  answer: Xeno.JS provides an in-memory cache and a Redis-backed cache.
- question: How do I resolve the configured cache?
  answer: After building the application, resolve TOKENS.CACHE through the builder's resolve method.
- question: Which API does the Xeno.JS cache expose?
  answer: The cache exposes get, set, setIfAbsent, remove, removePattern, has, and clear operations. The IAtomicCache contract also provides increment.
- question: Where is the Xeno.JS cache used?
  answer: Xeno.JS uses the configured cache for query caching, command idempotency, and rate limiting.
- question: Do I need to configure the cache explicitly when using pipelines or middleware?
  answer: Not always. Xeno.JS queues the default cache when query caching or command idempotency is enabled through pipelines, or when rate-limiting middleware is enabled. Call addCache() explicitly to choose or configure a cache provider.
- question: How do I configure Redis?
  answer: Use the dedicated Redis cache documentation.

---

## Introduction

Xeno.JS provides a common cache API that can be backed by different cache implementations.

The cache is configured through `XenoAppBuilder` and resolved through `TOKENS.CACHE`.

## Configure the Cache

Add the cache module to your application:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addCache()
```

The default configuration enables the **in-memory cache**.

You can also configure the cache explicitly:

```ts
app.addCache((options) => {
  options.inMemory = true
})
```

For Redis configuration, see [Redis Cache](./redis).

## Cache Types

Xeno.JS currently provides:

- **In-memory cache** — stores values in the current application process.
- **Redis cache** — stores values in Redis and can be used when cache state must be shared outside the process.

Both implementations expose the same cache contract, so application code can resolve and use the cache without depending on the underlying storage.

## Resolve the Cache

After building the application, resolve `TOKENS.CACHE` through the builder:

```ts
import { XenoAppBuilder, TOKENS } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addCache()

await app.build()

const { cache } = app.getServices()
```

The resolved value is the configured cache implementation.

## Use the Cache

### Set and Get a Value

```ts
await cache.set('user:123', { id: '123', name: 'Alice' }, 60)

const user = await cache.get<{ id: string; name: string }>('user:123')
```

The third argument of `set()` is the TTL in seconds.

### Check a Key

```ts
const exists = await cache.has('user:123')
```

### Remove a Value

```ts
await cache.remove('user:123')
```

### Set Only If the Key Does Not Exist

```ts
const created = await cache.setIfAbsent(
  'lock:123',
  { locked: true },
  30,
)
```

The method returns `true` when the value is stored and `false` when the key already exists.

### Clear the Cache

```ts
await cache.clear()
```

### Increment a Value

The configured cache also exposes the atomic `increment()` operation:

```ts
const count = await cache.increment('counter', 60)
```

If the key does not exist, the counter starts from `1`.

## Where Xeno.JS Uses the Cache

The configured cache is used by Xeno.JS itself for several application features.

### Query Caching

The query pipeline can cache query results when caching is configured on a query.

For example, a query can provide:

```ts
cacheOptions: {
  cacheKey: 'users:list',
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: false,
}
```

The query caching pipeline uses `TOKENS.CACHE` to read and store the result.

For details about query caching, see the CQRS documentation.

### Command Idempotency

Command idempotency uses the same cache abstraction to store locks and previously processed command results.

This means changing the configured cache implementation does not require changing the idempotency feature.

### Rate Limiting

HTTP rate limiting also uses the configured cache.

This allows rate-limit state to be stored through the same cache abstraction used by the rest of the application.

## Cache Configuration and Pipelines

When you call `addPipeline()`, Xeno.JS queues the cache module if query caching or command idempotency is enabled and a cache has not already been configured.

When you call `addMiddlewares()`, Xeno.JS queues the cache module if rate limiting is enabled and a cache has not already been configured.

Therefore, call `addCache()` explicitly when you want to configure the cache yourself, for example to select Redis.

## Choose a Cache

Use the in-memory cache when:

- the cache only needs to live inside one application process;
- you are developing locally;
- shared cache state is not required.

Use Redis when:

- multiple application instances need to share cached values;
- cache state must live outside the application process;
- you need a distributed cache.

For Redis configuration, see [Redis Cache](./redis).

## Related Documentation

- [Redis Cache](./redis)
- [CQRS Query](../application/cqrs/query)
- [Caching Pipeline](../application/pipelines/caching)
- [Command Idempotency](../application/pipelines/idempotency)
- [Dependency Injection Resolution](../dependency-injection/resolution)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
