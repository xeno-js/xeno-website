---
editUrl: false
next: false
prev: false
title: "ExtractTableRelationsFromSchema"
---

> **ExtractTableRelationsFromSchema**\<`TSchema`, `TTableName`\> = [`ExtractObjectValues`](/core/api-reference/type-aliases/extractobjectvalues/)\<`{ [K in keyof TSchema as TableRelationsKeysOnly<TSchema, TTableName, K>]: TSchema[K] extends Relations<TTableName, infer TConfig> ? TConfig : never }`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:61

## Type Parameters

### TSchema

`TSchema` *extends* `Record`\<`string`, `unknown`\>

### TTableName

`TTableName` *extends* `string`
