---
editUrl: false
next: false
prev: false
title: "IBaseAuthService"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L14)

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

- [`IExtendendService`](/shared/api-reference/interfaces/iextendendservice/)

## Methods

### authenticate()

> **authenticate**(`token`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:43](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L43)

Authenticates a user based on a token.

#### Parameters

##### token

`string`

The token to authenticate the user.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>

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

> **getUser**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:30](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L30)

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>\>

***

### isAuthenticated()

> **isAuthenticated**(): `Promise`\<`boolean`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L25)

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
