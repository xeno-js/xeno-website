---
editUrl: false
next: false
prev: false
title: "ExecutionContext"
---

Defined in: .temp/xeno-js/src/domain/contracts/context/execution-context.types.ts:24

The ExecutionContext interface represents the context of a request execution, encapsulating the request context and the service scope. The request context contains information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. The service scope allows for managing dependencies during the execution of a request, ensuring that services are properly scoped and disposed of after the request is processed.

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

## Type Parameters

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/) = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)

## Properties

### context

> **context**: [`RequestContext`](/core/api-reference/interfaces/requestcontext/)

Defined in: .temp/xeno-js/src/domain/contracts/context/execution-context.types.ts:32

The request context containing information about the identity, network, and tracing contexts for the current request execution.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### scope

> **scope**: [`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`TRegistry`\>

Defined in: .temp/xeno-js/src/domain/contracts/context/execution-context.types.ts:40

The service scope for managing dependencies during the execution of a request. This allows for proper scoping and disposal of services after the request is processed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
