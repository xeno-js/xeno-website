---
editUrl: false
next: false
prev: false
title: "InferColumnsDataTypes"
---

> **InferColumnsDataTypes**\<`TColumns`\> = `{ [Key in keyof TColumns]: GetColumnData<TColumns[Key], "query"> }`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:66

## Type Parameters

### TColumns

`TColumns` *extends* `Record`\<`string`, [`Column`](/core/api-reference/classes/column/)\>
