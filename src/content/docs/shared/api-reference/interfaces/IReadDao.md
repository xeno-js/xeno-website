---
editUrl: false
next: false
prev: false
title: "IReadDao"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/repositories/iread-dao.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/repositories/iread-dao.contracts.ts#L14)

## Description

Interface representing a Data Access Object (DAO) for read operations. This interface defines the contract for retrieving data from a data source, such as a database or an API. It includes methods for finding an entity by its unique identifier and for finding multiple entities based on a filter. The IReadDao interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing.

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

### T

`T`

## Methods

### findAll()

> **findAll**(`ctx`, `signal`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/repositories/iread-dao.contracts.ts:46](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/repositories/iread-dao.contracts.ts#L46)

#### Parameters

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal for cancellation.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

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

***

### findById()

> **findById**(`id`, `ctx`, `signal`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`T`\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/repositories/iread-dao.contracts.ts:28](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/repositories/iread-dao.contracts.ts#L28)

#### Parameters

##### id

`string` \| `number`

The unique identifier of the entity to find.

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal for cancellation.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`T`\>\>\>

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
