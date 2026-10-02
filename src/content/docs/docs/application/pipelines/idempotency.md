---
title: Idempotency Pipeline
description: Learn how to enable idempotency for Xeno.JS commands and configure lock and processed-result TTLs.
keywords:
- Xeno.JS idempotency
- Xeno.JS idempotency pipeline
- command idempotency
- CQRS idempotency
- command deduplication
- request idempotency
- TypeScript CQRS
tags:
- application
- pipelines
- idempotency
- cqrs
- commands
faqs:
- question: How do I enable idempotency?
  answer: Configure commandBus.idempotency through AppBuilder.addPipeline().
- question: Does idempotency apply to queries?
  answer: No. Idempotency is added to the Command pipeline only.
- question: What identifies an idempotent request?
  answer: Xeno.JS uses the requestId from the network context to identify the request.
- question: What happens when the same request is received again?
  answer: If a processed result is still stored, Xeno.JS returns that result without executing the command again.
- question: What happens when another request is processing the same request ID?
  answer: The command is not executed and a conflict result is returned.
- question: What happens when a command fails?
  answer: The idempotency lock is released and the failed result is not stored as the processed result.
- question: How long are idempotency locks kept?
  answer: Configure lockTtlSeconds. If it is not specified, Xeno.JS uses its built-in default.
- question: How long are processed results kept?
  answer: Configure processedTtlSeconds. If it is not specified, Xeno.JS uses its built-in default.
---

## Introduction

Use the Idempotency Pipeline to prevent the same **Command** from being processed more than once for the same request ID.

When idempotency is enabled, Xeno.JS:

1. checks whether the request has already been processed;
2. returns the stored result when one is available;
3. otherwise acquires an idempotency lock;
4. executes the command;
5. stores a successful result for subsequent requests;
6. releases the lock when the command fails or throws an exception.

Idempotency is available for **Commands only**. It is not added to the Query pipeline.

## Before you start

You need:

* an `AppBuilder` instance;
* a Command and its handler;
* a configured cache;
* a network request context that provides a `requestId`;
* the command executed through the Xeno.JS mediator.

If you are creating the Command itself, see [Create a Command](../cqrs/command).

If you need to configure the cache used by Xeno.JS, see the cache documentation.

## Enable idempotency

Configure `commandBus.idempotency` through `addPipeline()`:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 60,
    }
  })
  .build()
```

You do not need to instantiate or register `IdempotencyPipeline` manually.

Once `commandBus.idempotency` is defined, Xeno.JS adds the idempotency behavior to the Command pipeline.

## Configure the lock TTL

Use `lockTtlSeconds` to control how long an idempotency lock remains in the cache.

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 60,
    }
  })
  .build()
```

The value is expressed in **seconds**.

The value must be a positive integer.

For example:

```ts
lockTtlSeconds: 30
```

means that the lock can remain in the cache for up to 30 seconds if it is not explicitly released earlier.

The lock is released automatically by the pipeline when:

* the command returns a failed `Result`;
* command execution throws an exception.

A successful command is marked as processed instead of explicitly releasing the lock.

## Configure the processed-result TTL

Use `processedTtlSeconds` to control how long the result of a successfully processed command remains available.

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 300,
    }
  })
  .build()
```

The value is expressed in **seconds** and must be a positive integer.

While the processed result is still available, another request with the same `requestId` receives the stored result instead of executing the command again.

## Use the request ID

Idempotency is based on the request's `requestId`.

The same request ID identifies the same idempotent operation.

For example, if a command is executed with:

```text
requestId = "request-123"
```

and the command completes successfully, a subsequent execution using the same request ID can return the stored result without invoking the command handler again.

The request ID must therefore remain stable when a client intentionally retries the same operation.

Do not generate a new request ID for every retry if the intention is to retrieve the result of the original operation.

## What happens when a request was already processed?

When Xeno.JS finds a processed result for the request ID, it returns that result immediately.

The command pipeline does not execute the command again.

Conceptually:

```text
Request
   │
   ▼
Has this request already been processed?
   │
   ├── Yes ──► Return stored result
   │
   └── No
         │
         ▼
     Acquire lock
         │
         ▼
     Execute command
         │
         ▼
     Store successful result
