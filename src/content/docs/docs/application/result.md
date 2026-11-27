---
title: Result
description: Learn how to return, inspect, and propagate success and failure with Result and ResultType in Xeno.JS.
keywords:
- Xeno.JS Result
- Xeno.JS ResultType
- TypeScript result pattern
- application errors
- CQRS result
tags:
- application
- errors
- cqrs
faqs:
- question: What is ResultType in Xeno.JS?
  answer: ResultType<T, E> is an alias for Result<T, E>; its error type defaults to AppError.
- question: Can a successful Result contain undefined?
  answer: Yes. Result.ok() accepts an omitted value, and getValueOrThrow() returns T or undefined.
- question: Does Result.fail throw an exception?
  answer: No. Result.fail returns a failed Result containing the supplied error.
- question: Does isOk narrow the Result type?
  answer: No. isOk returns a boolean, and the value returned by getValueOrThrow remains optional.
---

## Introduction

`Result<TValue, TError>` represents the outcome of an operation. A result is
either successful, with an optional value, or failed, with an error. Callers
can inspect the outcome and decide how to handle it.

`ResultType<T, E>` is an alias for `Result<T, E>` whose error type defaults
to `AppError`. Xeno.JS uses it in contracts such as CQRS handlers and
repositories. Both types and the `Result` class are available from
`@xeno-js/shared`.

```ts
import { AppError, Result, type ResultType } from '@xeno-js/shared'

interface User {
  id: string
}

function findUser(id: string): ResultType<User> {
  if (id !== '42') {
    return Result.fail(AppError.notFound('findUser', 'User does not exist'))
  }

  return Result.ok({ id })
}
```

Creating a failed result does not throw. The caller receives the `AppError`
and can propagate it, inspect it, or map it at a boundary.

## Create a successful result

Use `Result.ok(value)` when an operation succeeds:

```ts
import { Result } from '@xeno-js/shared'

const result = Result.ok({ id: '42', name: 'Ada' })
```

The value is optional. For an operation without a return value, use
`Result.ok()`:

```ts
import { Result, type ResultType } from '@xeno-js/shared'

function complete(): ResultType<void> {
  return Result.ok()
}
```

A successful result can also contain `undefined` when its declared value
type is not `void`: `Result.ok<T>()` accepts no value. `isOk()` confirms the
outcome, not the presence of a value. `null`, `false`, `0`, and an empty
string are values and do not indicate failure.

## Create a failed result

Pass an error to `Result.fail(error)`:

```ts
import { AppError, Result, type ResultType } from '@xeno-js/shared'

function reserve(quantity: number): ResultType<number> {
  if (quantity <= 0) {
    return Result.fail(
      AppError.validationError('reserve', 'Quantity must be positive'),
    )
  }

  return Result.ok(quantity)
}
```

`Result` does not require the error to be an `AppError`. Set a different
error type where your contract needs one:

```ts
import { Result, type ResultType } from '@xeno-js/shared'

type ParseError = { code: 'INVALID_NUMBER' }

function parseCount(input: string): ResultType<number, ParseError> {
  const count = Number(input)
  if (!Number.isInteger(count)) {
    return Result.fail({ code: 'INVALID_NUMBER' })
  }

  return Result.ok(count)
}
```

When using explicit generic arguments on `Result.fail`, the first argument
is the success type and the second is the error type:
`Result.fail<number, ParseError>({ code: 'INVALID_NUMBER' })`.

## Inspect an outcome

Check `isOk()` before reading the matching side of the result.
`getValueOrThrow()` throws a new `Error` on failure;
`getErrorOrThrow()` throws a new `Error` on success.

```ts
const result = findUser('42')

if (!result.isOk()) {
  const error = result.getErrorOrThrow()
  console.error(error.code, error.message)
} else {
  const user = result.getValueOrThrow()
  if (user === undefined) {
    throw new Error('findUser succeeded without a user')
  }

  console.log(user.id)
}
```

This example uses `findUser` from the introduction. The check for
`undefined` is appropriate because that operation promises a user when it
succeeds. Other operations may intentionally return no value.

`isOk()` returns a boolean rather than a TypeScript type predicate. It does
not narrow the result into separate success and failure types, and
`getValueOrThrow()` always returns `TValue | undefined`. If it is called on
a failed result, it throws `Cannot get the value of a failed result.`, not
the stored error. To obtain the original error, call `getErrorOrThrow()`.

## Propagate a failure

When one operation depends on another, return its error before continuing:

```ts
import { Result, type ResultType } from '@xeno-js/shared'

interface User {
  id: string
}

function loadUser(id: string): ResultType<User> {
  // Application-specific implementation.
  return Result.ok({ id })
}

function getUserId(id: string): ResultType<string> {
  const userResult = loadUser(id)

  if (!userResult.isOk()) {
    return Result.fail(userResult.getErrorOrThrow())
  }

  const user = userResult.getValueOrThrow()
  if (user === undefined) {
    throw new Error('loadUser succeeded without a user')
  }

  return Result.ok(user.id)
}
```

This creates another failed `Result` containing the same error. It does not
wrap or log the error. The caller still needs to decide where to handle it.

## Result types and defaults

| Type | Default error type | Use |
| --- | --- | --- |
| `Result<T, E>` | `never` | Class type with an explicitly chosen error type when needed. |
| `ResultType<T, E>` | `AppError` | Alias used by Xeno.JS application contracts. |

`ResultType<T, E>` is an alias, not a value extractor or a separate runtime
class. `ResultType<User>` means `Result<User, AppError>`.
`Result.ok<T>()` returns `Result<T>` with the class's `never` error default;
`Result.fail<T, E>()` returns `Result<T, E>`.

## Results, exceptions, and HTTP

Returning `Result.fail(error)` makes failure part of the return value.
Throwing interrupts execution until a caller catches the exception. `Result`
does not catch exceptions from the function that creates it.

With CQRS configured, the [Exception Pipeline](/docs/application/pipelines/exception)
converts exceptions thrown by the next behavior or handler into failed
results. It preserves an existing `AppError` and wraps other thrown values.
This conversion applies within that pipeline, not to arbitrary code.

A result is not an HTTP response. A controller can inspect a failed
`ResultType` and pass its error to `this.fail()`. A successful value can be
passed to `this.ok()` after deciding whether `undefined` is valid for the
operation. See [API Responses](/docs/http/api-response) for the mapping and
[AppError](/docs/application/app-error) for error creation.

## Troubleshooting

### A successful result has no value

`Result.ok()` and `Result.ok<T>()` can both succeed without a value. Check
for `undefined` when the operation requires data; for `void` or optional
data, handle the absence according to the contract.

### Reading the result throws

Call `isOk()` first. Use `getValueOrThrow()` on success and
`getErrorOrThrow()` on failure. The accessor errors indicate that the wrong
side was read; they are not the error stored in the result.

### An exception did not become a failed result

`Result` does not wrap exceptions automatically. Check whether the throwing
code ran inside the configured CQRS exception behavior. See
[Exception Pipeline](/docs/application/pipelines/exception) for its scope.
