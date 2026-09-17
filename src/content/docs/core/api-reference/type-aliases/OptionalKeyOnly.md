---
editUrl: false
next: false
prev: false
title: "OptionalKeyOnly"
---

> **OptionalKeyOnly**\<`TKey`, `T`, `OverrideT`\> = `TKey` *extends* [`RequiredKeyOnly`](/core/api-reference/type-aliases/requiredkeyonly/)\<`TKey`, `T`\> ? `never` : `T` *extends* `object` ? `T` *extends* `object` ? `TKey` : `T`\[`"_"`\]\[`"identity"`\] *extends* `"always"` ? `OverrideT` *extends* `true` ? `TKey` : `never` : `TKey` : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/operations.d.ts:9

## Type Parameters

### TKey

`TKey` *extends* `string`

### T

`T` *extends* [`Column`](/core/api-reference/classes/column/)

### OverrideT

`OverrideT` *extends* `boolean` \| `undefined` = `false`
