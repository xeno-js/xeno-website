---
editUrl: false
next: false
prev: false
title: "RequireKeys"
---

> **RequireKeys**\<`T`, `K`\> = `Omit`\<`T`, `K`\> & `Required`\<`Pick`\<`T`, `K`\>\>

Defined in: [.temp/xeno-shared/src/shared/types/common.types.ts:94](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/common.types.ts#L94)

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
