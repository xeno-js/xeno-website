---
title: Creating Queries
description: Learn how to create, validate, cache, register, and execute queries in Xeno.JS.
keywords:
- Xeno.JS queries
- TypeScript CQRS
- Xeno.JS CQRS
- Query class
- query validation
- query caching
- query handlers
- mediator query
tags:
- application
- cqrs
- query
- caching
- validation
faqs:
- question: How do I create a Query in Xeno.JS?
  answer: Extend the Query class, define the query parameters, provide cache options, and connect the query to a handler.
- question: How do I execute a Query?
  answer: Execute the query through the mediator using mediator.query(query, signal).
- question: Do Xeno.JS Queries require cache options?
  answer: Yes. The Query constructor requires an ICacheableOptions object, even when query caching is not enabled.
- question: How do I enable Query caching?
  answer: Enable the query pipeline with queryBus.isEnabled through AppBuilder.addPipeline().
- question: How do I validate a Query?
  answer: Configure validation through AppBuilder.addPipeline() and register a Zod schema using the Query intent as its key.
- question: Can I bypass the cache for a Query?
  answer: Yes. Set bypassCache or consistentRead to true in the Query cache options.
- question: Can Query results be scoped to the current user?
  answer: Yes. Set isUserScoped to true in the Query cache options.
---

## Introduction

Use a Query when your application needs to retrieve data without performing a command operation.

A Xeno.JS Query:

1. extends the `Query` base class;
2. defines the input parameters required by the use case;
3. provides cache options;
4. is associated with a handler using its `intent`;
5. can optionally be validated;
6. can optionally participate in Query caching;
7. is executed through the mediator.

## Before you start

You need:

* an `AppBuilder` instance;
* CQRS pipeline configuration through `addPipeline()`;
* a Query class;
* a Query handler;
* a service scope available when the Query is executed.

If you use validation, you also need a Zod schema or a custom validation strategy.

If you use Query caching, you must enable the Query pipeline.

## Enable CQRS

Configure the CQRS pipeline through `AppBuilder.addPipeline()`.

The minimal configuration is:

```ts
import { AppBuilder } from 'xeno'

const app = new AppBuilder()
  .addPipeline()

const container = await app.build()
```

`addPipeline()` registers the CQRS infrastructure required to execute Commands and Queries.

It also initializes the default application services used by the CQRS pipeline.

## Create a Query

Extend the `Query` class from `@xeno-js/shared`.

```ts
import { Query } from '@xeno-js/shared'

export interface User {
  id: string
  email: string
  name: string
}

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

The first argument passed to `super()` is the Query `intent`.

The intent is important because Xeno.JS uses it to identify the Query and resolve the corresponding handler.

The `Query` base class also sets the request type to `REQUEST_TYPE.QUERY`.

## Define Query parameters

Define the data required by the Query directly on the Query class.

For example:

```ts
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

Keep the Query focused on the input required by the use case.

The handler is responsible for executing the use case and returning the result.

## Configure Query caching

A Query always receives an `ICacheableOptions` object.

The available options are:

| Option           | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `cacheKey`       | Key used to identify the cached Query result.                   |
| `ttl`            | Optional cache lifetime.                                        |
| `bypassCache`    | When `true`, skips reading the cache for this request.          |
| `consistentRead` | When `true`, skips reading the cache and performs a fresh read. |
| `isUserScoped`   | When `true`, scopes the cache key to the current user.          |

For example:

```ts
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

### Choose a cache key

The cache key should identify the actual input that affects the Query result.

For example:

```ts
cacheKey: `user:${userId}`
```

For a Query with multiple parameters:

```ts
cacheKey: `users:${page}:${pageSize}:${status}`
```

Avoid using a static key when different Query parameters can produce different results.

### Set a TTL

Use `ttl` to control how long a successful Query result remains cached.

```ts
ttl: 60
```

The `ICacheableOptions` contract documents `ttl` as seconds.

If you omit `ttl`, the configured cache implementation determines the effective TTL behavior.

### Bypass the cache

Use `bypassCache` when a particular Query execution should not use an existing cached value:

```ts
bypassCache: true
```

The Query still executes normally.

If the Query succeeds, its result can still be written to the cache.

### Use a consistent read

Use `consistentRead` when the Query should perform a fresh read instead of returning an existing cached value:

```ts
consistentRead: true
```

Like `bypassCache`, this skips the cache read.

A successful result can still update the cache.

### Use user-scoped caching

Set `isUserScoped` to `true` when the Query result depends on the current user:

```ts
isUserScoped: true
```

For example:

```ts
export class GetCurrentUserProfileQuery extends Query<User> {
  constructor() {
    super('GetCurrentUserProfileQuery', {
      cacheKey: 'profile',
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: true,
    })
  }
}
```

Use user-scoped caching for data that must not be shared between users.

## Enable Query caching

Query caching is enabled through `queryBus.isEnabled`.

Configure it in `addPipeline()`:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })

const container = await app.build()
```

