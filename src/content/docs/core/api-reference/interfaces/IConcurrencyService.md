---
editUrl: false
next: false
prev: false
title: "IConcurrencyService"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/services/concurrency/concurrency-service.contracts.d.ts:10

## Description

The IConcurrencyService interface provides a contract for executing multiple asynchronous tasks in parallel while strictly controlling the maximum number of concurrent executions. This is crucial for protecting system resources (CPU, RAM) and avoiding event loop blocking during massive batch operations (e.g., processing large CSV files, bulk database inserts).

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

### executeInParallel()

> **executeInParallel**\<`T`\>(`tasks`, `concurrencyLimit`): `Promise`\<`T`[]\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/concurrency/concurrency-service.contracts.d.ts:23

#### Type Parameters

##### T

`T`

#### Parameters

##### tasks

() => `Promise`\<`T`\>[]

An array of functions, where each function returns a Promise representing the asynchronous task to be executed.

##### concurrencyLimit

`number`

The maximum number of promises allowed to run concurrently.

#### Returns

`Promise`\<`T`[]\>

A Promise that resolves to an array containing the results of all tasks, in the same order as the input array.

#### Description

Executes an array of asynchronous tasks in parallel, limiting the number of tasks running at the exact same time.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
