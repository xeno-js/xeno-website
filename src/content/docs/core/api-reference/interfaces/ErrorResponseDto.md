---
editUrl: false
next: false
prev: false
title: "ErrorResponseDto"
---

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:101

## Description

Defines the structure of an error API response, which includes an error object containing details about the failure. This interface is used when the API call results in an error and the server returns information about what went wrong.

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

## Properties

### correlationId

> `readonly` **correlationId**: `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:158

#### Description

Metadata associated with the error API response. This can include information about the request that led to the error, timestamps, or any other relevant metadata that can help in understanding the context of the error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### error

> `readonly` **error**: `object`

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:117

#### code

> `readonly` **code**: `string`

##### Description

A string code that categorizes the type of error that occurred. This can be used for programmatic handling of different error types.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### details

> `readonly` **details**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

##### Description

Optional additional details about the error. This can include stack traces, validation errors, or any other relevant information that can assist in diagnosing and fixing the issue.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### message

> `readonly` **message**: `string`

##### Description

A human-readable message that describes the error. This should provide enough information for developers to understand what went wrong and how to address it.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### path

> `readonly` **path**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

##### Description

Optional path of the request that led to the error. This can be useful for logging and debugging purposes, allowing developers to trace back to the specific endpoint that caused the error.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

An object containing details about the error that occurred during the API call. This includes an error code, a human-readable error message, and optionally additional details that can help diagnose the issue.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### requestId

> `readonly` **requestId**: `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:166

#### Description

The timestamp indicating when the error occurred. This can be useful for logging and debugging purposes, allowing developers to correlate errors with specific events or requests.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### spanId

> `readonly` **spanId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:182

#### Description

An optional identifier for distributed tracing, which can be used to track the flow of requests across multiple services in a microservices architecture. This can help in diagnosing issues and understanding the context of the error within a larger system.

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

> `readonly` **success**: `false`

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:109

#### Description

A boolean flag that is always false for error responses. This provides a consistent way to check for errors in the API response.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### timestamp

> `readonly` **timestamp**: `string`

Defined in: .temp/xeno-shared/dist/shared/types/api-response.types.d.ts:174

#### Description

The timestamp indicating when the error occurred. This can be useful for logging and debugging purposes, allowing developers to correlate errors with specific events or requests.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
