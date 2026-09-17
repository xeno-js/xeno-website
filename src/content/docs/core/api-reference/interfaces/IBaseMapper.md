---
editUrl: false
next: false
prev: false
title: "IBaseMapper"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/mappers/ibase-mapper.contracts.d.ts:19

## Description

Generic mapper interface defining a contract for mapping objects of type TSource to type TDestination. Mappers are used to convert data between different layers of the application, such as transforming DTOs to domain entities or vice versa. This interface defines a contract that all mappers must implement, ensuring consistency and maintainability of the code.

## Example

```ts
// Example of a UserMapper that maps a UserDTO to a UserEntity
 class UserMapper implements IBaseMapper<UserDTO, UserEntity> {
     map(source: UserDTO): UserEntity {
         // Mapping logic here
     }
 }

  *
  *
```

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

### TSource

`TSource`

The type of the source object to be mapped.

### TDestination

`TDestination`

The type of the destination object resulting from the mapping.

## Methods

### map()

> **map**(`source`): `TDestination`

Defined in: .temp/xeno-shared/dist/domain/contracts/mappers/ibase-mapper.contracts.d.ts:31

#### Parameters

##### source

`TSource`

The source object of type TSource that needs to be mapped to type TDestination. This object contains the data that will be transformed and returned as a new object of the destination type.

#### Returns

`TDestination`

An object of type TDestination that is the result of mapping the source object. The returned object should be a new instance that represents the transformed data according to the mapping logic defined in the implementation of this method.

#### Description

Maps an object of type TSource to an object of type TDestination. The implementation of this method should contain the logic for transforming the source object into the desired destination format, which may involve copying properties, converting data types, or applying any necessary transformations to ensure that the resulting object is correctly structured for its intended use.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
