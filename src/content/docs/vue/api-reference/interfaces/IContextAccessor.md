---
editUrl: false
next: false
prev: false
title: "IContextAccessor"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:35

## Description

The IServiceScopeAccessor interface is a contract that defines the structure and behavior of a service scope accessor within the application. It provides a method for retrieving the current service scope, which allows for managing dependencies during the execution of a request. This interface is essential for ensuring that services are properly scoped and disposed of after the request is processed.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extended by

- [`IBaseAccessor`](/vue/api-reference/interfaces/ibaseaccessor/)

## Type Parameters

### TCtx

`TCtx`

## Methods

### getContext()

> **getContext**(): [`Optional`](/vue/api-reference/type-aliases/optional/)\<`TCtx`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:45

Retrieves the current context, which can include information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. This method allows for synchronous access to context-related data when needed.

#### Returns

[`Optional`](/vue/api-reference/type-aliases/optional/)\<`TCtx`\>

An object representing the current context, containing properties such as identity, network, and tracing contexts. This information can be used for managing execution context and ensuring that context-related data is accessible when needed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
