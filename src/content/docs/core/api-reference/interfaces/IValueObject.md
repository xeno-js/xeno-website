---
editUrl: false
next: false
prev: false
title: "IValueObject"
---

Defined in: .temp/xeno-shared/dist/domain/value\_objects/ivalue-object.contracts.d.ts:10

The IValueObject interface defines the contract for value objects in the domain. A value object is an immutable type that represents a concept or measurement in the domain, and its equality is based on its properties rather than its identity. The IValueObject interface includes methods for retrieving the underlying value, comparing value objects for equality, and providing a string representation of the value object.

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

## Type Parameters

### T

`T` *extends* `object`

## Methods

### equals()

> **equals**(`other`): `boolean`

Defined in: .temp/xeno-shared/dist/domain/value\_objects/ivalue-object.contracts.d.ts:33

Compares the current value object with another value object for equality. This method checks if the underlying values of both value objects are equal, allowing for meaningful comparisons between value objects based on their encapsulated data rather than their reference identity.

#### Parameters

##### other

`IValueObject`\<`T`\>

The other value object to compare with the current value object.

#### Returns

`boolean`

True if the underlying values of both value objects are equal; otherwise, returns false.

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

> **getValue**(): `T`

Defined in: .temp/xeno-shared/dist/domain/value\_objects/ivalue-object.contracts.d.ts:21

Retrieves the underlying value of the value object. This method provides access to the encapsulated data, allowing it to be used in comparisons, transformations, or other operations while maintaining the integrity and immutability of the value object.

#### Returns

`T`

The underlying value of the value object.

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

Defined in: .temp/xeno-shared/dist/domain/value\_objects/ivalue-object.contracts.d.ts:44

Returns a string representation of the value object. This method can be used for debugging, logging, or any scenario where a human-readable representation of the value object is needed. The string representation should ideally include relevant information about the underlying value to provide context when the value object is printed or logged.

#### Returns

`string`

A string representation of the value object.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
