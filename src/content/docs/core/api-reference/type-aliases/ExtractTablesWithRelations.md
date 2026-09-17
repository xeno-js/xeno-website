---
editUrl: false
next: false
prev: false
title: "ExtractTablesWithRelations"
---

> **ExtractTablesWithRelations**\<`TSchema`\> = `{ [K in keyof TSchema as TSchema[K] extends Table ? K : never]: TSchema[K] extends Table ? { columns: TSchema[K]["_"]["columns"]; dbName: TSchema[K]["_"]["name"]; primaryKey: AnyColumn[]; relations: ExtractTableRelationsFromSchema<TSchema, TSchema[K]["_"]["name"]>; tsName: K & string } : never }`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:139

## Type Parameters

### TSchema

`TSchema` *extends* `Record`\<`string`, `unknown`\>
