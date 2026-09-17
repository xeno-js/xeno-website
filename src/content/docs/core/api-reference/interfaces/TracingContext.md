---
editUrl: false
next: false
prev: false
title: "TracingContext"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/tracing-context.types.d.ts:11

## Description

TracingContext defines the structure for tracing information used in logging and monitoring. It includes a correlation ID for tracking related operations, a start time for measuring duration, and an optional span ID for distributed tracing.

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

### correlationId

> `readonly` **correlationId**: `` `${string}-${string}-${string}-${string}-${string}` ``

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/tracing-context.types.d.ts:19

A unique identifier for correlating related operations across different services or components.

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

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/tracing-context.types.d.ts:43

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

### spanId

> `readonly` **spanId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/tracing-context.types.d.ts:35

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

### startTime

> `readonly` **startTime**: `number`

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/tracing-context.types.d.ts:27

The timestamp indicating when the operation started, used for measuring duration and performance.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
