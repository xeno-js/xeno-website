---
editUrl: false
next: false
prev: false
title: "WithSubquery"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:17

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

- [`Subquery`](/core/api-reference/classes/subquery/)\<`TAlias`, `TSelection`\>

## Type Parameters

### TAlias

`TAlias` *extends* `string` = `string`

### TSelection

`TSelection` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `unknown`\>

## Constructors

### Constructor

> **new WithSubquery**\<`TAlias`, `TSelection`\>(`sql`, `fields`, `alias`, `isWith?`, `usedTables?`): `WithSubquery`\<`TAlias`, `TSelection`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:15

#### Parameters

##### sql

[`SQL`](/core/api-reference/classes/sql/)

##### fields

`TSelection`

##### alias

`string`

##### isWith?

`boolean`

##### usedTables?

`string`[]

#### Returns

`WithSubquery`\<`TAlias`, `TSelection`\>

#### Inherited from

[`Subquery`](/core/api-reference/classes/subquery/).[`constructor`](/core/api-reference/classes/subquery/#constructor)

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

> **selectedFields**: `TSelection`

#### sql

> **sql**: [`SQL`](/core/api-reference/classes/sql/)

#### usedTables?

> `optional` **usedTables?**: `string`[]

#### Inherited from

[`Subquery`](/core/api-reference/classes/subquery/).[`_`](/core/api-reference/classes/subquery/#_)

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/subquery.d.ts:18

#### Overrides

[`Subquery`](/core/api-reference/classes/subquery/).[`[entityKind]`](/core/api-reference/classes/subquery/#entitykind)

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:50

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### Inherited from

[`Subquery`](/core/api-reference/classes/subquery/).[`getSQL`](/core/api-reference/classes/subquery/#getsql)

***

### shouldOmitSQLParens()?

> `optional` **shouldOmitSQLParens**(): `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:51

#### Returns

`boolean`

#### Inherited from

[`Subquery`](/core/api-reference/classes/subquery/).[`shouldOmitSQLParens`](/core/api-reference/classes/subquery/#shouldomitsqlparens)
