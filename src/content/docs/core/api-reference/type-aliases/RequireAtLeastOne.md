---
editUrl: false
next: false
prev: false
title: "RequireAtLeastOne"
---

> **RequireAtLeastOne**\<`T`, `Keys`\> = `Keys` *extends* `any` ? `Required`\<`Pick`\<`T`, `Keys`\>\> & `Partial`\<`Omit`\<`T`, `Keys`\>\> : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/utils.d.ts:60

## Type Parameters

### T

`T`

### Keys

`Keys` *extends* keyof `T` = keyof `T`
