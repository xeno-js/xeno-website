---
editUrl: false
next: false
prev: false
title: "BuildColumns"
---

> **BuildColumns**\<`TTableName`, `TConfigMap`, `TDialect`\> = `{ [Key in keyof TConfigMap]: BuildColumn<TTableName, { _: Omit<TConfigMap[Key]["_"], "name"> & { name: TConfigMap[Key]["_"]["name"] extends "" ? Assume<Key, string> : TConfigMap[Key]["_"]["name"] } }, TDialect> }` & `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:232

## Type Parameters

### TTableName

`TTableName` *extends* `string`

### TConfigMap

`TConfigMap` *extends* `Record`\<`string`, [`ColumnBuilderBase`](/core/api-reference/interfaces/columnbuilderbase/)\>

### TDialect

`TDialect` *extends* [`Dialect`](/core/api-reference/type-aliases/dialect/)
