---
editUrl: false
next: false
prev: false
title: "RequestContext"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/request-context.types.d.ts:14

## Description

RequestContext defines the structure for the context of a request execution, which includes the identity of the user or system executing the request, the network context for tracing and logging purposes, and the tracing context for distributed tracing across services. This context is essential for ensuring proper authentication, authorization, and observability in a distributed system.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### identity

> `readonly` **identity**: [`Identity`](/vue/api-reference/interfaces/identity/)

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/request-context.types.d.ts:22

The identity of the user or system executing the request, which can be used for authentication and authorization purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### messaging?

> `readonly` `optional` **messaging?**: [`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`MessagingContext`](/vue/api-reference/interfaces/messagingcontext/)\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/request-context.types.d.ts:46

The messaging context of the request, which includes information related to messaging systems, such as return addresses and message expiration times. This context is useful for handling asynchronous communication and message-based workflows.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### network

> `readonly` **network**: [`NetworkContext`](/vue/api-reference/interfaces/networkcontext/)

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/request-context.types.d.ts:30

The network context of the request, which includes information such as the client's IP address and request ID for tracing purposes.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### tracing

> `readonly` **tracing**: [`TracingContext`](/vue/api-reference/interfaces/tracingcontext/)

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/request-context.types.d.ts:38

The tracing context of the request, which includes information for distributed tracing and correlation across services.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
