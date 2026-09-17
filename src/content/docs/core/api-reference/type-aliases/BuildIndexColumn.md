---
editUrl: false
next: false
prev: false
title: "BuildIndexColumn"
---

> **BuildIndexColumn**\<`TDialect`\> = `TDialect` *extends* `"pg"` ? `ExtraConfigColumn` : `TDialect` *extends* `"gel"` ? `GelExtraConfigColumn` : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:231

## Type Parameters

### TDialect

`TDialect` *extends* [`Dialect`](/core/api-reference/type-aliases/dialect/)
