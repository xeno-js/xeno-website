---
editUrl: false
next: false
prev: false
title: "BuildQueryConfig"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:18

## Properties

### casing

> **casing**: `CasingCache`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:19

***

### inlineParams?

> `optional` **inlineParams?**: `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:27

***

### invokeSource?

> `optional` **invokeSource?**: `"indexes"`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:28

***

### paramStartIndex?

> `optional` **paramStartIndex?**: `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:24

#### value

> **value**: `number`

***

### prepareTyping?

> `optional` **prepareTyping?**: (`encoder`) => [`QueryTypingsValue`](/core/api-reference/type-aliases/querytypingsvalue/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:23

#### Parameters

##### encoder

[`DriverValueEncoder`](/core/api-reference/interfaces/drivervalueencoder/)\<`unknown`, `unknown`\>

#### Returns

[`QueryTypingsValue`](/core/api-reference/type-aliases/querytypingsvalue/)

## Methods

### escapeName()

> **escapeName**(`name`): `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:20

#### Parameters

##### name

`string`

#### Returns

`string`

***

### escapeParam()

> **escapeParam**(`num`, `value`): `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:21

#### Parameters

##### num

`number`

##### value

`unknown`

#### Returns

`string`

***

### escapeString()

> **escapeString**(`str`): `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:22

#### Parameters

##### str

`string`

#### Returns

`string`
