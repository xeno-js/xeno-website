---
editUrl: false
next: false
prev: false
title: "Repository"
---

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:17

An abstract generic repository that provides basic CRUD operations for entities of type T, using a Data Transfer Object (DTO) of type TDto for data access. This class relies on an IWriteDataSource to perform database operations and an IMapper to convert between entities and DTOs.

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

The type of the entity that the repository will manage.

### TDto

`TDto`

The type of the Data Transfer Object (DTO) used for data access.

  * 
  *

## Implements

- [`IRepository`](/core/api-reference/interfaces/irepository/)\<`T`\>

## Constructors

### Constructor

> **new Repository**\<`T`, `TDto`\>(`_dataSource`, `_mapper`): `Repository`\<`T`, `TDto`\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:29

Constructs a new Repository instance.

#### Parameters

##### \_dataSource

[`IWriteDataSource`](/core/api-reference/interfaces/iwritedatasource/)\<`TDto`\>

An instance of IWriteDataSource used to execute SQL queries and commands for data access.

##### \_mapper

[`IMapper`](/core/api-reference/interfaces/imapper/)\<`T`, `TDto`\>

An instance of IMapper used to convert between entities and DTOs.

#### Returns

`Repository`\<`T`, `TDto`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### delete()

> **delete**(`entity`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:65

Deletes an entity from the repository by its unique identifier.

#### Parameters

##### entity

`T`

The entity to delete.

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the delete operation.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

A promise that resolves when the entity has been deleted.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRepository`](/core/api-reference/interfaces/irepository/).[`delete`](/core/api-reference/interfaces/irepository/#delete)

***

### findAll()

> **findAll**(`ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:48

#### Parameters

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal for cancellation.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

A promise that resolves to an array of entities that match the context.

#### Description

Finds entities based on the user context. This method takes a user context and an optional AbortSignal for cancellation. It returns a promise that resolves to an array of entities that match the context. The implementation of this method is responsible for constructing the appropriate query based on the provided context and handling any necessary data transformations before returning the results.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRepository`](/core/api-reference/interfaces/irepository/).[`findAll`](/core/api-reference/interfaces/irepository/#findall)

***

### findById()

> **findById**(`id`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`T`\>\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:34

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

[`IRepository`](/core/api-reference/interfaces/irepository/).[`findById`](/core/api-reference/interfaces/irepository/#findbyid)

***

### save()

> **save**(`entity`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:56

#### Parameters

##### entity

`T`

The entity object to save.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to allow cancellation of the save operation.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

A promise that resolves when the entity has been saved.

#### Description

Saves an entity to the repository. This method takes an entity object and an optional AbortSignal for cancellation. It returns a promise that resolves when the save operation is complete.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRepository`](/core/api-reference/interfaces/irepository/).[`save`](/core/api-reference/interfaces/irepository/#save)

***

### update()

> **update**(`id`, `entity`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-js/src/infrastructure/repositories/repository.ts:78

#### Parameters

##### id

`string` \| `number`

The unique identifier of the entity to update.

##### entity

`Partial`\<`T`\>

The partial entity object containing the data to be updated.

##### ctx

[`UserContext`](/core/api-reference/interfaces/usercontext/)

The context of the authenticated user, which may be used for authorization and auditing purposes.

##### signal

[`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal for cancellation.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

A promise that resolves when the update operation is complete.

#### Description

Updates entities based on the user context. This method takes a user context and an optional AbortSignal for cancellation. It returns a promise that resolves when the update operation is complete.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRepository`](/core/api-reference/interfaces/irepository/).[`update`](/core/api-reference/interfaces/irepository/#update)
