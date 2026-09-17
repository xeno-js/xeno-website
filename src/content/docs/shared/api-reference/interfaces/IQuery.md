---
editUrl: false
next: false
prev: false
title: "IQuery"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/iquery.types.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/iquery.types.ts#L24)

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

- [`IRequest`](/shared/api-reference/interfaces/irequest/)\<`TResponse`\>

## Type Parameters

### TResponse

`TResponse` = `unknown`

## Properties

### $type?

> `readonly` `optional` **$type?**: `TResponse`

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/irequest.types.ts:13](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/irequest.types.ts#L13)

#### Inherited from

[`IRequest`](/shared/api-reference/interfaces/irequest/).[`$type`](/shared/api-reference/interfaces/irequest/#type)

***

### cacheOptions

> `readonly` **cacheOptions**: [`ICacheableOptions`](/shared/api-reference/interfaces/icacheableoptions/)

Defined in: [.temp/xeno-shared/src/domain/contracts/cqrs/cqrs\_types/iquery.types.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cqrs/cqrs_types/iquery.types.ts#L33)

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
