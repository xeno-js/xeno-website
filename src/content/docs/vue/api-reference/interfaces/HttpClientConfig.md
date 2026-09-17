---
editUrl: false
next: false
prev: false
title: "HttpClientConfig"
---

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:11

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

> **baseURL**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:27

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

> **decompress**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:43

Abilita la decompressione automatica di gzip/brotli per risparmiare banda (Default: true)

***

### defaultHeaders

> **defaultHeaders**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<[`HttpHeaders`](/vue/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:19

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

> **keepAlive**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:37

Abilita il riutilizzo delle connessioni TCP per ridurre la latenza dei retry (Default: true)

***

### maxRedirects

> **maxRedirects**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:41

Numero massimo di redirect consentiti prima di lanciare errore (Default: 5)

***

### maxSockets

> **maxSockets**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:39

Numero massimo di socket simultanei per host (Default: 100)

***

### proxy

> **proxy**: `false` \| [`ProxyConfig`](/vue/api-reference/interfaces/proxyconfig/)

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:45

***

### timeoutMs

> **timeoutMs**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:35

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

> **withCredentials**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: .temp/xeno-shared/dist/domain/config/http.config.d.ts:44
