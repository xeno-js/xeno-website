---
title: Idempotency Pipeline
description: Learn how to enable idempotency for Xeno.JS commands and configure lock and processed-result TTLs globally or per command intent.
keywords:
- Xeno.JS idempotency
- Xeno.JS idempotency pipeline
- command idempotency
- CQRS idempotency
- command deduplication
- request idempotency
- intentRegistry
- TypeScript CQRS
tags:
- application
- pipelines
- idempotency
- cqrs
- commands
faqs:
- question: How do I enable idempotency?
  answer: Pass withIdempotency() to XenoAppBuilder.addPipeline().
- question: Does idempotency apply to queries?
  answer: No. Idempotency is added to the Command pipeline only.
- question: What identifies an idempotent request?
  answer: Xeno.JS uses the requestId from the network context as the idempotency key. The command intent selects optional per-command TTL settings.
- question: What happens when the same request is received again?
  answer: If a processed payload is still stored, Xeno.JS returns it in a new successful Result without executing the command again.
- question: What happens when another request is processing the same request ID?
  answer: The command is not executed and a conflict result is returned.
- question: What happens when a command fails?
  answer: The idempotency lock is released and the failed result is not stored as the processed result.
- question: How long are idempotency locks kept?
  answer: Configure lockTtlSeconds. If it is not specified, Xeno.JS uses its built-in default.
- question: How long are processed results kept?
  answer: Configure processedTtlSeconds. If it is not specified, Xeno.JS uses its built-in default.
- question: Can I configure idempotency TTLs per command?
  answer: Yes. Use intentRegistry with keys matching each command's intent; per-intent TTL values override the corresponding global values.
---

## Introduction

Use the Idempotency Pipeline to deduplicate repeated **Command** executions
that use the same request ID while the corresponding cache entry is available.

When idempotency is enabled, Xeno.JS:

1. checks whether the request has already been processed;
2. returns the stored payload in a successful `Result` when one is available;
3. otherwise acquires an idempotency lock;
4. executes the command;
5. stores the successful result payload for subsequent requests;
6. releases the lock when the command fails or throws an exception.

Idempotency is available for **Commands only**. It is not added to the Query pipeline.

## Before you start

You need:

- an `XenoAppBuilder` instance;
- a Command and its handler;
- a cache implementation; the CQRS module configures the default in-memory cache if needed;
- a network request context that provides a `requestId`;
- the command executed through the Xeno.JS mediator.

If you are creating the Command itself, see [Create a Command](../cqrs/command).

If you need to configure the cache used by Xeno.JS, see the cache documentation.

## Enable idempotency

Pass `withIdempotency()` to `addPipeline()` and configure its options:

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 30
    options.processedTtlSeconds = 60
  }))

const application = await app.build()
```

You do not need to instantiate or register `IdempotencyPipeline` manually.

Once configured, Xeno.JS adds the idempotency behavior to the Command pipeline.

## Configure the lock TTL

Use `lockTtlSeconds` to control how long an idempotency lock remains in the cache.

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 30
    options.processedTtlSeconds = 60
  }))

const application = await app.build()
```

The value is expressed in **seconds**.

Use a positive integer value.

For example:

```ts
lockTtlSeconds: 30
```

means that the lock can remain in the cache for up to 30 seconds if it is not explicitly released earlier.

The lock is released by the pipeline when:

- the command returns a failed `Result`;
- the next behavior or command handler throws.

A successful command is marked as processed instead of explicitly releasing the lock.

## Configure the processed-result TTL

Use `processedTtlSeconds` to control how long the result of a successfully processed command remains available.

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 30
    options.processedTtlSeconds = 300
  }))

const application = await app.build()
```

The value is expressed in **seconds**. Use a positive integer.

While the processed payload is still available, another request with the same
`requestId` receives that payload in a successful `Result` instead of executing
the command again.

## Configure idempotency per intent

Use `intentRegistry` to override TTL settings for specific command intents. A
registry key must match the command's `intent`. Each per-intent TTL overrides
the corresponding global setting; omitted values fall back to the global
setting and then to the pipeline default.

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 30
    options.processedTtlSeconds = 300
    options.intentRegistry = {
      CreateUserCommand: {
        processedTtlSeconds: 900,
      },
      SubmitPaymentCommand: {
        lockTtlSeconds: 60,
        processedTtlSeconds: 3600,
      },
    }
  }))

const application = await app.build()
```

