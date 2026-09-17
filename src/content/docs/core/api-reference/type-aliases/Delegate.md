---
editUrl: false
next: false
prev: false
title: "Delegate"
---

> **Delegate**\<`TResult`\> = () => `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/ipipeline-behavior.contracts.d.ts:14

## Type Parameters

### TResult

`TResult`

The type of the result that the delegate will return when invoked. This allows for flexibility in defining the expected output of the next step in the pipeline, which can be tailored to the specific needs of the request being processed.

  *
  *

## Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`TResult`\>\>

## Description

A delegate function type that represents the next step in the pipeline behavior. It returns a promise that resolves to a ResultType, which can be either a successful result or an error. This delegate is used to invoke the next behavior in the pipeline or the actual request handler, allowing for a chain of behaviors to be executed in a structured manner.

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
