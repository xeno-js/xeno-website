---
title:
  'Guards Utility Specification: Runtime Type Checks & Invariant Assertions'
description:
  'Technical specification for the Guards utility module in Xeno, detailing
  runtime type narrowing, nullability checks, object inspections, and assertion
  helpers.'
keywords:
  [
    'Guards',
    'Xeno Utilities',
    'Type Narrowing',
    'Runtime Guards',
    'Invariant Enforcement',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Runtime Type Checks & Invariant Assertions with `Guards`

The `Guards` utility namespace provides centralized runtime type-guard
predicates and invariant assertion helpers. Frozen at initialization to prevent
tampering, `Guards` combines TypeScript type-narrowing signatures (`value is T`)
with runtime validation checks to prevent uncaught type exceptions (`TypeError`)
across application boundaries.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/guards.utils.ts`, `Guards` acts as the primary
runtime validation tool used internally by Xeno pipelines, extractors, and
repositories, while remaining fully accessible to developers building domain
logic.

### Key Features

- **TypeScript Type Narrowing**: Predicates use explicit `value is T` return
  signatures, allowing the TypeScript compiler to narrow unknown inputs
  automatically inside conditional blocks.

- **Strict Nullability Checks**: Differentiates between actual data values and
  empty/falsy representations (`null`, `undefined`, empty strings `''`, empty
  arrays `[]`, or `NaN`).

- **Fail-Fast Assertions**: Throws explicit runtime `Error` exceptions when
  critical invariants (such as integer constraints or non-empty presence) are
  violated.

---

## API Reference Specification

### 1. Nullability & Presence Guards

#### `Guards.isDefined<TValue>(value: Maybe<TValue>): value is TValue`

Checks whether a candidate value is neither `null`, `undefined`, an empty string
`''`, nor `NaN`.

- **Returns**: `true` if the value represents defined data.

- **Example**:

```typescript
if (Guards.isDefined(request.props.email)) {
  // TypeScript automatically narrows 'email' to string
  console.log(request.props.email.toLowerCase())
}
```

#### `Guards.isNullOrEmpty<TValue>(value: Maybe<TValue>): value is null | undefined`

Evaluates whether a value is absent. Returns `true` if the candidate is `null`,
`undefined`, a whitespace-only string, or an empty array `[]`.

- **Returns**: `true` when the value is empty or missing.

---

### 2. Assertion & Invariant Helpers

#### `Guards.throwIfNullOrEmpty<TValue>(value: Maybe<TValue>, errorMessage: string): void`

Enforces the presence of a value. Throws a standard `Error` with `errorMessage`
if `Guards.isNullOrEmpty(value)` evaluates to `true`.

```typescript
Guards.throwIfNullOrEmpty(
  config.databaseUrl,
  'Database connection string is required.',
)
```

#### `Guards.throwIfNegative(value: number, errorMessage: string): void`

Verifies that an integer is non-negative ($\ge 0$). Throws an `Error` if `value`
is a negative integer.

#### `Guards.throwIfNotInteger(value: number, errorMessage: string): void`

Verifies whether a numeric value is an integer. Throws an `Error` if `value` is
a float or `NaN`.

---

### 3. Data Type & Reflection Predicates

| Method                        | Type Signature                  | Description                                                                                |
| ----------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| **`isString(value)`**         | `value is string`               | Returns `true` if the primitive type is `string`.                                          |
| **`isNumber(value)`**         | `value is number`               | Returns `true` for finite numbers (rejects `Infinity` and `NaN`).                          |
| **`isInteger(value)`**        | `value is number`               | Returns `true` if the value is a finite integer.                                           |
| **`isBoolean(value)`**        | `value is boolean`              | Returns `true` for strict boolean primitives (`true` / `false`).                           |
| **`isBigInt(value)`**         | `value is bigint`               | Returns `true` for `bigint` primitives.                                                    |
| **`isSymbol(value)`**         | `value is symbol`               | Returns `true` for `symbol` instances.                                                     |
| **`isFunction(value)`**       | `value is Function`             | Returns `true` if the target candidate is executable.                                      |
| **`isArray<T>(value)`**       | `value is T[]`                  | Wraps `Array.isArray(value)`.                                                              |
| **`isDate(value)`**           | `value is Date`                 | Checks if value is a valid `Date` instance with a non-`NaN` epoch timestamp.               |
| **`isError(value)`**          | `value is Error`                | Checks if candidate inherits from the base `Error` class.                                  |
| **`isObject(value)`**         | `value is object`               | Returns `true` for non-null objects and arrays.                                            |
| **`isObjectRecord(value)`**   | `value is Readonly<Dictionary>` | Returns `true` strictly for plain objects (`[object Object]`), excluding arrays and Dates. |
| **`isPromiseLike<T>(value)`** | `value is PromiseLike<T>`       | Determines if a value is "thenable" (contains a `.then()` method).                         |
| **`hasMethod(obj, name)`**    | `boolean`                       | Checks if `obj` contains a function property matching `name`.                              |

---

## Practical Implementation Example

The snippet below demonstrates using `Guards` within a domain service to
validate input parameters and narrow types cleanly:

```typescript
import { Guards } from '@xeno/core'

export class OrderService {
  public processDiscount(discountCode: unknown, percentage: number): void {
    // 1. Enforce integer constraints on numeric inputs
    Guards.throwIfNotInteger(
      percentage,
      'Discount percentage must be an integer.',
    )
    Guards.throwIfNegative(
      percentage,
      'Discount percentage cannot be negative.',
    )

    // 2. Safely inspect optional string input with type narrowing
    if (Guards.isString(discountCode) && !Guards.isNullOrEmpty(discountCode)) {
      console.log(`Applying code: ${discountCode.toUpperCase()}`)
    }

    // 3. Inspect object structures dynamically
    if (
      Guards.isObjectRecord(discountCode) &&
      Guards.hasMethod(discountCode, 'isValid')
    ) {
      ;(discountCode as { isValid: () => boolean }).isValid()
    }
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
