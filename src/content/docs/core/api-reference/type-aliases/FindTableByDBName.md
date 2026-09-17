---
editUrl: false
next: false
prev: false
title: "FindTableByDBName"
---

> **FindTableByDBName**\<`TSchema`, `TTableName`\> = [`ExtractObjectValues`](/core/api-reference/type-aliases/extractobjectvalues/)\<`{ [K in keyof TSchema as TSchema[K]["dbName"] extends TTableName ? K : never]: TSchema[K] }`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:99

## Type Parameters

### TSchema

`TSchema` *extends* [`TablesRelationalConfig`](/core/api-reference/type-aliases/tablesrelationalconfig/)

### TTableName

`TTableName` *extends* `string`
