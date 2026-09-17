---
editUrl: false
next: false
prev: false
title: "ColumnAliasProxyHandler"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:8

## Type Parameters

### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)

## Implements

- `ProxyHandler`\<`TColumn`\>

## Constructors

### Constructor

> **new ColumnAliasProxyHandler**\<`TColumn`\>(`table`): `ColumnAliasProxyHandler`\<`TColumn`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:11

#### Parameters

##### table

[`Table`](/core/api-reference/classes/table/)\<[`TableConfig`](/core/api-reference/interfaces/tableconfig/)\<[`Column`](/core/api-reference/classes/column/)\<`any`, `object`, `object`\>\>\> \| [`View`](/core/api-reference/classes/view/)\<`string`, `boolean`, [`ColumnsSelection`](/core/api-reference/type-aliases/columnsselection/)\>

#### Returns

`ColumnAliasProxyHandler`\<`TColumn`\>

## Properties

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:10

## Methods

### get()

> **get**(`columnObj`, `prop`): `any`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:12

A trap for getting a property value.

#### Parameters

##### columnObj

`TColumn`

##### prop

`string` \| `symbol`

#### Returns

`any`

#### Implementation of

`ProxyHandler.get`
