---
editUrl: false
next: false
prev: false
title: "Guards"
---

> `const` **Guards**: `Readonly`\<\{ `hasMethod`: (`obj`, `methodName`) => `boolean`; `isArray`: \<`TValue`\>(`value`) => `value is TValue[]`; `isBigInt`: (`value`) => `value is bigint`; `isBoolean`: (`value`) => `value is boolean`; `isDate`: (`value`) => `value is Date`; `isDefined`: \<`TValue`\>(`value`) => `value is TValue`; `isError`: (`value`) => `value is Error`; `isFunction`: (`value`) => `value is (args: readonly unknown[]) => unknown`; `isInteger`: (`value`) => `value is number`; `isNullOrEmpty`: \<`TValue`\>(`value`) => value is null \| undefined; `isNumber`: (`value`) => `value is number`; `isObject`: (`value`) => `value is object`; `isObjectRecord`: (`value`) => `value is Readonly<Dictionary<unknown>>`; `isPromiseLike`: \<`TValue`\>(`value`) => `value is PromiseLike<TValue>`; `isString`: (`value`) => `value is string`; `isSymbol`: (`value`) => `value is symbol`; `throwIfNegative`: (`value`, `errorMessage`) => `void`; `throwIfNotInteger`: (`value`, `errorMessage`) => `void`; `throwIfNullOrEmpty`: \<`TValue`\>(`value`, `errorMessage`) => `void`; \}\>

Defined in: .temp/xeno-shared/dist/shared/utils/guards.utils.d.ts:11

## Description

Centralized type guards and runtime predicates.

  *
  *

## Author

Xeno
  *

## Version

1.0.0
  *

## Since

2025-09-30
  *

## Link

https://github.com/Mattia-Carcione/xeno-js
