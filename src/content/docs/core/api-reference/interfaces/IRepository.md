---
editUrl: false
next: false
prev: false
title: "IRepository"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/repositories/irepository.contracts.d.ts:23

A generic repository interface for performing basic CRUD operations on entities of type T.

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

  *
  *

## Methods

### delete()

> **delete**(`entity`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/repositories/irepository.contracts.d.ts:93

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

***

### findAll()

> **findAll**(`ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`T`[]\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/repositories/irepository.contracts.d.ts:50

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

***

### findById()

> **findById**(`id`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`T`\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/repositories/irepository.contracts.d.ts:37

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

***

### save()

> **save**(`entity`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/repositories/irepository.contracts.d.ts:78

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

***

### update()

> **update**(`id`, `entity`, `ctx`, `signal`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/repositories/irepository.contracts.d.ts:65

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
