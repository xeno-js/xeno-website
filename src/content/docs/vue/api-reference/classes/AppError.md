---
editUrl: false
next: false
prev: false
title: "AppError"
---

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:72

A class representing an application error, which extends the built-in Error class.
It includes additional properties such as an error code and an HTTP status code.

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

## Extends

- `Error`

## Indexable

> \[`key`: `string`\]: `unknown`

A Dictionary to hold any additional context or information related to the error.

### Author

Xeno

### Version

1.0.0

### Since

2025-09-30

### Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### cause?

> `optional` **cause?**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

`Error.cause`

***

### code

> `readonly` **code**: `string`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:82

The error code representing the type of error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`

***

### status

> `readonly` **status**: `number`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:92

The HTTP status code associated with the error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### aborted()

> `static` **aborted**(`name`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:150

Creates an AppError instance representing an aborted request.

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred.

#### Returns

`AppError`

An AppError instance representing the aborted request error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### authFailed()

> `static` **authFailed**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:240

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the Authentication failed. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the Authentication failed.

#### Description

Creates an AppError instance representing a Authentication failed. This method is used to generate a standardized error response when an auth requested produce an error..

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### badRequest()

> `static` **badRequest**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:196

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the bad request. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the bad request error.

#### Description

Creates an AppError instance representing a bad request error. This method is used to generate a standardized error response when a request made by the client is invalid or cannot be processed due to client-side issues, such as validation errors or malformed requests.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### conflict()

> `static` **conflict**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:218

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the conflict. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the conflict error.

#### Description

Creates an AppError instance representing a conflict error. This method is used to generate a standardized error response when a request conflicts with the current state of the resource, such as when attempting to create a resource that already exists or update a resource that has been modified by another process.

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

> `static` **create**(`payload`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:126

Creates an AppError instance with the given error payload.

#### Parameters

##### payload

`ErrorPayload`

The payload containing error details.

#### Returns

`AppError`

An AppError instance representing the error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### forbidden()

> `static` **forbidden**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:185

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the forbidden access. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the forbidden access error.

#### Description

Creates an AppError instance representing a forbidden access error. This method is used to generate a standardized error response when a user attempts to access a resource or perform an action that they are not authorized to access, even if they are authenticated.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### notFound()

> `static` **notFound**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:229

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the not found error. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the not found error.

#### Description

Creates an AppError instance representing a not found error. This method is used to generate a standardized error response when a requested resource does not exist, indicating that the client attempted to access a resource that could not be found on the server.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### notSupported()

> `static` **notSupported**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:174

#### Parameters

##### name

`string`

##### message

`string`

#### Returns

`AppError`

***

### throw()

> `static` **throw**(`payload`): `never`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:138

Creates an AppError instance and throws it immediately.

#### Parameters

##### payload

`ErrorPayload`

The payload containing error details.

#### Returns

`never`

#### Throws

An AppError instance representing the error.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### throwIfAborted()

> `static` **throwIfAborted**(`signal`, `name`): `void`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:162

Utility method to check if an AbortSignal has been triggered and throw an AppError if it has.

#### Parameters

##### signal

[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<`AbortSignal`\>

The AbortSignal to check for abortion.

##### name

`string`

The name of the error, typically the class name or context where the error occurred.

#### Returns

`void`

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### unauthorized()

> `static` **unauthorized**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:173

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the unauthorized access. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the unauthorized access error.

#### Description

Creates an AppError instance representing an unauthorized access error. This method is used to generate a standardized error response when a user attempts to access a resource or perform an action without the necessary authentication or authorization.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### validationError()

> `static` **validationError**(`name`, `message`): `AppError`

Defined in: .temp/xeno-shared/dist/domain/errors/app-error.d.ts:207

#### Parameters

##### name

`string`

The name of the error, typically the class name or context where the error occurred. This helps in identifying the source of the error in logs and error reports.

##### message

`string`

A custom message describing the reason for the validation failure. This message is included in the AppError's cause for detailed error reporting.

#### Returns

`AppError`

An AppError instance representing the validation error.

#### Description

Creates an AppError instance representing a validation error. This method is used to generate a standardized error response when one or more input fields fail invariant or schema validation, indicating that the request cannot be processed due to invalid data.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
