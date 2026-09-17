---
editUrl: false
next: false
prev: false
title: "Aliased"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:183

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

### T

`T` = `unknown`

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new Aliased**\<`T`\>(`sql`, `fieldAlias`): `Aliased`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:191

#### Parameters

##### sql

[`SQL`](/core/api-reference/classes/sql/)

##### fieldAlias

`string`

#### Returns

`Aliased`\<`T`\>

## Properties

### \_

> **\_**: `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:187

#### brand

> **brand**: `"SQL.Aliased"`

#### type

> **type**: `T`

***

### fieldAlias

> `readonly` **fieldAlias**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:185

***

### sql

> `readonly` **sql**: [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:184

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:186

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:192

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### Implementation of

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)
