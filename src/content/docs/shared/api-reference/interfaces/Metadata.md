---
editUrl: false
next: false
prev: false
title: "Metadata"
---

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L12)

## Description

The Metadata interface defines a structure for storing optional metadata information that can be associated with various operations, such as HTTP requests, logging, or tracing. It includes properties like correlationId, requestId, token, clientIp, and spanId, which can be used for tracking, authentication, and monitoring purposes. Additionally, it allows for any number of additional key-value pairs to be included as optional strings, providing flexibility for different use cases.

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

## Properties

### clientIp

> `readonly` **clientIp**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:44](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L44)

An optional IP address of the client making the request, which can be used for audit logging and security purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### correlationId

> `readonly` **correlationId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:20](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L20)

An optional identifier for correlating related operations across different services or components.

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

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:86](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L86)

***

### expiration

> `readonly` **expiration**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:127](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L127)

An optional expiration time for the request, which can be used to determine when the request should be considered expired and no longer processed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### formatIndicator

> `readonly` **formatIndicator**: `string`

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:68](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L68)

A format indicator for the request, which can be used for content negotiation and logging purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### parentSpanId

> `readonly` **parentSpanId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:60](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L60)

An optional identifier for the parent span in distributed tracing, which can be used to establish a hierarchy of spans and track the flow of requests across multiple services in a microservices architecture.

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

> `readonly` **requestId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:28](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L28)

An optional unique identifier for the request, which can be used for ensuring idempotency and tracing purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### returnAddress

> `readonly` **returnAddress**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:84](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L84)

An optional return address for the request, which can be used for routing responses or callbacks.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### sequence

> `readonly` **sequence**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<\{ `position`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>; `sequenceId`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>; `size`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>; \}\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:94](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L94)

An optional sequence object that can be used for managing message sequencing in distributed systems.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### spanId

> `readonly` **spanId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:52](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L52)

An optional identifier for distributed tracing, which can be used to track the flow of requests across multiple services in a microservices architecture.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### token

> `readonly` **token**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:36](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L36)

An optional token that can be used for authentication or authorization purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### userAgent

> `readonly` **userAgent**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/metadata.types.ts:76](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/metadata.types.ts#L76)

An optional user agent string of the client making the request, which can be used for audit logging and security purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
