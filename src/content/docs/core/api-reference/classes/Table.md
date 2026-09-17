---
editUrl: false
next: false
prev: false
title: "Table"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:13

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

## Type Parameters

### T

`T` *extends* [`TableConfig`](/core/api-reference/interfaces/tableconfig/) = [`TableConfig`](/core/api-reference/interfaces/tableconfig/)

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new Table**\<`T`\>(`name`, `schema`, `baseName`): `Table`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:28

#### Parameters

##### name

`string`

##### schema

`string` \| `undefined`

##### baseName

`string`

#### Returns

`Table`\<`T`\>

#### Inherited from

`SQLWrapper.constructor`

## Properties

### \_

> `readonly` **\_**: `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:17

#### brand

> `readonly` **brand**: `"Table"`

#### columns

> `readonly` **columns**: `T`\[`"columns"`\]

#### config

> `readonly` **config**: `T`

#### inferInsert

> `readonly` **inferInsert**: \{ \[K in string\]: (\{ \[Key in string as RequiredKeyOnly\<Key, T\["columns"\]\[Key\]\>\]: T\["columns"\]\[Key\]\["\_"\]\["notNull"\] extends true ? T\["columns"\]\[Key\]\["\_"\]\["data"\] : (...)\[(...)\]\[Key\]\["\_"\]\["data"\] \| null \} & \{ \[Key in string as OptionalKeyOnly\<Key, T\["columns"\]\[Key\], false\>\]?: (...)\[(...)\]\[Key\]\["\_"\]\["notNull"\] extends true ? (...)\[(...)\]\[Key\]\["\_"\]\["data"\] : (...)\[(...)\]\["\_"\]\["data"\] \| null \})\[K\] \}

#### inferSelect

> `readonly` **inferSelect**: \{ \[K in string\]: \{ \[Key in string as Key\]: T\["columns"\]\[Key\]\["\_"\]\["notNull"\] extends true ? T\["columns"\]\[Key\]\["\_"\]\["data"\] : T\["columns"\]\[Key\]\["\_"\]\["data"\] \| null \}\[K\] \}

#### name

> `readonly` **name**: `T`\[`"name"`\]

#### schema

> `readonly` **schema**: `T`\[`"schema"`\]

***

### $inferInsert

> `readonly` **$inferInsert**: \{ \[K in string\]: (\{ \[Key in string as RequiredKeyOnly\<Key, T\["columns"\]\[Key\]\>\]: T\["columns"\]\[Key\]\["\_"\]\["notNull"\] extends true ? T\["columns"\]\[Key\]\["\_"\]\["data"\] : T\["columns"\]\[Key\]\["\_"\]\["data"\] \| null \} & \{ \[Key in string as OptionalKeyOnly\<Key, T\["columns"\]\[Key\], false\>\]?: T\["columns"\]\[Key\]\["\_"\]\["notNull"\] extends true ? T\["columns"\]\[Key\]\["\_"\]\["data"\] : (...)\[(...)\]\[Key\]\["\_"\]\["data"\] \| null \})\[K\] \}

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:27

***

### $inferSelect

> `readonly` **$inferSelect**: \{ \[K in string\]: \{ \[Key in string as Key\]: T\["columns"\]\[Key\]\["\_"\]\["notNull"\] extends true ? T\["columns"\]\[Key\]\["\_"\]\["data"\] : T\["columns"\]\[Key\]\["\_"\]\["data"\] \| null \}\[K\] \}

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:26

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:16

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
