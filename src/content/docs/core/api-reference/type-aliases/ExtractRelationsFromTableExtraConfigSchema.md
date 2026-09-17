---
editUrl: false
next: false
prev: false
title: "ExtractRelationsFromTableExtraConfigSchema"
---

> **ExtractRelationsFromTableExtraConfigSchema**\<`TConfig`\> = [`ExtractObjectValues`](/core/api-reference/type-aliases/extractobjectvalues/)\<`{ [K in keyof TConfig as TConfig[K] extends Relations<any> ? K : never]: TConfig[K] extends Relations<infer TRelationConfig> ? TRelationConfig : never }`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:65

## Type Parameters

### TConfig

`TConfig` *extends* `unknown`[]
