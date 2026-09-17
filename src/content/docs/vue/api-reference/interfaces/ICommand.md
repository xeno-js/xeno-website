---
editUrl: false
next: false
prev: false
title: "ICommand"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/icommand.types.d.ts:20

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

## Extends

- [`IRequest`](/vue/api-reference/interfaces/irequest/)\<`TResponse`\>

## Type Parameters

### TResponse

`TResponse` = `unknown`

## Properties

### $type?

> `readonly` `optional` **$type?**: `TResponse`

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/icommand.types.d.ts:28

#### Description

An optional property to specify the expected response type of the command, which can be used for type inference and validation in command handlers.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Overrides

[`IRequest`](/vue/api-reference/interfaces/irequest/).[`$type`](/vue/api-reference/interfaces/irequest/#type)

***

### intent

> `readonly` **intent**: `string`

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/irequest.types.d.ts:20

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

#### Inherited from

[`IRequest`](/vue/api-reference/interfaces/irequest/).[`intent`](/vue/api-reference/interfaces/irequest/#intent)

***

### type

> `readonly` **type**: [`RequestType`](/vue/api-reference/type-aliases/requesttype/)

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/irequest.types.d.ts:28

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

#### Inherited from

[`IRequest`](/vue/api-reference/interfaces/irequest/).[`type`](/vue/api-reference/interfaces/irequest/#type-1)
