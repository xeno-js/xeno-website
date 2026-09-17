---
editUrl: false
next: false
prev: false
title: "BuildExtraConfigColumns"
---

> **BuildExtraConfigColumns**\<`_TTableName`, `TConfigMap`, `TDialect`\> = `{ [Key in keyof TConfigMap]: BuildIndexColumn<TDialect> }` & `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:239

## Type Parameters

### _TTableName

`_TTableName` *extends* `string`

### TConfigMap

`TConfigMap` *extends* `Record`\<`string`, [`ColumnBuilderBase`](/core/api-reference/interfaces/columnbuilderbase/)\>

### TDialect

`TDialect` *extends* [`Dialect`](/core/api-reference/type-aliases/dialect/)
