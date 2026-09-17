---
editUrl: false
next: false
prev: false
title: "Command"
---

Defined in: .temp/xeno-shared/dist/application/cqrs/command/command.d.ts:3

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

- [`ICommand`](/vue/api-reference/interfaces/icommand/)\<`TResponse`\>

## Constructors

### Constructor

> **new Command**\<`TResponse`\>(`intent`): `Command`\<`TResponse`\>

Defined in: .temp/xeno-shared/dist/application/cqrs/command/command.d.ts:6

#### Parameters

##### intent

`string`

#### Returns

`Command`\<`TResponse`\>

## Properties

### intent

> `readonly` **intent**: `string`

Defined in: .temp/xeno-shared/dist/application/cqrs/command/command.d.ts:4

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

[`ICommand`](/vue/api-reference/interfaces/icommand/).[`intent`](/vue/api-reference/interfaces/icommand/#intent)

***

### type

> `readonly` **type**: [`RequestType`](/vue/api-reference/type-aliases/requesttype/)

Defined in: .temp/xeno-shared/dist/application/cqrs/command/command.d.ts:5

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

[`ICommand`](/vue/api-reference/interfaces/icommand/).[`type`](/vue/api-reference/interfaces/icommand/#type-1)
