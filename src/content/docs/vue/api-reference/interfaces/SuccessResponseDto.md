---
editUrl: false
next: false
prev: false
title: "SuccessResponseDto"
---

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:66

## Description

Defines the structure of a successful API response, which includes a data field containing the expected response payload. This interface is used when the API call is successful and the server returns the requested data.

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

`T` = `unknown`

## Properties

### data

> `readonly` **data**: `T` \| [`IPaginatedResult`](/vue/api-reference/interfaces/ipaginatedresult/)\<`T`\>

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:82

#### Description

The actual data payload returned by the API call. The structure of this field can vary depending on the specific endpoint and the type of data being returned. It is defined as a generic type T, allowing for flexibility in the shape of the response data.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### meta

> `readonly` **meta**: [`Dictionary`](/vue/api-reference/type-aliases/dictionary/)

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:90

#### Description

Metadata associated with the successful API response. This can include pagination information, rate limit details, or other relevant metadata.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### success

> `readonly` **success**: `true`

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:74

#### Description

A boolean flag that is always true for successful responses. This provides a consistent way to check for success in the API response.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
