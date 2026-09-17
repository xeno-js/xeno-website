---
editUrl: false
next: false
prev: false
title: "ValidateShape"
---

> **ValidateShape**\<`T`, `ValidShape`, `TResult`\> = `T` *extends* `ValidShape` ? `Exclude`\<keyof `T`, keyof `ValidShape`\> *extends* `never` ? `TResult` : [`DrizzleTypeError`](/core/api-reference/interfaces/drizzletypeerror/)\<\`Invalid key(s): $\{Exclude\<keyof T & (string \| number \| bigint \| boolean \| null \| undefined), keyof ValidShape\>\}\`\> : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/utils.d.ts:53

## Type Parameters

### T

`T`

### ValidShape

`ValidShape`

### TResult

`TResult` = `T`
