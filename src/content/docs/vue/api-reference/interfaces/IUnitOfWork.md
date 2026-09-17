---
editUrl: false
next: false
prev: false
title: "IUnitOfWork"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/transaction/iunit-of-work.types.d.ts:11

## File

unit-of-work.types.ts

## Description

This file contains the interface for the Unit of Work pattern.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### runInTransaction()

> **runInTransaction**\<`T`\>(`callback`, `signal`): `Promise`\<`T`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/transaction/iunit-of-work.types.d.ts:23

Executes a callback function within a transaction.

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

() => `Promise`\<`T`\>

The callback function to execute.

##### signal

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to cancel the transaction.

#### Returns

`Promise`\<`T`\>

A promise that resolves with the result of the callback function.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
