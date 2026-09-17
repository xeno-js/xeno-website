---
editUrl: false
next: false
prev: false
title: "BuildQueryResult"
---

> **BuildQueryResult**\<`TSchema`, `TTableConfig`, `TFullSelection`\> = [`Equal`](/core/api-reference/type-aliases/equal/)\<`TFullSelection`, `true`\> *extends* `true` ? [`InferModelFromColumns`](/core/api-reference/type-aliases/infermodelfromcolumns/)\<`TTableConfig`\[`"columns"`\]\> : `TFullSelection` *extends* `Record`\<`string`, `unknown`\> ? [`Simplify`](/core/api-reference/type-aliases/simplify/)\<`TFullSelection`\[`"columns"`\] *extends* `Record`\<`string`, `unknown`\> ? [`InferModelFromColumns`](/core/api-reference/type-aliases/infermodelfromcolumns/)\<`{ [K in Equal<Exclude<(...), (...)>, false> extends true ? Exclude<keyof (...), NonUndefinedKeysOnly<(...)>> : (...)[(...)] & keyof (...)]: TTableConfig["columns"][K] }`\> : [`InferModelFromColumns`](/core/api-reference/type-aliases/infermodelfromcolumns/)\<`TTableConfig`\[`"columns"`\]\> & `TFullSelection`\[`"extras"`\] *extends* `Record`\<`string`, `unknown`\> \| ((...`args`) => `Record`\<`string`, `unknown`\>) ? `{ [K in NonUndefinedKeysOnly<ReturnTypeOrValue<TFullSelection["extras"]>>]: Assume<(...)[(...)], Aliased>["_"]["type"] }` : `object` & `TFullSelection`\[`"with"`\] *extends* `Record`\<`string`, `unknown`\> ? [`BuildRelationResult`](/core/api-reference/type-aliases/buildrelationresult/)\<`TSchema`, `TFullSelection`\[`"with"`\], `TTableConfig`\[`"relations"`\]\> : `object`\> : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:155

## Type Parameters

### TSchema

`TSchema` *extends* [`TablesRelationalConfig`](/core/api-reference/type-aliases/tablesrelationalconfig/)

### TTableConfig

`TTableConfig` *extends* [`TableRelationalConfig`](/core/api-reference/interfaces/tablerelationalconfig/)

### TFullSelection

`TFullSelection` *extends* `true` \| `Record`\<`string`, `unknown`\>
