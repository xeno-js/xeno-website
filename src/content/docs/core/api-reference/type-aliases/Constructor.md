---
editUrl: false
next: false
prev: false
title: "Constructor"
---

> **Constructor**\<`T`, `TArgs`\> = (...`args`) => `T`

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:47

## Type Parameters

### T

`T`

The instance type produced by `new`.

### TArgs

`TArgs` *extends* [`Dictionary`](/core/api-reference/type-aliases/dictionary/)[] = [`Dictionary`](/core/api-reference/type-aliases/dictionary/)[]

Constructor parameter tuple; defaults to `any[]`.

  *
  *

## Parameters

### args

...`TArgs`

## Returns

`T`

## Description

Represents a concrete (instantiable) class.
Used by IoC containers and auto-wiring utilities to bind concrete implementations.

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
