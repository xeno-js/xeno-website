---
editUrl: false
next: false
prev: false
title: "SupabaseAuthService"
---

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:12

## Description

The SupabaseAuthService class is responsible for handling authentication-related operations using a SupabaseClient instance. It implements the IAuthService interface, providing methods to check if a user is authenticated and to retrieve authentication claims from a given token. The authenticate method interacts with the Supabase authentication API to fetch user information based on the provided token, while the isAuthenticated method checks if there is an active session. The class also includes error handling to create standardized authentication errors when necessary.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Implements

- [`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/)
- [`IAuthService`](/core/api-reference/interfaces/iauthservice/)

## Constructors

### Constructor

> **new SupabaseAuthService**(`_supabase`, `_mapper`, `_sessionMapper`, `_opts`): `SupabaseAuthService`

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:17

#### Parameters

##### \_supabase

`SupabaseClient`

##### \_mapper

[`IBaseMapper`](/core/api-reference/interfaces/ibasemapper/)\<`User`, [`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>

##### \_sessionMapper

[`IBaseMapper`](/core/api-reference/interfaces/ibasemapper/)\<`Session`, [`Session`](/core/api-reference/interfaces/session/)\>

##### \_opts

###### redirectTo

[`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

#### Returns

`SupabaseAuthService`

## Methods

### authenticate()

> **authenticate**(`token`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:20

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

#### Implementation of

[`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`authenticate`](/core/api-reference/interfaces/ibaseauthservice/#authenticate)

***

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:22

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

#### Implementation of

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`exchangeCodeForSession`](/core/api-reference/interfaces/iauthservice/#exchangecodeforsession)

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:26

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

#### Implementation of

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`getSession`](/core/api-reference/interfaces/iauthservice/#getsession)

***

### getSessionToken()

> **getSessionToken**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:29

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>\>\>

***

### getUser()

> **getUser**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:27

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/)\>\>\>

#### Implementation of

[`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`getUser`](/core/api-reference/interfaces/ibaseauthservice/#getuser)

***

### isAuthenticated()

> **isAuthenticated**(): `Promise`\<`boolean`\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:21

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

#### Implementation of

[`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/).[`isAuthenticated`](/core/api-reference/interfaces/ibaseauthservice/#isauthenticated)

***

### signInWithProvider()

> **signInWithProvider**(`provider`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:23

Avvia il flusso di autenticazione OAuth con un provider esterno (es. Google).

#### Parameters

##### provider

`Provider`

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

#### Implementation of

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`signInWithProvider`](/core/api-reference/interfaces/iauthservice/#signinwithprovider)

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/infrastructure/auth/supabase-auth.service.d.ts:28

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

#### Implementation of

[`IAuthService`](/core/api-reference/interfaces/iauthservice/).[`signOut`](/core/api-reference/interfaces/iauthservice/#signout)
