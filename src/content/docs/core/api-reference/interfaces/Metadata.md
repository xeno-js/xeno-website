---
editUrl: false
next: false
prev: false
title: "Metadata"
---

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:11

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

> `readonly` **clientIp**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:43

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

> `readonly` **correlationId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:19

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

> `readonly` **csrf**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:84

***

### expiration

> `readonly` **expiration**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:125

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

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:67

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

> `readonly` **parentSpanId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:59

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

> `readonly` **requestId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:27

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

> `readonly` **returnAddress**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:83

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

> `readonly` **sequence**: [`Optional`](/core/api-reference/type-aliases/optional/)\<\{ `position`: [`Optional`](/core/api-reference/type-aliases/optional/)\<`number`\>; `sequenceId`: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>; `size`: [`Optional`](/core/api-reference/type-aliases/optional/)\<`number`\>; \}\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:92

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

> `readonly` **spanId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:51

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

> `readonly` **token**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:35

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

> `readonly` **userAgent**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/metadata.types.d.ts:75

An optional user agent string of the client making the request, which can be used for audit logging and security purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
