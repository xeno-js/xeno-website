---
title: Caching Pipeline
description: Learn how to enable query caching in Xeno.JS, configure cache options on queries, and control cache reads, TTLs, and cache scope.
keywords:
- Xeno.JS caching
- Xeno.JS query caching
- query cache
- CQRS caching
- TypeScript query caching
- cacheOptions
- Redis cache
- in-memory cache
tags:
- application
- pipelines
- caching
- cqrs
- queries
faqs:
- question: How do I enable query caching?
  answer: Configure queryBus.isEnabled through AppBuilder.addPipeline() and configure a cache with AppBuilder.addCache().
- question: Does the caching pipeline apply to commands?
  answer: No. The built-in caching pipeline is added to the Query pipeline.
- question: How do I make a query cacheable?
  answer: Create the query with cacheOptions containing a cacheKey and the desired cache settings.
- question: What happens when a cached value is found?
  answer: The cached value is returned and the query handler is not executed.
- question: What happens when the cache does not contain the value?
  answer: Xeno.JS executes the query and caches the successful result.
- question: Can I bypass the cache for a query?
  answer: Yes. Set bypassCache to true or consistentRead to true.
- question: Are failed query results cached?
  answer: No. Only successful query results are stored.
- question: What happens if the cache is unavailable?
  answer: Xeno.JS logs a warning and continues query execution without failing the query because of the cache error.

---

## Introduction

Use the Caching Pipeline to cache the results of **Queries** in Xeno.JS.

The built-in caching behavior:

1. checks whether the query has cache options;
2. checks the cache when caching is not bypassed;
3. returns the cached value when one is available;
4. executes the query when there is no cached value;
5. stores successful query results using the configured TTL.

The Caching Pipeline is part of the **Query pipeline**. It is not added to the Command pipeline.

If you first need to create a Query, see [Create a Query](../cqrs/query).

## Before you start

You need:

* an `AppBuilder` instance;
* a configured cache;
* a Query;
* a Query Handler;
* the Query executed through the Xeno.JS mediator.

The cache can use the built-in in-memory implementation or Redis.

For the complete Query creation workflow, including how to extend `Query` and define its parameters, see [Create a Query](../cqrs/query).

## Enable the cache

Configure the cache through `AppBuilder.addCache()`.

For example, to use the built-in in-memory cache:

```ts
const app = new AppBuilder()
  .addCache()
  .build()
```

The default `AppBuilder` cache configuration uses the in-memory cache.

You can also explicitly configure it:

```ts
const app = new AppBuilder()
  .addCache((config) => {
    config.inMemory = true
    config.redis = undefined
  })
  .build()
```

If you want to use Redis instead, configure the Redis connection:

```ts
const app = new AppBuilder()
  .addCache((config) => {
    config.inMemory = false
    config.redis = {
      host: 'localhost',
      port: 6379,
      username: undefined,
      password: undefined,
      tls: false,
      maxRetriesPerRequest: undefined,
    }
  })
  .build()
```

At least one cache strategy must be configured.

## Enable query caching

After configuring the cache, enable the Query pipeline through `addPipeline()`:

```ts
const app = new AppBuilder()
  .addCache()
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })
  .build()
```

This configuration enables the query-specific caching behavior.

The two configuration steps have different responsibilities:

* `addCache()` configures the cache implementation;
* `addPipeline()` with `queryBus.isEnabled = true` enables the Query pipeline behavior.

Both are required when using the built-in query caching pipeline.

## Create a cacheable Query

The caching pipeline reads caching information from the Query's `cacheOptions`.

A Query can be created like this:

```ts
import { Query } from '@xeno-js/shared'

export class GetUserQuery extends Query<User> {
  constructor(
    public readonly userId: string,
  ) {
    super('GetUserQuery', {
      cacheKey: `user:${userId}`,
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: false,
    })
  }
}
```

The Query itself is covered in detail in [Create a Query](../cqrs/query).

That page should be your starting point when you need to:

* create a Query class;
* define Query parameters;
* create a Query Handler;
* connect the Query to its handler;
* add validation to the Query.

This page focuses only on the caching options used by the Query.

## Configure the cache key

Use `cacheKey` to identify the cached result.

For example:

```ts
super('GetUserQuery', {
  cacheKey: `user:${userId}`,
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: false,
})
```

The cache key should represent the input that determines the query result.

For example, a Query that retrieves a user by ID can use:

```ts
cacheKey: `user:${userId}`
```

A Query that retrieves a paginated list should include the parameters that affect the result:

```ts
cacheKey: `users:${page}:${pageSize}`
```

If the `cacheKey` is empty or missing, the caching behavior is skipped and the Query executes normally.

## Configure the TTL

Use `ttl` to specify the lifetime of the cached result:

```ts
cacheOptions: {
  cacheKey: `user:${userId}`,
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: false,
}
```

The value is passed to the configured cache when the successful Query result is stored.

Choose a TTL according to how long the cached result can safely remain available for your application.

## Use user-scoped caching

Set `isUserScoped` to `true` when the cached result must be isolated per user:

```ts
super('GetCurrentUserQuery', {
  cacheKey: 'current-user',
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: true,
})
```

This is useful for Queries whose result depends on the current authenticated user.

For example:

```ts
export class GetCurrentUserQuery extends Query<User> {
  constructor() {
    super('GetCurrentUserQuery', {
      cacheKey: 'current-user',
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: true,
    })
  }
}
```

Use user-scoped caching when the same logical Query can return different data for different users.

## Bypass the cache

Set `bypassCache` to `true` when you want to skip reading an existing cached value:

