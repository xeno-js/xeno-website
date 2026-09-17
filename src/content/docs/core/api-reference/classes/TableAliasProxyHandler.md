---
editUrl: false
next: false
prev: false
title: "TableAliasProxyHandler"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:14

## Type Parameters

### T

`T` *extends* [`Table`](/core/api-reference/classes/table/) \| [`View`](/core/api-reference/classes/view/)

## Implements

- `ProxyHandler`\<`T`\>

## Constructors

### Constructor

> **new TableAliasProxyHandler**\<`T`\>(`alias`, `replaceOriginalName`): `TableAliasProxyHandler`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:18

#### Parameters

##### alias

`string`

##### replaceOriginalName

`boolean`

#### Returns

`TableAliasProxyHandler`\<`T`\>

## Properties

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:17

## Methods

### get()

> **get**(`target`, `prop`): `any`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:19

A trap for getting a property value.

#### Parameters

##### target

`T`

The original object which is being proxied.

##### prop

`string` \| `symbol`

#### Returns

`any`

#### Implementation of

`ProxyHandler.get`
