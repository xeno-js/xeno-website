---
editUrl: false
next: false
prev: false
title: "Entity"
---

Defined in: .temp/xeno-shared/dist/domain/entities/entity.d.ts:15

A base class representing a generic entity in the domain. An entity is an object that has a unique identity and is defined by its properties.

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

The type of the properties of the entity.

  *
  *

## Implements

- [`IEntity`](/core/api-reference/interfaces/ientity/)\<`T`\>

## Properties

### id

> `readonly` **id**: [`UniqueId`](/core/api-reference/classes/uniqueid/)

Defined in: .temp/xeno-shared/dist/domain/entities/entity.d.ts:16

The unique identifier of the entity. This is a read-only property that should be assigned when the entity is created and should not change throughout the lifecycle of the entity.

#### See

UniqueId for more details on the unique identifier.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IEntity`](/core/api-reference/interfaces/ientity/).[`id`](/core/api-reference/interfaces/ientity/#id)

## Methods

### getId()

> **getId**(): [`UniqueId`](/core/api-reference/classes/uniqueid/)

Defined in: .temp/xeno-shared/dist/domain/entities/entity.d.ts:41

Retrieves the unique identifier of the entity.

#### Returns

[`UniqueId`](/core/api-reference/classes/uniqueid/)

The unique identifier of the entity.

#### Implementation of

[`IEntity`](/core/api-reference/interfaces/ientity/).[`getId`](/core/api-reference/interfaces/ientity/#getid)

***

### getProps()

> **getProps**(): `T`

Defined in: .temp/xeno-shared/dist/domain/entities/entity.d.ts:40

Retrieves the properties of the entity.

#### Returns

`T`

The properties of the entity.

#### Throws

An error if the entity is in an invalid state or if the properties cannot be retrieved.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IEntity`](/core/api-reference/interfaces/ientity/).[`getProps`](/core/api-reference/interfaces/ientity/#getprops)
