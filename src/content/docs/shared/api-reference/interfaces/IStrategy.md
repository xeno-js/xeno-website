---
editUrl: false
next: false
prev: false
title: "IStrategy"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/strategies/istrategy.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/strategies/istrategy.contracts.ts#L12)

## Description

Interface that defines the contract for a strategy used in the authorization pipeline. Each strategy must implement the isApplicable method to determine if it should be applied to a given request, and the execute method to perform the necessary authorization checks. The execute method returns a ResultType indicating whether the authorization was successful or if it failed, allowing the pipeline to handle the outcome accordingly.

  * 
  *

## Author

Xeno
  *

## Version

1.0.0
  *

## Since

2025-09-30
  *

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### TInput

`TInput`

### TResult

`TResult` = `void`

## Methods

### execute()

> **execute**(`context`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/strategies/istrategy.contracts.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/strategies/istrategy.contracts.ts#L24)

#### Parameters

##### context

`TInput`

The context for which the strategy should be executed, which can be of any type depending on the specific implementation of the strategy. This could include the request object, user information, or any other relevant data needed to perform the authorization checks.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

A Promise that resolves to a ResultType indicating the outcome of the strategy's execution. The ResultType should indicate success if the authorization checks pass, or contain an error if the checks fail, allowing the pipeline to handle the result accordingly.

#### Description

Executes the strategy's logic for the given context. This method is called by the authorization pipeline when a strategy is deemed applicable. The implementation of this method should perform the necessary checks to determine if the request is authorized, and return a ResultType indicating the outcome of the authorization process. The ResultType should indicate success if the authorization checks pass, or contain an error if the checks fail, allowing the pipeline to handle the result accordingly.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
