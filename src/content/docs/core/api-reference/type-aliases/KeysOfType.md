---
editUrl: false
next: false
prev: false
title: "KeysOfType"
---

> **KeysOfType**\<`T`, `V`\> = `{ [K in keyof T]: T[K] extends V ? K : never }`\[keyof `T`\]

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:108

## Type Parameters

### T

`T`

### V

`V`

## Description

Extracts only the keys of `T` whose values are assignable to `V`.

## Example

```ts
type StringKeys = KeysOfType<{ a: string; b: number; c: string }, string>;
// => 'a' | 'c'

  *
  *
```

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
