---
editUrl: false
next: false
prev: false
title: "HttpBaseRequest"
---

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:51

## Description

Base Request options accepted by the agnostic HTTP client.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extended by

- [`HttpRequest`](/core/api-reference/interfaces/httprequest/)

## Properties

### headers?

> `readonly` `optional` **headers?**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:67

#### Description

Optional request headers.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### query?

> `readonly` `optional` **query?**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`Dictionary`](/core/api-reference/type-aliases/dictionary/)\<[`HttpQueryValue`](/core/api-reference/type-aliases/httpqueryvalue/)\>\>

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:59

#### Description

Optional query string parameters.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### signal

> `readonly` **signal**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`AbortSignal`\>

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:75

#### Description

Optional abort signal used to cancel the request.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### timeoutMs?

> `readonly` `optional` **timeoutMs?**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:83

#### Description

Optional request timeout in milliseconds.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
