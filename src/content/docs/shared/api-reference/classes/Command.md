---
editUrl: false
next: false
prev: false
title: "Command"
---

Defined in: [.temp/xeno-shared/src/application/cqrs/command/command.ts:5](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/command/command.ts#L5)

## Description

An interface representing a base request in a CQRS architecture. This interface can be implemented by both command and query requests, as it includes common properties such as the request type, timestamp, and a unique token for identification.

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

### TResponse

`TResponse` = `unknown`

## Implements

- [`ICommand`](/shared/api-reference/interfaces/icommand/)\<`TResponse`\>

## Constructors

### Constructor

> **new Command**\<`TResponse`\>(`intent`): `Command`\<`TResponse`\>

Defined in: [.temp/xeno-shared/src/application/cqrs/command/command.ts:8](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/command/command.ts#L8)

#### Parameters

##### intent

`string`

#### Returns

`Command`\<`TResponse`\>

## Properties

### intent

> `readonly` **intent**: `string`

Defined in: [.temp/xeno-shared/src/application/cqrs/command/command.ts:8](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/command/command.ts#L8)

#### Description

The intent of the request, which can be used to describe the purpose or action associated with the request.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICommand`](/shared/api-reference/interfaces/icommand/).[`intent`](/shared/api-reference/interfaces/icommand/#intent)

***

### type

> `readonly` **type**: [`RequestType`](/shared/api-reference/type-aliases/requesttype/) = `REQUEST_TYPE.COMMAND`

Defined in: [.temp/xeno-shared/src/application/cqrs/command/command.ts:6](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/command/command.ts#L6)

#### Description

The type of the request, which can be used to distinguish between different kinds of requests (e.g., command, query).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICommand`](/shared/api-reference/interfaces/icommand/).[`type`](/shared/api-reference/interfaces/icommand/#type-1)
