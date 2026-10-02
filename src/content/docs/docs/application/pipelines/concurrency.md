---
title: Concurrency Pipeline
description: Learn how to configure automatic retries for Xeno.JS commands that fail because of concurrency conflicts.
keywords:
- Xeno.JS concurrency
- Xeno.JS concurrency pipeline
- Xeno.JS concurrency retry
- CQRS concurrency
- command retry
- optimistic concurrency
- concurrency conflict
- TypeScript CQRS
tags:
- application
- pipelines
- concurrency
- cqrs
- commands
faqs:
- question: How do I enable concurrency retries?
  answer: Configure commandBus.concurrency through AppBuilder.addPipeline().
- question: Does the concurrency pipeline apply to queries?
  answer: No. The concurrency retry pipeline is added to the command pipeline only.
- question: What errors are retried?
  answer: Only failed Results containing a conflict error with the conflict error code and HTTP 409 status are retried.
- question: How many times is a command executed?
  answer: The maxRetries value limits the total number of pipeline attempts, including the first execution.
- question: Can I configure the delay between retries?
  answer: Yes. Use commandBus.concurrency.delayConfig with baseDelayMs and maxJitterMs.
- question: What happens when the retry limit is reached?
  answer: The pipeline returns a failed conflict Result instead of executing the command again.

---

## Introduction

Use the Concurrency Pipeline to automatically retry a **Command** when its execution returns a concurrency conflict.

The pipeline is useful with optimistic concurrency, where two operations can attempt to update the same resource and one operation may fail because the resource version has changed.

The concurrency retry configuration belongs to the **command bus**. It does not apply to queries.

## Before you start

You need:

* an `AppBuilder` instance;
* a Command and its handler;
* concurrency conflicts represented as a failed `Result` with a conflict error;
* the command executed through the Xeno.JS mediator.

If you are creating the Command itself, see [Create a Command](../cqrs/command).

## Enable concurrency retries

Configure `commandBus.concurrency` inside `addPipeline()`:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.concurrency = {
      maxRetries: 3,
      delayConfig: {
        baseDelayMs: 100,
        maxJitterMs: 50,
      },
    }
  })
  .build()
```

Once configured, Xeno.JS adds the concurrency retry behavior to the **Command pipeline**.

You do not need to register `ConcurrencyRetryPipeline` manually.

## Configure the retry limit

Use `maxRetries` to control the maximum number of times the command pipeline is executed.

For example:

```ts
config.commandBus.concurrency = {
  maxRetries: 3,
  delayConfig: {
    baseDelayMs: 100,
    maxJitterMs: 50,
  },
}
```

With `maxRetries: 3`, a command can be executed up to three times when it keeps returning a concurrency conflict:

```text
Attempt 1
   │
   ├── success ───────────────► return result
   │
   └── conflict
         │
         ▼
       delay
         │
         ▼
Attempt 2
   │
   ├── success ───────────────► return result
   │
   └── conflict
         │
         ▼
       delay
         │
         ▼
Attempt 3
   │
   ├── success ───────────────► return result
   │
   └── conflict ───────────────► return failed Result
```

`maxRetries` must be a positive integer.

A value of `0` or a negative value is invalid.

## Configure retry delays

Use `delayConfig` to configure the delay applied between concurrency-conflict attempts:

```ts
config.commandBus.concurrency = {
  maxRetries: 5,
  delayConfig: {
    baseDelayMs: 100,
    maxJitterMs: 50,
  },
}
```

### `baseDelayMs`

`baseDelayMs` defines the base delay in milliseconds before another attempt.

It must be a non-negative integer.

```ts
baseDelayMs: 100
```

### `maxJitterMs`

`maxJitterMs` defines the maximum jitter added to the retry delay.

It must be a non-negative integer.

```ts
maxJitterMs: 50
```

Using jitter helps avoid multiple concurrent operations retrying at exactly the same time.

## Configure only what you need

The concurrency configuration is optional.

You can enable it with the defaults:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.concurrency = {}
  })
  .build()
```

When a value is omitted, Xeno.JS uses the pipeline defaults.

You can override only the retry count:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.concurrency = {
      maxRetries: 5,
    }
  })
  .build()
```

Or provide the complete configuration:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.concurrency = {
      maxRetries: 5,
      delayConfig: {
        baseDelayMs: 100,
        maxJitterMs: 50,
      },
    }
  })
  .build()
```

## What counts as a concurrency conflict?

The retry pipeline does not retry every failed command.

A result is retried only when its error is a conflict with:

* the `CONFLICT` error code;
* HTTP status `409`.

For example, a command handler can return a conflict result when an optimistic concurrency check detects that the entity was modified by another operation.

```ts
return Result.fail(
  AppError.conflict(
    request.intent,
    'The user was modified by another request.',
  ),
)
```

