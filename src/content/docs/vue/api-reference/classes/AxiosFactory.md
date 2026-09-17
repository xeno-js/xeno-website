---
editUrl: false
next: false
prev: false
title: "AxiosFactory"
---

Defined in: .temp/xeno-shared/dist/infrastructure/factories/axios.factory.d.ts:12

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

- [`IFactory`](/vue/api-reference/interfaces/ifactory/)\<[`HttpClientConfig`](/vue/api-reference/interfaces/httpclientconfig/), [`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/)\>

## Constructors

### Constructor

> **new AxiosFactory**(): `AxiosFactory`

#### Returns

`AxiosFactory`

## Methods

### create()

> **create**(`config`): [`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/)

Defined in: .temp/xeno-shared/dist/infrastructure/factories/axios.factory.d.ts:13

Creates an instance of `Output` using the provided `input` of type `TInput`.

#### Parameters

##### config

[`HttpClientConfig`](/vue/api-reference/interfaces/httpclientconfig/)

#### Returns

[`IHttpClient`](/vue/api-reference/interfaces/ihttpclient/)

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
