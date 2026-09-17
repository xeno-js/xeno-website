---
editUrl: false
next: false
prev: false
title: "AxiosHttpClient"
---

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:4

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

## Implements

- [`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/)

## Constructors

### Constructor

> **new AxiosHttpClient**(`_client`): `AxiosHttpClient`

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:6

#### Parameters

##### \_client

`AxiosInstance`

#### Returns

`AxiosHttpClient`

## Methods

### delete()

> **delete**\<`TResponse`\>(`url`, `options?`): `Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:12

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

#### Parameters

##### url

`string`

The URL to which the DELETE request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### options?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/vue/api-reference/interfaces/httprequest/)\<`never`\>, [`HttpOptions`](/vue/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

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

#### Implementation of

[`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/).[`delete`](/vue/api-reference/interfaces/ihttpclient/#delete)

***

### get()

> **get**\<`TResponse`\>(`url`, `options?`): `Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:8

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

#### Parameters

##### url

`string`

The URL to which the GET request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### options?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/vue/api-reference/interfaces/httprequest/)\<`never`\>, [`HttpOptions`](/vue/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

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

#### Implementation of

[`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/).[`get`](/vue/api-reference/interfaces/ihttpclient/#get)

***

### patch()

> **patch**\<`TResponse`, `TBody`\>(`url`, `body?`, `options?`): `Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:11

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

##### TBody

`TBody` = `unknown`

#### Parameters

##### url

`string`

The URL to which the PATCH request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### body?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`TBody`\>

The request body to be sent with the PATCH request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.

##### options?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/vue/api-reference/interfaces/httprequest/)\<`TBody`\>, [`HttpOptions`](/vue/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

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

#### Implementation of

[`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/).[`patch`](/vue/api-reference/interfaces/ihttpclient/#patch)

***

### post()

> **post**\<`TResponse`, `TBody`\>(`url`, `body?`, `options?`): `Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:9

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

##### TBody

`TBody` = `unknown`

#### Parameters

##### url

`string`

The URL to which the POST request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### body?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`TBody`\>

The request body to be sent with the POST request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.

##### options?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/vue/api-reference/interfaces/httprequest/)\<`TBody`\>, [`HttpOptions`](/vue/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

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

#### Implementation of

[`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/).[`post`](/vue/api-reference/interfaces/ihttpclient/#post)

***

### put()

> **put**\<`TResponse`, `TBody`\>(`url`, `body?`, `options?`): `Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/http/axios.http.d.ts:10

#### Type Parameters

##### TResponse

`TResponse` = `unknown`

##### TBody

`TBody` = `unknown`

#### Parameters

##### url

`string`

The URL to which the PUT request is sent. This can be an absolute or relative URL depending on the configuration of the HTTP client.

##### body?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`TBody`\>

The request body to be sent with the PUT request. This can be of any type, such as an object, string, or FormData, depending on the requirements of the server endpoint.

##### options?

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`Omit`\<[`HttpRequest`](/vue/api-reference/interfaces/httprequest/)\<`TBody`\>, [`HttpOptions`](/vue/api-reference/type-aliases/httpoptions/)\>\>

Optional request options that can include headers, query parameters, abort signal, and timeout settings. These options allow for customization of the HTTP request, such as adding specific headers, including query parameters in the URL, setting a timeout for the request, or providing an abort signal to cancel the request if needed.

#### Returns

`Promise`\<[`HttpResponse`](/vue/api-reference/interfaces/httpresponse/)\<`TResponse`\>\>

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

#### Implementation of

[`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/).[`put`](/vue/api-reference/interfaces/ihttpclient/#put)
