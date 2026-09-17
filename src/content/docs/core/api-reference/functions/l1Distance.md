---
editUrl: false
next: false
prev: false
title: "l1Distance"
---

> **l1Distance**(`column`, `value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/vector.d.ts:47

L1 distance is one of the possible distance measures between two probability distribution vectors and it is
calculated as the sum of the absolute differences.
The smaller the distance between the observed probability vectors, the higher the accuracy of the synthetic data

## Examples

```ts
// Sort cars by embedding similarity
// to the given embedding
db.select().from(cars)
  .orderBy(l1Distance(cars.embedding, embedding));
```

```ts
// Select distance of cars and embedding
// to the given embedding
db.select({distance: l1Distance(cars.embedding, embedding)}).from(cars)
```

## Parameters

### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

### value

`string` \| `string`[] \| `number`[] \| `TypedQueryBuilder`\<`any`, `unknown`, `unknown`\>

## Returns

[`SQL`](/core/api-reference/classes/sql/)
