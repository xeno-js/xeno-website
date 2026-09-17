---
editUrl: false
next: false
prev: false
title: "DefaultLogger"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/logger.d.ts:12

## Implements

- [`Logger`](/core/api-reference/interfaces/logger/)

## Constructors

### Constructor

> **new DefaultLogger**(`config?`): `DefaultLogger`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/logger.d.ts:15

#### Parameters

##### config?

###### writer

[`LogWriter`](/core/api-reference/interfaces/logwriter/)

#### Returns

`DefaultLogger`

## Properties

### writer

> `readonly` **writer**: [`LogWriter`](/core/api-reference/interfaces/logwriter/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/logger.d.ts:14

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/logger.d.ts:13

## Methods

### logQuery()

> **logQuery**(`query`, `params`): `void`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/logger.d.ts:18

#### Parameters

##### query

`string`

##### params

`unknown`[]

#### Returns

`void`

#### Implementation of

[`Logger`](/core/api-reference/interfaces/logger/).[`logQuery`](/core/api-reference/interfaces/logger/#logquery)
