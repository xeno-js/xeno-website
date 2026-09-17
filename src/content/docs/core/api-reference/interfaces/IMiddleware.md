---
editUrl: false
next: false
prev: false
title: "IMiddleware"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/middlewares/imiddleware.contracts.d.ts:11

## Description

The IMiddleware interface defines the contract for middleware components that process incoming HTTP requests. Implementing classes must provide an execute method that takes an HttpRequest as input and returns a Promise of a ResponseDto, which can either be a successful response or an error response. This design allows for flexible middleware implementations that can perform various tasks such as authentication, logging, request transformation, or response generation.

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

### THeaders

`THeaders` = `unknown`

## Methods

### execute()

> **execute**\<`T`\>(`req`, `headers`, `next`): `Promise`\<[`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`T`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/middlewares/imiddleware.contracts.d.ts:25

#### Type Parameters

##### T

`T`

#### Parameters

##### req

###### method

[`HttpMethod`](/core/api-reference/type-aliases/httpmethod/)

###### path

`string`

###### transport

\{ `req`: `unknown`; `res`: `unknown`; \}

###### transport.req

`unknown`

###### transport.res

`unknown`

##### headers

`THeaders`

##### next

() => `Promise`\<[`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`T`\>\>

A callback function that, when invoked, will pass control to the next middleware in the chain or to the final request handler. This allows for a composable middleware architecture where multiple middleware components can be chained together to process a request.

#### Returns

`Promise`\<[`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`T`\>\>

A Promise that resolves to a ResponseDto containing either a successful response or an error response. The ResponseDto allows for handling both success and error cases in a consistent manner.

#### Description

The execute method processes an incoming HTTP request and returns a ResponseDto that can either be a successful response or an error response. This allows for flexible middleware implementations that can either modify the request, perform side effects, or generate a response directly.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
