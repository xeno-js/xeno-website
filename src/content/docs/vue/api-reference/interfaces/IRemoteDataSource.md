---
editUrl: false
next: false
prev: false
title: "IRemoteDataSource"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iremote-datasource.contracts.d.ts:11

## Description

Contract for a remote data source that defines the method for fetching data from a remote endpoint. This interface abstracts the details of how the data is fetched, allowing for different implementations (e.g., using different HTTP clients or protocols) while providing a consistent method signature for fetching data.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### delete()

> **delete**\<`TResponse`\>(`endpoint`, `request`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iremote-datasource.contracts.d.ts:71

#### Type Parameters

##### TResponse

`TResponse`

#### Parameters

##### endpoint

`string`

The URL or endpoint from which to delete data.

##### request

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

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

***

### get()

> **get**\<`TResponse`\>(`endpoint`, `request`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iremote-datasource.contracts.d.ts:23

#### Type Parameters

##### TResponse

`TResponse`

#### Parameters

##### endpoint

`string`

The URL or endpoint from which to fetch data.

##### request

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

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

***

### patch()

> **patch**\<`TResponse`, `TBody`\>(`endpoint`, `body`, `request`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iremote-datasource.contracts.d.ts:59

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

##### request

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

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

***

### post()

> **post**\<`TResponse`, `TBody`\>(`endpoint`, `body`, `request`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iremote-datasource.contracts.d.ts:35

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

##### request

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

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

***

### put()

> **put**\<`TResponse`, `TBody`\>(`endpoint`, `body`, `request`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/datasources/iremote-datasource.contracts.d.ts:47

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

##### request

[`HttpBaseRequest`](/vue/api-reference/interfaces/httpbaserequest/)

The request options for the remote call.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`TResponse`\>\>

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
