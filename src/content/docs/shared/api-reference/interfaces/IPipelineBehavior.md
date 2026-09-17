---
editUrl: false
next: false
prev: false
title: "IPipelineBehavior"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/ipipeline-behavior.contracts.ts:29](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/ipipeline-behavior.contracts.ts#L29)

## Description

An interface representing a pipeline behavior in a CQRS architecture. Pipeline behaviors are used to implement cross-cutting concerns such as logging, validation, and error handling in a structured manner. Each behavior can perform specific actions before and after invoking the next step in the pipeline, allowing for a modular and reusable approach to handling requests.

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

`TInput` *extends* [`IRequest`](/shared/api-reference/interfaces/irequest/)\<`TResult`\>

The type of the input request that the pipeline behavior will handle. This allows for type safety and ensures that the behavior can work with specific types of requests, which can be defined based on the application's needs.

### TResult

`TResult`

The type of the result that the pipeline behavior will return after processing the request. This allows for flexibility in defining the expected output of the behavior, which can be tailored to the specific requirements of the request being handled.

  * 
  *

## Methods

### handle()

> **handle**(`request`, `next`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/ipipeline-behavior.contracts.ts:42](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/ipipeline-behavior.contracts.ts#L42)

#### Parameters

##### request

`TInput`

The input request to be processed by the pipeline behavior.

##### next

[`Delegate`](/shared/api-reference/type-aliases/delegate/)\<`TResult`\>

A delegate function representing the next step in the pipeline. Invoking this delegate will pass control to the next behavior or the actual request handler.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

A promise that resolves to a ResultType, which can be either a successful result or an error.

#### Description

Handles the processing of a request within the pipeline. This method is responsible for executing any pre-processing logic, invoking the next behavior in the pipeline, and performing any post-processing logic. It ensures that the request is handled in a structured manner, allowing for cross-cutting concerns to be applied consistently.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
