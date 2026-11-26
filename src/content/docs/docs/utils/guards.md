---
title: Guards
description: Use Xeno.JS Guards to check values at runtime, narrow TypeScript types, and reject empty or invalid inputs.
keywords: [Xeno.JS, Guards, type guards, runtime validation, TypeScript]
tags: [utilities, guards, validation, typescript]
faqs:
  - question: Does Guards.isDefined accept NaN?
    answer: No. It returns false for null, undefined, and NaN.
  - question: Does isNullOrEmpty treat false or zero as empty?
    answer: No. It treats null, undefined, NaN, whitespace-only strings, and empty arrays as empty.
---

## Check values at runtime

`Guards` provides predicates and assertions for common JavaScript values. Type predicates such as `isString()` can also narrow an `unknown` value in TypeScript.

```ts
import { Guards } from '@xeno-js/core'

function displayName(value: unknown): string {
  if (!Guards.isString(value) || Guards.isNullOrEmpty(value)) {
    throw new Error('Name is required')
  }
  return value.trim()
}

console.log(displayName('  Ada  ')) // Ada
console.log(Guards.isNullOrEmpty(false)) // false
console.log(Guards.isDefined(NaN)) // false
```

## Available checks

- `isDefined(value)` rejects `null`, `undefined`, and `NaN`.
- `isNullOrEmpty(value)` also treats whitespace-only strings and empty arrays as empty. It does not treat `false`, `0`, or an empty object as empty.
- `isString`, `isNumber`, `isInteger`, `isBoolean`, `isBigInt`, `isSymbol`, and `isFunction` check primitive or function types. `isNumber` requires a finite number.
- `isArray<T>()` checks that the value is an array, not that its elements are of type `T`.
- `isDate()` checks for a valid `Date`; `isError()` uses `instanceof Error`.
- `isObject()` accepts non-null objects, including arrays. `isObjectRecord()` checks the `[object Object]` tag; it is not a prototype or schema validation.
- `isPromiseLike()` checks for a callable `then`; `hasMethod(object, name)` checks for a callable property.

## Assertions

`throwIfNullOrEmpty(value, message)` throws the supplied message for an empty value. `throwIfNotInteger(value, message)` throws unless the value is a finite integer.

`throwIfNegative(value, message)` throws only for negative integers. Negative fractions and non-integers pass this particular check; validate integer requirements separately when needed.

```ts
Guards.throwIfNotInteger(3, 'Count must be an integer')
Guards.throwIfNegative(3, 'Count must not be negative')
```

## Common problems

Type guards do not validate nested fields or business rules. In particular, a generic argument to `isArray<T>()` is not a runtime element validator. Validate each item or use an application schema for untrusted input.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
