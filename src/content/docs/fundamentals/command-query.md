---
title: 'CQRS Primitives: Command and Query Pipeline Architecture'
description:
  'Comprehensive guide to Command and Query architectural primitives in Xeno.
  Learn how to implement ICommand, configure IQuery caching, and customize
  mediator pipelines.'
keywords:
  [
    'CQRS',
    'ICommand',
    'IQuery',
    'Mediator',
    'Pipeline Behavior',
    'Query Caching',
    'Idempotency Pipeline',
    'Concurrency Retry',
    'Xeno',
  ]
author: 'Xeno'
---

## Command and Query Primitives in CQRS Architectures

Shifting from monolithic architectures to Command-Query Responsibility
Segregation (CQRS) separates data modifications from read operations. Xeno
provides strongly-typed messages and pipeline behaviors that decouple
application intents from underlying infrastructure configurations.

---

## Understanding the Command Primitive and State Mutation

A Command in Xeno is a cross-layer messaging primitive designed to encapsulate
user intentions that mutate system state. Implementing the `ICommand` interface
ensures compile-time type safety, routing payloads through the mediator bus to
execute state-changing domain logic without return-value overhead.

Commands represent write operations within the system (e.g., creating a record,
updating fields, or deleting data structures). They are imperative data
envelopes named with present-tense actions that reflect business events. Within
Xeno, commands avoid returning rich domain objects; instead, they generally
return a functional `Result<void>` or metadata identifiers, reinforcing the
principle that write operations are distinct from data queries.

### Key-Value Specification of ICommand Attributes

- **intent** — A distinct, string-based injection token matching the unique
  command handler registered in the dependency injection container.

- **type** — An explicit discriminator set to `REQUEST_TYPE.COMMAND` to guide
  routing decisions across cross-cutting behaviors.

- **props** — An immutable, strongly-typed structural data transfer object
  encapsulating the operational payload parameters.

### Programmatic Definition of a Command Contract

To author a state-mutating command, construct a concrete class that adheres to
the `ICommand<TResponse>` contract:

```typescript
// src/application/user/commands/create-user.command.ts
import { type ICommand, REQUEST_TYPE } from '@xeno/core'
import type { UserProps } from '../../../domain/entities/user'

export class CreateUserCommand implements ICommand<void> {
  // Binds the contract to its matching infrastructure handler token
  public readonly intent = 'CREATE_USER_COMMAND_HANDLER_TOKEN'
  public readonly type = REQUEST_TYPE.COMMAND

  constructor(public readonly props: UserProps) {}
}
```

---

## Executing Read Operations and Caching Configurations with Queries

A Query in Xeno represents an idempotent read-only operation tailored for data
retrieval. Leveraging the `IQuery` interface provides native binding to
`ICacheableOptions`, enabling automated result caching, time-to-live expiration
constraints, and cache-bypass controls to optimize data fetching efficiency
across infrastructure boundaries.

Queries isolate data fetching paths from domain state modifications. Because
read operations lack side effects, they bypass write-heavy locks and
transactional blocks. Xeno requires every query instance to supply an explicit
caching policy via `ICacheableOptions`, allowing the mediator to route identical
queries straight to fast in-memory or distributed cache blocks without touching
database layers.

### Key-Value Specification of ICacheableOptions Attributes

- **cacheKey** — A unique string identifier incorporating input parameters used
  to safely isolate cached data across keyspaces.

- **ttl** — An optional number specifying the cache entry's time-to-live in
  seconds before expiration triggers a database re-fetch.

- **bypassCache** — A boolean flag forcing the framework to ignore existing
  cached items and query primary data sources directly.

- **consistentRead** — A boolean directing the query bus to bypass secondary
  cache replicas when strict data freshness is required.

### Programmatic Definition of a Query Contract

