---
editUrl: false
next: false
prev: false
title: "Query"
---

Defined in: [.temp/xeno-shared/src/application/cqrs/query/query.ts:5](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/query/query.ts#L5)

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

## Type Parameters

### TResponse

`TResponse` = `unknown`

## Implements

- [`IQuery`](/shared/api-reference/interfaces/iquery/)\<`TResponse`\>

## Constructors

### Constructor

> **new Query**\<`TResponse`\>(`intent`, `cacheOptions`): `Query`\<`TResponse`\>

Defined in: [.temp/xeno-shared/src/application/cqrs/query/query.ts:8](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/query/query.ts#L8)

#### Parameters

##### intent

`string`

##### cacheOptions

[`ICacheableOptions`](/shared/api-reference/interfaces/icacheableoptions/)

#### Returns

`Query`\<`TResponse`\>

## Properties

### cacheOptions

> `readonly` **cacheOptions**: [`ICacheableOptions`](/shared/api-reference/interfaces/icacheableoptions/)

Defined in: [.temp/xeno-shared/src/application/cqrs/query/query.ts:10](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/query/query.ts#L10)

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

#### Implementation of

[`IQuery`](/shared/api-reference/interfaces/iquery/).[`cacheOptions`](/shared/api-reference/interfaces/iquery/#cacheoptions)

***

### intent

> `readonly` **intent**: `string`

Defined in: [.temp/xeno-shared/src/application/cqrs/query/query.ts:9](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/query/query.ts#L9)

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

[`IQuery`](/shared/api-reference/interfaces/iquery/).[`intent`](/shared/api-reference/interfaces/iquery/#intent)

***

### type

> `readonly` **type**: [`RequestType`](/shared/api-reference/type-aliases/requesttype/) = `REQUEST_TYPE.QUERY`

Defined in: [.temp/xeno-shared/src/application/cqrs/query/query.ts:6](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/cqrs/query/query.ts#L6)

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

[`IQuery`](/shared/api-reference/interfaces/iquery/).[`type`](/shared/api-reference/interfaces/iquery/#type-1)
