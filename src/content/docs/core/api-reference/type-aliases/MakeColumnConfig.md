---
editUrl: false
next: false
prev: false
title: "MakeColumnConfig"
---

> **MakeColumnConfig**\<`T`, `TTableName`, `TData`\> = `object` & `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:32

## Type Declaration

### baseColumn

> **baseColumn**: `T` *extends* `object` ? [`BuildColumn`](/core/api-reference/type-aliases/buildcolumn/)\<`TTableName`, `U`, `"common"`\> : `never`

### columnType

> **columnType**: `T`\[`"columnType"`\]

### data

> **data**: `TData`

### dataType

> **dataType**: `T`\[`"dataType"`\]

### driverParam

> **driverParam**: `T`\[`"driverParam"`\]

### enumValues

> **enumValues**: `T`\[`"enumValues"`\]

### generated

> **generated**: `T` *extends* `object` ? `unknown` *extends* `G` ? `undefined` : `G` *extends* `undefined` ? `undefined` : `G` : `undefined`

### hasDefault

> **hasDefault**: `T` *extends* `object` ? `true` : `false`

### hasRuntimeDefault

> **hasRuntimeDefault**: `T` *extends* `object` ? `true` : `false`

### identity

> **identity**: `T` *extends* `object` ? `"always"` : `T` *extends* `object` ? `"byDefault"` : `undefined`

### isAutoincrement

> **isAutoincrement**: `T` *extends* `object` ? `true` : `false`

### isPrimaryKey

> **isPrimaryKey**: `T` *extends* `object` ? `true` : `false`

### name

> **name**: `T`\[`"name"`\]

### notNull

> **notNull**: `T` *extends* `object` ? `true` : `false`

### tableName

> **tableName**: `TTableName`

## Type Parameters

### T

`T` *extends* [`ColumnBuilderBaseConfig`](/core/api-reference/interfaces/columnbuilderbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>

### TTableName

`TTableName` *extends* `string`

### TData

`TData` = `T` *extends* `object` ? `U` : `T`\[`"data"`\]