In this example, `CreateUserCommand` uses the global lock TTL and a processed
payload TTL of 900 seconds. `SubmitPaymentCommand` uses both of its configured
TTLs. Other commands use the global values; any global value not specified
falls back to the pipeline default.

The intent selects TTL configuration only. The idempotency store is keyed by
the network context's `requestId`, not by the command intent. Use request IDs
that are unique across commands, and reuse the same ID only when retrying the
same operation.

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

When Xeno.JS finds a processed payload for the request ID, it returns
`Result.ok(payload)` immediately. The payload must be defined in the store.

The command pipeline does not execute the command again.

If the store reports that the request was processed but has no payload for its
ID, the pipeline returns a failed conflict `Result` instead.

Conceptually:

```text
Request
   │
   ▼
Has this request already been processed?
   │
   ├── Yes ──► Return Result.ok(stored payload)
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
     Store successful payload
```

This is the main behavior provided by the Idempotency Pipeline.

## What happens when another request is processing the same ID?

If the request has not been processed yet but another execution already holds the idempotency lock, the second execution cannot acquire the lock.

Xeno.JS returns a failed `Result` containing a conflict error.

The command handler is not executed by the second request.

This prevents two concurrent executions with the same request ID from processing the command simultaneously.

## What happens when the command succeeds?

When the command returns a successful `Result`, Xeno.JS stores its value
(`result.getValueOrThrow()`) using the configured `processedTtlSeconds`.

For example:

```ts
const result = Result.ok({
  id: user.id,
})
```

Only the successful payload is stored. On replay, the pipeline creates a new
`Result.ok(payload)`; it does not persist and replay the original `Result`
object or its error metadata.

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

This is different from a successful execution, where the payload remains
available for the configured processed-result TTL.

## What happens when the command throws?

If the next pipeline behavior or command handler throws, Xeno.JS releases the
idempotency lock and rethrows the value. The CQRS exception behavior handles
that thrown value separately.

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
   thrown value
      │
      ▼
 release lock
      │
      ▼
 rethrow value
```

## Configure both TTLs

A typical configuration explicitly sets both TTL values:

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 30
    options.processedTtlSeconds = 300
  }))

const application = await app.build()
```

Use:

- `lockTtlSeconds` for the lifetime of an in-progress idempotency lock;
- `processedTtlSeconds` for the lifetime of a successful command payload.

Use positive integers for both values.

If they are omitted, Xeno.JS uses the built-in defaults.

## Complete example

The following example shows the relevant application configuration:

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 30
    options.processedTtlSeconds = 300
  }))
  .addServices((services) => {
    services.addTransient('CREATE_USER_HANDLER', (scope) => {
      return new CreateUserHandler(
        scope.resolve('USER_REPOSITORY'),
      )
    })
  })

const application = await app.build()
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

`withIdempotency()` adds idempotency to the Command pipeline. The CQRS module
does not add this behavior to the Query pipeline.

If you need query result caching, see [Caching](./caching).

## Idempotency uses a cache

The built-in idempotency store uses the Xeno.JS cache to store:

- active idempotency locks;
- successfully processed command payloads.

When idempotency is enabled and no cache has been registered, the CQRS module
configures the default in-memory cache. Register a cache explicitly if the
application needs a different provider or cache configuration.

## Troubleshooting

### The command is executed more than once

Check:

1. `withIdempotency()` is passed to `addPipeline()`;
2. the command is executed through the Xeno.JS mediator;
3. the requests use the same `requestId`;
4. application building succeeds, so the CQRS module can configure the behavior and cache;
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

Once the stored successful payload expires, a later request with the same request ID can be processed again.

Choose a processed-result TTL that matches how long your application needs to recognize repeated requests as duplicates.

### Choose valid TTL values

Use positive integer values for:

```ts
lockTtlSeconds
processedTtlSeconds
```

The pipeline does not validate TTL values, so avoid zero, negative, or
fractional values.

## Related documentation

- [Application Overview](../overview)
- [Create a Command](../cqrs/command)
- [Create a Command Handler](../cqrs/handler)
- [Configure Concurrency](./concurrency)
- [Enable Caching](./caching)
- [Handle Exceptions](./exception)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
