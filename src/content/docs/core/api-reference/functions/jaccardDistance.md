---
editUrl: false
next: false
prev: false
title: "jaccardDistance"
---

> **jaccardDistance**(`column`, `value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/vector.d.ts:120

## Examples

```ts
// Sort cars by embedding similarity
// to the given embedding
db.select().from(cars)
  .orderBy(jaccardDistance(cars.embedding, embedding));
```

## Parameters

### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

### value

`string` \| `string`[] \| `number`[] \| `TypedQueryBuilder`\<`any`, `unknown`, `unknown`\>

## Returns

[`SQL`](/core/api-reference/classes/sql/)
