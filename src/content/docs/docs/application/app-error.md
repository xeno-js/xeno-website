---
title: AppError
description: Learn how to create, return, throw, and handle Xeno.JS AppError values and their HTTP metadata.
keywords:
- Xeno.JS AppError
- TypeScript application errors
- Xeno.JS error handling
- Xeno.JS error codes
- CQRS exceptions
- HTTP errors
tags:
- application
- errors
- cqrs
- http
faqs:
- question: What is an AppError?
  answer: AppError extends Error with a code, an HTTP status, and optional diagnostic or application metadata.
- question: Does creating an AppError throw it?
  answer: No. AppError.create and the named factories return an error; AppError.throw throws one.
- question: Where does a factory's custom message go?
  answer: For factories that accept a message, the standard message is stored in message and the supplied message is wrapped in cause as an Error.
- question: Does an AppError automatically become an HTTP response?
  answer: No. A controller or another boundary must map the error to a response.
---

## Introduction

`AppError` is an `Error` with a machine-readable `code`, an HTTP `status`,
and application-defined context. Xeno.JS uses it as the default error type
of `ResultType<T>`.

Create an error with a named factory or with `AppError.create()`. Return it
in a failed [Result](/docs/application/result), or throw it when an exception is appropriate.
Creating an `AppError` does not log it or send an HTTP response.

```ts
import { AppError, Result, type ResultType } from '@xeno-js/shared'

interface Order {
  id: string
}

function getOrder(id: string): ResultType<Order> {
  if (id !== '42') {
    return Result.fail(AppError.notFound('getOrder', 'Order does not exist'))
  }

  return Result.ok({ id })
}
```

## Error properties

| Property | Meaning |
| --- | --- |
| `message` | Error message inherited from `Error`. Named factories use a standard message from `ERROR_CODE_MESSAGES`. |
| `code` | String identifying the error category or application condition. |
| `status` | Numeric HTTP status metadata. No response is sent when the error is created. |
| `name` | Name supplied by the caller, often identifying the operation or component. |
| `cause` | Original error or other diagnostic context. Its type is `unknown` and it can be `undefined`. |
| Additional properties | Application context copied from the payload, such as a `header` dictionary. |

For factories that accept `name` and `message`, the supplied message becomes
the message of a new `Error` stored in `cause`. It does not replace the
standard `AppError.message`.

```ts
import { AppError } from '@xeno-js/shared'

const error = AppError.notFound('GetOrder', 'Order 42 does not exist')

console.log(error.code)    // NOT_FOUND
console.log(error.status)  // 404
console.log(error.message) // errors.not_found

if (error.cause instanceof Error) {
  console.log(error.cause.message) // Order 42 does not exist
}
```

Treat `cause` and custom properties as potentially sensitive. Inspect or log
them according to your application's policy; do not assume they are safe to
send to a client.

## Named factories

Named factories return an `AppError`; they do not throw it. The table shows
the code and status each factory assigns:

| Factory | Code | Status | Cause or additional metadata |
| --- | --- | --- | --- |
| `badRequest(name, message)` | `BAD_REQUEST` | 400 | `Error(message)` |
| `validationError(name, message)` | `VALIDATION_FAILED` | 400 | `Error(message)` |
| `unauthorized(name, message)` | `UNAUTHORIZED` | 401 | `Error(message)` and a `WWW-Authenticate` Bearer header |
| `authFailed(name, message)` | `AUTHENTICATION_FAILED` | 401 | `Error(message)` |
| `forbidden(name, message)` | `FORBIDDEN` | 403 | `Error(message)` |
| `notFound(name, message)` | `NOT_FOUND` | 404 | `Error(message)` |
| `notSupported(name, message)` | `METHOD_NOT_ALLOWED` | 405 | `Error(message)` |
| `conflict(name, message)` | `CONFLICT` | 409 | `Error(message)` |
| `aborted(name)` | `ABORTED` | 499 | An `Error` describing a closed client connection |
| `internalServerError(name, err)` | `SYSTEM_ERROR` | 500 | The supplied `err`, which can be any value |

