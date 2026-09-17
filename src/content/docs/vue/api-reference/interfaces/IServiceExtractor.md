---
editUrl: false
next: false
prev: false
title: "IServiceExtractor"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/services/extractors/iextractor-service.contracts.d.ts:10

## Description

The IServiceExtractor interface defines a contract for extracting metadata from HTTP headers. Implementing classes must provide the extract method, which takes HttpHeaders as input and returns a Metadata object containing the extracted information. This allows for flexible and consistent extraction of metadata across different parts of the application, such as authentication, logging, or request validation.

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

## Type Parameters

### TRequest

`TRequest`

### TResponse

`TResponse` = `unknown`

## Methods

### extract()

> **extract**(`headers`): `TResponse`

Defined in: .temp/xeno-shared/dist/domain/contracts/services/extractors/iextractor-service.contracts.d.ts:22

#### Parameters

##### headers

`TRequest`

The HTTP headers from which the metadata will be extracted. This object typically contains key-value pairs representing the headers of the incoming request.

#### Returns

`TResponse`

A Metadata object containing the extracted metadata information. This allows for handling both success and error cases in a consistent manner.

#### Description

The extract method retrieves metadata from the provided HttpHeaders. Implementing classes must provide this method to allow flexible extraction of metadata for various purposes such as authentication, logging, or request validation.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
