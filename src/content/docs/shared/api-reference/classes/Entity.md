---
editUrl: false
next: false
prev: false
title: "Entity"
---

Defined in: [.temp/xeno-shared/src/domain/entities/entity.ts:17](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/entity.ts#L17)

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

- [`IEntity`](/shared/api-reference/interfaces/ientity/)\<`T`\>

## Properties

### id

> `readonly` **id**: [`UniqueId`](/shared/api-reference/classes/uniqueid/)

Defined in: [.temp/xeno-shared/src/domain/entities/entity.ts:18](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/entity.ts#L18)

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

[`IEntity`](/shared/api-reference/interfaces/ientity/).[`id`](/shared/api-reference/interfaces/ientity/#id)

## Methods

### getId()

> **getId**(): [`UniqueId`](/shared/api-reference/classes/uniqueid/)

Defined in: [.temp/xeno-shared/src/domain/entities/entity.ts:57](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/entity.ts#L57)

Retrieves the unique identifier of the entity.

#### Returns

[`UniqueId`](/shared/api-reference/classes/uniqueid/)

The unique identifier of the entity.

#### Implementation of

[`IEntity`](/shared/api-reference/interfaces/ientity/).[`getId`](/shared/api-reference/interfaces/ientity/#getid)

***

### getProps()

> **getProps**(): `T`

Defined in: [.temp/xeno-shared/src/domain/entities/entity.ts:53](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/entity.ts#L53)

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

[`IEntity`](/shared/api-reference/interfaces/ientity/).[`getProps`](/shared/api-reference/interfaces/ientity/#getprops)
