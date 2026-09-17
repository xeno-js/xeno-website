---
editUrl: false
next: false
prev: false
title: "IHttpClient"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/http/ihttp-client.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/http/ihttp-client.contracts.ts#L12)

## Description

Agnostic contract used to execute HTTP calls independently from concrete transport libraries (fetch, axios, undici, etc.).

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

## Methods

### delete()

> **delete**\<`TResponse`\>(`url`, `options`): `Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/http/ihttp-client.contracts.ts:99](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/http/ihttp-client.contracts.ts#L99)

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

#### Parameters

##### url

`string`

The URL to which the DELETE request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### options

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/shared/api-reference/interfaces/httprequest/)\<`never`\>, [`HttpOptions`](/shared/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).

#### Description

Executes an HTTP DELETE request to the specified URL with optional request options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### get()

> **get**\<`TResponse`\>(`url`, `options`): `Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/http/ihttp-client.contracts.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/http/ihttp-client.contracts.ts#L25)

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

#### Parameters

##### url

`string`

The URL to which the GET request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### options

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/shared/api-reference/interfaces/httprequest/)\<`never`\>, [`HttpOptions`](/shared/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).

#### Description

Executes an HTTP GET request to the specified URL with optional request options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### patch()

> **patch**\<`TResponse`, `TBody`\>(`url`, `body`, `options`): `Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/http/ihttp-client.contracts.ts:81](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/http/ihttp-client.contracts.ts#L81)

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

##### TBody

`TBody` = `unknown`

#### Parameters

##### url

`string`

The URL to which the PATCH request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### body

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TBody`\>

The request body to be sent with the PATCH request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.

##### options

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/shared/api-reference/interfaces/httprequest/)\<`TBody`\>, [`HttpOptions`](/shared/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).

#### Description

Executes an HTTP PATCH request to the specified URL with the provided request body and optional request options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### post()

> **post**\<`TResponse`, `TBody`\>(`url`, `body`, `options`): `Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/http/ihttp-client.contracts.ts:43](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/http/ihttp-client.contracts.ts#L43)

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

##### TBody

`TBody` = `unknown`

#### Parameters

##### url

`string`

The URL to which the POST request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### body

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TBody`\>

The request body to be sent with the POST request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.

##### options

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/shared/api-reference/interfaces/httprequest/)\<`TBody`\>, [`HttpOptions`](/shared/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).

#### Description

Executes an HTTP POST request to the specified URL with the provided request body and optional request options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### put()

> **put**\<`TResponse`, `TBody`\>(`url`, `body`, `options`): `Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/http/ihttp-client.contracts.ts:62](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/http/ihttp-client.contracts.ts#L62)

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

##### TBody

`TBody` = `unknown`

#### Parameters

##### url

`string`

The URL to which the PUT request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### body

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`TBody`\>

The request body to be sent with the PUT request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.

##### options

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/shared/api-reference/interfaces/httprequest/)\<`TBody`\>, [`HttpOptions`](/shared/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/shared/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

A promise that resolves to an HttpResponse object containing the status code, response headers, and response data from the server. The HttpResponse object provides information about the outcome of the HTTP request, including whether it was successful (status code 2xx) or if there was an error (status code 4xx or 5xx).

#### Description

Executes an HTTP PUT request to the specified URL with the provided request body and optional request options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
