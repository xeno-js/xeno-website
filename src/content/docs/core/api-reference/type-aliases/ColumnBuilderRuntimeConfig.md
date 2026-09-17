---
editUrl: false
next: false
prev: false
title: "ColumnBuilderRuntimeConfig"
---

> **ColumnBuilderRuntimeConfig**\<`TData`, `TRuntimeConfig`\> = `object` & `TRuntimeConfig`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:90

## Type Declaration

### columnType

> **columnType**: `string`

### dataType

> **dataType**: `string`

### default

> **default**: `TData` \| [`SQL`](/core/api-reference/classes/sql/) \| `undefined`

### defaultFn

> **defaultFn**: (() => `TData` \| [`SQL`](/core/api-reference/classes/sql/)) \| `undefined`

### generated

> **generated**: [`GeneratedColumnConfig`](/core/api-reference/type-aliases/generatedcolumnconfig/)\<`TData`\> \| `undefined`

### generatedIdentity

> **generatedIdentity**: [`GeneratedIdentityConfig`](/core/api-reference/type-aliases/generatedidentityconfig/) \| `undefined`

### hasDefault

> **hasDefault**: `boolean`

### isUnique

> **isUnique**: `boolean`

### keyAsName

> **keyAsName**: `boolean`

### name

> **name**: `string`

### notNull

> **notNull**: `boolean`

### onUpdateFn

> **onUpdateFn**: (() => `TData` \| [`SQL`](/core/api-reference/classes/sql/)) \| `undefined`

### primaryKey

> **primaryKey**: `boolean`

### uniqueName

> **uniqueName**: `string` \| `undefined`

### uniqueType

> **uniqueType**: `string` \| `undefined`

## Type Parameters

### TData

`TData`

### TRuntimeConfig

`TRuntimeConfig` *extends* `object` = `object`
