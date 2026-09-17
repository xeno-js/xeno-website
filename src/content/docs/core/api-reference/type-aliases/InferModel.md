---
editUrl: false
next: false
prev: false
title: "InferModel"
---

> **InferModel**\<`TTable`, `TInferMode`, `TConfig`\> = [`InferModelFromColumns`](/core/api-reference/type-aliases/infermodelfromcolumns/)\<`TTable`\[`"_"`\]\[`"columns"`\], `TInferMode`, `TConfig`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:67

:::caution[Deprecated]
Use one of the alternatives: [InferSelectModel](/core/api-reference/type-aliases/inferselectmodel/) / [InferInsertModel](/core/api-reference/type-aliases/inferinsertmodel/), or `table.$inferSelect` / `table.$inferInsert`
:::

## Type Parameters

### TTable

`TTable` *extends* [`Table`](/core/api-reference/classes/table/)

### TInferMode

`TInferMode` *extends* `"select"` \| `"insert"` = `"select"`

### TConfig

`TConfig` *extends* `object` = \{ `dbColumnNames`: `false`; \}
