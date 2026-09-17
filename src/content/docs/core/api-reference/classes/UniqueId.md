---
editUrl: false
next: false
prev: false
title: "UniqueId"
---

Defined in: .temp/xeno-shared/dist/domain/unique\_id/unique-id.d.ts:12

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

Defined in: .temp/xeno-shared/dist/domain/unique\_id/unique-id.d.ts:70

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

Defined in: .temp/xeno-shared/dist/domain/unique\_id/unique-id.d.ts:58

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

Defined in: .temp/xeno-shared/dist/domain/unique\_id/unique-id.d.ts:47

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

Defined in: .temp/xeno-shared/dist/domain/unique\_id/unique-id.d.ts:36

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