Once enabled, Xeno.JS adds Query caching to the Query pipeline.

You do not need to add `QueryCachingPipeline` manually.

### Configure the cache provider

`AppBuilder` provides an in-memory cache configuration by default.

You can explicitly enable the in-memory cache:

```ts
const app = new AppBuilder()
  .addCache((config) => {
    config.inMemory = true
  })
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })

await app.build()
```

A Redis configuration can also be supplied through `addCache()`:

```ts
const app = new AppBuilder()
  .addCache((config) => {
    config.inMemory = false

    config.redis = {
      // Redis configuration
    }
  })
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })

await app.build()
```

The exact Redis options depend on the configured `CacheConfig` type.

If no cache strategy is configured, the cache module cannot initialize.

## Create a Query schema

Queries can use the same validation pipeline used by Commands.

Define a Zod schema whose key matches the Query `intent`.

For the Query:

```ts
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

the validation schema can be:

```ts
import { z } from 'zod'

export const getUserQuerySchema = z.object({
  intent: z.literal('GetUserQuery'),
  type: z.literal('QUERY'),
  userId: z.string().min(1),
})
```

The schema is registered using the Query intent:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        GetUserQuery: getUserQuerySchema,
      },
    }
  })
```

See [Validation Pipeline](../pipelines/validation) for the validation configuration and behavior.

For the complete Query-specific schema workflow, keep the schema next to the Query:

```text
src/
└── application/
    └── users/
        ├── get-user.query.ts
        ├── get-user.query.schema.ts
        └── get-user.handler.ts
```

## Create the Query Handler

A Query needs a handler registered under the same `intent`.

Extend `BaseHandler` and implement `executeAsync()`:

```ts
import type { ResultType } from '@xeno-js/shared'
import { Result } from '@xeno-js/shared'

import { BaseHandler } from '@/application'
import type { User } from './user.types'
import { GetUserQuery } from './get-user.query'

export class GetUserHandler extends BaseHandler<
  GetUserQuery,
  User
> {
  protected async executeAsync(
    request: GetUserQuery,
  ): Promise<ResultType<User>> {
    const user = await this.findUser(request.userId)

    if (!user) {
      return Result.fail(
        new Error('User not found'),
      )
    }

    return Result.ok(user)
  }

  private async findUser(userId: string): Promise<User | undefined> {
    // Load the user from your application service or repository.
    return undefined
  }
}
```

For handler registration and dependency injection, see [Creating Handlers](./handler).

## Register the Query Handler

The handler registration token must exactly match the Query `intent`.

For the Query:

```ts
super('GetUserQuery', {
  cacheKey: `user:${userId}`,
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: false,
})
```

register the handler using `GetUserQuery`:

```ts
const app = new AppBuilder()
  .addServices((container) => {
    container.addTransient(
      'GetUserQuery',
      (scope) => {
        return new GetUserHandler(
          scope.resolve('USER_CONTEXT_FACTORY'),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

The string must match exactly.

```text
Query intent
    ↓
GetUserQuery
    ↓
registered handler
```

If the intent and registration token differ, Xeno.JS cannot resolve the handler.

## Execute a Query

Queries are executed through the mediator with `mediator.query()`.

```ts
const query = new GetUserQuery('user-123')

const result = await mediator.query(
  query,
  new AbortController().signal,
)
```

The result is a `ResultType<TResponse>`.

Check the result before using its value:

```ts
if (result.isOk()) {
  const user = result.getValueOrThrow()

  console.log(user)
}
```

## Complete example

A complete Query setup can look like this:

```text
src/
└── application/
    └── users/
        ├── get-user.query.ts
        ├── get-user.query.schema.ts
        ├── get-user.handler.ts
        └── user.types.ts
└── bootstrap.ts
```

### `user.types.ts`

```ts
export interface User {
  id: string
  email: string
  name: string
}
```

### `get-user.query.ts`

```ts
import { Query } from '@xeno-js/shared'

import type { User } from './user.types'

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

### `get-user.query.schema.ts`

```ts
import { z } from 'zod'

export const getUserQuerySchema = z.object({
  intent: z.literal('GetUserQuery'),
  type: z.literal('QUERY'),
  userId: z.string().min(1),
})
```

### `get-user.handler.ts`

```ts
import type { ResultType } from '@xeno-js/shared'
import { Result } from '@xeno-js/shared'

import { BaseHandler } from '@/application'

import { GetUserQuery } from './get-user.query'
import type { User } from './user.types'

export class GetUserHandler extends BaseHandler<
  GetUserQuery,
  User
> {
  protected async executeAsync(
    request: GetUserQuery,
  ): Promise<ResultType<User>> {
    const user: User = {
      id: request.userId,
      email: 'john@example.com',
      name: 'John Doe',
    }

    return Result.ok(user)
  }
}
```

### `bootstrap.ts`

