---
editUrl: false
next: false
prev: false
title: "RequiredKeyOnly"
---

> **RequiredKeyOnly**\<`TKey`, `T`\> = `T` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)\<\{ `hasDefault`: `false`; `notNull`: `true`; \}\> ? `TKey` : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/operations.d.ts:5

## Type Parameters

### TKey

`TKey` *extends* `string`

### T

`T` *extends* [`Column`](/core/api-reference/classes/column/)
