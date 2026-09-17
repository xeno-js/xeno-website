---
editUrl: false
next: false
prev: false
title: "AsyncResolver"
---

> **AsyncResolver** = \<`T`\>(`token`) => `Promise`\<`T`\>

Defined in: [.temp/xeno-shared/src/shared/types/common.types.ts:211](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/common.types.ts#L211)

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
