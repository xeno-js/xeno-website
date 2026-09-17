---
editUrl: false
next: false
prev: false
title: "INetworkContextAccessor"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/context/irequest-context.contracts.ts:61](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/irequest-context.contracts.ts#L61)

## Description

The IContextAccessor interface is a contract that defines the structure and behavior of a context accessor within the application. It provides a method for retrieving the current context, which can include information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. This interface is essential for managing execution context and ensuring that context-related data is accessible when needed.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extended by

- [`IBaseAccessor`](/shared/api-reference/interfaces/ibaseaccessor/)

## Methods

### getNetworkContext()

> **getNetworkContext**(): [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`NetworkContext`](/shared/api-reference/interfaces/networkcontext/)\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/irequest-context.contracts.ts:71](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/irequest-context.contracts.ts#L71)

Retrieves the current network context, which can include information about the request ID, correlation ID, and other network-related data. This method allows for synchronous access to network context-related data when needed.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`NetworkContext`](/shared/api-reference/interfaces/networkcontext/)\>

An object representing the current network context, containing properties such as request ID, correlation ID, and other network-related data. This information can be used for managing execution context and ensuring that network context-related data is accessible when needed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
