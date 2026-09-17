---
editUrl: false
next: false
prev: false
title: "NetworkContext"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:10

## Description

NetworkContext defines the structure for network-related information used in logging and monitoring. It includes a request ID for ensuring idempotency and a client IP address for audit logging purposes.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### clientIp

> `readonly` **clientIp**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:26

The IP address of the client making the request, which can be used for audit logging and security purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### csrf

> `readonly` **csrf**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:51

***

### formatIndicator

> `readonly` **formatIndicator**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:42

The format indicator for the request, which can be used for content negotiation and logging purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### path

> `readonly` **path**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:50

The path of the request, which can be used for routing, logging, or applying specific middleware logic.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### requestId

> `readonly` **requestId**: `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:18

A unique identifier for the request, which can be used for ensuring idempotency and tracing purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### transport

> `readonly` **transport**: [`Optional`](/core/api-reference/type-aliases/optional/)\<\{ `req`: `unknown`; `res`: `unknown`; \}\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:52

***

### userAgent

> `readonly` **userAgent**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/network-context.types.d.ts:34

The user agent string of the client making the request, which can be used for audit logging and security purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
