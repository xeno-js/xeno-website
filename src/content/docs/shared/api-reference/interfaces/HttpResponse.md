---
editUrl: false
next: false
prev: false
title: "HttpResponse"
---

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:141](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L141)

## Description

Normalized response returned by an agnostic HTTP client.

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

### TData

`TData` = `unknown`

## Properties

### data

> `readonly` **data**: `TData`

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:176](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L176)

#### Description

Parsed response payload.

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

> `readonly` **headers**: [`HttpHeaders`](/shared/api-reference/type-aliases/httpheaders/)

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:167](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L167)

#### Description

Response headers normalized as a dictionary.

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

> `readonly` **ok**: `boolean`

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:158](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L158)

#### Description

Indicates if the response status is in the 2xx range.

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

> `readonly` **status**: `number`

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:149](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L149)

#### Description

HTTP status code returned by the server.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
