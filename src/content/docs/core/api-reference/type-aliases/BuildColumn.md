---
editUrl: false
next: false
prev: false
title: "BuildColumn"
---

> **BuildColumn**\<`TTableName`, `TBuilder`, `TDialect`\> = `TDialect` *extends* `"pg"` ? `PgColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\>, \{ \}, [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`Omit`\<`TBuilder`\[`"_"`\], keyof [`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\> \| `"brand"` \| `"dialect"`\>\>\> : `TDialect` *extends* `"mysql"` ? `MySqlColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\>, \{ \}, [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`Omit`\<`TBuilder`\[`"_"`\], keyof [`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\> \| `"brand"` \| `"dialect"` \| `"primaryKeyHasDefault"` \| `"mysqlColumnBuilderBrand"`\>\>\> : `TDialect` *extends* `"sqlite"` ? `SQLiteColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\>, \{ \}, [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`Omit`\<`TBuilder`\[`"_"`\], keyof [`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\> \| `"brand"` \| `"dialect"`\>\>\> : `TDialect` *extends* `"common"` ? [`Column`](/core/api-reference/classes/column/)\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\>, \{ \}, [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`Omit`\<`TBuilder`\[`"_"`\], keyof [`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<...\[...\], `TTableName`\> \| `"brand"` \| `"dialect"`\>\>\> : `TDialect` *extends* `"singlestore"` ? `SingleStoreColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\>, \{ \}, [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`Omit`\<`TBuilder`\[`"_"`\], keyof [`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<..., ...\> \| `"brand"` \| `"dialect"` \| `"primaryKeyHasDefault"` \| `"singlestoreColumnBuilderBrand"`\>\>\> : `TDialect` *extends* `"gel"` ? `GelColumn`\<[`MakeColumnConfig`](/core/api-reference/type-aliases/makecolumnconfig/)\<`TBuilder`\[`"_"`\], `TTableName`\>, \{ \}, [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`Omit`\<`TBuilder`\[`"_"`\], keyof ... \| `"brand"` \| `"dialect"`\>\>\> : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:230

## Type Parameters

### TTableName

`TTableName` *extends* `string`

### TBuilder

`TBuilder` *extends* [`ColumnBuilderBase`](/core/api-reference/interfaces/columnbuilderbase/)

### TDialect

`TDialect` *extends* [`Dialect`](/core/api-reference/type-aliases/dialect/)
