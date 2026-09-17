---
editUrl: false
next: false
prev: false
title: "Many"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:47

## Extends

- [`Relation`](/core/api-reference/classes/relation/)\<`TTableName`\>

## Type Parameters

### TTableName

`TTableName` *extends* `string`

## Constructors

### Constructor

> **new Many**\<`TTableName`\>(`sourceTable`, `referencedTable`, `config`): `Many`\<`TTableName`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:53

#### Parameters

##### sourceTable

[`Table`](/core/api-reference/classes/table/)

##### referencedTable

[`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

##### config

\{ `relationName`: `string`; \} \| `undefined`

#### Returns

`Many`\<`TTableName`\>

#### Overrides

[`Relation`](/core/api-reference/classes/relation/).[`constructor`](/core/api-reference/classes/relation/#constructor)

## Properties

### $brand

> `readonly` **$brand**: `"Relation"`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:14

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`$brand`](/core/api-reference/classes/relation/#brand)

***

### config

> `readonly` **config**: \{ `relationName`: `string`; \} \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:48

***

### fieldName

> **fieldName**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:16

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`fieldName`](/core/api-reference/classes/relation/#fieldname)

***

### referencedTable

> `readonly` **referencedTable**: [`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:9

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`referencedTable`](/core/api-reference/classes/relation/#referencedtable)

***

### referencedTableName

> `readonly` **referencedTableName**: `TTableName`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:15

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`referencedTableName`](/core/api-reference/classes/relation/#referencedtablename)

***

### relationName

> `readonly` **relationName**: `string` \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:12

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`relationName`](/core/api-reference/classes/relation/#relationname)

***

### sourceTable

> `readonly` **sourceTable**: [`Table`](/core/api-reference/classes/table/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:8

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`sourceTable`](/core/api-reference/classes/relation/#sourcetable)

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:51

#### Overrides

[`Relation`](/core/api-reference/classes/relation/).[`[entityKind]`](/core/api-reference/classes/relation/#entitykind)

## Methods

### withFieldName()

> **withFieldName**(`fieldName`): `Many`\<`TTableName`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:58

#### Parameters

##### fieldName

`string`

#### Returns

`Many`\<`TTableName`\>

#### Overrides

[`Relation`](/core/api-reference/classes/relation/).[`withFieldName`](/core/api-reference/classes/relation/#withfieldname)
