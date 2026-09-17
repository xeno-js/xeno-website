---
editUrl: false
next: false
prev: false
title: "IAuthService"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:56](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L56)

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

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:72](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L72)

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:65](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L65)

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<[`Maybe`](/shared/api-reference/type-aliases/maybe/)\<[`Session`](/shared/api-reference/interfaces/session/)\>\>\>

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

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: [.temp/xeno-shared/src/domain/contracts/services/auth/iauth-service.contracts.ts:70](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/services/auth/iauth-service.contracts.ts#L70)

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`void`\>\>
