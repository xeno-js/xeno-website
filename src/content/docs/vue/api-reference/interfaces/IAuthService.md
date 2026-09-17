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

- [`IExtendendService`](/vue/api-reference/interfaces/iextendendservice/)

## Methods

### exchangeCodeForSession()

> **exchangeCodeForSession**(`code`): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:67

#### Parameters

##### code

`string`

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Optional`](/vue/api-reference/type-aliases/optional/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

***

### getSession()

> **getSession**(): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:62

Restituisce la sessione corrente attiva salvata nel client Supabase.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<[`Maybe`](/vue/api-reference/type-aliases/maybe/)\<[`Session`](/vue/api-reference/interfaces/session/)\>\>\>

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

***

### signOut()

> **signOut**(): `Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/auth/iauth-service.contracts.d.ts:66

Esegue il logout dell'utente e pulisce la sessione locale.

#### Returns

`Promise`\<[`ResultType`](/vue/api-reference/type-aliases/resulttype/)\<`void`\>\>
