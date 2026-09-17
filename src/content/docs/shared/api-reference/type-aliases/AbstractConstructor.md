---
editUrl: false
next: false
prev: false
title: "AbstractConstructor"
---

> **AbstractConstructor**\<`T`\> = (...`args`) => `T`

Defined in: [.temp/xeno-shared/src/shared/types/common.types.ts:68](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/common.types.ts#L68)

## Type Parameters

### T

`T`

The instance type produced by subclasses.

  * 
  *

## Parameters

### args

...[`Dictionary`](/shared/api-reference/type-aliases/dictionary/)[]

## Returns

`T`

## Description

Represents an abstract class that cannot be instantiated directly.
Used for binding abstract base classes in the IoC container without requiring
a concrete constructor signature.

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