```

This is the main behavior provided by the Idempotency Pipeline.

## What happens when another request is processing the same ID?

If the request has not been processed yet but another execution already holds the idempotency lock, the second execution cannot acquire the lock.

Xeno.JS returns a failed `Result` containing a conflict error.

The command handler is not executed by the second request.

This prevents two concurrent executions with the same request ID from processing the command simultaneously.

## What happens when the command succeeds?

When the command returns a successful `Result`, Xeno.JS stores the result using the configured `processedTtlSeconds`.

For example:

```ts
const result = Result.ok({
  id: user.id,
})
```

The successful payload is stored.

A subsequent request with the same request ID can receive:

```ts
{
  id: user.id,
}
```

without executing the command again.

## What happens when the command returns a failure?

A failed command result is **not** stored as the processed result.

For example:

```ts
return Result.fail(
  AppError.create({
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    status: 404,
    name: 'CreateUserCommand',
  }),
)
```

The idempotency lock is released and the failed result is returned.

A later request with the same request ID can therefore attempt the command again.

This is different from a successful execution, where the result remains available for the configured processed-result TTL.

## What happens when the command throws?

If command execution throws an exception, Xeno.JS releases the idempotency lock and rethrows the exception.

The exception is not stored as a processed result.

This means that a later request using the same request ID can attempt the command again.

For example:

```ts
const result = await mediator.send(command)
```

If the handler throws:

```text
Command execution
      │
      ▼
   exception
      │
      ▼
 release lock
      │
      ▼
 rethrow exception
```

## Configure both TTLs

A typical configuration explicitly sets both TTL values:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 300,
    }
  })
  .build()
```

Use:

* `lockTtlSeconds` for the lifetime of an in-progress idempotency lock;
* `processedTtlSeconds` for the lifetime of a successful command result.

Both values must be positive integers.

If they are omitted, Xeno.JS uses the built-in defaults.

## Complete example

The following example shows the relevant application configuration:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 300,
    }
  })
  .addServices((services) => {
    services.addTransient('CREATE_USER_HANDLER', (container) => {
      return new CreateUserHandler(
        container.resolve('USER_REPOSITORY'),
      )
    })
  })
  .build()
```

Your command can then be executed normally through the mediator:

```ts
const result = await mediator.send(
  new CreateUserCommand({
    email: 'user@example.com',
    name: 'John Doe',
  }),
)
```

The idempotency pipeline operates around the command execution without requiring the handler to implement locking or result storage itself.

## Idempotency applies to Commands

Idempotency is configured under:

```ts
config.commandBus.idempotency
```

It is therefore part of the Command pipeline.

It does not apply to:

```ts
config.queryBus
```

Queries have different execution semantics and are not processed through the idempotency pipeline.

If you need query result caching, see [Caching](./caching).

## Idempotency requires a cache

The built-in idempotency store uses the configured Xeno.JS cache to store:

* active idempotency locks;
* successfully processed command results.

Make sure a cache implementation is configured before enabling idempotency.

If the cache is not available, application configuration cannot construct the idempotency store required by the pipeline.

## Troubleshooting

### The command is executed more than once

Check:

1. `config.commandBus.idempotency` is configured;
2. the command is executed through the Xeno.JS mediator;
3. the requests use the same `requestId`;
4. a cache implementation is configured;
5. the processed-result TTL has not expired.

Remember that using a different request ID represents a different idempotent operation.

### The second request returns a conflict

This can happen when the first request is still processing the command.

Check:

1. whether the first request is still running;
2. whether `lockTtlSeconds` is appropriate for the command duration;
3. whether the same request ID is being used concurrently.

A request that cannot acquire the existing lock does not execute the command.

### The command can be executed again after a failure

This is expected behavior.

Failed `Result` values are not stored as processed results. The lock is released so that a later request can retry the operation.

### The same request is processed again after some time

Check `processedTtlSeconds`.

Once the stored successful result expires, a later request with the same request ID can be processed again.

Choose a processed-result TTL that matches how long your application needs to recognize repeated requests as duplicates.

### Idempotency configuration throws an error

Check that:

```ts
lockTtlSeconds
processedTtlSeconds
```

are positive integers.

Values such as these are invalid:

```ts
lockTtlSeconds: 0
```

```ts
processedTtlSeconds: -1
```

```ts
lockTtlSeconds: 1.5
```

## Related documentation

* [Application Overview](../overview)
* [Create a Command](../cqrs/command)
* [Create a Command Handler](../cqrs/handler)
* [Configure Concurrency](./concurrency)
* [Enable Caching](./caching)
* [Handle Exceptions](./exception)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
