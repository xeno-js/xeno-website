---
editUrl: false
next: false
prev: false
title: "IMediator"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/imediator.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/imediator.contracts.ts#L14)

An interface representing a mediator in the CQRS (Command Query Responsibility Segregation) pattern. The mediator is responsible for sending commands and executing queries by delegating them to the appropriate handlers.

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

## Methods

### query()

> **query**\<`TResponse`\>(`request`, `signal`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/imediator.contracts.ts:41](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/imediator.contracts.ts#L41)

Executes a query and returns the result.

#### Type Parameters

##### TResponse

`TResponse`

#### Parameters

##### request

[`IQuery`](/shared/api-reference/interfaces/iquery/)\<`TResponse`\>

The query object to be executed.

##### signal

`AbortSignal`

An optional AbortSignal to allow cancellation of the query.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A promise that resolves to the result of the query.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### send()

> **send**\<`TResponse`\>(`request`, `signal`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/imediator.contracts.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/imediator.contracts.ts#L27)

Sends a command to the appropriate handler and returns a response.

#### Type Parameters

##### TResponse

`TResponse`

#### Parameters

##### request

[`ICommand`](/shared/api-reference/interfaces/icommand/)\<`TResponse`\>

The command object to be executed.

##### signal

`AbortSignal`

An optional AbortSignal to allow cancellation of the command.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A promise that resolves to the response from the handler.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
