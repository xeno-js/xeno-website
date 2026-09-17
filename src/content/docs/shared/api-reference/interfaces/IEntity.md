---
editUrl: false
next: false
prev: false
title: "IEntity"
---

Defined in: [.temp/xeno-shared/src/domain/entities/ientity.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/ientity.contracts.ts#L14)

An interface representing a generic entity in the domain. An entity is an object that has a unique identity and is defined by its properties.

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

## Properties

### id

> `readonly` **id**: [`UniqueId`](/shared/api-reference/classes/uniqueid/)

Defined in: [.temp/xeno-shared/src/domain/entities/ientity.contracts.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/ientity.contracts.ts#L25)

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

## Methods

### getId()

> **getId**(): [`UniqueId`](/shared/api-reference/classes/uniqueid/)

Defined in: [.temp/xeno-shared/src/domain/entities/ientity.contracts.ts:44](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/ientity.contracts.ts#L44)

Retrieves the unique identifier of the entity.

#### Returns

[`UniqueId`](/shared/api-reference/classes/uniqueid/)

The unique identifier of the entity.

***

### getProps()

> **getProps**(): `T`

Defined in: [.temp/xeno-shared/src/domain/entities/ientity.contracts.ts:38](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/entities/ientity.contracts.ts#L38)

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
