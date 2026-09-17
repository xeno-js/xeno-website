---
editUrl: false
next: false
prev: false
title: "NonUndefinedKeysOnly"
---

> **NonUndefinedKeysOnly**\<`T`\> = [`ExtractObjectValues`](/core/api-reference/type-aliases/extractobjectvalues/)\<`{ [K in keyof T as T[K] extends undefined ? never : K]: K }`\> & keyof `T`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:152

## Type Parameters

### T

`T`