That failed result is eligible for the concurrency retry pipeline.

Other failures are returned immediately.

For example:

```text
Command
   │
   ▼
Handler
   │
   ├── success ───────────────► return result
   │
   ├── validation error ──────► return error
   │
   ├── authorization error ───► return error
   │
   └── conflict (409) ────────► retry
```

## What happens during a retry?

When a command returns a concurrency conflict:

1. Xeno.JS checks whether the error is a conflict;
2. if the retry limit has not been reached, it waits using the configured delay and jitter;
3. the command pipeline is executed again;
4. the new result is evaluated again.

A successful retry immediately returns the successful result.

For example:

```text
Command
   │
   ▼
Conflict
   │
   ▼
wait
   │
   ▼
Command again
   │
   ▼
Success
   │
   ▼
Return success
```

A non-concurrency error is not retried.

## What happens when all attempts fail?

If every allowed attempt returns a concurrency conflict, the pipeline stops retrying and returns a failed conflict `Result`.

The returned error indicates that the maximum retry attempts were exceeded.

For example:

```text
Maximum retry attempts (3) exceeded due to concurrency conflicts.
```

The command is not executed again after the limit has been reached.

## Complete example

A typical application can configure the command bus as follows:

```ts
import { AppBuilder } from '@xeno-js/shared'

const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.concurrency = {
      maxRetries: 3,
      delayConfig: {
        baseDelayMs: 100,
        maxJitterMs: 50,
      },
    }
  })
  .build()
```

Your command handler is responsible for returning a conflict when an optimistic concurrency check fails:

```ts
import { AppError, Result } from '@xeno-js/shared'

export class UpdateUserHandler extends BaseHandler<
  UpdateUserCommand,
  UpdateUserResult
> {
  protected async executeAsync(
    request: UpdateUserCommand,
  ): Promise<Result<UpdateUserResult>> {
    const user = await this.userRepository.findById(request.userId)

    if (!user) {
      return Result.fail(
        AppError.notFound(
          request.intent,
          'User not found.',
        ),
      )
    }

    if (user.version !== request.version) {
      return Result.fail(
        AppError.conflict(
          request.intent,
          'The user was modified by another request.',
        ),
      )
    }

    // Update the entity and persist it.

    return Result.ok({
      userId: user.id,
    })
  }
}
```

With concurrency retries enabled, a conflict can cause the command to be executed again according to the configured retry policy.

## Concurrency applies to Commands

The retry configuration is part of:

```ts
config.commandBus.concurrency
```

It is therefore applied to Commands.

It is not part of:

```ts
config.queryBus
```

and does not automatically retry Queries.

The application pipeline is conceptually:

```text
Command
   │
   ▼
Common pipelines
   │
   ▼
Command-specific pipelines
   │
   └── Concurrency Retry
          │
          ▼
       Handler
```

If you need query result caching or other query-specific behavior, see the corresponding query pipeline documentation.

## Validation and authorization errors are not retried

Concurrency retry is intentionally limited to conflict errors.

For example:

```text
Validation failure
      │
      └──► return immediately

Authorization failure
      │
      └──► return immediately

Not found
      │
      └──► return immediately

Conflict / 409
      │
      └──► retry
```

This means that increasing `maxRetries` does not cause unrelated application errors to be retried.

## Troubleshooting

### The command is not being retried

Check that concurrency is configured under `commandBus`:

```ts
config.commandBus.concurrency = {
  maxRetries: 3,
}
```

Then check that the handler returns a conflict error.

The retry pipeline only recognizes errors with:

* conflict error code;
* HTTP status `409`.

A generic failed `Result` will not trigger a retry.

### A failed command is not retried

Check the error returned by the handler.

For example, this is a concurrency conflict:

```ts
return Result.fail(
  AppError.conflict(
    request.intent,
    'Concurrent update detected.',
  ),
)
```

Whereas returning another error type will not activate the retry behavior.

### `maxRetries` is rejected

`maxRetries` must be a positive integer.

Invalid:

```ts
maxRetries: 0
```

Invalid:

```ts
maxRetries: -1
```

Valid:

```ts
maxRetries: 3
```

### `baseDelayMs` or `maxJitterMs` is rejected

Both values must be non-negative integers.

Invalid:

```ts
delayConfig: {
  baseDelayMs: -100,
  maxJitterMs: 50,
}
```

Valid:

```ts
delayConfig: {
  baseDelayMs: 100,
  maxJitterMs: 50,
}
```

## Related docs

* [Application Overview](../overview)
* [Create a Command](../cqrs/command)
* [Create a Handler](../cqrs/handler)
* [Exception Pipeline](./exception)
* [Validation Pipeline](./validation)
* [Idempotency Pipeline](./idempotency)
* [Caching](./caching)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
