---
editUrl: false
next: false
prev: false
title: "NetworkContext"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:11](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L11)

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

> `readonly` **clientIp**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L27)

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

> `readonly` **csrf**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:53](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L53)

***

### formatIndicator

> `readonly` **formatIndicator**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:43](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L43)

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

> `readonly` **path**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:51](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L51)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:19](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L19)

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

> `readonly` **transport**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<\{ `req`: `unknown`; `res`: `unknown`; \}\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:55](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L55)

***

### userAgent

> `readonly` **userAgent**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/network-context.types.ts:35](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/network-context.types.ts#L35)

The user agent string of the client making the request, which can be used for audit logging and security purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
