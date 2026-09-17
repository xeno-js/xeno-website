---
editUrl: false
next: false
prev: false
title: "ValueObject"
---

Defined in: [.temp/xeno-shared/src/domain/value\_objects/value-object.ts:15](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/value_objects/value-object.ts#L15)

The ValueObject class is an abstract implementation of the IValueObject interface, providing a base class for creating value objects in the domain. A value object is an immutable type that represents a concept or measurement in the domain, and its equality is based on its properties rather than its identity. The ValueObject class includes a constructor that initializes the properties of the value object and an equals method that compares two value objects for equality based on their properties.

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

## Implements

- [`IValueObject`](/shared/api-reference/interfaces/ivalueobject/)\<`T`\>

## Methods

### equals()

> **equals**(`vo?`): `boolean`

Defined in: [.temp/xeno-shared/src/domain/value\_objects/value-object.ts:30](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/value_objects/value-object.ts#L30)

Compares the current value object with another value object for equality. This method checks if the underlying values of both value objects are equal, allowing for meaningful comparisons between value objects based on their encapsulated data rather than their reference identity.

#### Parameters

##### vo?

[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`IValueObject`](/shared/api-reference/interfaces/ivalueobject/)\<`T`\>\> = `undefined`

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

#### Implementation of

[`IValueObject`](/shared/api-reference/interfaces/ivalueobject/).[`equals`](/shared/api-reference/interfaces/ivalueobject/#equals)

***

### getValue()

> **getValue**(): `T`

Defined in: [.temp/xeno-shared/src/domain/value\_objects/value-object.ts:38](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/value_objects/value-object.ts#L38)

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

#### Implementation of

[`IValueObject`](/shared/api-reference/interfaces/ivalueobject/).[`getValue`](/shared/api-reference/interfaces/ivalueobject/#getvalue)

***

### toString()

> **toString**(): `string`

Defined in: [.temp/xeno-shared/src/domain/value\_objects/value-object.ts:42](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/value_objects/value-object.ts#L42)

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

#### Implementation of

[`IValueObject`](/shared/api-reference/interfaces/ivalueobject/).[`toString`](/shared/api-reference/interfaces/ivalueobject/#tostring)
