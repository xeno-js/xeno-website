---
editUrl: false
next: false
prev: false
title: "Specification"
---

Defined in: .temp/xeno-js/src/application/specifications/specification.ts:14

Base class for specifications, providing default implementations for logical operations (AND, OR, NOT).

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

The type of the candidate object that the specification will evaluate.

  * 
  *

## Implements

- [`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

## Constructors

### Constructor

> **new Specification**\<`T`\>(): `Specification`\<`T`\>

#### Returns

`Specification`\<`T`\>

## Methods

### and()

> **and**(`other`): [`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

Defined in: .temp/xeno-js/src/application/specifications/specification.ts:41

Combines this specification with another specification using a logical AND operation.

#### Parameters

##### other

[`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

Another specification to combine with this specification.

#### Returns

[`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

A new specification that represents the logical AND of this and the other specification.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ISpecification`](/core/api-reference/interfaces/ispecification/).[`and`](/core/api-reference/interfaces/ispecification/#and)

***

### isSatisfiedBy()

> `abstract` **isSatisfiedBy**(`candidate`): `boolean`

Defined in: .temp/xeno-js/src/application/specifications/specification.ts:27

Determines if the candidate satisfies the specification criteria.

#### Parameters

##### candidate

`T`

The object to evaluate against the specification.

#### Returns

`boolean`

A boolean indicating whether the candidate satisfies the specification.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ISpecification`](/core/api-reference/interfaces/ispecification/).[`isSatisfiedBy`](/core/api-reference/interfaces/ispecification/#issatisfiedby)

***

### not()

> **not**(): [`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

Defined in: .temp/xeno-js/src/application/specifications/specification.ts:72

Inverts this specification using a logical NOT operation.

#### Returns

[`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

A new specification that represents the logical NOT of this specification.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ISpecification`](/core/api-reference/interfaces/ispecification/).[`not`](/core/api-reference/interfaces/ispecification/#not)

***

### or()

> **or**(`other`): [`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

Defined in: .temp/xeno-js/src/application/specifications/specification.ts:57

Combines this specification with another specification using a logical OR operation.

#### Parameters

##### other

[`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

Another specification to combine with this specification.

#### Returns

[`ISpecification`](/core/api-reference/interfaces/ispecification/)\<`T`\>

A new specification that represents the logical OR of this and the other specification.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ISpecification`](/core/api-reference/interfaces/ispecification/).[`or`](/core/api-reference/interfaces/ispecification/#or)
