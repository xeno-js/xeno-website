---
editUrl: false
next: false
prev: false
title: "AbortSignalHelper"
---

Defined in: [.temp/xeno-shared/src/shared/utils/abort.utils.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/utils/abort.utils.ts#L22)

AbortSignalHelper

## Description

A utility class that provides a method to execute a promise with an optional AbortSignal.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

www.github.com/Mattia-Carcione/xeno-js

## Methods

### execute()

> `readonly` `static` **execute**\<`T`\>(`promise`, `signal`): `Promise`\<`T`\>

Defined in: [.temp/xeno-shared/src/shared/utils/abort.utils.ts:35](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/utils/abort.utils.ts#L35)

Executes a promise with an optional AbortSignal. If the signal is provided and is aborted, the promise will be rejected with the signal's reason.

#### Type Parameters

##### T

`T`

The type of the promise's resolved value.

#### Parameters

##### promise

`Promise`\<`T`\>

The promise to execute.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal to cancel the promise.

#### Returns

`Promise`\<`T`\>

A promise that resolves with the original promise's value or rejects if the signal is aborted.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

www.github.com/Mattia-Carcione/xeno-js
