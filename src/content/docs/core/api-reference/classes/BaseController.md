---
editUrl: false
next: false
prev: false
title: "BaseController"
---

Defined in: .temp/xeno-js/src/presentation/controllers/base.controller.ts:24

BaseController is an abstract class that implements the IController interface. It provides a foundation for creating specific controllers that handle incoming requests and return responses. The class requires a mediator to facilitate communication between different parts of the application.

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

`TRequest`

The type of the request object that the controller will handle.

### TResponse

`TResponse`

The type of the response object that the controller will return.

## Implements

- [`IController`](/core/api-reference/interfaces/icontroller/)\<`TRequest`, `TResponse`\>

## Constructors

### Constructor

> **new BaseController**\<`TRequest`, `TResponse`\>(`_requestContext`, `_mediator`): `BaseController`\<`TRequest`, `TResponse`\>

Defined in: .temp/xeno-js/src/presentation/controllers/base.controller.ts:38

Constructs a new instance of the BaseController class.

#### Parameters

##### \_requestContext

[`IContextAccessor`](/core/api-reference/interfaces/icontextaccessor/)\<[`RequestContext`](/core/api-reference/interfaces/requestcontext/)\>

An instance of IContextAccessor used to manage the execution context for requests.

##### \_mediator

[`IMediator`](/core/api-reference/interfaces/imediator/)

An instance of IMediator used to facilitate communication between different parts of the application.

#### Returns

`BaseController`\<`TRequest`, `TResponse`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### handle()

> `abstract` **handle**(`request`): `Promise`\<[`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`TResponse`\>\>

Defined in: .temp/xeno-js/src/presentation/controllers/base.controller.ts:43

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

#### Implementation of

[`IController`](/core/api-reference/interfaces/icontroller/).[`handle`](/core/api-reference/interfaces/icontroller/#handle)
