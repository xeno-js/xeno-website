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

- [`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/)

## Type Parameters

### TBody

`TBody` = `unknown`

## Properties

### body?

> `readonly` `optional` **body?**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`TBody`\>

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

> `readonly` `optional` **headers?**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<[`HttpHeaders`](/vue/api-reference/type-aliases/httpheaders/)\>

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

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/).[`headers`](/vue/api-reference/interfaces/httpbaserequest/#headers)

***

### method

> `readonly` **method**: [`HttpMethod`](/vue/api-reference/type-aliases/httpmethod/)

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

> `readonly` `optional` **query?**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Dictionary`](/vue/api-reference/type-aliases/dictionary/)\<[`HttpQueryValue`](/vue/api-reference/type-aliases/httpqueryvalue/)\>\>

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

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/).[`query`](/vue/api-reference/interfaces/httpbaserequest/#query)

***

### signal

> `readonly` **signal**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`AbortSignal`\>

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

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/).[`signal`](/vue/api-reference/interfaces/httpbaserequest/#signal)

***

### timeoutMs?

> `readonly` `optional` **timeoutMs?**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

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

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/).[`timeoutMs`](/vue/api-reference/interfaces/httpbaserequest/#timeoutms)

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
