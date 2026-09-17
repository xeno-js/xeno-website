---
editUrl: false
next: false
prev: false
title: "IPipeline"
---

Defined in: [.temp/xeno-vue/src/domain/contracts/pipeline/ipipeline.ts:3](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/domain/contracts/pipeline/ipipeline.ts#L3)

## Methods

### handle()

> **handle**\<`TResult`\>(`req`, `next`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

Defined in: [.temp/xeno-vue/src/domain/contracts/pipeline/ipipeline.ts:4](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/domain/contracts/pipeline/ipipeline.ts#L4)

#### Type Parameters

##### TResult

`TResult`

#### Parameters

##### req

[`IRequest`](/vue/api-reference/interfaces/irequest/)\<`TResult`\>

##### next

[`Delegate`](/vue/api-reference/type-aliases/delegate/)\<`TResult`\>

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResult`\>\>
