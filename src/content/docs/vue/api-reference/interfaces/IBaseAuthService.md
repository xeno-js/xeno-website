---
editUrl: false
next: false
prev: false
title: "IBaseAuthService"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:13

## Description

IAuthService defines the contract for authentication services.
It provides methods to check if a user is authenticated and to retrieve the user's claims.

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

## Extended by

- [`IExtendendService`](/vue/api-reference/interfaces/iextendendservice/)

## Methods

### authenticate()

> **authenticate**(`token`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/vue/api-reference/interfaces/authclaims/)\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:40

Authenticates a user based on a token.

#### Parameters

##### token

`string`

The token to authenticate the user.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/vue/api-reference/interfaces/authclaims/)\>\>

A promise that resolves to the user's claims, or null if not authenticated.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getUser()

> **getUser**(): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/vue/api-reference/interfaces/authclaims/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:28

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/vue/api-reference/interfaces/authclaims/)\>\>\>

***

### isAuthenticated()

> **isAuthenticated**(): `Promise`\<`boolean`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:24

Checks if the user is authenticated.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the user is authenticated, false otherwise.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
