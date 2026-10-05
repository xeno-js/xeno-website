---
title: Redis Cache
description: Learn how to configure and use Redis as the cache backend in Xeno.JS.
keywords:
- Xeno.JS
- Redis
- Redis cache
- ioredis
- cache
- AppBuilder
- TOKENS.CACHE
tags:
- cache
- redis
- caching
- infrastructure
- typescript
faqs:
- question: How do I configure Redis as the Xeno.JS cache?
  answer: Disable the in-memory cache and provide the Redis connection options through app.addCache().
- question: Which Redis client does Xeno.JS use?
  answer: Xeno.JS uses ioredis for its Redis cache implementation.
- question: Which Redis options can I configure?
  answer: Xeno.JS exposes host, port, password, username, TLS, and maxRetriesPerRequest through the Redis cache configuration.
- question: How do I resolve the Redis cache?
  answer: Resolve TOKENS.CACHE after app.build(); it returns the configured Redis-backed cache through the common cache API.
- question: Do I need to use the Redis client directly?
  answer: No. Application code should resolve TOKENS.CACHE and use the Xeno.JS cache API.

---

## Introduction

Xeno.JS can use Redis as the application's cache backend.

The Redis integration is configured through `AppBuilder.addCache()` and uses `ioredis`.

## Install Redis Support

Install the Redis client dependency:

```bash
npm install ioredis
```

## Configure Redis

Disable the in-memory cache and provide the Redis configuration:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addCache((options, config) => {
  options.inMemory = false

  options.redis = {
    host: config.get('REDIS_HOST', 'localhost'),
    port: config.getNumber('REDIS_PORT', 6379),
    password: config.getOrThrow('REDIS_PASSWORD'),
    username: config.getOrThrow('REDIS_USERNAME'),
    tls: config.get('REDIS_TLS') === 'true',
    maxRetriesPerRequest: getNumber('REDIS_MAX_RETRIES', 3),
  }
})
```

The relevant Redis options are:

| Option                 | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `host`                 | Redis server hostname. Defaults to `localhost`.                 |
| `port`                 | Redis server port. Defaults to `6379`.                          |
| `password`             | Optional Redis password.                                        |
| `username`             | Optional Redis username.                                        |
| `tls`                  | Enables TLS when `true`.                                        |
| `maxRetriesPerRequest` | Maximum number of retries for a Redis request. Defaults to `3`. |

## Using Environment Variables

A typical configuration can be kept entirely in environment variables:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_TLS=false
REDIS_MAX_RETRIES=3
```

Then configure the application:

```ts
app.addCache((options. config) => {
  options.inMemory = false

  options.redis = {
    host: config.get('REDIS_HOST', 'localhost'),
    port: config.getNumber('REDIS_PORT', 6379),
    password: config.getOrThrow('REDIS_PASSWORD'),
    username: config.getOrThrow('REDIS_USERNAME'),
    tls: config.get('REDIS_TLS') === 'true',
    maxRetriesPerRequest: getNumber('REDIS_MAX_RETRIES', 3),
  }
})
```

## Resolve the Redis Cache

The application does not resolve Redis directly.

Resolve the common Xeno.JS cache token:

```ts
import { AppBuilder, TOKENS } from '@xeno-js/core'

const app = new AppBuilder()

app.addCache((options) => {
  options.inMemory = false

  options.redis = {
    host: 'localhost',
    port: 6379,
  }
})

await app.build()

const cache = app.resolve(TOKENS.CACHE)
```

`TOKENS.CACHE` returns the configured Redis-backed cache.

Your application therefore remains independent from the Redis client:

```ts
await cache.set('user:123', { id: '123' }, 60)

const user = await cache.get<{ id: string }>('user:123')
```

## Redis Cache Operations

The Redis-backed cache supports the same cache API described in the [Cache Overview](./overview):

```ts
await cache.set('key', value, 60)

const value = await cache.get<MyValue>('key')

await cache.remove('key')

const exists = await cache.has('key')

await cache.clear()
```

It also supports atomic operations used by Xeno.JS features:

```ts
await cache.setIfAbsent('lock:key', true, 30)

await cache.increment('counter', 60)
```

## Complete Example

```ts
import { AppBuilder, TOKENS } from '@xeno-js/core'

const app = new AppBuilder()

app.addCache((options, config) => {
  options.inMemory = false

  options.redis = {
    host: config.get('REDIS_HOST', 'localhost'),
    port: config.getNumber('REDIS_PORT', 6379),
    password: config.getOrThrow('REDIS_PASSWORD'),
    username: config.getOrThrow('REDIS_USERNAME'),
    tls: config.get('REDIS_TLS') === 'true',
    maxRetriesPerRequest: getNumber('REDIS_MAX_RETRIES', 3),
  }
})

await app.build()

const cache = app.resolve(TOKENS.CACHE)

await cache.set('example', { value: 'hello' }, 60)

const value = await cache.get<{ value: string }>('example')

console.log(value)
```

## Troubleshooting

### Redis Is Not Being Used

Make sure the in-memory cache is disabled:

```ts
options.inMemory = false
```

and that `options.redis` is configured.

### Redis Connection Fails

Check:

* `REDIS_HOST`
* `REDIS_PORT`
* `REDIS_USERNAME`
* `REDIS_PASSWORD`
* `REDIS_TLS`
* Redis availability

### The Cache Is Not Registered

If both `inMemory` and `redis` are disabled or undefined, Xeno.JS cannot configure a cache and application startup fails.

## Related Documentation

* [Cache Overview](./overview)
* [Dependency Injection Resolution](../dependency-injection/resolution)
* [Caching Pipeline](../application/pipelines/caching)
* [Idempotency](../application/pipelines/idempotency)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
