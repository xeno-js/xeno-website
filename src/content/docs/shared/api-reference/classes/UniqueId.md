---
editUrl: false
next: false
prev: false
title: "UniqueId"
---

Defined in: [.temp/xeno-shared/src/domain/unique\_id/unique-id.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/unique_id/unique-id.ts#L14)

A class representing a unique identifier (UUID v4) for entities in the domain.
This class encapsulates the generation and representation of unique identifiers.

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

## Methods

### equals()

> **equals**(`other`): `boolean`

Defined in: [.temp/xeno-shared/src/domain/unique\_id/unique-id.ts:85](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/unique_id/unique-id.ts#L85)

Compares this UniqueId with another for equality based on their string values.

#### Parameters

##### other

`UniqueId`

The other UniqueId to compare with.

#### Returns

`boolean`

True if both UniqueIds have the same string value, false otherwise.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getValue()

> **getValue**(): `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: [.temp/xeno-shared/src/domain/unique\_id/unique-id.ts:70](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/unique_id/unique-id.ts#L70)

Returns the underlying GUID value of the UniqueId instance.

#### Returns

`` `${string}-${string}-${string}-${string}-${string}` ``

The GUID value of the UniqueId instance.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### toString()

> **toString**(): `string`

Defined in: [.temp/xeno-shared/src/domain/unique\_id/unique-id.ts:56](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/unique_id/unique-id.ts#L56)

Returns the string representation of the unique identifier.

#### Returns

`string`

The string representation of the unique identifier (UUID v4).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### create()

> `static` **create**(`id?`): `UniqueId`

Defined in: [.temp/xeno-shared/src/domain/unique\_id/unique-id.ts:40](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/unique_id/unique-id.ts#L40)

Static factory method to create a new UniqueId instance with a generated UUID v4.

#### Parameters

##### id?

`string`

#### Returns

`UniqueId`

A new instance of UniqueId with a generated UUID v4.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
