---
editUrl: false
next: false
prev: false
title: "Result"
---

Defined in: .temp/xeno-shared/dist/domain/results/result.d.ts:15

A class representing the result of an operation, which can either be a success or a failure.
It encapsulates the value of a successful operation or the error of a failed operation.

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

### TValue

`TValue`

The type of the value in case of a successful operation.

### TError

`TError` = `never`

The type of the error in case of a failed operation (default is never).

  *
  *

## Methods

### getErrorOrThrow()

> **getErrorOrThrow**(): `TError`

Defined in: .temp/xeno-shared/dist/domain/results/result.d.ts:123

Gets the error of the result or throws an error if the result is a success.

#### Returns

`TError`

The error of the result.

#### Throws

An error if the result is a success.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getValueOrThrow()

> **getValueOrThrow**(): [`Optional`](/vue/api-reference/type-aliases/optional/)\<`TValue`\>

Defined in: .temp/xeno-shared/dist/domain/results/result.d.ts:110

Gets the value of the result or throws an error if the result is a failure.

#### Returns

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`TValue`\>

The value of the result.

#### Throws

An error if the result is a failure.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### isOk()

> **isOk**(): `boolean`

Defined in: .temp/xeno-shared/dist/domain/results/result.d.ts:97

Checks if the result is a success.

#### Returns

`boolean`

True if the result is a success, false otherwise.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### fail()

> `static` **fail**\<`U`, `V`\>(`error`): `Result`\<`U`, `V`\>

Defined in: .temp/xeno-shared/dist/domain/results/result.d.ts:85

Creates a failed result with the given error.

#### Type Parameters

##### U

`U`

##### V

`V` = `never`

#### Parameters

##### error

`V`

The error of the failed operation.

#### Returns

`Result`\<`U`, `V`\>

A Result instance representing a failed operation.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### ok()

> `static` **ok**\<`U`\>(`value?`): `Result`\<`U`\>

Defined in: .temp/xeno-shared/dist/domain/results/result.d.ts:72

Creates a successful result with the given value.

#### Type Parameters

##### U

`U`

#### Parameters

##### value?

`U`

The value of the successful operation.

#### Returns

`Result`\<`U`\>

A Result instance representing a successful operation.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
