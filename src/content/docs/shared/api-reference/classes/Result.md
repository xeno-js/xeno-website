---
editUrl: false
next: false
prev: false
title: "Result"
---

Defined in: [.temp/xeno-shared/src/domain/results/result.ts:16](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/results/result.ts#L16)

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

Defined in: [.temp/xeno-shared/src/domain/results/result.ts:145](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/results/result.ts#L145)

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

> **getValueOrThrow**(): [`Optional`](/shared/api-reference/type-aliases/optional/)\<`TValue`\>

Defined in: [.temp/xeno-shared/src/domain/results/result.ts:126](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/results/result.ts#L126)

Gets the value of the result or throws an error if the result is a failure.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TValue`\>

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

Defined in: [.temp/xeno-shared/src/domain/results/result.ts:110](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/results/result.ts#L110)

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

Defined in: [.temp/xeno-shared/src/domain/results/result.ts:95](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/results/result.ts#L95)

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

Defined in: [.temp/xeno-shared/src/domain/results/result.ts:79](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/results/result.ts#L79)

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
