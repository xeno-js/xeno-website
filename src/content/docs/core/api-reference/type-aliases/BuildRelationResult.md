---
editUrl: false
next: false
prev: false
title: "BuildRelationResult"
---

> **BuildRelationResult**\<`TSchema`, `TInclude`, `TRelations`\> = \{ \[K in NonUndefinedKeysOnly\<TInclude\> & keyof TRelations\]: TRelations\[K\] extends infer TRel extends Relation ? BuildQueryResult\<TSchema, FindTableByDBName\<TSchema, TRel\["referencedTableName"\]\>, Assume\<TInclude\[K\], true \| Record\<string, unknown\>\>\> extends infer TResult ? TRel extends One ? TResult \| (Equal\<TRel\["isNullable"\], false\> extends true ? null : never) : TResult\[\] : never : never \}

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:149

## Type Parameters

### TSchema

`TSchema` *extends* [`TablesRelationalConfig`](/core/api-reference/type-aliases/tablesrelationalconfig/)

### TInclude

`TInclude`

### TRelations

`TRelations` *extends* `Record`\<`string`, [`Relation`](/core/api-reference/classes/relation/)\>
