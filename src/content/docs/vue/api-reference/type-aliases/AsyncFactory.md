---
editUrl: false
next: false
prev: false
title: "AsyncFactory"
---

> **AsyncFactory**\<`T`, `TArgs`\> = (...`args`) => `Promise`\<`T`\>

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:149

## Type Parameters

### T

`T`

The type of the resolved value.

### TArgs

`TArgs` *extends* `unknown`[] = \[\]

Tuple of factory argument types.

  *
  *

## Parameters

### args

...`TArgs`

## Returns

`Promise`\<`T`\>

## Description

Async variant of `Factory<T, TArgs>`.
Use when the construction process involves I/O (e.g. DB pool acquisition).

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
