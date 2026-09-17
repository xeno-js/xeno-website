---
editUrl: false
next: false
prev: false
title: "Param"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:124

Parameter value that is optionally bound to an encoder (for example, a column).

## Type Parameters

### TDataType

`TDataType` = `unknown`

### TDriverParamType

`TDriverParamType` = `TDataType`

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new Param**\<`TDataType`, `TDriverParamType`\>(`value`, `encoder?`): `Param`\<`TDataType`, `TDriverParamType`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:133

#### Parameters

##### value

`TDataType`

Parameter value

##### encoder?

[`DriverValueEncoder`](/core/api-reference/interfaces/drivervalueencoder/)\<`TDataType`, `TDriverParamType`\>

Encoder to convert the value to a driver parameter

#### Returns

`Param`\<`TDataType`, `TDriverParamType`\>

## Properties

### encoder

> `readonly` **encoder**: [`DriverValueEncoder`](/core/api-reference/interfaces/drivervalueencoder/)\<`TDataType`, `TDriverParamType`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:126

***

### value

> `readonly` **value**: `TDataType`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:125

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:127

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:134

#### Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\>

#### Implementation of

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)
