---
editUrl: false
next: false
prev: false
title: "ITransactionState"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/transaction/itransaction-state.types.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/transaction/itransaction-state.types.ts#L24)

ITransactionState

## Description

Represents the state of a transaction, which can be either a specific transaction type or null.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

## Type Parameters

### TTx

`TTx` = `unknown`

The type of the transaction state.

## Accessors

### state

#### Get Signature

> **get** **state**(): [`Maybe`](/shared/api-reference/type-aliases/maybe/)\<`TTx`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/transaction/itransaction-state.types.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/transaction/itransaction-state.types.ts#L33)

Gets the current state of the transaction, which can be either a specific transaction type or null.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

##### Returns

[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<`TTx`\>

#### Set Signature

> **set** **state**(`value`): `void`

Defined in: [.temp/xeno-shared/src/domain/contracts/transaction/itransaction-state.types.ts:45](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/transaction/itransaction-state.types.ts#L45)

Sets the current state of the transaction, which can be either a specific transaction type or null.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

##### Parameters

###### value

[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<`TTx`\>

The new state of the transaction.

##### Returns

`void`

The current state of the transaction.
