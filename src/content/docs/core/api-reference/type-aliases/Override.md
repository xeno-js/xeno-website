---
editUrl: false
next: false
prev: false
title: "Override"
---

> **Override**\<`T`, `K`, `V`\> = `Omit`\<`T`, `K`\> & `Record`\<`K`, `V`\>

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:94

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

### V

`V`

## Description

Produces a new type where property `K` is overridden with type `V`.
Useful for narrowing a property inside a generic base type.

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
