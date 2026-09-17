---
editUrl: false
next: false
prev: false
title: "HttpRequest"
---

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:103](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L103)

## Description

Request options accepted by the agnostic HTTP client.

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

- [`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/)

## Type Parameters

### TBody

`TBody` = `unknown`

## Properties

### body?

> `readonly` `optional` **body?**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`TBody`\>

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:120](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L120)

#### Description

Optional request body.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

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

#### Inherited from

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/).[`headers`](/shared/api-reference/interfaces/httpbaserequest/#headers)

***

### method

> `readonly` **method**: [`HttpMethod`](/shared/api-reference/type-aliases/httpmethod/)

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:111](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L111)

#### Description

HTTP method used for the outgoing call.

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

#### Inherited from

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/).[`query`](/shared/api-reference/interfaces/httpbaserequest/#query)

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

#### Inherited from

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/).[`signal`](/shared/api-reference/interfaces/httpbaserequest/#signal)

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

#### Inherited from

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/).[`timeoutMs`](/shared/api-reference/interfaces/httpbaserequest/#timeoutms)

***

### url?

> `readonly` `optional` **url?**: `string`

Defined in: [.temp/xeno-shared/src/shared/types/http.types.ts:129](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/http.types.ts#L129)

#### Description

Absolute or relative target URL.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
