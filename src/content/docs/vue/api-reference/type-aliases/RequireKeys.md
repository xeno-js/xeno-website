---
editUrl: false
next: false
prev: false
title: "RequireKeys"
---

> **RequireKeys**\<`T`, `K`\> = `Omit`\<`T`, `K`\> & `Required`\<`Pick`\<`T`, `K`\>\>

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:83

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

## Description

Produces a new type with only the keys `K` made required;
all other keys retain their original optionality.

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
