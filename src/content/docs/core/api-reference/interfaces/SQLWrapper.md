---
editUrl: false
next: false
prev: false
title: "SQLWrapper"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:49

Any value that implements the `getSQL` method. The implementations include:
- `Table`
- `Column`
- `View`
- `Subquery`
- `SQL`
- `SQL.Aliased`
- `Placeholder`
- `Param`

## Extended by

- [`Column`](/core/api-reference/classes/column/)
- [`Subquery`](/core/api-reference/classes/subquery/)
- [`Table`](/core/api-reference/classes/table/)

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:50

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

***

### shouldOmitSQLParens()?

> `optional` **shouldOmitSQLParens**(): `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:51

#### Returns

`boolean`