The factories use `ERROR_CODES`, `ERROR_CODE_MESSAGES`, and `STATUS_CODES`
from `@xeno-js/shared`. Choose a factory based on the condition your
application detected. For example, `unauthorized` and `authFailed` both use
status 401, but only `unauthorized` adds the Bearer challenge header.

```ts
import { AppError } from '@xeno-js/shared'

const error = AppError.conflict('CreateOrder', 'Order already exists')
```

## Create a custom error

Use `AppError.create()` when the built-in factories do not express your
condition. Supply `message`, `code`, `status`, `name`, and `cause`; the
payload type requires `cause`, although its value can be `undefined`.
Additional properties are copied onto the instance.

```ts
import { AppError } from '@xeno-js/shared'

const error = AppError.create({
  code: 'ORDER_ALREADY_SHIPPED',
  message: 'The order has already shipped.',
  status: 409,
  name: 'CancelOrder',
  cause: undefined,
  orderId: '42',
})
```

Custom properties have type `unknown` when read through `AppError`. Check
their type before using them:

```ts
if (typeof error.orderId === 'string') {
  console.log(error.orderId)
}
```

`AppError` has a private constructor. Use `create()` or a named factory
instead of `new AppError(...)`. Keep custom `message`, `code`, and any
response headers safe for their intended audience.

## Return or throw an AppError

Return an error when failure is part of the operation's result contract:

```ts
import { AppError, Result, type ResultType } from '@xeno-js/shared'

function cancelOrder(shipped: boolean): ResultType<void> {
  if (shipped) {
    return Result.fail(AppError.conflict('cancelOrder', 'Order already shipped'))
  }

  return Result.ok()
}
```

To throw, use `throw` with a returned error or call `AppError.throw()` with
the complete custom payload:

```ts
import { AppError } from '@xeno-js/shared'

throw AppError.forbidden('CancelOrder', 'The user cannot cancel this order')
```

```ts
import { AppError } from '@xeno-js/shared'

AppError.throw({
  code: 'ORDER_ALREADY_SHIPPED',
  message: 'The order has already shipped.',
  status: 409,
  name: 'CancelOrder',
  cause: undefined,
})
```

`AppError.throw()` returns `never` because it always throws. Neither form
automatically produces a failed result outside an exception handler.

## Handle cancellation

`AppError.throwIfAborted(signal, name)` accepts an `AbortSignal`, `null`, or
`undefined`. It throws `AppError.aborted(name)` only when the signal exists
and is already aborted:

```ts
import { AppError } from '@xeno-js/shared'

function prepareOrder(signal?: AbortSignal): void {
  AppError.throwIfAborted(signal, 'prepareOrder')
  // Continue with work that respects the signal.
}
```

This checks the signal at the time of the call. It does not subscribe to
later aborts or cancel work on its own. Pass the signal to the underlying
operations and check it at appropriate boundaries.

## CQRS and HTTP boundaries

The [Exception Pipeline](/docs/application/pipelines/exception) catches values thrown by the
next CQRS behavior or handler. It returns an existing `AppError` in a failed
result. Other thrown values become a `SYSTEM_ERROR` with status `500`, and
the original value is kept as `cause`.

The behavior does not itself log or send a response. A controller can map a
failed result with `this.fail(result.getErrorOrThrow())`. The helper uses
the error's code, message, and status; it does not automatically include
`cause` in the response. It also reads an optional `header` property before
merging headers supplied to `fail()`.

Only provide client-safe response details and headers. See
[API Responses](/docs/http/api-response) for the response shape, header
precedence, and handling of successful results.

## Troubleshooting

### My custom message is not in the HTTP response

Named factories store their `message` argument in `cause`. The standard
`AppError.message` is used by `this.fail()`, which does not expose `cause`
automatically. Pass client-safe details explicitly when needed.

### My error became `SYSTEM_ERROR`

The CQRS exception behavior preserves actual `AppError` instances. Other
thrown values, including plain objects with similar properties, are wrapped
as system errors. Use a factory or `AppError.create()` for an application
error that must retain its code.

### My aborted operation continued

`throwIfAborted()` checks the current state once. Ensure the underlying work
receives the signal or check it again before later work.
