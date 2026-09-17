---
editUrl: false
next: false
prev: false
title: "IQuery"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/iquery.types.d.ts:21

## Description

An interface representing a paginated query request, which extends the IQuery interface and includes pagination parameters.

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

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/irequest.types.d.ts:12

#### Inherited from

[`IRequest`](/vue/api-reference/interfaces/irequest/).[`$type`](/vue/api-reference/interfaces/irequest/#type)

***

### cacheOptions

> `readonly` **cacheOptions**: [`ICacheableOptions`](/vue/api-reference/interfaces/icacheableoptions/)

Defined in: .temp/xeno-shared/dist/domain/contracts/cqrs/cqrs\_types/iquery.types.d.ts:30

#### Description

Cache options for the query, including cache key, TTL, and bypass flags.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

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