```ts
super('GetUserQuery', {
  cacheKey: `user:${userId}`,
  ttl: 60,
  bypassCache: true,
  consistentRead: false,
  isUserScoped: false,
})
```

When `bypassCache` is enabled:

1. Xeno.JS does not read the cached value;
2. the Query executes normally;
3. if the Query succeeds, its result is still stored in the cache.

For example:

```text
Query
  │
  ▼
bypassCache = true
  │
  ├── skip cache read
  │
  ▼
Query Handler
  │
  ▼
successful result
  │
  ▼
store result in cache
```

If you want to force a fresh read while still allowing the successful result to refresh the cache, this behavior can be useful.

## Use consistent reads

Set `consistentRead` to `true` when the Query should skip the cached value and execute against the normal Query path:

```ts
super('GetUserQuery', {
  cacheKey: `user:${userId}`,
  ttl: 60,
  bypassCache: false,
  consistentRead: true,
  isUserScoped: false,
})
```

When `consistentRead` is `true`, Xeno.JS skips the cache read.

As with `bypassCache`, a successful result is still written to the cache.

Therefore:

```text
consistentRead = true
        │
        ▼
   skip cache read
        │
        ▼
   execute Query
        │
        ▼
   successful result
        │
        ▼
   update cache
```

## What happens on a cache hit?

When caching is enabled and a cached value exists for the Query's cache key, Xeno.JS returns that value immediately.

The Query Handler is not executed.

For example:

```text
Query
  │
  ▼
Cache lookup
  │
  ├── HIT ──► return cached result
  │
  └── MISS
        │
        ▼
   Query Handler
```

This means the handler is not called again when a valid cached result is available.

## What happens on a cache miss?

When there is no cached value, Xeno.JS executes the Query normally.

If the Query succeeds, the result is stored in the cache using the configured `cacheKey` and `ttl`.

For example:

```text
Query
  │
  ▼
Cache lookup
  │
  └── MISS
       │
       ▼
  Query Handler
       │
       ▼
  successful result
       │
       ▼
  store in cache
       │
       ▼
  return result
```

The same Query can then use the cached result on subsequent executions.

## Are failed Query results cached?

No.

The caching pipeline stores the result only when the Query returns a successful `Result`.

If the Query fails:

```ts
return Result.fail(error)
```

the result is returned to the caller but is not written to the cache.

This prevents a failed execution from becoming the cached response for subsequent requests.

## What happens when the cache read fails?

A cache read failure does not fail the Query.

For example, if the cache service is temporarily unavailable:

```text
Query
  │
  ▼
Cache read
  │
  └── error
       │
       ▼
   log warning
       │
       ▼
   execute Query
```

Xeno.JS logs a warning and continues with normal Query execution.

This allows the application to continue serving the Query even when the cache is unavailable.

## What happens when the cache write fails?

A cache write failure also does not fail an otherwise successful Query.

The Query result is returned normally and Xeno.JS logs a warning about the cache error.

For example:

```text
Query Handler
     │
     ▼
successful result
     │
     ├── cache write succeeds ──► return result
     │
     └── cache write fails
              │
              ▼
          log warning
              │
              ▼
          return result
```

The cache is therefore an optimization for Query execution rather than a requirement for returning a successful Query result.

## Complete example

The following example shows the relevant application configuration and a cacheable Query.

### Application configuration

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()
  .addCache()
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })
  .build()
```

### Query

```ts
import { Query } from '@xeno-js/shared'

export class GetUserQuery extends Query<User> {
  constructor(
    public readonly userId: string,
  ) {
    super('GetUserQuery', {
      cacheKey: `user:${userId}`,
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: false,
    })
  }
}
```

### Execute the Query

Execute the Query through the mediator as you normally would:

```ts
const result = await mediator.query(
  new GetUserQuery(userId),
  signal,
)
```

The first successful execution populates the cache.

Subsequent executions using the same cache key can return the cached result without executing the Query Handler.

For the complete Query implementation and Handler registration workflow, see [Create a Query](../cqrs/query) and [Create a Query Handler](../cqrs/handler).

## Troubleshooting

### Query caching is not running

Check:

1. `addCache()` is configured;
2. a cache strategy is available;
3. `config.queryBus.isEnabled = true`;
4. the Query defines a non-empty `cacheKey`;
5. the Query is executed through the Xeno.JS mediator.

For example:

```ts
const app = new AppBuilder()
  .addCache()
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })
  .build()
```

### The Query Handler still runs every time

Check:

1. the Query has a `cacheKey`;
2. the cache key is stable for the same Query parameters;
3. `bypassCache` is not `true`;
4. `consistentRead` is not `true`;
5. the configured TTL has not expired.

Also make sure that the cache key includes every parameter that can change the Query result.

### Different users receive the same cached result

If the Query result depends on the current user, use:

```ts
isUserScoped: true
```

For example:

```ts
super('GetCurrentUserQuery', {
  cacheKey: 'current-user',
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: true,
})
```

### The application fails while enabling query caching

Make sure a cache implementation has been configured.

For example:

```ts
const app = new AppBuilder()
  .addCache()
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })
  .build()
```

A cache strategy must be available before the Query caching pipeline can be configured.

### Cache errors appear in the logs

Cache read and write failures are logged as warnings.

The Query itself should continue executing when a cache operation fails.

Check the cache configuration if these warnings persist, especially when using Redis.

## Related documentation

* [Application Overview](../overview)
* [Create a Query](../cqrs/query)
* [Create a Query Handler](../cqrs/handler)
* [Enable Validation](./validation)
* [Enable Performance Tracking](./performance)
* [Configure Idempotency](./idempotency)
* [Configure Concurrency](./concurrency)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
