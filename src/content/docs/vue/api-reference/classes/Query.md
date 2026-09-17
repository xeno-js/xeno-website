---
editUrl: false
next: false
prev: false
title: "Query"
---

Defined in: .temp/xeno-shared/dist/application/cqrs/query/query.d.ts:3

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

- [`IQuery`](/vue/api-reference/interfaces/iquery/)\<`TResponse`\>

## Constructors

### Constructor

> **new Query**\<`TResponse`\>(`intent`, `cacheOptions`): `Query`\<`TResponse`\>

Defined in: .temp/xeno-shared/dist/application/cqrs/query/query.d.ts:7

#### Parameters

##### intent

`string`

##### cacheOptions

[`ICacheableOptions`](/vue/api-reference/interfaces/icacheableoptions/)

#### Returns

`Query`\<`TResponse`\>

## Properties

### cacheOptions

> `readonly` **cacheOptions**: [`ICacheableOptions`](/vue/api-reference/interfaces/icacheableoptions/)

Defined in: .temp/xeno-shared/dist/application/cqrs/query/query.d.ts:5

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

[`IQuery`](/vue/api-reference/interfaces/iquery/).[`cacheOptions`](/vue/api-reference/interfaces/iquery/#cacheoptions)

***

### intent

> `readonly` **intent**: `string`

Defined in: .temp/xeno-shared/dist/application/cqrs/query/query.d.ts:4

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

[`IQuery`](/vue/api-reference/interfaces/iquery/).[`intent`](/vue/api-reference/interfaces/iquery/#intent)

***

### type

> `readonly` **type**: [`RequestType`](/vue/api-reference/type-aliases/requesttype/)

Defined in: .temp/xeno-shared/dist/application/cqrs/query/query.d.ts:6

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

[`IQuery`](/vue/api-reference/interfaces/iquery/).[`type`](/vue/api-reference/interfaces/iquery/#type-1)
