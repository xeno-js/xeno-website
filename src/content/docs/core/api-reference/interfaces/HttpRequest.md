---
editUrl: false
next: false
prev: false
title: "HttpRequest"
---

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:94

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

- [`HttpBaseRequest`](/core/api-reference/interfaces/httpbaserequest/)

## Type Parameters

### TBody

`TBody` = `unknown`

## Properties

### body?

> `readonly` `optional` **body?**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`TBody`\>

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:110

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

#### Inherited from

[`HttpBaseRequest`](/core/api-reference/interfaces/httpbaserequest/).[`headers`](/core/api-reference/interfaces/httpbaserequest/#headers)

***

### method

> `readonly` **method**: [`HttpMethod`](/core/api-reference/type-aliases/httpmethod/)

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:102

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

#### Inherited from

[`HttpBaseRequest`](/core/api-reference/interfaces/httpbaserequest/).[`query`](/core/api-reference/interfaces/httpbaserequest/#query)

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

#### Inherited from

[`HttpBaseRequest`](/core/api-reference/interfaces/httpbaserequest/).[`signal`](/core/api-reference/interfaces/httpbaserequest/#signal)

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

#### Inherited from

[`HttpBaseRequest`](/core/api-reference/interfaces/httpbaserequest/).[`timeoutMs`](/core/api-reference/interfaces/httpbaserequest/#timeoutms)

***

### url?

> `readonly` `optional` **url?**: `string`

Defined in: .temp/xeno-shared/dist/shared/types/http.types.d.ts:118

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
