---
editUrl: false
next: false
prev: false
title: "HttpResponse"
---

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:129

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

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:161

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

> `readonly` **headers**: [`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:153

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

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:145

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

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:137

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
