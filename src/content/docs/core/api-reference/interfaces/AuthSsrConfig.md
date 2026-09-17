---
editUrl: false
next: false
prev: false
title: "AuthSsrConfig"
---

Defined in: .temp/xeno-js/src/domain/config/auth.config.ts:20

## Extends

- [`AuthConfig`](/core/api-reference/interfaces/authconfig/)\<`TOption`\>

## Type Parameters

### TOption

`TOption`

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/) = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)

## Properties

### key

> **key**: `string`

Defined in: .temp/xeno-shared/dist/domain/config/auth.config.d.ts:5

#### Inherited from

[`AuthConfig`](/core/api-reference/interfaces/authconfig/).[`key`](/core/api-reference/interfaces/authconfig/#key)

***

### opts

> **opts**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`TOption`\>

Defined in: .temp/xeno-shared/dist/domain/config/auth.config.d.ts:6

#### Inherited from

[`AuthConfig`](/core/api-reference/interfaces/authconfig/).[`opts`](/core/api-reference/interfaces/authconfig/#opts)

***

### redirectTo

> **redirectTo**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/config/auth.config.d.ts:12

#### Inherited from

[`AuthConfig`](/core/api-reference/interfaces/authconfig/).[`redirectTo`](/core/api-reference/interfaces/authconfig/#redirectto)

***

### ssrOpts

> **ssrOpts**: [`Optional`](/core/api-reference/type-aliases/optional/)\<(`container`) => [`ISsrCookieHandler`](/core/api-reference/interfaces/issrcookiehandler/)\>

Defined in: .temp/xeno-js/src/domain/config/auth.config.ts:24

***

### storageOpts

> **storageOpts**: `object`

Defined in: .temp/xeno-shared/dist/domain/config/auth.config.d.ts:7

#### cookieOpts

> **cookieOpts**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`CookieOptions`](/core/api-reference/interfaces/cookieoptions/)\>

#### storage

> **storage**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`IStorage`](/core/api-reference/interfaces/istorage/)\>

#### type

> **type**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`"session"` \| `"cookie"` \| `"memory"` \| `"local"`\>

#### Inherited from

[`AuthConfig`](/core/api-reference/interfaces/authconfig/).[`storageOpts`](/core/api-reference/interfaces/authconfig/#storageopts)

***

### url

> **url**: `string`

Defined in: .temp/xeno-shared/dist/domain/config/auth.config.d.ts:4

#### Inherited from

[`AuthConfig`](/core/api-reference/interfaces/authconfig/).[`url`](/core/api-reference/interfaces/authconfig/#url)
