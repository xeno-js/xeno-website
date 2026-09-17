---
editUrl: false
next: false
prev: false
title: "Guards"
---

> `const` **Guards**: `Readonly`\<\{ `hasMethod`: `boolean`; `isArray`: `value is TValue[]`; `isBigInt`: `value is bigint`; `isBoolean`: `value is boolean`; `isDate`: `value is Date`; `isDefined`: `value is TValue`; `isError`: `value is Error`; `isFunction`: `value is (args: readonly unknown[]) => unknown`; `isInteger`: `value is number`; `isNullOrEmpty`: value is null \| undefined; `isNumber`: `value is number`; `isObject`: `value is object`; `isObjectRecord`: `value is Readonly<Dictionary<unknown>>`; `isPromiseLike`: `value is PromiseLike<TValue>`; `isString`: `value is string`; `isSymbol`: `value is symbol`; `throwIfNegative`: `void`; `throwIfNotInteger`: `void`; `throwIfNullOrEmpty`: `void`; \}\>

Defined in: [.temp/xeno-shared/src/shared/utils/guards.utils.ts:15](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/utils/guards.utils.ts#L15)

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
