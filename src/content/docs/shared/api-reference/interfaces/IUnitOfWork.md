---
editUrl: false
next: false
prev: false
title: "IUnitOfWork"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/transaction/iunit-of-work.types.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/transaction/iunit-of-work.types.ts#L12)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/transaction/iunit-of-work.types.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/transaction/iunit-of-work.types.ts#L24)

Executes a callback function within a transaction.

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

() => `Promise`\<`T`\>

The callback function to execute.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

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
