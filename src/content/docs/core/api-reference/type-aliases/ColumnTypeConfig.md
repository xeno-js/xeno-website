---
editUrl: false
next: false
prev: false
title: "ColumnTypeConfig"
---

> **ColumnTypeConfig**\<`T`, `TTypeConfig`\> = `T` & `object` & `TTypeConfig`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:14

## Type Declaration

### baseColumn

> **baseColumn**: `T` *extends* `object` ? `U` : `unknown`

### brand

> **brand**: `"Column"`

### columnType

> **columnType**: `T`\[`"columnType"`\]

### data

> **data**: `T`\[`"data"`\]

### dataType

> **dataType**: `T`\[`"dataType"`\]

### driverParam

> **driverParam**: `T`\[`"driverParam"`\]

### enumValues

> **enumValues**: `T`\[`"enumValues"`\]

### generated

> **generated**: [`GeneratedColumnConfig`](/core/api-reference/type-aliases/generatedcolumnconfig/)\<`T`\[`"data"`\]\> \| `undefined`

### hasDefault

> **hasDefault**: `T`\[`"hasDefault"`\]

### hasRuntimeDefault

> **hasRuntimeDefault**: `T`\[`"hasRuntimeDefault"`\]

### identity

> **identity**: `undefined` \| `"always"` \| `"byDefault"`

### isAutoincrement

> **isAutoincrement**: `T`\[`"isAutoincrement"`\]

### isPrimaryKey

> **isPrimaryKey**: `T`\[`"isPrimaryKey"`\]

### name

> **name**: `T`\[`"name"`\]

### notNull

> **notNull**: `T`\[`"notNull"`\]

### tableName

> **tableName**: `T`\[`"tableName"`\]

## Type Parameters

### T

`T` *extends* [`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>

### TTypeConfig

`TTypeConfig` *extends* `object`
