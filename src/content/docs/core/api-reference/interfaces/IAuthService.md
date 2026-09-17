---
editUrl: false
next: false
prev: false
title: "IAuthService"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:52

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

- [`IExtendendService`](/core/api-reference/interfaces/iextendendservice/)

## Methods

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:67

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:62

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<[`Maybe`](/core/api-reference/type-aliases/maybe/)\<[`Session`](/core/api-reference/interfaces/session/)\>\>\>

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

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:66

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>
