---
editUrl: false
next: false
prev: false
title: "HttpBaseRequest"
---

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:56](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L56)

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

- [`HttpRequest`](/shared/api-reference/interfaces/httprequest/)

## Properties

### headers?

> `readonly` `optional` **headers?**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`HttpHeaders`](/shared/api-reference/type-aliases/httpheaders/)\>

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:73](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L73)

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

> `readonly` `optional` **query?**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Dictionary`](/shared/api-reference/type-aliases/dictionary/)\<[`HttpQueryValue`](/shared/api-reference/type-aliases/httpqueryvalue/)\>\>

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:64](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L64)

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

> `readonly` **signal**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:82](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L82)

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

> `readonly` `optional` **timeoutMs?**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:91](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L91)

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
