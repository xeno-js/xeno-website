---
editUrl: false
next: false
prev: false
title: "Relation"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:7

## Extended by

- [`One`](/core/api-reference/classes/one/)
- [`Many`](/core/api-reference/classes/many/)

## Type Parameters

### TTableName

`TTableName` *extends* `string` = `string`

## Constructors

### Constructor

> **new Relation**\<`TTableName`\>(`sourceTable`, `referencedTable`, `relationName`): `Relation`\<`TTableName`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:17

#### Parameters

##### sourceTable

[`Table`](/core/api-reference/classes/table/)

##### referencedTable

[`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

##### relationName

`string` \| `undefined`

#### Returns

`Relation`\<`TTableName`\>

## Properties

### $brand

> `readonly` **$brand**: `"Relation"`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:14

***

### fieldName

> **fieldName**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:16

***

### referencedTable

> `readonly` **referencedTable**: [`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:9

***

### referencedTableName

> `readonly` **referencedTableName**: `TTableName`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:15

***

### relationName

> `readonly` **relationName**: `string` \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:12

***

### sourceTable

> `readonly` **sourceTable**: [`Table`](/core/api-reference/classes/table/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:8

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:13

## Methods

### withFieldName()

> `abstract` **withFieldName**(`fieldName`): `Relation`\<`TTableName`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:20

#### Parameters

##### fieldName

`string`

#### Returns

`Relation`\<`TTableName`\>
