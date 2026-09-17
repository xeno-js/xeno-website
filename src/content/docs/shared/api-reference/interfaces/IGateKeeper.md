---
editUrl: false
next: false
prev: false
title: "IGateKeeper"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/gate\_keepers/igate-keeper.contracts.ts:15](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/gate_keepers/igate-keeper.contracts.ts#L15)

## Description

IGateKeeper defines the contract for gatekeeper services responsible for authorizing users based on their identity and permissions. It provides a method to check if a user has a specific permission, taking into account their roles and permissions. The authorize method checks if the user's permissions include the required permission or if they have a role that grants them access (e.g., SUPER_ADMIN or ADMIN). If the user does not have the necessary permissions, it returns false.

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

## Methods

### authenticate()

> **authenticate**(`token`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Identity`](/shared/api-reference/interfaces/identity/)\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/gate\_keepers/igate-keeper.contracts.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/gate_keepers/igate-keeper.contracts.ts#L27)

Authenticates a user based on a provided token and returns their identity.

#### Parameters

##### token

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

The authentication token to validate and extract the user's identity from.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Identity`](/shared/api-reference/interfaces/identity/)\>\>

A promise that resolves to the user's identity if authentication is successful, or an error if it fails.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
