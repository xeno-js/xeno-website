---
editUrl: false
next: false
prev: false
title: "ChangeColumnTableName"
---

> **ChangeColumnTableName**\<`TColumn`, `TAlias`, `TDialect`\> = `TDialect` *extends* `"pg"` ? `PgColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TColumn`\[`"_"`\], `TAlias`\>\> : `TDialect` *extends* `"mysql"` ? `MySqlColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TColumn`\[`"_"`\], `TAlias`\>\> : `TDialect` *extends* `"singlestore"` ? `SingleStoreColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TColumn`\[`"_"`\], `TAlias`\>\> : `TDialect` *extends* `"sqlite"` ? `SQLiteColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TColumn`\[`"_"`\], `TAlias`\>\> : `TDialect` *extends* `"gel"` ? `GelColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TColumn`\[`"_"`\], `TAlias`\>\> : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:242

## Type Parameters

### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)

### TAlias

`TAlias` *extends* `string`

### TDialect

`TDialect` *extends* [`Dialect`](/core/api-reference/type-aliases/dialect/)
