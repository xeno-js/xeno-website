---
editUrl: false
next: false
prev: false
title: "Relations"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:22

## Type Parameters

### TTableName

`TTableName` *extends* `string` = `string`

### TConfig

`TConfig` *extends* `Record`\<`string`, [`Relation`](/core/api-reference/classes/relation/)\> = `Record`\<`string`, [`Relation`](/core/api-reference/classes/relation/)\>

## Constructors

### Constructor

> **new Relations**\<`TTableName`, `TConfig`\>(`table`, `config`): `Relations`\<`TTableName`, `TConfig`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:29

#### Parameters

##### table

[`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

##### config

(`helpers`) => `TConfig`

#### Returns

`Relations`\<`TTableName`, `TConfig`\>

## Properties

### $brand

> `readonly` **$brand**: `"Relations"`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:28

***

### config

> `readonly` **config**: (`helpers`) => `TConfig`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:26

#### Parameters

##### helpers

###### many

\<`TForeignTable`\>(`referencedTable`, `config?`) => [`Many`](/core/api-reference/classes/many/)\<`TForeignTable`\[`"_"`\]\[`"name"`\]\>

###### one

\<`TForeignTable`, `TColumns`\>(`table`, `config?`) => [`One`](/core/api-reference/classes/one/)\<`TForeignTable`\[`"_"`\]\[`"name"`\], [`Equal`](/core/api-reference/type-aliases/equal/)\<`TColumns`\[`number`\]\[`"_"`\]\[`"notNull"`\], `true`\>\>

#### Returns

`TConfig`

***

### table

> `readonly` **table**: [`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:23

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:27
