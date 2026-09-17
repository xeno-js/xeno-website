---
editUrl: false
next: false
prev: false
title: "IWriteDataSource"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iwrite-datasource.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iwrite-datasource.contracts.ts#L14)

## Description

Interface representing a data source for performing database operations. This interface defines the contract for executing SQL queries and commands against a database, including methods for finding records based on filters and unique identifiers, as well as inserting and deleting records. The IWriteDataSource interface is designed to be implemented by classes that provide specific data access logic, allowing for separation of concerns and easier testing. It extends the IReadDataSource interface, which includes basic read operations, and adds methods for write operations such as insert and delete.

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

### delete()

> **delete**(`dto`, `ctx`, `signal`): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iwrite-datasource.contracts.ts:75](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iwrite-datasource.contracts.ts#L75)

#### Parameters

##### dto

`TDto`

The data transfer object containing the data to be deleted from the database.

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the delete operation.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the command has been executed successfully.

#### Description

Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE). This method takes a data transfer object (DTO) containing the data to be deleted from the database, a user context, and an optional AbortSignal for cancellation. It returns a promise that resolves when the command has been executed successfully. The implementation of this method is responsible for constructing the appropriate SQL command based on the provided DTO and handling any necessary data transformations before executing the command.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

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

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iwrite-datasource.contracts.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iwrite-datasource.contracts.ts#L27)

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

Finds entities This method takes a filter object and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities. The implementation of this method is responsible for constructing the appropriate query based on the provided filter and handling any necessary data transformations before returning the results.

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

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iwrite-datasource.contracts.ts:42](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iwrite-datasource.contracts.ts#L42)

Executes a SQL query and returns the result as an array of objects.

#### Parameters

##### id

`string` \| `number`

The unique identifier of the entity to find.

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the query operation.

#### Returns

`Promise`\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TDto`\>\>

A promise that resolves to an object representing the row returned by the query.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### insert()

> **insert**(`dto`, `signal`): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iwrite-datasource.contracts.ts:60](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iwrite-datasource.contracts.ts#L60)

#### Parameters

##### dto

`TDto`

The data transfer object containing the data to be inserted into the database.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the insert operation.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the command has been executed successfully.

#### Description

Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE). This method takes a data transfer object (DTO) containing the data to be inserted into the database and an optional AbortSignal for cancellation. It returns a promise that resolves when the command has been executed successfully. The implementation of this method is responsible for constructing the appropriate SQL command based on the provided DTO and handling any necessary data transformations before executing the command.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### update()

> **update**(`id`, `dto`, `ctx`, `signal`): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/datasources/iwrite-datasource.contracts.ts:90](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/datasources/iwrite-datasource.contracts.ts#L90)

#### Parameters

##### id

`string` \| `number`

##### dto

`Partial`\<`TDto`\>

The data transfer object containing the data to be updated in the database.

##### ctx

[`UserContext`](/shared/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the update operation.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the command has been executed successfully.

#### Description

Executes a SQL command that does not return any rows (e.g., INSERT, UPDATE, DELETE). This method takes a data transfer object (DTO) containing the data to be updated in the database, a user context, and an optional AbortSignal for cancellation. It returns a promise that resolves when the command has been executed successfully. The implementation of this method is responsible for constructing the appropriate SQL command based on the provided DTO and handling any necessary data transformations before executing the command.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
