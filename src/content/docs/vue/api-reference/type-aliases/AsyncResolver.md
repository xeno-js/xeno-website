---
editUrl: false
next: false
prev: false
title: "AsyncResolver"
---

> **AsyncResolver** = \<`T`\>(`token`) => `Promise`\<`T`\>

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:190

## Type Parameters

### T

`T`

Narrows the resolved type at each call site.

  *
  *

## Parameters

### token

`symbol`

## Returns

`Promise`\<`T`\>

## Description

Async variant of `Resolver` for containers that resolve
dependencies asynchronously (e.g. lazy module loading, remote config).

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
