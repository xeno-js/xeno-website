---
editUrl: false
next: false
prev: false
title: "HttpCoreConfig"
---

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:14

## Description

HttpCoreConfig is an interface that defines the configuration options for the core HTTP functionality of the application. It includes two properties: 'http' of type HttpConfig, which specifies the configuration for the HTTP client, and 'resilience' of type ResilienceConfig, which provides the settings for implementing resilience strategies such as retries, circuit breakers, and timeouts. This interface allows for a centralized configuration of both HTTP and resilience features in the application.

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

### dataSourceToken

> **dataSourceToken**: [`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)\<`TRegistry`\>\>

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:24

#### Description

A unique token used for identifying the RemoteDataSource instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### http

> **http**: [`HttpConfig`](/core/api-reference/interfaces/httpconfig/)\<`TRegistry`\>

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:32

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

### resilience

> **resilience**: [`ResilienceConfig`](/core/api-reference/interfaces/resilienceconfig/)

Defined in: .temp/xeno-js/src/domain/config/http.config.ts:40

#### Description

The configuration options for implementing resilience strategies, including retries, circuit breakers, and timeouts. This allows for enhancing the reliability of service interactions by automatically handling transient faults and preventing cascading failures in distributed systems.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
