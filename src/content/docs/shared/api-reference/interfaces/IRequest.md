---
editUrl: false
next: false
prev: false
title: "IRequest"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/irequest.types.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/irequest.types.ts#L12)

## Fileoverview

Defines the IRequest interface for requests in a CQRS architecture.

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

## Extended by

- [`ICommand`](/shared/api-reference/interfaces/icommand/)
- [`IQuery`](/shared/api-reference/interfaces/iquery/)

## Type Parameters

### TResponse

`TResponse` = `unknown`

## Properties

### $type?

> `readonly` `optional` **$type?**: `TResponse`

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/irequest.types.ts:13](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/irequest.types.ts#L13)

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
