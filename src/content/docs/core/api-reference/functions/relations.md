---
editUrl: false
next: false
prev: false
title: "relations"
---

> **relations**\<`TTableName`, `TRelations`\>(`table`, `relations`): [`Relations`](/core/api-reference/classes/relations/)\<`TTableName`, `TRelations`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:173

## Type Parameters

### TTableName

`TTableName` *extends* `string`

### TRelations

`TRelations` *extends* `Record`\<`string`, [`Relation`](/core/api-reference/classes/relation/)\<`any`\>\>

## Parameters

### table

[`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

### relations

(`helpers`) => `TRelations`

## Returns

[`Relations`](/core/api-reference/classes/relations/)\<`TTableName`, `TRelations`\>
