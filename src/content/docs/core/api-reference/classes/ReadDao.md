---
editUrl: false
next: false
prev: false
title: "ReadDao"
---

Defined in: .temp/xeno-js/src/infrastructure/repositories/read-dao.ts:17

An abstract generic read-only DAO that provides basic read operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IReadDataSource to perform database operations and an IMapper to convert between entities and DTOs.

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

### T

`T`

The type of the entity that the DAO will manage.

### TDto

`TDto`

The type of the Data Transfer Object (DTO) used for data access.

  * 
  *

## Implements

- [`IReadDao`](/core/api-reference/interfaces/ireaddao/)\<`T`\>

## Constructors

### Constructor

> **new ReadDao**\<`T`, `TDto`\>(`_dataSource`, `_mapper`): `ReadDao`\<`T`, `TDto`\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/read-dao.ts:29

Constructs a new ReadDao instance.

#### Parameters

##### \_dataSource

[`IReadDataSource`](/core/api-reference/interfaces/ireaddatasource/)\<`TDto`\>

An instance of IReadDataSource used to execute SQL queries and commands for data access.

##### \_mapper

[`IMapper`](/core/api-reference/interfaces/imapper/)\<`T`, `TDto`\>

An instance of IMapper used to convert between entities and DTOs.

#### Returns

`ReadDao`\<`T`, `TDto`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### findAll()

> **findAll**(`ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/read-dao.ts:47

#### Parameters

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal for cancellation.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

A promise that resolves to an array of entities that match the filter criteria.

#### Description

Finds entities based on a filter. This method takes a filter object and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities that match the filter criteria. The implementation of this method is responsible for constructing the appropriate query based on the provided filter and handling any necessary data transformations before returning the results.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IReadDao`](/core/api-reference/interfaces/ireaddao/).[`findAll`](/core/api-reference/interfaces/ireaddao/#findall)

***

### findById()

> **findById**(`id`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`T`\>\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/read-dao.ts:34

#### Parameters

##### id

`string` \| `number`

The unique identifier of the entity to find.

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal for cancellation.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`T`\>\>\>

A promise that resolves to the entity if found, or null | undefined if not found.

#### Description

Finds an entity by its unique identifier. This method takes an ID and an optional AbortSignal for cancellation. It returns a promise that resolves to the entity if found, or null | undefined if not found. The implementation of this method is responsible for constructing the appropriate query based on the provided ID and handling any necessary data transformations before returning the result.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IReadDao`](/core/api-reference/interfaces/ireaddao/).[`findById`](/core/api-reference/interfaces/ireaddao/#findbyid)
