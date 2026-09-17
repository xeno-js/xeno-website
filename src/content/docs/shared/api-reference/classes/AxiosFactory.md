---
editUrl: false
next: false
prev: false
title: "AxiosFactory"
---

Defined in: [.temp/xeno-shared/src/infrastructure/factories/axios.factory.ts:17](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/factories/axios.factory.ts#L17)

## Description

Factory class responsible for creating instances of AxiosHttpClient based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the AxiosHttpClient, including the initialization of the underlying Axios instance with the specified configuration options such as base URL, default headers, and timeout settings. This design promotes separation of concerns and allows for flexibility in managing AxiosHttpClient instances across the application.

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

- [`IFactory`](/shared/api-reference/interfaces/ifactory/)\<[`HttpClientConfig`](/shared/api-reference/interfaces/httpclientconfig/), [`IHttpClient`](/shared/api-reference/interfaces/ihttpclient/)\>

## Constructors

### Constructor

> **new AxiosFactory**(): `AxiosFactory`

#### Returns

`AxiosFactory`

## Methods

### create()

> **create**(`config`): [`IHttpClient`](/shared/api-reference/interfaces/ihttpclient/)

Defined in: [.temp/xeno-shared/src/infrastructure/factories/axios.factory.ts:18](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/factories/axios.factory.ts#L18)

Creates an instance of `Output` using the provided `input` of type `TInput`.

#### Parameters

##### config

[`HttpClientConfig`](/shared/api-reference/interfaces/httpclientconfig/)

#### Returns

[`IHttpClient`](/shared/api-reference/interfaces/ihttpclient/)

An instance of type `Output`.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

`IFactory.create`
