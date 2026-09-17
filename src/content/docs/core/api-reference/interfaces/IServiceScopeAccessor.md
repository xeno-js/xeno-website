---
editUrl: false
next: false
prev: false
title: "IServiceScopeAccessor"
---

Defined in: .temp/xeno-js/src/domain/contracts/context/irequest.context.ts:50

## Description

The IIdentityAccessor interface is a contract that defines the structure and behavior of an identity accessor within the application. It provides a method for retrieving the current user's identity information, including user ID, roles, and correlation ID. This interface is essential for managing user identity and ensuring that identity-related data is accessible when needed.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extended by

- [`IRequestContext`](/core/api-reference/interfaces/irequestcontext/)

## Type Parameters

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

## Methods

### getScope()

> **getScope**(): [`Optional`](/core/api-reference/type-aliases/optional/)\<[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`TRegistry`\>\>

Defined in: .temp/xeno-js/src/domain/contracts/context/irequest.context.ts:62

Retrieves the current service scope, which allows for managing dependencies during the execution of a request. This method enables access to the service scope, ensuring that services are properly scoped and disposed of after the request is processed.

#### Returns

[`Optional`](/core/api-reference/type-aliases/optional/)\<[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`TRegistry`\>\>

An object representing the current service scope, allowing for resolution of dependencies and management of services during the execution of a request.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
