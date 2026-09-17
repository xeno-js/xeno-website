---
editUrl: false
next: false
prev: false
title: "UserContext"
---

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:81

## Description

An interface representing the context of an authenticated user, including their unique identifier and tenant ID. This context can be used throughout the application to enforce authorization rules and access control based on the user's identity and associated claims.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### tenantId

> `readonly` **tenantId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:97

The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### userId

> `readonly` **userId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:89

The unique identifier for the user (subject).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
