---
editUrl: false
next: false
prev: false
title: "IMapper"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/mappers/imapper.contracts.d.ts:13

## Description

Contratto per i Mapper, che definisce i metodi per convertire tra entità e Data Transfer Object (DTO).

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

### TE

`TE`

Il tipo dell'entità.

### TDto

`TDto`

Il tipo del Data Transfer Object (DTO).

  *
  *

## Methods

### toDto()

> **toDto**(`entity`): `TDto`

Defined in: .temp/xeno-shared/dist/domain/contracts/mappers/imapper.contracts.d.ts:26

Converts an entity of type TE to a Data Transfer Object (DTO) of type TDto.

#### Parameters

##### entity

`TE`

The entity to be converted.

#### Returns

`TDto`

A DTO representation of the given entity.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### toEntity()

> **toEntity**(`dto`): `TE`

Defined in: .temp/xeno-shared/dist/domain/contracts/mappers/imapper.contracts.d.ts:39

Converts a Data Transfer Object (DTO) of type TDto to an entity of type TE.

#### Parameters

##### dto

`TDto`

The DTO to be converted.

#### Returns

`TE`

An entity representation of the given DTO.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### toPartialDto()

> **toPartialDto**(`entity`): `Partial`\<`TDto`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/mappers/imapper.contracts.d.ts:51

Converts a partial entity of type TE to a partial Data Transfer Object (DTO) of type TDto.

#### Parameters

##### entity

`Partial`\<`TE`\>

The partial entity to be converted.

#### Returns

`Partial`\<`TDto`\>

A partial DTO representation of the given partial entity.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
