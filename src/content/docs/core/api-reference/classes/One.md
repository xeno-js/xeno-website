---
editUrl: false
next: false
prev: false
title: "One"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:33

## Extends

- [`Relation`](/core/api-reference/classes/relation/)\<`TTableName`\>

## Type Parameters

### TTableName

`TTableName` *extends* `string` = `string`

### TIsNullable

`TIsNullable` *extends* `boolean` = `boolean`

## Constructors

### Constructor

> **new One**\<`TTableName`, `TIsNullable`\>(`sourceTable`, `referencedTable`, `config`, `isNullable`): `One`\<`TTableName`, `TIsNullable`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:40

#### Parameters

##### sourceTable

[`Table`](/core/api-reference/classes/table/)

##### referencedTable

[`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

##### config

[`RelationConfig`](/core/api-reference/interfaces/relationconfig/)\<`TTableName`, `string`, [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)\<\{ `tableName`: `TTableName`; \}\>[]\> \| `undefined`

##### isNullable

`TIsNullable`

#### Returns

`One`\<`TTableName`, `TIsNullable`\>

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

> `readonly` **config**: [`RelationConfig`](/core/api-reference/interfaces/relationconfig/)\<`TTableName`, `string`, [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)\<\{ `tableName`: `TTableName`; \}\>[]\> \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:34

***

### fieldName

> **fieldName**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:16

#### Inherited from

[`Relation`](/core/api-reference/classes/relation/).[`fieldName`](/core/api-reference/classes/relation/#fieldname)

***

### isNullable

> `readonly` **isNullable**: `TIsNullable`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:37

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

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:38

#### Overrides

[`Relation`](/core/api-reference/classes/relation/).[`[entityKind]`](/core/api-reference/classes/relation/#entitykind)

## Methods

### withFieldName()

> **withFieldName**(`fieldName`): `One`\<`TTableName`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:45

#### Parameters

##### fieldName

`string`

#### Returns

`One`\<`TTableName`\>

#### Overrides

[`Relation`](/core/api-reference/classes/relation/).[`withFieldName`](/core/api-reference/classes/relation/#withfieldname)
