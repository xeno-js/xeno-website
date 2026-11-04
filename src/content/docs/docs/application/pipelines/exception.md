---
title: Exception Pipeline
description: Learn how the Xeno.JS CQRS exception behavior converts thrown values into failed Results and how to preserve application errors with AppError.
keywords:
- Xeno.JS exception handling
- Xeno.JS exception pipeline
- TypeScript exception handling
- CQRS exception handling
- AppError
- Xeno.JS AppError
- command exception
- query exception
tags:
- application
- pipeline
- exceptions
- cqrs
faqs:
- question: How do I enable the Exception Pipeline?
  answer: Enable CQRS by calling addPipeline() on XenoAppBuilder. The ExceptionPipeline is added as a common behavior for commands and queries.
- question: Do I need to configure an exception option?
  answer: No. The Exception Pipeline does not have a separate exception configuration option.
- question: What happens when a command or query throws an AppError?
  answer: The existing AppError is preserved and returned as a failed Result.
- question: What happens when a command or query throws a value other than AppError?
  answer: If the thrown value is not an AppError, Xeno.JS wraps it in an AppError with the SYSTEM_ERROR code and status 500.
- question: Is the original thrown value preserved?
  answer: Yes. For non-AppError values wrapped by the behavior, the original thrown value is stored as the AppError cause.
---

## Introduction

The `ExceptionPipeline` is a CQRS behavior that handles values thrown while
executing the next command or query behavior, including the handler.

It returns a failed `Result` for both existing `AppError` instances and other
thrown values. It does not itself write logs or create an HTTP response.

`XenoAppBuilder.addPipeline()` enables the CQRS module, which adds
`ExceptionPipeline` as a common behavior for commands and queries. You do not
configure it separately.

## Enable the Exception Pipeline

Before using the CQRS pipeline, configure it through `XenoAppBuilder`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline()

await app.build()
```

`addPipeline()` queues the CQRS module, which is initialized during `build()`.

The Exception Pipeline is registered automatically as part of this configuration.

There is no separate setting such as:

```ts
config.exception = {
  enabled: true,
}
```

## How exception handling works

When a command or query runs through the configured CQRS pipeline, the
`ExceptionPipeline` awaits the next behavior. This continues through the
remaining behaviors and the handler. If that execution throws, the behavior
converts the thrown value according to its type.

### Existing `AppError`

If the thrown value is already an `AppError`, Xeno.JS preserves that error.

For example:

```ts
throw AppError.create({
  code: 'USER_NOT_FOUND',
  message: 'User not found',
  status: 404,
  name: 'GetUserQuery',
})
```

The resulting `Result.fail` contains the same `AppError` instance.

This preserves the error instance and its application-defined metadata.

### Other thrown values

If the thrown value is not an `AppError` (including non-`Error` values),
Xeno.JS creates a system error.

For example:

```ts
throw new Error('Unexpected database failure')
```

The Exception Pipeline converts it into an `AppError` with:

- code: `SYSTEM_ERROR`;
- status: `500` (`STATUS_CODES.INTERNAL_SERVER_ERROR`);
- the CQRS request's `intent` as the error name;
- the original thrown value as the `cause`.

The original thrown value is therefore available as the `cause` of the
resulting `AppError`. The status is error metadata; this behavior does not
itself create or send an HTTP response.

## Use `AppError` for expected application errors

Use `AppError` when the error is part of the expected behavior of your application.

For example, a use case may reject an operation because a requested resource does not exist:

```ts
import { AppError } from '@xeno-js/shared'

