---
editUrl: false
next: false
prev: false
title: "View"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:206

Any value that implements the `getSQL` method. The implementations include:
- `Table`
- `Column`
- `View`
- `Subquery`
- `SQL`
- `SQL.Aliased`
- `Placeholder`
- `Param`

## Type Parameters

### TName

`TName` *extends* `string` = `string`

### TExisting

`TExisting` *extends* `boolean` = `boolean`

### TSelection

`TSelection` *extends* [`ColumnsSelection`](/core/api-reference/type-aliases/columnsselection/) = [`ColumnsSelection`](/core/api-reference/type-aliases/columnsselection/)

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new View**\<`TName`, `TExisting`, `TSelection`\>(`__namedParameters`): `View`\<`TName`, `TExisting`, `TSelection`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:216

#### Parameters

##### \_\_namedParameters

###### name

`TName`

###### query

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

###### schema

`string` \| `undefined`

###### selectedFields

[`ColumnsSelection`](/core/api-reference/type-aliases/columnsselection/)

#### Returns

`View`\<`TName`, `TExisting`, `TSelection`\>

## Properties

### \_

> **\_**: `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:208

#### brand

> **brand**: `"View"`

#### existing

> **existing**: `TExisting`

#### name

> **name**: `TName`

#### selectedFields

> **selectedFields**: `TSelection`

#### viewBrand

> **viewBrand**: `string`

***

### $inferSelect

> `readonly` **$inferSelect**: [`InferSelectViewModel`](/core/api-reference/type-aliases/inferselectviewmodel/)\<`View`\<[`Assume`](/core/api-reference/type-aliases/assume/)\<`TName`, `string`\>, `TExisting`, `TSelection`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:215

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:207

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:222

#### Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\>

#### Implementation of

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)
