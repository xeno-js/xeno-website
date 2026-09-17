---
editUrl: false
next: false
prev: false
title: "HttpConfig"
---

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:51

## Description

HttpConfig is an interface that defines the configuration options for an HTTP client. It includes a required 'client' property of type HttpClientConfig, which specifies the default headers, base URL, and timeout for the HTTP client. Additionally, it has an optional 'resilience' property that indicates whether resilience features are enabled and provides the corresponding ResilienceConfig if they are.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

## Properties

### client

> **client**: [`HttpClientConfig`](/core/api-reference/interfaces/httpclientconfig/)

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:69

#### Description

The configuration options for the HTTP client, including default headers, base URL, and timeout settings.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### token

> **token**: keyof `TRegistry`

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:61

#### Description

A unique token used for identifying the HTTP client configuration in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
