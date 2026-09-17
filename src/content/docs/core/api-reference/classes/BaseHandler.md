---
editUrl: false
next: false
prev: false
title: "BaseHandler"
---

Defined in: .temp/xeno-js/src/application/cqrs/base-handler.ts:12

BaseHandler is an abstract class that implements the IHandler interface.
It provides a base implementation for handling requests and executing strategies.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### TRequest

`TRequest` *extends* [`IRequest`](/core/api-reference/interfaces/irequest/)\<`TResponse`\>

### TResponse

`TResponse`

## Implements

- [`IHandler`](/core/api-reference/interfaces/ihandler/)\<`TRequest`, `TResponse`\>

## Constructors

### Constructor

> **new BaseHandler**\<`TRequest`, `TResponse`\>(`_identityFactory`): `BaseHandler`\<`TRequest`, `TResponse`\>

Defined in: .temp/xeno-js/src/application/cqrs/base-handler.ts:16

#### Parameters

##### \_identityFactory

[`IFactory`](/core/api-reference/interfaces/ifactory/)\<`void`, [`UserContext`](/core/api-reference/interfaces/usercontext/)\>

#### Returns

`BaseHandler`\<`TRequest`, `TResponse`\>

## Methods

### handle()

> `abstract` **handle**(`request`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: .temp/xeno-js/src/application/cqrs/base-handler.ts:18

Handles a request and returns a response. This method is asynchronous and returns a Promise.

#### Parameters

##### request

`TRequest`

The request to be handled, of type TRequest.

##### signal

`AbortSignal`

An optional AbortSignal to allow cancellation of the request.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

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

#### Implementation of

[`IHandler`](/core/api-reference/interfaces/ihandler/).[`handle`](/core/api-reference/interfaces/ihandler/#handle)