```ts
import { AppBuilder } from 'xeno'

import { GetUserHandler } from './application/users/get-user.handler'
import { getUserQuerySchema } from './application/users/get-user.query.schema'

const app = new AppBuilder()
  .addServices((container) => {
    container.addTransient(
      'GetUserQuery',
      (scope) => {
        return new GetUserHandler(
          scope.resolve('USER_CONTEXT_FACTORY'),
        )
      },
    )
  })
  .addPipeline((config) => {
    config.queryBus.isEnabled = true

    config.validation.zod = {
      schemas: {
        GetUserQuery: getUserQuerySchema,
      },
    }
  })

const container = await app.build()

const mediator = container.resolve('MEDIATOR')

const query = new GetUserQuery('user-123')

const result = await mediator.query(
  query,
  new AbortController().signal,
)

if (result.isOk()) {
  console.log(result.getValueOrThrow())
}
```

This setup provides:

* a Query with typed input and output;
* a registered Query handler;
* Zod validation;
* Query caching;
* a cache key based on the Query parameter;
* execution through the mediator.

## Understand Query caching behavior

When Query caching is enabled and the Query has a `cacheKey`, Xeno.JS behaves as follows:

```text
Query
  │
  ├── cache read
  │      │
  │      ├── hit → return cached result
  │      │
  │      └── miss
  │
  ├── execute handler
  │
  └── successful result → write to cache
```

A cache hit returns the cached result without executing the handler.

A successful cache miss stores the handler result.

Failed Query results are not written to the cache.

### Cache errors do not fail the Query

If a cache read fails, Xeno.JS logs a warning and continues with the Query execution.

If a cache write fails, Xeno.JS logs a warning and returns the Query result normally.

This means the cache is not required to be available for the Query handler to produce its result after a cache read/write failure.

## Skip the cache for one Query

To force a fresh read:

```ts
export class GetUserQuery extends Query<User> {
  constructor(
    public readonly userId: string,
  ) {
    super('GetUserQuery', {
      cacheKey: `user:${userId}`,
      ttl: 60,
      bypassCache: true,
      consistentRead: false,
      isUserScoped: false,
    })
  }
}
```

`bypassCache: true` prevents an existing cached value from being returned.

The Query still executes and, if successful, its result can be cached.

For a semantically explicit fresh read, use:

```ts
consistentRead: true
```

Both options prevent the cache from being read.

## Troubleshooting

### The Query handler is not being called

Check:

1. the Query extends `Query`;
2. the `intent` is correct;
3. the handler is registered with exactly the same intent;
4. `addPipeline()` is configured;
5. the Query is executed through `mediator.query()`.

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

must be registered as:

```ts
container.addTransient(
  'GetUserQuery',
  (scope) => new GetUserHandler(
    scope.resolve('USER_CONTEXT_FACTORY'),
  ),
)
```

### Query caching is not working

Check:

1. `queryBus.isEnabled` is `true`;
2. `addPipeline()` is called;
3. the Query has a non-empty `cacheKey`;
4. `addCache()` has a valid cache strategy;
5. the Query parameters are represented in the cache key.

For example:

```ts
.addPipeline((config) => {
  config.queryBus.isEnabled = true
})
```

and:

```ts
super('GetUserQuery', {
  cacheKey: `user:${userId}`,
  ttl: 60,
  bypassCache: false,
  consistentRead: false,
  isUserScoped: false,
})
```

### Every Query executes even when caching is configured

Check whether caching is enabled:

```ts
config.queryBus.isEnabled = true
```

Configuring a cache provider alone does not add Query caching to the Query pipeline.

### Validation is not running

Check:

1. `addPipeline()` is configured;
2. `validation.zod` contains a schema;
3. the schema is registered using the exact Query intent;
4. the Query is executed through the mediator.

For example:

```ts
config.validation.zod = {
  schemas: {
    GetUserQuery: getUserQuerySchema,
  },
}
```

The key must match:

```ts
super('GetUserQuery', ...)
```

See [Validation Pipeline](../pipelines/validation) for validation-specific troubleshooting.

### The wrong cached result is returned

Check the `cacheKey`.

Every value that can change the Query result should be represented in the key.

For example, avoid:

```ts
cacheKey: 'users'
```

when the Query depends on:

```ts
page
pageSize
status
```

Instead use a key that includes those parameters:

```ts
cacheKey: `users:${page}:${pageSize}:${status}`
```

If the result depends on the current user, also consider:

```ts
isUserScoped: true
```

## Related documentation

* [CQRS Overview](./overview) — Find the Query, Command, and Handler guides.
* [Creating Commands](./command) — Create and execute Commands.
* [Creating Handlers](./handler) — Create and register Query and Command handlers.
* [Validation Pipeline](../pipelines/validation) — Validate Queries and Commands with Zod or custom validation.
* [Caching Pipeline](../pipelines/caching) — Configure and understand Query caching.
* [Performance Pipeline](../pipelines/performance) — Track slow Query executions.
* [Logging Pipeline](../pipelines/logging) — Configure CQRS logging.
* [Exception Pipeline](../pipelines/exception) — Handle exceptions during Query execution.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
