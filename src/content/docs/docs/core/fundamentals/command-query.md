---
title: 'CQRS Primitives: Command and Query Pipeline Architecture'
description:
  'Learn how Xeno.JS Command and Query base classes define CQRS requests, assign
  request types, configure query caching, and integrate with mediator
  pipelines.'
keywords:
  [
    'CQRS',
    'ICommand',
    'IQuery',
    'Command base class',
    'Query base class',
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

A Command in Xeno.JS is a CQRS request that represents an operation which can
change application state. The abstract `Command<TResponse>` base class already
implements `ICommand<TResponse>` and assigns `REQUEST_TYPE.COMMAND` to the
request. A concrete Command therefore supplies its intent and its own payload
properties without redeclaring the request type.

Commands represent write operations within the system (e.g., creating a record,
updating fields, or deleting data structures). They are imperative data
envelopes named with present-tense actions that reflect business operations. The
response type is selected through the `Command<TResponse>` generic and is
handled by the corresponding Handler.

### Common Command Attributes

- **intent** — A string identifying the purpose of the Command and matching the
  handler registration used by the application.

- **type** — Assigned by the `Command` base class as
  `REQUEST_TYPE.COMMAND`. Concrete Commands do not need to assign it.

- **custom properties** — Application-specific readonly values that carry the
  Command payload. Xeno.JS does not require a `props` property in the base class.

### Programmatic Definition of a Command Contract

To author a state-mutating Command, extend `Command<TResponse>` and declare the
payload properties required by the application:

```typescript
// src/application/user/commands/create-user.command.ts
import { Command } from '@xeno-js/core'
import type { UserProps } from '../../../domain/entities/user'

export class CreateUserCommand extends Command<void> {
  public readonly props: UserProps

  constructor(props: UserProps) {
    super('CREATE_USER_COMMAND_HANDLER_TOKEN')
    this.props = props
  }
}
```

---

## Executing Read Operations and Caching Configurations with Queries

A Query in Xeno.JS represents a read operation tailored for data retrieval. The
abstract `BaseQuery<TResponse>` base class already implements `IQuery<TResponse>` and
assigns `REQUEST_TYPE.QUERY`. Its constructor requires the Query intent and
`ICacheableOptions`, so concrete Queries only need to provide those common
values and any application-specific payload properties.

Queries isolate data-fetching paths from state-changing Commands. Each Query
must provide an explicit `ICacheableOptions` value, allowing the query pipeline
to apply the configured cache behavior when query caching is enabled. The base
class does not perform the cache lookup itself.

### Key-Value Specification of ICacheableOptions Attributes

- **cacheKey** — A unique string identifier incorporating input parameters used
  to safely isolate cached data across keyspaces.

- **ttl** — An optional number specifying the cache entry's time-to-live in
  seconds before expiration triggers a database re-fetch.

- **bypassCache** — A boolean flag forcing the framework to ignore existing
  cached items and query primary data sources directly.

- **consistentRead** — A boolean directing the query bus to bypass secondary
  cache replicas when strict data freshness is required.

### Programmatic Definition of a Query

```typescript
// src/application/user/queries/get-user-by-id.query.ts
import { BaseQuery } from '@xeno-js/core'
import type { User } from '../../../domain/entities/user'

export class GetUserByIdQuery extends BaseQuery<User> {
  public readonly userId: string

  constructor(userId: string) {
    super('GET_USER_QUERY_HANDLER_TOKEN', {
      cacheKey: `GET_USER_QUERY_HANDLER_TOKEN:${userId}`,
      ttl: 60, // Cache lifecycle lifespan of 60 seconds
      bypassCache: false,
      consistentRead: false,
    })
    this.userId = userId
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
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

export const appHost = new AppBuilder<AppRegistry>()
  .addContext()
  .addPipeline((opts) => {
    opts.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 60,
    }

    opts.commandBus.concurrency = {
      maxRetries: 3,
      delayConfig: {
        baseDelayMs: 100,
        maxJitterMs: 500,
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
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

export const appHost = new AppBuilder<AppRegistry>()
  .addContext()
  .addPipeline((opts) => {
    opts.queryBus.isEnabled = true
  })
  .addCache((opts, config) => {
    opts.inMemory = false
    opts.redis = {
      host: config.getOrThrow('REDIS_HOST'),
      port: 6379,
      maxRetriesPerRequest: 3,
    }
  })
```

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
