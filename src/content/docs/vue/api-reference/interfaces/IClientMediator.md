---
editUrl: false
next: false
prev: false
title: "IClientMediator"
---

Defined in: [.temp/xeno-vue/src/domain/contracts/pipeline/imediator.ts:3](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/domain/contracts/pipeline/imediator.ts#L3)

## Methods

### query()

> **query**\<`TResult`\>(`data`, `action`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

Defined in: [.temp/xeno-vue/src/domain/contracts/pipeline/imediator.ts:6](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/domain/contracts/pipeline/imediator.ts#L6)

#### Type Parameters

##### TResult

`TResult`

#### Parameters

##### data

[`IQuery`](/vue/api-reference/interfaces/iquery/)\<`TResult`\>

##### action

[`Delegate`](/vue/api-reference/type-aliases/delegate/)\<`TResult`\>

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

***

### send()

> **send**\<`TResult`\>(`data`, `action`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

Defined in: [.temp/xeno-vue/src/domain/contracts/pipeline/imediator.ts:4](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/domain/contracts/pipeline/imediator.ts#L4)

#### Type Parameters

##### TResult

`TResult`

#### Parameters

##### data

[`ICommand`](/vue/api-reference/interfaces/icommand/)\<`TResult`\>

##### action

[`Delegate`](/vue/api-reference/type-aliases/delegate/)\<`TResult`\>

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResult`\>\>
