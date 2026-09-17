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

- [`IBaseAuthService`](/vue/api-reference/interfaces/ibaseauthservice/).[`IAuthService`](/vue/api-reference/interfaces/iauthservice/)

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

#### Inherited from

[`IBaseAuthService`](/vue/api-reference/interfaces/ibaseauthservice/).[`authenticate`](/vue/api-reference/interfaces/ibaseauthservice/#authenticate)

***

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:67

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

#### Inherited from

[`IAuthService`](/vue/api-reference/interfaces/iauthservice/).[`exchangeCodeForSession`](/vue/api-reference/interfaces/iauthservice/#exchangecodeforsession)

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:62

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

#### Inherited from

[`IAuthService`](/vue/api-reference/interfaces/iauthservice/).[`getSession`](/vue/api-reference/interfaces/iauthservice/#getsession)

***

### getUser()

> **getUser**(): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/vue/api-reference/interfaces/authclaims/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:28

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/vue/api-reference/interfaces/authclaims/)\>\>\>

#### Inherited from

[`IBaseAuthService`](/vue/api-reference/interfaces/ibaseauthservice/).[`getUser`](/vue/api-reference/interfaces/ibaseauthservice/#getuser)

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

[`IBaseAuthService`](/vue/api-reference/interfaces/ibaseauthservice/).[`isAuthenticated`](/vue/api-reference/interfaces/ibaseauthservice/#isauthenticated)

***

### signInWithProvider()

> **signInWithProvider**(`provider`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:56

Avvia il flusso di autenticazione OAuth con un provider esterno (es. Google).

#### Parameters

##### provider

[`Provider`](/vue/api-reference/type-aliases/provider/)

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

#### Inherited from

[`IAuthService`](/vue/api-reference/interfaces/iauthservice/).[`signInWithProvider`](/vue/api-reference/interfaces/iauthservice/#signinwithprovider)

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:66

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`void`\>\>

#### Inherited from

[`IAuthService`](/vue/api-reference/interfaces/iauthservice/).[`signOut`](/vue/api-reference/interfaces/iauthservice/#signout)
