---
editUrl: false
next: false
prev: false
title: "hammingDistance"
---

> **hammingDistance**(`column`, `value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/vector.d.ts:109

Hamming distance between two strings or vectors of equal length is the number of positions at which the
corresponding symbols are different. In other words, it measures the minimum number of
substitutions required to change one string into the other, or equivalently,
the minimum number of errors that could have transformed one string into the other

## Examples

```ts
// Sort cars by embedding similarity
// to the given embedding
db.select().from(cars)
  .orderBy(hammingDistance(cars.embedding, embedding));
```

## Parameters

### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

### value

`string` \| `string`[] \| `number`[] \| `TypedQueryBuilder`\<`any`, `unknown`, `unknown`\>

## Returns

[`SQL`](/core/api-reference/classes/sql/)