```typescript
// src/application/user/queries/get-user-by-id.query.ts
import { type IQuery, type ICacheableOptions, REQUEST_TYPE } from '@xeno/core'
import type { User } from '../../../domain/entities/user'

export class GetUserByIdQuery implements IQuery<User> {
  // Binds the contract to its matching infrastructure handler token
  public readonly intent = 'GET_USER_QUERY_HANDLER_TOKEN'
  public readonly type = REQUEST_TYPE.QUERY
  public readonly cacheOptions: ICacheableOptions

  constructor(public readonly userId: string) {
    this.cacheOptions = {
      cacheKey: `${this.intent}:${userId}`,
      ttl: 60, // Cache lifecycle lifespan of 60 seconds
      bypassCache: false,
      consistentRead: false,
    }
  }
}
```

---

## Configuring and Registering the Cross-Cutting Command Pipeline

The command middleware execution stack is configured programmatically via the
`addPipeline` method inside the `AppBuilder` assembly loop. This pipeline
orchestrates complex distributed behaviors, including SaaS-aligned idempotency
keyspaces and exponential backoff concurrency controls, validating invariants
prior to committing changes to the transactional data store.

When developers call `.addPipeline()`, the `AppBuilder` automatically mounts
three core behavioral pipelines to **both** the command and query channels by
default:

- **Exception Pipeline** — Catches unhandled runtime errors across handler
  streams, mapping anomalies to deterministic error returns.

- **Logging Pipeline** — Records inbound telemetry, payload footprints, and
  diagnostic metrics across boundaries.

- **Performance Pipeline** — Tracks handler execution speeds, triggering logging
  alerts if processing times cross specific millisecond thresholds.

Beyond these defaults, you can programmatically register advanced distributed
safety layers targeting write-specific commands.

### Registering Idempotency and Concurrency Controls

```typescript
// src/infrastructure/bootstrap.ts
import { AppBuilder, LOG_LEVEL } from '@xeno/core'
import type { AppRegistry } from './registry'

export const appHost = new AppBuilder<AppRegistry>()
  .addContext()
  .addPipeline((opts) => {
    // 1. Configure fine-grained authorization constraints
    opts.authorization.userId = true
    opts.authorization.tenantId = true

    // 2. Configure Command-specific Idempotency protection layers
    opts.commandBus.idempotency = {
      lockTtlSeconds: 30, // Maximum lock retention during processing
      processedTtlSeconds: 60, // Payload storage lifespan for deduplication
    }

    // 3. Configure Command-specific Concurrency Retry limits
    opts.commandBus.concurrency = {
      maxRetries: 3,
      delayConfig: {
        baseDelayMs: 100,
        maxJitterMs: 500, // Mitigates thundering herd syndrome
      },
    }
  })
```

---

## Establishing Performance and Cache Routing for the Query Pipeline

The query pipeline governs the read-optimized middleware stack within the Xeno
ecosystem, enabled through the declarative `addPipeline` bootstrap interface. It
resolves highly-performant data fetching by mounting the query caching layer
directly behind the mediator bus, reducing computational strain on core database
engines.

The query channel inherits the same standard baseline behavior modules
(`exception`, `logging`, and `performance`) as the command track. However,
instead of mounting write-heavy mutations like transaction locks or
deduplication trackers, the query pipeline emphasizes performance-focused
caching behaviors.

### Activating Cache Optimization on the Query Bus

To activate query cache resolution, toggle the `queryBus.isEnabled`
configuration flag inside the pipeline definition block. This tells the mediator
engine to evaluate incoming cache configurations (`ICacheableOptions`) before
invoking the matching application read handler.

```typescript
// src/infrastructure/bootstrap-queries.ts
import { AppBuilder } from '@xeno/core'
import type { AppRegistry } from './registry'

export const appHost = new AppBuilder<AppRegistry>()
  .addContext()
  .addPipeline((opts) => {
    // Standard default pipelines (Exception, Logging, Performance) mount automatically here

    // Activate the Query Caching engine pipeline behavior explicitly
    opts.queryBus.isEnabled = true
  })
  .addCache((opts, config) => {
    // Configure backing caching providers (e.g., Redis or local In-Memory stores)
    opts.inMemory = false
    opts.redis = {
      host: config.getOrThrow('REDIS_HOST'),
      port: 6379,
      maxRetriesPerRequest: 3,
    }
  })
```
