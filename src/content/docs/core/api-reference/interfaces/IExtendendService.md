---
editUrl: false
next: false
prev: false
title: "IExtendendService"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:69

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

- [`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`IAuthService`](/core/api-reference/interfaces/iauthservice/)

## Methods

### authenticate()

> **authenticate**(`token`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:40

Authenticates a user based on a token.

#### Parameters

##### token

`string`

The token to authenticate the user.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>

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

[`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`authenticate`](/core/api-reference/interfaces/ibaseauthservice/#authenticate)

***

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:67

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

#### Inherited from

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`exchangeCodeForSession`](/core/api-reference/interfaces/iauthservice/#exchangecodeforsession)

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:62

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

#### Inherited from

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`getSession`](/core/api-reference/interfaces/iauthservice/#getsession)

***

### getUser()

> **getUser**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:28

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>\>

#### Inherited from

[`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`getUser`](/core/api-reference/interfaces/ibaseauthservice/#getuser)

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

#### Inherited from

[`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`isAuthenticated`](/core/api-reference/interfaces/ibaseauthservice/#isauthenticated)

***

### signInWithProvider()

> **signInWithProvider**(`provider`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:56

Avvia il flusso di autenticazione OAuth con un provider esterno (es. Google).

#### Parameters

##### provider

[`Provider`](/core/api-reference/type-aliases/provider/)

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

#### Inherited from

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`signInWithProvider`](/core/api-reference/interfaces/iauthservice/#signinwithprovider)

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:66

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

#### Inherited from

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`signOut`](/core/api-reference/interfaces/iauthservice/#signout)
