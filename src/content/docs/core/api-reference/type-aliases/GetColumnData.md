---
editUrl: false
next: false
prev: false
title: "GetColumnData"
---

> **GetColumnData**\<`TColumn`, `TInferMode`\> = `TInferMode` *extends* `"raw"` ? `TColumn`\[`"_"`\]\[`"data"`\] : `TColumn`\[`"_"`\]\[`"notNull"`\] *extends* `true` ? `TColumn`\[`"_"`\]\[`"data"`\] : `TColumn`\[`"_"`\]\[`"data"`\] \| `null`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:65

## Type Parameters

### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)

### TInferMode

`TInferMode` *extends* `"query"` \| `"raw"` = `"query"`
