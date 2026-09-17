---
editUrl: false
next: false
prev: false
title: "DBQueryConfig"
---

> **DBQueryConfig**\<`TRelationType`, `TIsRoot`, `TSchema`, `TTableConfig`\> = `object` & `TRelationType` *extends* `"many"` ? `object` & `TIsRoot` *extends* `true` ? `object` : `object` : `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:102

## Type Declaration

### columns?

> `optional` **columns?**: `{ [K in keyof TTableConfig["columns"]]?: boolean }`

### extras?

> `optional` **extras?**: `Record`\<`string`, [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\> \| ((`fields`, `operators`) => `Record`\<`string`, [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\>)

### with?

> `optional` **with?**: \{ \[K in keyof TTableConfig\["relations"\]\]?: true \| DBQueryConfig\<TTableConfig\["relations"\]\[K\] extends One ? "one" : "many", false, TSchema, FindTableByDBName\<TSchema, TTableConfig\["relations"\]\[K\]\["referencedTableName"\]\>\> \}

## Type Parameters

### TRelationType

`TRelationType` *extends* `"one"` \| `"many"` = `"one"` \| `"many"`

### TIsRoot

`TIsRoot` *extends* `boolean` = `boolean`

### TSchema

`TSchema` *extends* [`TablesRelationalConfig`](/core/api-reference/type-aliases/tablesrelationalconfig/) = [`TablesRelationalConfig`](/core/api-reference/type-aliases/tablesrelationalconfig/)

### TTableConfig

`TTableConfig` *extends* [`TableRelationalConfig`](/core/api-reference/interfaces/tablerelationalconfig/) = [`TableRelationalConfig`](/core/api-reference/interfaces/tablerelationalconfig/)
