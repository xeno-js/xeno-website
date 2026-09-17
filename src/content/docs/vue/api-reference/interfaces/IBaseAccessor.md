---
editUrl: false
next: false
prev: false
title: "IBaseAccessor"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:3

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

## Extends

- [`IContextAccessor`](/vue/api-reference/interfaces/icontextaccessor/)\<`TCtx`\>.[`IIdentityAccessor`](/vue/api-reference/interfaces/iidentityaccessor/).[`INetworkContextAccessor`](/vue/api-reference/interfaces/inetworkcontextaccessor/)

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

#### Inherited from

[`IContextAccessor`](/vue/api-reference/interfaces/icontextaccessor/).[`getContext`](/vue/api-reference/interfaces/icontextaccessor/#getcontext)

***

### getIdentity()

> **getIdentity**(): [`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Identity`](/vue/api-reference/interfaces/identity/)\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:24

Retrieves the current user's identity information, including user ID, roles, and correlation ID. This method can be used to access identity data outside of the context of an asynchronous function, allowing for synchronous access to identity information when needed.

#### Returns

[`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Identity`](/vue/api-reference/interfaces/identity/)\>

An object representing the current user's identity, containing properties such as user ID, roles, and correlation ID. This information can be used for authentication and authorization purposes throughout the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Inherited from

[`IIdentityAccessor`](/vue/api-reference/interfaces/iidentityaccessor/).[`getIdentity`](/vue/api-reference/interfaces/iidentityaccessor/#getidentity)

***

### getNetworkContext()

> **getNetworkContext**(): [`Optional`](/vue/api-reference/type-aliases/optional/)\<[`NetworkContext`](/vue/api-reference/interfaces/networkcontext/)\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:66

Retrieves the current network context, which can include information about the request ID, correlation ID, and other network-related data. This method allows for synchronous access to network context-related data when needed.

#### Returns

[`Optional`](/vue/api-reference/type-aliases/optional/)\<[`NetworkContext`](/vue/api-reference/interfaces/networkcontext/)\>

An object representing the current network context, containing properties such as request ID, correlation ID, and other network-related data. This information can be used for managing execution context and ensuring that network context-related data is accessible when needed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Inherited from

[`INetworkContextAccessor`](/vue/api-reference/interfaces/inetworkcontextaccessor/).[`getNetworkContext`](/vue/api-reference/interfaces/inetworkcontextaccessor/#getnetworkcontext)
