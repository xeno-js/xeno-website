---
editUrl: false
next: false
prev: false
title: "IServiceResilience"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/services/resiliences/iresilience-service.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/resiliences/iresilience-service.contracts.ts#L12)

## Description

The ServiceResilience interface defines a contract for implementing resilience features in service calls. It provides a method to execute asynchronous operations with built-in support for retries, timeouts, and circuit breakers. This interface is designed to enhance the reliability of service interactions by automatically handling transient faults and preventing cascading failures in distributed systems.

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

## Methods

### execute()

> **execute**\<`T`\>(`action`, `signal`): `Promise`\<`T`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/resiliences/iresilience-service.contracts.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/resiliences/iresilience-service.contracts.ts#L25)

#### Type Parameters

##### T

`T`

#### Parameters

##### action

() => `Promise`\<`T`\>

An asynchronous function that represents the operation to be executed with resilience features. This function should return a Promise that resolves with the result of the operation or rejects with an error if the operation fails.

##### signal

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`AbortSignal`\>

An optional AbortSignal that can be used to cancel the operation.

#### Returns

`Promise`\<`T`\>

A Promise that resolves with the result of the operation if it succeeds within the allowed retry attempts and timeouts, or rejects with an error if it fails after exhausting all retry attempts or if a timeout occurs.

#### Description

Executes a given asynchronous operation with resilience features such as retries, timeouts, and circuit breakers. This method is designed to handle transient faults and improve the reliability of service calls by automatically retrying failed operations, enforcing timeouts to prevent hanging requests, and implementing circuit breaker patterns to avoid overwhelming services that are experiencing issues. The method takes an asynchronous function as input and returns a Promise that resolves with the result of the operation or rejects with an error if the operation fails after exhausting all retry attempts or if a timeout occurs.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
