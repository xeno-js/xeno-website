---
editUrl: false
next: false
prev: false
title: "SupabaseAuthService"
---

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:21](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L21)

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

- [`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/)
- [`IAuthService`](/shared/api-reference/interfaces/iauthservice/)

## Constructors

### Constructor

> **new SupabaseAuthService**(`_supabase`, `_mapper`, `_sessionMapper`, `_opts`): `SupabaseAuthService`

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L22)

#### Parameters

##### \_supabase

`SupabaseClient`

##### \_mapper

[`IBaseMapper`](/shared/api-reference/interfaces/ibasemapper/)\<`User`, [`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>

##### \_sessionMapper

[`IBaseMapper`](/shared/api-reference/interfaces/ibasemapper/)\<`Session`, [`Session`](/shared/api-reference/interfaces/session/)\>

##### \_opts

###### redirectTo

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

#### Returns

`SupabaseAuthService`

## Methods

### authenticate()

> **authenticate**(`token`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:29](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L29)

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

#### Implementation of

[`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`authenticate`](/shared/api-reference/interfaces/ibaseauthservice/#authenticate)

***

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:48](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L48)

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

#### Implementation of

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`exchangeCodeForSession`](/shared/api-reference/interfaces/iauthservice/#exchangecodeforsession)

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:77](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L77)

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

#### Implementation of

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`getSession`](/shared/api-reference/interfaces/iauthservice/#getsession)

***

### getSessionToken()

> **getSessionToken**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:109](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L109)

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>\>\>

***

### getUser()

> **getUser**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:90](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L90)

Restituisce l'utente attualmente autenticato.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>\>\>

#### Implementation of

[`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`getUser`](/shared/api-reference/interfaces/ibaseauthservice/#getuser)

***

### isAuthenticated()

> **isAuthenticated**(): `Promise`\<`boolean`\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:43](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L43)

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

[`IBaseAuthService`](/shared/api-reference/interfaces/ibaseauthservice/).[`isAuthenticated`](/shared/api-reference/interfaces/ibaseauthservice/#isauthenticated)

***

### signInWithProvider()

> **signInWithProvider**(`provider`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:62](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L62)

Avvia il flusso di autenticazione OAuth con un provider esterno (es. Google).

#### Parameters

##### provider

`Provider`

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<\{ `url`: `string`; \}\>\>

#### Implementation of

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`signInWithProvider`](/shared/api-reference/interfaces/iauthservice/#signinwithprovider)

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/auth/supabase-auth.service.ts:101](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/auth/supabase-auth.service.ts#L101)

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`void`\>\>

#### Implementation of

[`IAuthService`](/shared/api-reference/interfaces/iauthservice/).[`signOut`](/shared/api-reference/interfaces/iauthservice/#signout)
