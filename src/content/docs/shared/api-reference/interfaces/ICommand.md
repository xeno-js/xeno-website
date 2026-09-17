---
editUrl: false
next: false
prev: false
title: "ICommand"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/icommand.types.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/icommand.types.ts#L22)

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

- [`IRequest`](/shared/api-reference/interfaces/irequest/)\<`TResponse`\>

## Type Parameters

### TResponse

`TResponse` = `unknown`

## Properties

### $type?

> `readonly` `optional` **$type?**: `TResponse`

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/icommand.types.ts:30](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/icommand.types.ts#L30)

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

[`IRequest`](/shared/api-reference/interfaces/irequest/).[`$type`](/shared/api-reference/interfaces/irequest/#type)

***

### intent

> `readonly` **intent**: `string`

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/irequest.types.ts:21](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/irequest.types.ts#L21)

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

[`IRequest`](/shared/api-reference/interfaces/irequest/).[`intent`](/shared/api-reference/interfaces/irequest/#intent)

***

### type

> `readonly` **type**: [`RequestType`](/shared/api-reference/type-aliases/requesttype/)

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/irequest.types.ts:29](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/irequest.types.ts#L29)

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

[`IRequest`](/shared/api-reference/interfaces/irequest/).[`type`](/shared/api-reference/interfaces/irequest/#type-1)
