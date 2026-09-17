---
editUrl: false
next: false
prev: false
title: "DriverValueMapper"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:120

## Extends

- [`DriverValueDecoder`](/core/api-reference/interfaces/drivervaluedecoder/)\<`TData`, `TDriverParam`\>.[`DriverValueEncoder`](/core/api-reference/interfaces/drivervalueencoder/)\<`TData`, `TDriverParam`\>

## Extended by

- [`Column`](/core/api-reference/classes/column/)

## Type Parameters

### TData

`TData`

### TDriverParam

`TDriverParam`

## Methods

### mapFromDriverValue()

> **mapFromDriverValue**(`value`): `TData`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:112

#### Parameters

##### value

`TDriverParam`

#### Returns

`TData`

#### Inherited from

`DriverValueDecoder.mapFromDriverValue`

***

### mapToDriverValue()

> **mapToDriverValue**(`value`): [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `TDriverParam`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:115

#### Parameters

##### value

`TData`

#### Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `TDriverParam`

#### Inherited from

[`DriverValueEncoder`](/core/api-reference/interfaces/drivervalueencoder/).[`mapToDriverValue`](/core/api-reference/interfaces/drivervalueencoder/#maptodrivervalue)
