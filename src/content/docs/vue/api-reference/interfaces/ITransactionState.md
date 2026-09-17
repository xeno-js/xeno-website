---
editUrl: false
next: false
prev: false
title: "ITransactionState"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/transaction/itransaction-state.types.d.ts:22

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

> **get** **state**(): [`Maybe`](/vue/api-reference/type-aliases/maybe/)\<`TTx`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/transaction/itransaction-state.types.d.ts:31

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

[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<`TTx`\>

#### Set Signature

> **set** **state**(`value`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/transaction/itransaction-state.types.d.ts:42

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

[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<`TTx`\>

The new state of the transaction.

##### Returns

`void`

The current state of the transaction.
