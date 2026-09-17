---
editUrl: false
next: false
prev: false
title: "RemoteDataSource"
---

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:13](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L13)

## Description

Concrete implementation of the IRemoteDataSource contract that utilizes an agnostic HTTP client and a resilience service to fetch data from remote endpoints. The RemoteDataSource class is responsible for sending HTTP requests based on the provided HttpClientRequest parameters, while leveraging the resilience features of the IServiceResilience to ensure reliable communication with external services. This implementation abstracts away the details of how HTTP requests are made and how resilience is handled, allowing for flexibility in choosing different HTTP clients and resilience strategies without affecting the consumers of the IRemoteDataSource interface.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Implements

- [`IRemoteDataSource`](/shared/api-reference/interfaces/iremotedatasource/)

## Constructors

### Constructor

> **new RemoteDataSource**(`_httpClient`, `_resilienceService`): `RemoteDataSource`

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L25)

The constructor of the RemoteDataSource class takes two dependencies: an instance of an agnostic HTTP client that implements the IHttpClient interface, and an instance of a resilience service that implements the IServiceResilience interface.
These dependencies are injected into the class, allowing for greater flexibility and testability.
The HTTP client is used to send requests to remote endpoints, while the resilience service is used to execute these requests with built-in support for retries, timeouts, and circuit breakers, ensuring that the remote calls are more resilient to failures and can recover gracefully from errors.

#### Parameters

##### \_httpClient

[`IHttpClient`](/shared/api-reference/interfaces/ihttpclient/)

An instance of an agnostic HTTP client that implements the IHttpClient interface, used for sending HTTP requests to remote endpoints.

##### \_resilienceService

[`IServiceResilience`](/shared/api-reference/interfaces/iserviceresilience/)

An instance of a resilience service that implements the IServiceResilience interface, used for executing HTTP requests with built-in support for retries, timeouts, and circuit breakers to enhance the reliability of remote calls.

#### Returns

`RemoteDataSource`

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### delete()

> **delete**\<`TResponse`\>(`endpoint`, `request?`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:133](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L133)

#### Type Parameters

##### TResponse

`TResponse`

#### Parameters

##### endpoint

`string`

The URL or endpoint from which to delete data.

##### request?

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.

#### Description

Deletes data from a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRemoteDataSource`](/shared/api-reference/interfaces/iremotedatasource/).[`delete`](/shared/api-reference/interfaces/iremotedatasource/#delete)

***

### get()

> **get**\<`TResponse`\>(`endpoint`, `request?`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:67](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L67)

#### Type Parameters

##### TResponse

`TResponse`

#### Parameters

##### endpoint

`string`

The URL or endpoint from which to fetch data.

##### request?

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.

#### Description

Fetches data from a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRemoteDataSource`](/shared/api-reference/interfaces/iremotedatasource/).[`get`](/shared/api-reference/interfaces/iremotedatasource/#get)

***

### patch()

> **patch**\<`TResponse`, `TBody`\>(`endpoint`, `body`, `request?`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:116](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L116)

#### Type Parameters

##### TResponse

`TResponse`

##### TBody

`TBody` = `unknown`

#### Parameters

##### endpoint

`string`

The URL or endpoint at which to patch data.

##### body

`TBody`

##### request?

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.

#### Description

Patches data at a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRemoteDataSource`](/shared/api-reference/interfaces/iremotedatasource/).[`patch`](/shared/api-reference/interfaces/iremotedatasource/#patch)

***

### post()

> **post**\<`TResponse`, `TBody`\>(`endpoint`, `body`, `request?`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:82](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L82)

#### Type Parameters

##### TResponse

`TResponse`

##### TBody

`TBody` = `unknown`

#### Parameters

##### endpoint

`string`

The URL or endpoint to which to send data.

##### body

`TBody`

##### request?

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.

#### Description

Sends data to a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRemoteDataSource`](/shared/api-reference/interfaces/iremotedatasource/).[`post`](/shared/api-reference/interfaces/iremotedatasource/#post)

***

### put()

> **put**\<`TResponse`, `TBody`\>(`endpoint`, `body`, `request?`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/datasources/remote.datasource.ts:99](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/datasources/remote.datasource.ts#L99)

#### Type Parameters

##### TResponse

`TResponse`

##### TBody

`TBody` = `unknown`

#### Parameters

##### endpoint

`string`

The URL or endpoint at which to update data.

##### body

`TBody`

##### request?

[`HttpBaseRequest`](/shared/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

A Promise that resolves to a ResultType containing either the successful response data or an error if the request fails.

#### Description

Updates data at a remote endpoint using the specified HTTP method and request options. The method returns a ResultType that encapsulates either the successful response data or an error, providing a consistent way to handle both success and failure cases.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IRemoteDataSource`](/shared/api-reference/interfaces/iremotedatasource/).[`put`](/shared/api-reference/interfaces/iremotedatasource/#put)
