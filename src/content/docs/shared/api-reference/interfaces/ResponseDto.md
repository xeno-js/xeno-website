---
editUrl: false
next: false
prev: false
title: "ResponseDto"
---

Defined in: [.temp/xeno-shared/src/shared/types/api-response.types.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/api-response.types.ts#L25)

## Description

Defines the structure of the API response returned by the server. It includes a status indicating whether the request was successful or resulted in an error, a boolean flag 'ok' for quick checks, headers containing any relevant HTTP headers, and a data field that can either be a successful response with the expected data or an error response with details about the failure.

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

> **data**: [`ApiResponseDto`](/shared/api-reference/type-aliases/apiresponsedto/)\<`T`\>

Defined in: [.temp/xeno-shared/src/shared/types/api-response.types.ts:57](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/api-response.types.ts#L57)

#### Description

The payload of the API response, which can either be a successful response containing the expected data or an error response containing details about the failure. The structure of this field depends on whether the API call was successful or resulted in an error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### headers

> **headers**: [`HttpHeaders`](/shared/api-reference/type-aliases/httpheaders/)

Defined in: [.temp/xeno-shared/src/shared/types/api-response.types.ts:49](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/api-response.types.ts#L49)

#### Description

A dictionary of HTTP headers included in the API response. This can contain any relevant headers returned by the server, such as content type, caching directives, or custom headers.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### ok

> **ok**: `boolean`

Defined in: [.temp/xeno-shared/src/shared/types/api-response.types.ts:41](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/api-response.types.ts#L41)

#### Description

A boolean flag that is true if the response status is 'success' and false if it is 'error'. This provides a convenient way to check the success of the API call without having to compare the status string.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### status

> **status**: `number`

Defined in: [.temp/xeno-shared/src/shared/types/api-response.types.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/api-response.types.ts#L33)

#### Description

Indicates the overall status of the API response, which can be either 'success' or 'error'.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
