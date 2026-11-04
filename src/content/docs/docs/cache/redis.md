---
title: Redis Cache
description: Learn how to configure and use Redis as the cache backend in Xeno.JS.
keywords:
- Xeno.JS
- Redis
- Redis cache
- cache
- XenoAppBuilder
- TOKENS.CACHE
tags:
- cache
- redis
- caching
- infrastructure
- typescript
faqs:
- question: How do I configure Redis as the Xeno.JS cache?
  answer: Pass the withRedis plugin to app.addCache(). The plugin enables Redis by default and can be configured through its setup callback.
- question: Which Redis client does Xeno.JS use?
  answer: The Redis client cannot be verified from the plugin configuration shown here.
- question: Which Redis options can I configure?
  answer: The withRedis setup callback receives Redis configuration that includes host, port, and an options object with username and password. Other Redis options are not established by this configuration.
- question: How do I resolve the Redis cache?
  answer: Resolve TOKENS.CACHE after app.build(); it returns the configured Redis-backed cache through the common cache API.
- question: Do I need to use the Redis client directly?
  answer: No. Application code should resolve TOKENS.CACHE and use the Xeno.JS cache API.

---

## Introduction

Xeno.JS can use Redis as the application's cache backend through the `withRedis` cache plugin.

Pass the plugin to `XenoAppBuilder.addCache()`. The plugin supplies a Redis cache provider to the cache module.

## Install Redis Support

Install the Redis integration package:

```bash
npm install @xeno-js/redis
```

## Configure Redis

Pass `withRedis` to `addCache()`. Its setup callback receives Redis configuration; the plugin defaults to enabled, with host `localhost` and port `6379`.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withRedis } from '@xeno-js/redis'

const app = new XenoAppBuilder()

app.addCache(withRedis((options, config) => {
  options.host = config.get('REDIS_HOST') ?? 'localhost'
  options.port = config.getNumber('REDIS_PORT') ?? 6379
  options.options = {
    username: config.get('REDIS_USERNAME'),
    password: config.get('REDIS_PASSWORD'),
  }
}))
```

The Redis configuration fields shown by the plugin are:

| Field       | Description                                                            |
| ----------- | ---------------------------------------------------------------------- |
| `isEnabled` | Enables the Redis provider when `true`; defaults to `true`.            |
| `host`      | Redis server hostname; defaults to `localhost`.                        |
| `port`      | Redis server port; defaults to `6379`.                                 |
| `options`   | Options object initialized with `username` and `password` from configuration.                   |

## Using Environment Variables

A typical configuration can be kept entirely in environment variables:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
```

Then configure the application:

```ts
import { withRedis } from '@xeno-js/redis'

app.addCache(withRedis((options, config) => {
  options.host = config.get('REDIS_HOST') ?? 'localhost'
  options.port = config.getNumber('REDIS_PORT') ?? 6379
  options.options = {
    username: config.get('REDIS_USERNAME'),
    password: config.get('REDIS_PASSWORD'),
  }
}))
```

## Resolve the Redis Cache

The application does not resolve Redis directly.

Resolve the common Xeno.JS cache token:

```ts
import { XenoAppBuilder, TOKENS } from '@xeno-js/core'
import { withRedis } from '@xeno-js/redis'

const app = new XenoAppBuilder()

app.addCache(withRedis(() => {}))

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
import { XenoAppBuilder, TOKENS } from '@xeno-js/core'
import { withRedis } from '@xeno-js/redis'

const app = new XenoAppBuilder()

app.addCache(withRedis((options, config) => {
  options.host = config.get('REDIS_HOST') ?? 'localhost'
  options.port = config.getNumber('REDIS_PORT') ?? 6379
  options.options = {
    username: config.get('REDIS_USERNAME'),
    password: config.get('REDIS_PASSWORD'),
  }
}))

await app.build()

const cache = app.resolve(TOKENS.CACHE)

await cache.set('example', { value: 'hello' }, 60)

const value = await cache.get<{ value: string }>('example')

console.log(value)
```

## Troubleshooting

### Redis Is Not Being Used

Pass the Redis cache plugin to `addCache()`:

```ts
app.addCache(withRedis(() => {}))
```

The plugin selects its Redis provider by default. Set `isEnabled` to `false` in its setup callback to use the in-memory cache instead.

### Redis Connection Fails

Check:

- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_USERNAME`
- `REDIS_PASSWORD`
- Redis availability

### The Cache Is Not Registered

If the cache module receives neither an enabled in-memory configuration nor a cache provider, its configuration fails.

## Related Documentation

- [Cache Overview](./overview)
- [Dependency Injection Resolution](../dependency-injection/resolution)
- [Caching Pipeline](../application/pipelines/caching)
- [Idempotency](../application/pipelines/idempotency)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
