---
editUrl: false
next: false
prev: false
title: "XenoAppBuilder"
---

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:29](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L29)

## Description

Fluent composition root for configuring and bootstrapping frontend services.
Implements code-splitting and Pure Dependency Injection for browser runtimes.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### TRegistry

`TRegistry` *extends* [`XenoVueRegistry`](/vue/api-reference/type-aliases/xenovueregistry/) = [`XenoVueRegistry`](/vue/api-reference/type-aliases/xenovueregistry/)

## Methods

### addAuth()

> **addAuth**(`setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:131](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L131)

#### Parameters

##### setup

[`SetupAction`](/vue/api-reference/type-aliases/setupaction/)\<[`AuthConfig`](/vue/api-reference/interfaces/authconfig/)\<`SupabaseClientOptions`\<`"public"`\>\>, [`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

***

### addCache()

> **addCache**(`setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:76](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L76)

#### Parameters

##### setup

[`SetupAction`](/vue/api-reference/type-aliases/setupaction/)\<`CacheConfig`, [`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

***

### addContext()

> **addContext**(`setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:116](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L116)

#### Parameters

##### setup

[`SetupAction`](/vue/api-reference/type-aliases/setupaction/)\<`ContextConfig`, [`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

***

### addHttpCore()

> **addHttpCore**\<`K`\>(`token`, `setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:151](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L151)

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### token

`K`

Il token di registrazione type-safe dal Registry.

##### setup

[`SetupAction`](/vue/api-reference/type-aliases/setupaction/)\<`HttpCoreVueConfig`\<`TRegistry`, `K`\>, [`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)\>

Callback per configurare client, resilienza e la factory del DataSource.

#### Returns

`this`

#### Description

Registra un DataSource remoto con un ecosistema Axios/Cockatiel completamente isolato.

***

### addLogger()

> **addLogger**(`setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:109](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L109)

Configures the logging module with fluent callback.
Defers dynamic import of LoggerModule until build() execution.

#### Parameters

##### setup

[`SetupAction`](/vue/api-reference/type-aliases/setupaction/)\<`LoggerConfig`, [`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

***

### addPipeline()

> **addPipeline**(`setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:83](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L83)

#### Parameters

##### setup

[`SetupAction`](/vue/api-reference/type-aliases/setupaction/)\<`PipelineConfig`, [`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

***

### addServices()

> **addServices**(`setup`): `this`

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:197](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L197)

#### Parameters

##### setup

(`config`, `register`, `services`) => `void` \| `Promise`\<`void`\>

Callback per orchestrare le registrazioni.

#### Returns

`this`

#### Description

Permette la registrazione massiva di più servizi in un unico blocco,
garantendo la type-safety tramite il parametro `register` iniettato.

***

### build()

> **build**(): `Promise`\<`TRegistry`\>

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:221](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L221)

#### Returns

`Promise`\<`TRegistry`\>

***

### create()

> `static` **create**\<`T`\>(`configService?`): `XenoAppBuilder`\<`T`\>

Defined in: [.temp/xeno-vue/src/infrastructure/builder/xeno-vue.builder.ts:215](https://github.com/Mattia-Carcione/xeno-fe/blob/0dbea2d440c713766e625625ab42f3336988ecba/src/infrastructure/builder/xeno-vue.builder.ts#L215)

#### Type Parameters

##### T

`T` *extends* [`XenoVueRegistry`](/vue/api-reference/type-aliases/xenovueregistry/) = [`XenoVueRegistry`](/vue/api-reference/type-aliases/xenovueregistry/)

#### Parameters

##### configService?

[`IConfigurationService`](/vue/api-reference/interfaces/iconfigurationservice/)

#### Returns

`XenoAppBuilder`\<`T`\>
