---
editUrl: false
next: false
prev: false
title: "SingleKeyObject"
---

> **SingleKeyObject**\<`T`, `TError`, `K`\> = [`IsNever`](/core/api-reference/type-aliases/isnever/)\<`K`\> *extends* `true` ? `never` : [`IsUnion`](/core/api-reference/type-aliases/isunion/)\<`K`\> *extends* `true` ? [`DrizzleTypeError`](/core/api-reference/interfaces/drizzletypeerror/)\<`TError`\> : `T`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/utils.d.ts:18

## Type Parameters

### T

`T`

### TError

`TError` *extends* `string`

### K

`K` = keyof `T`
