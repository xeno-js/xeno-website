---
editUrl: false
next: false
prev: false
title: "RelationTableAliasProxyHandler"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:21

## Type Parameters

### T

`T` *extends* [`Relation`](/core/api-reference/classes/relation/)

## Implements

- `ProxyHandler`\<`T`\>

## Constructors

### Constructor

> **new RelationTableAliasProxyHandler**\<`T`\>(`alias`): `RelationTableAliasProxyHandler`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:24

#### Parameters

##### alias

`string`

#### Returns

`RelationTableAliasProxyHandler`\<`T`\>

## Properties

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:23

## Methods

### get()

> **get**(`target`, `prop`): `any`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/alias.d.ts:25

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
