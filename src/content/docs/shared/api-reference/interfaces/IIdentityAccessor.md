---
editUrl: false
next: false
prev: false
title: "IIdentityAccessor"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/context/irequest-context.contracts.ts:17](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/irequest-context.contracts.ts#L17)

## Description

The IRequestContext interface is a contract that defines the structure and behavior of a request context within the application. It provides methods for executing asynchronous functions with the current user's identity context and retrieving the current user's identity information. This interface is essential for managing user identity and ensuring that identity-related data is properly propagated throughout the application.

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

### getIdentity()

> **getIdentity**(): [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Identity`](/shared/api-reference/interfaces/identity/)\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/irequest-context.contracts.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/irequest-context.contracts.ts#L27)

Retrieves the current user's identity information, including user ID, roles, and correlation ID. This method can be used to access identity data outside of the context of an asynchronous function, allowing for synchronous access to identity information when needed.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Identity`](/shared/api-reference/interfaces/identity/)\>

An object representing the current user's identity, containing properties such as user ID, roles, and correlation ID. This information can be used for authentication and authorization purposes throughout the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
