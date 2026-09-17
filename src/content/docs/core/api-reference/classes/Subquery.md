---
editUrl: false
next: false
prev: false
title: "Subquery"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:3

Any value that implements the `getSQL` method. The implementations include:
- `Table`
- `Column`
- `View`
- `Subquery`
- `SQL`
- `SQL.Aliased`
- `Placeholder`
- `Param`

## Extends

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Extended by

- [`WithSubquery`](/core/api-reference/classes/withsubquery/)

## Type Parameters

### TAlias

`TAlias` *extends* `string` = `string`

### TSelectedFields

`TSelectedFields` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new Subquery**\<`TAlias`, `TSelectedFields`\>(`sql`, `fields`, `alias`, `isWith?`, `usedTables?`): `Subquery`\<`TAlias`, `TSelectedFields`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:15

#### Parameters

##### sql

[`SQL`](/core/api-reference/classes/sql/)

##### fields

`TSelectedFields`

##### alias

`string`

##### isWith?

`boolean`

##### usedTables?

`string`[]

#### Returns

`Subquery`\<`TAlias`, `TSelectedFields`\>

#### Inherited from

`SQLWrapper.constructor`

## Properties

### \_

> **\_**: `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:7

#### alias

> **alias**: `TAlias`

#### brand

> **brand**: `"Subquery"`

#### isWith

> **isWith**: `boolean`

#### selectedFields

> **selectedFields**: `TSelectedFields`

#### sql

> **sql**: [`SQL`](/core/api-reference/classes/sql/)

#### usedTables?

> `optional` **usedTables?**: `string`[]

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:6

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:50

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### Inherited from

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)

***

### shouldOmitSQLParens()?

> `optional` **shouldOmitSQLParens**(): `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:51

#### Returns

`boolean`

#### Inherited from

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`shouldOmitSQLParens`](/core/api-reference/interfaces/sqlwrapper/#shouldomitsqlparens)
