---
editUrl: false
next: false
prev: false
title: "IMapper"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/mappers/imapper.contracts.ts:13](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/mappers/imapper.contracts.ts#L13)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/mappers/imapper.contracts.ts:26](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/mappers/imapper.contracts.ts#L26)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/mappers/imapper.contracts.ts:40](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/mappers/imapper.contracts.ts#L40)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/mappers/imapper.contracts.ts:53](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/mappers/imapper.contracts.ts#L53)

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
