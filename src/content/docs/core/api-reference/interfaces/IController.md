---
editUrl: false
next: false
prev: false
title: "IController"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/controllers/icontroller.contracts.d.ts:11

## Fileoverview

IController defines the interface for controllers in the application. A controller is responsible for handling incoming requests, processing them, and returning appropriate responses. The IController interface ensures that all controllers adhere to a consistent structure, making it easier to manage and maintain the application's request handling logic. Each controller must implement the handle method, which takes an incoming request and returns a response, typically as a promise to accommodate asynchronous operations.

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

### TRequest

`TRequest` = `unknown`

### TResponse

`TResponse` = `unknown`

## Methods

### handle()

> **handle**(`request`): `Promise`\<[`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/controllers/icontroller.contracts.d.ts:23

Handles an incoming request and returns a response.

#### Parameters

##### request

`TRequest`

The incoming request object.

#### Returns

`Promise`\<[`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`TResponse`\>\>

A promise that resolves to a ResponseDto containing the response object.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
