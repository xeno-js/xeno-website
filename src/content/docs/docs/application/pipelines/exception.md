---
title: Exception Pipeline
description: Learn how Xeno.JS handles exceptions raised while executing commands and queries and how to preserve application errors with AppError.
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
  answer: Enable the CQRS pipeline module by calling addPipeline() on AppBuilder. The Exception Pipeline is included automatically.
- question: Do I need to configure an exception option?
  answer: No. The Exception Pipeline does not have a separate exception configuration option.
- question: What happens when a command or query throws an AppError?
  answer: The existing AppError is preserved and returned as a failed Result.
- question: What happens when a command or query throws a regular Error?
  answer: Xeno.JS wraps it in an AppError with the SYSTEM_ERROR code and an HTTP 500 status.
- question: Is the original exception preserved?
  answer: Yes. For errors wrapped by the pipeline, the original exception is stored as the AppError cause.
---

## Introduction

The Exception Pipeline provides consistent exception handling for commands and queries executed through the Xeno.JS application pipeline.

It catches exceptions raised during request processing and converts them into failed `Result` values.

You do not configure the Exception Pipeline separately. It is included when you enable the CQRS pipeline through `AppBuilder`.

## Enable the Exception Pipeline

Before using the CQRS pipeline, configure it through `AppBuilder`:

```ts
import { AppBuilder } from 'xeno-js'

const app = new AppBuilder()
  .addPipeline()

await app.build()
```

`addPipeline()` initializes the CQRS pipeline used by commands and queries.

The Exception Pipeline is registered automatically as part of this configuration.

There is no separate setting such as:

```ts
config.exception = {
  enabled: true,
}
```

## How exception handling works

When a command or query is executed, an exception can be raised by application code such as a handler or one of its dependencies.

The Exception Pipeline handles the exception according to its type.

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

The resulting failed `Result` contains the same `AppError`.

This allows application code to define meaningful application errors without losing their code, message, status, or other metadata.

### Regular errors

If the thrown value is not an `AppError`, Xeno.JS creates a system error.

For example:

```ts
throw new Error('Unexpected database failure')
```

The Exception Pipeline converts it into an `AppError` with:

* code: `SYSTEM_ERROR`;
* status: `500 Internal Server Error`;
* the current request intent as the error name;
* the original exception as the `cause`.

The original exception is therefore still available as the cause of the resulting `AppError`.

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

the Exception Pipeline converts it into a failed `Result` containing a `SYSTEM_ERROR` with status `500`.

The original exception is retained as the `cause`.

## Result of exception handling

The Exception Pipeline returns a failed `Result` rather than propagating the exception as an unhandled rejection.

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
            └── other Error
                   └─────────────► Result.fail(
                                      AppError(
                                        SYSTEM_ERROR,
                                        HTTP 500,
                                        cause = original error
                                      )
                                    )
```

This gives application code a consistent error result for both expected application failures and unexpected exceptions.

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

The Exception Pipeline is part of the common pipeline used for both commands and queries.

This means the same exception handling behavior applies to:

* commands;
* queries;
* their handlers;
* dependencies executed during request processing.

You therefore do not need separate exception handling configuration for commands and queries.

For creating the request itself, see:

* [Creating Commands](../cqrs/command)
* [Creating Queries](../cqrs/query)
* [Creating Handlers](../cqrs/handler)

## Troubleshooting

### Exceptions are not being converted to `Result.fail`

Check that the application has enabled the CQRS pipeline:

```ts
const app = new AppBuilder()
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

### My error has status 500

If the error is a regular `Error`, the Exception Pipeline intentionally converts it to a system error with status `500`.

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

### I need to inspect the original unexpected exception

Unexpected exceptions are stored as the `cause` of the generated `AppError`.

For example:

```ts
const error = result.getErrorOrThrow()

console.log(error.cause)
```

The original exception can therefore still be inspected by the application or by the logging infrastructure.

## Related documentation

* [Application Overview](../overview)
* [CQRS Overview](../cqrs/overview)
* [Creating Commands](../cqrs/command)
* [Creating Queries](../cqrs/query)
* [Creating Handlers](../cqrs/handler)
* [Logging Pipeline](./logging)
* [Performance Pipeline](./performance)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
