---
editUrl: false
next: false
prev: false
title: "FromSingleKeyObject"
---

> **FromSingleKeyObject**\<`T`, `Result`, `TError`, `K`\> = [`IsNever`](/core/api-reference/type-aliases/isnever/)\<`K`\> *extends* `true` ? `never` : [`IsUnion`](/core/api-reference/type-aliases/isunion/)\<`K`\> *extends* `true` ? [`DrizzleTypeError`](/core/api-reference/interfaces/drizzletypeerror/)\<`TError`\> : `Result`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/utils.d.ts:19

## Type Parameters

### T

`T`

### Result

`Result`

### TError

`TError` *extends* `string`

### K

`K` = keyof `T`
