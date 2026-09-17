---
editUrl: false
next: false
prev: false
title: "InferModelFromColumns"
---

> **InferModelFromColumns**\<`TColumns`, `TInferMode`, `TConfig`\> = [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`TInferMode` *extends* `"insert"` ? `{ [Key in keyof TColumns & string as RequiredKeyOnly<MapColumnName<Key, TColumns[Key], TConfig["dbColumnNames"]>, TColumns[Key]>]: GetColumnData<TColumns[Key], "query"> }` & `{ [Key in keyof TColumns & string as OptionalKeyOnly<MapColumnName<Key, TColumns[Key], TConfig["dbColumnNames"]>, TColumns[Key], TConfig["override"]>]?: GetColumnData<TColumns[Key], "query"> }` : `{ [Key in keyof TColumns & string as MapColumnName<Key, TColumns[Key], TConfig["dbColumnNames"]>]: GetColumnData<TColumns[Key], "query"> }`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:52

## Type Parameters

### TColumns

`TColumns` *extends* `Record`\<`string`, [`Column`](/core/api-reference/classes/column/)\>

### TInferMode

`TInferMode` *extends* `"select"` \| `"insert"` = `"select"`

### TConfig

`TConfig` *extends* `object` = \{ `dbColumnNames`: `false`; `override`: `false`; \}
