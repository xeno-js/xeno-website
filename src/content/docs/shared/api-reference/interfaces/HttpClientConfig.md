---
editUrl: false
next: false
prev: false
title: "HttpClientConfig"
---

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L12)

## Description

Agnostic contract used to execute HTTP calls independently
from concrete transport libraries (fetch, axios, undici, etc.),

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### baseURL

> **baseURL**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:28](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L28)

#### Description

Optional base URL to prepend to all request URLs made by the HTTP client.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### decompress

> **decompress**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:48](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L48)

Abilita la decompressione automatica di gzip/brotli per risparmiare banda (Default: true)

***

### defaultHeaders

> **defaultHeaders**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`HttpHeaders`](/shared/api-reference/type-aliases/httpheaders/)\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:20](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L20)

#### Description

Optional default headers to include in every request made by the HTTP client.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### keepAlive

> **keepAlive**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:39](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L39)

Abilita il riutilizzo delle connessioni TCP per ridurre la latenza dei retry (Default: true)

***

### maxRedirects

> **maxRedirects**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:45](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L45)

Numero massimo di redirect consentiti prima di lanciare errore (Default: 5)

***

### maxSockets

> **maxSockets**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:42](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L42)

Numero massimo di socket simultanei per host (Default: 100)

***

### proxy

> **proxy**: `false` \| [`ProxyConfig`](/shared/api-reference/interfaces/proxyconfig/)

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:52](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L52)

***

### timeoutMs

> **timeoutMs**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:36](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L36)

#### Description

Optional timeout in milliseconds for all requests made by the HTTP client.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### withCredentials

> **withCredentials**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: [.temp/xeno-shared/src/domain/config/http.config.ts:50](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/http.config.ts#L50)
