---
editUrl: false
next: false
prev: false
title: "IWriteDataSource"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iwrite-datasource.contracts.d.ts:12

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

- [`IDisposable`](/core/api-reference/interfaces/idisposable/)

## Type Parameters

### TDto

`TDto`

## Methods

### delete()

> **delete**(`dto`, `ctx`, `signal`): `Promise`\<`void`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iwrite-datasource.contracts.d.ts:66

#### Parameters

##### dto

`TDto`

The data transfer object containing the data to be deleted from the database.

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

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

Defined in: .temp/xeno-shared/dist/domain/contracts/disposables/idisposable.contracts.d.ts:21

#### Returns

`Promise`\<`void`\>

A promise that resolves when the disposal process is complete.

#### Description

Disposes of the resource, releasing any held resources and performing necessary cleanup. This method should be called when the resource is no longer needed to ensure proper cleanup and avoid resource leaks.

#### Inherited from

[`IDisposable`](/core/api-reference/interfaces/idisposable/).[`dispose`](/core/api-reference/interfaces/idisposable/#dispose)

***

### findAll()

> **findAll**(`ctx`, `signal`): `Promise`\<`TDto`[]\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iwrite-datasource.contracts.d.ts:25

#### Parameters

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

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

> **findById**(`id`, `ctx`, `signal`): `Promise`\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`TDto`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iwrite-datasource.contracts.d.ts:39

Executes a SQL query and returns the result as an array of objects.

#### Parameters

##### id

`string` \| `number`

The unique identifier of the entity to find.

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the query operation.

#### Returns

`Promise`\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`TDto`\>\>

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

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iwrite-datasource.contracts.d.ts:52

#### Parameters

##### dto

`TDto`

The data transfer object containing the data to be inserted into the database.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

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

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iwrite-datasource.contracts.d.ts:80

#### Parameters

##### id

`string` \| `number`

##### dto

`Partial`\<`TDto`\>

The data transfer object containing the data to be updated in the database.

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

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
