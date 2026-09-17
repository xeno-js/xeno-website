---
editUrl: false
next: false
prev: false
title: "IExtendendService"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:75](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L75)

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

## Extends

- [`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`IAuthService`](/shared/api-reference/interfaces/iauthservice/)

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

#### Inherited from

[`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`authenticate`](/shared/api-reference/interfaces/ibaseauthservice/#authenticate)

***

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:72](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L72)

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

#### Inherited from

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`exchangeCodeForSession`](/shared/api-reference/interfaces/iauthservice/#exchangecodeforsession)

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:65](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L65)

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

#### Inherited from

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`getSession`](/shared/api-reference/interfaces/iauthservice/#getsession)

***

### getUser()

> **getUser**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:30](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L30)

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>\>

#### Inherited from

[`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`getUser`](/shared/api-reference/interfaces/ibaseauthservice/#getuser)

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

#### Inherited from

[`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`isAuthenticated`](/shared/api-reference/interfaces/ibaseauthservice/#isauthenticated)

***

### signInWithProvider()

> **signInWithProvider**(`provider`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:60](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L60)

Avvia il flusso di autenticazione OAuth con un provider esterno (es. Google).

#### Parameters

##### provider

[`Provider`](/shared/api-reference/type-aliases/provider/)

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

#### Inherited from

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`signInWithProvider`](/shared/api-reference/interfaces/iauthservice/#signinwithprovider)

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:70](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L70)

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`void`\>\>

#### Inherited from

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`signOut`](/shared/api-reference/interfaces/iauthservice/#signout)