export class GetUserHandler {
  async execute(userId: string) {
    const user = await this.repository.findById(userId)

    if (!user) {
      throw AppError.create({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
        status: 404,
        name: 'GetUserQuery',
      })
    }

    return user
  }
}
```

The Exception Pipeline preserves this error instead of replacing it with a generic system error.

This means callers can distinguish application errors from unexpected failures.

## Handle unexpected errors

You do not need to wrap every unexpected exception manually.

For example:

```ts
export class CreateUserHandler {
  async execute(request: CreateUserRequest) {
    const user = await this.repository.create(request)

    return user
  }
}
```

If an unexpected exception is thrown by the repository or another dependency:

```ts
throw new Error('Database connection failed')
```

the Exception Pipeline converts it into a failed `Result` containing a
`SYSTEM_ERROR` with status `500`.

The original thrown value is retained as the `cause`.

## Result of exception handling

When the next behavior or handler throws, the Exception Pipeline returns a
failed `Result` rather than propagating that thrown value from this pipeline
call.

Conceptually:

```text
Command / Query
      │
      ▼
Application execution
      │
      ├── success ───────────────► Result.ok(...)
      │
      └── exception
            │
            ├── AppError
            │      └─────────────► Result.fail(existing AppError)
            │
            └── other thrown value
                   └─────────────► Result.fail(
                                      AppError(
                                        SYSTEM_ERROR,
                                        status = 500,
                                        cause = original value
                                      )
                                    )
```

This gives command and query dispatch a consistent failed `Result` for
application errors and other thrown values that reach this behavior.

## Throwing an `AppError`

When creating an application-specific error, provide a meaningful error code, message, status, and request name.

```ts
import { AppError } from '@xeno-js/shared'

throw AppError.create({
  code: 'ORDER_ALREADY_CANCELLED',
  message: 'The order has already been cancelled.',
  status: 409,
  name: 'CancelOrderCommand',
})
```

The error remains an `AppError` when it reaches the caller.

## Unexpected errors

For unexpected errors, normal JavaScript errors can be thrown directly:

```ts
throw new Error('Unexpected failure')
```

Xeno.JS converts the error into a system `AppError`.

You should not manually convert every unexpected exception into `SYSTEM_ERROR`. The Exception Pipeline performs this conversion for you.

## Command and query execution

The CQRS module adds `ExceptionPipeline` as a common behavior at priority `0`,
so it applies to both command and query pipelines. The logging behavior is
registered separately; exception conversion itself does not log.

This means the behavior is available to:

- commands;
- queries;
- their handlers;
- dependencies called while those handlers or subsequent behaviors execute.

You therefore do not need separate exception handling configuration for commands and queries.

For creating the request itself, see:

- [Creating Commands](../cqrs/command)
- [Creating Queries](../cqrs/query)
- [Creating Handlers](../cqrs/handler)

## Troubleshooting

### Exceptions are not being converted to `Result.fail`

Check that the application has enabled the CQRS pipeline:

```ts
const app = new XenoAppBuilder()
  .addPipeline()

await app.build()
```

Without `addPipeline()`, the CQRS pipeline module is not initialized.

### My custom `AppError` becomes a `SYSTEM_ERROR`

Make sure the value being thrown is an actual `AppError`:

```ts
throw AppError.create({
  code: 'USER_NOT_FOUND',
  message: 'User not found',
  status: 404,
  name: 'GetUserQuery',
})
```

The Exception Pipeline preserves errors that are instances of `AppError`.

### My thrown value produces status 500

If the thrown value is not an `AppError`, the Exception Pipeline converts it
to a system error with status `500`.

If the error represents an expected application condition, create and throw an appropriate `AppError` instead.

For example:

```ts
throw AppError.create({
  code: 'RESOURCE_NOT_FOUND',
  message: 'Resource not found',
  status: 404,
  name: 'GetResourceQuery',
})
```

### I need to inspect the original thrown value

Unexpected thrown values are stored as the `cause` of the generated
`AppError`.

When handling the failed result, inspect the generated `AppError` and its
`cause`. Logging is provided separately by the configured logging behavior.

## Related documentation

- [Application Overview](../overview)
- [CQRS Overview](../cqrs/overview)
- [Creating Commands](../cqrs/command)
- [Creating Queries](../cqrs/query)
- [Creating Handlers](../cqrs/handler)
- [Logging Pipeline](./logging)
- [Performance Pipeline](./performance)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
