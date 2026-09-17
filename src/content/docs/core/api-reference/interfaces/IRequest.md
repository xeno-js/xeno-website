---
editUrl: false
next: false
prev: false
title: "IRequest"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/irequest.types.d.ts:11

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

- [`ICommand`](/core/api-reference/interfaces/icommand/)
- [`IQuery`](/core/api-reference/interfaces/iquery/)

## Type Parameters

### TResponse

`TResponse` = `unknown`

## Properties

### $type?

> `readonly` `optional` **$type?**: `TResponse`

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/irequest.types.d.ts:12

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

***

### type

> `readonly` **type**: [`RequestType`](/core/api-reference/type-aliases/requesttype/)

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
