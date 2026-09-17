---
editUrl: false
next: false
prev: false
title: "GetDecoderResult"
---

> **GetDecoderResult**\<`T`\> = `T` *extends* [`Column`](/core/api-reference/classes/column/) ? `T`\[`"_"`\]\[`"data"`\] : `T` *extends* [`DriverValueDecoder`](/core/api-reference/interfaces/drivervaluedecoder/)\<infer TData, `any`\> \| [`DriverValueDecoder`](/core/api-reference/interfaces/drivervaluedecoder/)\<infer TData, `any`\>\[`"mapFromDriverValue"`\] ? `TData` : `never`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:95

## Type Parameters

### T

`T`
