---
editUrl: false
next: false
prev: false
title: "KeysOfType"
---

> **KeysOfType**\<`T`, `V`\> = `{ [K in keyof T]: T[K] extends V ? K : never }`\[keyof `T`\]

Defined in: [.temp/xeno-shared/src/shared/types/common.types.ts:121](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/common.types.ts#L121)

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
