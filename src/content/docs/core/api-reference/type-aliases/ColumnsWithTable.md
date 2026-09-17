---
editUrl: false
next: false
prev: false
title: "ColumnsWithTable"
---

> **ColumnsWithTable**\<`TTableName`, `TForeignTableName`, `TColumns`\> = `{ [Key in keyof TColumns]: AnyColumn<{ tableName: TForeignTableName }> }`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/utils.d.ts:39

## Type Parameters

### TTableName

`TTableName` *extends* `string`

### TForeignTableName

`TForeignTableName` *extends* `string`

### TColumns

`TColumns` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)\<\{ `tableName`: `TTableName`; \}\>[]
