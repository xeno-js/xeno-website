---
editUrl: false
next: false
prev: false
title: "StringChunk"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:54

Any value that implements the `getSQL` method. The implementations include:
- `Table`
- `Column`
- `View`
- `Subquery`
- `SQL`
- `SQL.Aliased`
- `Placeholder`
- `Param`

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new StringChunk**(`value`): `StringChunk`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:57

#### Parameters

##### value

`string` \| `string`[]

#### Returns

`StringChunk`

## Properties

### value

> `readonly` **value**: `string`[]

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:56

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:55

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:58

#### Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\>

#### Implementation of

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)
