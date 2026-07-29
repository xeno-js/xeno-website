---
title: 'InMemoryCache Driver: Process-Local Caching Architecture'
description:
  'Technical guide to using InMemoryCache in Xeno, covering process-local
  storage mechanics, TTL expiration handling, AppBuilder registration, and
  ICache dependency resolution.'
keywords:
  [
    'InMemoryCache',
    'ICache',
    'Process-Local Caching',
    'AppBuilder Caching',
    'TOKENS.CACHE',
    'Xeno Caching',
  ]
author: 'Xeno'
---

## InMemoryCache Driver: Process-Local Caching Architecture

For single-instance applications, unit testing environments, or low-latency
local lookup scenarios, external distributed caching stores introduce
unnecessary infrastructure complexity and network hop overhead. Xeno addresses
this by providing `InMemoryCache`, a process-local implementation of the
framework's standard `ICache` contract.

---

## Understanding How InMemoryCache Works

The `InMemoryCache` driver operates directly within Node.js process memory to
provide fast key-value storage without external daemon dependencies. It
implements the agnostic `ICache` contract and supports custom Time-To-Live (TTL)
expiration handling for stored key-value pairs.

Unlike distributed cache adapters (such as `RedisCache`), `InMemoryCache` stores
data in memory heap structures local to the active Node.js execution process.
Stored entries are tagged with expiration timestamps when a TTL is provided.
During access or write operations, expired entries are cleaned up to prevent
memory leakage.

### Key Operational Characteristics

- **Zero External Dependencies** — Requires no running background
  infrastructure, database servers, or network sockets.

- **Ultra-Low Latency Access** — Eliminates network serialization and round-trip
  transport times by reading directly from process memory.
- **Process Lifetime Scope** — Cache state is bound strictly to the application
  process lifecycle. Restarting or scaling across multiple Node.js instances
  creates isolated, non-shared memory pools.
- **Standardized ICache Compliance** — Fully satisfies the framework's `ICache`
  interface, allowing application services to switch between `InMemoryCache` and
  `RedisCache` without changing domain code.

---

## Registering InMemoryCache in the Bootstrap Cycle

Registering `InMemoryCache` relies on the AppBuilder bootstrapping interface.
Under the hood, `CacheUtils.addCache` instantiates `InMemoryCache` and binds it
as a singleton service under `TOKENS.CACHE` inside the dependency injection
container.

During application startup, `CacheUtils.addCache` checks the pipeline
configuration options. If `opts.inMemory` is set to `true` or if no Redis
configuration is supplied, `InMemoryCache` is imported and registered as a
singleton under `TOKENS.CACHE`.

### Programmatic Bootstrap Configuration Example

```typescript
// src/infrastructure/bootstrap-inmemory-cache.ts
import { AppBuilder, TOKENS } from '@xeno/core'
import type { AppRegistry } from './infrastructure/app-registry'

export const configureInMemoryCaching = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder.addContext().addPipeline((options) => {
    // 1. Enable Query Caching on the Query Bus
    options.queryBus.isEnabled = true

    // 2. Configure Idempotency Locks using InMemoryCache
    options.commandBus.idempotency = {
      lockTtlSeconds: 60,
      processedTtlSeconds: 3600,
    }
  })

  return await builder.build()
}
```

---

## Resolving and Utilizing InMemoryCache

Application services resolve `InMemoryCache` by pulling `TOKENS.CACHE` from the
service container. Services receive the interface `ICache`, ensuring loose
coupling and complete type safety.

### Key-Value Specification of Exposed Methods

- **get`<T>`(key)** — Resolves a cached entry by key, returning
  `Promise<Optional<T>>`. Returns `undefined` if the key is missing or expired.

- **set`<T>`(key, value, ttlSeconds?)** — Stores an entry with an optional TTL
  expiration window in seconds.

- **setIfAbsent`<T>`(key, value, ttlSeconds?)** — Atomically sets the key only
  if it does not already exist (or has expired), returning `true` if saved or
  `false` if occupied.

- **has(key)** — Asynchronously returns `true` if a non-expired entry exists for
  the given key.

- **remove(key)** — Immediately evicts the target key from process memory.

### Programmatic Usage Example in an Application Service

```typescript
// src/application/services/user-preference.service.ts
import type { ICache } from '@xeno/core'

export class UserPreferenceService {
  constructor(private readonly _cache: ICache) {}

  public async getUserPreferences(
    userId: string,
  ): Promise<Record<string, unknown>> {
    const cacheKey = `user:prefs:${userId}`

    // 1. Query process memory for cached preferences
    const cachedPrefs = await this._cache.get<Record<string, unknown>>(cacheKey)
    if (cachedPrefs) {
      return cachedPrefs
    }

    // 2. Fallback to default state on cache miss
    const defaultPrefs = { theme: 'dark', notifications: true }

    // 3. Store preferences in InMemoryCache with a 10-minute (600s) TTL
    await this._cache.set(cacheKey, defaultPrefs, 600)

    return defaultPrefs
  }

  public async invalidateUserPreferences(userId: string): Promise<void> {
    const cacheKey = `user:prefs:${userId}`
    // Evict entry from local memory
    await this._cache.remove(cacheKey)
  }
}
```

### Dependency Injection Registration Example

To wire your application service into the container, resolve `TOKENS.CACHE`
during host assembly:

```typescript
// src/infrastructure/bootstrap-services.ts
import { AppBuilder, TOKENS } from '@xeno/core'
import { UserPreferenceService } from '../application/services/user-preference.service'
import type { AppRegistry } from './infrastructure/app-registry'

export const configureServices = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder
    .addContext()
    .addCache()
    .addServices((services) => {
      services.addScoped('USER_PREFERENCE_SERVICE', (container) => {
        // Resolve the global InMemoryCache instance bound to TOKENS.CACHE
        const cache = container.resolve(TOKENS.CACHE)
        return new UserPreferenceService(cache)
      })
    })

  return await builder.build()
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
