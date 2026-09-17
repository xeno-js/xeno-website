---
editUrl: false
next: false
prev: false
title: "IHandler"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/ihandler.contracts.ts:16](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/ihandler.contracts.ts#L16)

An interface representing a handler for processing requests in a CQRS (Command Query Responsibility Segregation) pattern.
This interface defines a method for handling a request and returning a response, which can be used for both commands and queries.

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

### TRequest

`TRequest` *extends* [`IRequest`](/shared/api-reference/interfaces/irequest/)\<`TResponse`\>

The type of the request that the handler will process.

### TResponse

`TResponse`

The type of the response that the handler will return after processing the request.

  * 
  *

## Methods

### handle()

> **handle**(`request`, `signal`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/ihandler.contracts.ts:29](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/ihandler.contracts.ts#L29)

Handles a request and returns a response. This method is asynchronous and returns a Promise.

#### Parameters

##### request

`TRequest`

The request to be handled, of type TRequest.

##### signal

`AbortSignal`

An optional AbortSignal to allow cancellation of the request.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A Promise that resolves to a response of type TResponse.

#### Throws

An error if the request handling fails or is aborted.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
