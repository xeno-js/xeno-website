---
editUrl: false
next: false
prev: false
title: "CockatielResilienceFactory"
---

Defined in: [.temp/xeno-shared/src/infrastructure/factories/cockatiel-resilience.factory.ts:34](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/factories/cockatiel-resilience.factory.ts#L34)

## Description

Factory class responsible for creating instances of ServiceResilience based on the provided configuration. It implements the IFactory interface, allowing for easy integration with dependency injection systems. The factory encapsulates the creation logic for the ServiceResilience, including the initialization of the underlying resilience policies with the specified configuration options such as retry, circuit breaker, and bulkhead. This design promotes separation of concerns and allows for flexibility in managing ServiceResilience instances across the application.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Implements

- [`IFactory`](/shared/api-reference/interfaces/ifactory/)\<[`ResilienceConfig`](/shared/api-reference/interfaces/resilienceconfig/), [`IServiceResilience`](/shared/api-reference/interfaces/iserviceresilience/)\>

## Constructors

### Constructor

> **new CockatielResilienceFactory**(): `CockatielResilienceFactory`

#### Returns

`CockatielResilienceFactory`

## Methods

### create()

> **create**(`config`): [`IServiceResilience`](/shared/api-reference/interfaces/iserviceresilience/)

Defined in: [.temp/xeno-shared/src/infrastructure/factories/cockatiel-resilience.factory.ts:35](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/factories/cockatiel-resilience.factory.ts#L35)

Creates an instance of `Output` using the provided `input` of type `TInput`.

#### Parameters

##### config

[`ResilienceConfig`](/shared/api-reference/interfaces/resilienceconfig/)

#### Returns

[`IServiceResilience`](/shared/api-reference/interfaces/iserviceresilience/)

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
