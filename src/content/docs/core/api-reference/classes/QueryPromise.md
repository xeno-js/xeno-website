---
editUrl: false
next: false
prev: false
title: "QueryPromise"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:2

## Type Parameters

### T

`T`

## Implements

- `Promise`\<`T`\>

## Constructors

### Constructor

> **new QueryPromise**\<`T`\>(): `QueryPromise`\<`T`\>

#### Returns

`QueryPromise`\<`T`\>

## Properties

### \[toStringTag\]

> **\[toStringTag\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:4

#### Implementation of

`Promise.[toStringTag]`

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:3

## Methods

### catch()

> **catch**\<`TResult`\>(`onRejected?`): `Promise`\<`T` \| `TResult`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:5

Attaches a callback for only the rejection of the Promise.

#### Type Parameters

##### TResult

`TResult` = `never`

#### Parameters

##### onRejected?

((`reason`) => `TResult` \| `PromiseLike`\<`TResult`\>) \| `null`

#### Returns

`Promise`\<`T` \| `TResult`\>

A Promise for the completion of the callback.

#### Implementation of

`Promise.catch`

***

### execute()

> `abstract` **execute**(): `Promise`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:8

#### Returns

`Promise`\<`T`\>

***

### finally()

> **finally**(`onFinally?`): `Promise`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:6

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

##### onFinally?

(() => `void`) \| `null`

#### Returns

`Promise`\<`T`\>

A Promise for the completion of the callback.

#### Implementation of

`Promise.finally`

***

### then()

> **then**\<`TResult1`, `TResult2`\>(`onFulfilled?`, `onRejected?`): `Promise`\<`TResult1` \| `TResult2`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/query-promise.d.ts:7

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type Parameters

##### TResult1

`TResult1` = `T`

##### TResult2

`TResult2` = `never`

#### Parameters

##### onFulfilled?

((`value`) => `TResult1` \| `PromiseLike`\<`TResult1`\>) \| `null`

##### onRejected?

((`reason`) => `TResult2` \| `PromiseLike`\<`TResult2`\>) \| `null`

#### Returns

`Promise`\<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Implementation of

`Promise.then`
