---
editUrl: false
next: false
prev: false
title: "IReadDataSource"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iread-datasource.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iread-datasource.contracts.ts#L14)

## Description

Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries against a database, including methods for finding records based on filters and unique identifiers. The IReadDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing.

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

- [`IDisposable`](/shared/api-reference/interfaces/idisposable/)

## Type Parameters

### TDto

`TDto`

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/disposables/idisposable.contracts.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/disposables/idisposable.contracts.ts#L22)

#### Returns

`Promise`\<`void`\>

A promise that resolves when the disposal process is complete.

#### Description

Disposes of the resource, releasing any held resources and performing necessary cleanup. This method should be called when the resource is no longer needed to ensure proper cleanup and avoid resource leaks.

#### Inherited from

[`IDisposable`](/shared/api-reference/interfaces/idisposable/).[`dispose`](/shared/api-reference/interfaces/idisposable/#dispose)

***

### findAll()

> **findAll**(`ctx`, `signal`): `Promise`\<`TDto`[]\>

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iread-datasource.contracts.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iread-datasource.contracts.ts#L27)

#### Parameters

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the query operation.

#### Returns

`Promise`\<`TDto`[]\>

A promise that resolves to an array of objects representing the rows returned by the query.

#### Description

Finds entities. This method takes an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities. The implementation of this method is responsible for constructing the appropriate query and handling any necessary data transformations before returning the results.

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

> **findById**(`id`, `ctx`, `signal`): `Promise`\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TDto`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iread-datasource.contracts.ts:42](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iread-datasource.contracts.ts#L42)

#### Parameters

##### id

`string` \| `number`

The unique identifier of the entity to retrieve.

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the query operation.

#### Returns

`Promise`\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TDto`\>\>

A promise that resolves to an object representing the row returned by the query.

#### Description

Finds an entity by its unique identifier. This method takes an optional AbortSignal for cancellation. It returns a promise that resolves to the entity if found, or null if not found. The implementation of this method is responsible for constructing the appropriate query and handling any necessary data transformations before returning the result.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
