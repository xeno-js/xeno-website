---
editUrl: false
next: false
prev: false
title: "TableRelationsKeysOnly"
---

> **TableRelationsKeysOnly**\<`TSchema`, `TTableName`, `K`\> = `TSchema`\[`K`\] *extends* [`Relations`](/core/api-reference/classes/relations/)\<`TTableName`\> ? `K` : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:60

## Type Parameters

### TSchema

`TSchema` *extends* `Record`\<`string`, `unknown`\>

### TTableName

`TTableName` *extends* `string`

### K

`K` *extends* keyof `TSchema`
