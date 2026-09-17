---
editUrl: false
next: false
prev: false
title: "Placeholder"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:195

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

### TValue

`TValue` = `any`

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new Placeholder**\<`TName`, `TValue`\>(`name`): `Placeholder`\<`TName`, `TValue`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:199

#### Parameters

##### name

`TName`

#### Returns

`Placeholder`\<`TName`, `TValue`\>

## Properties

### name

> `readonly` **name**: `TName`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:196

***

### protected

> **protected**: `TValue`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:198

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:197

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:200

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### Implementation of

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)
