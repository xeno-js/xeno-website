---
editUrl: false
next: false
prev: false
title: "innerProduct"
---

> **innerProduct**(`column`, `value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/vector.d.ts:70

Used in sorting and in querying, if used in sorting,
this specifies that the given column or expression should be sorted in an order
that minimizes the inner product distance to the given value.
If used in querying, this specifies that it should return the inner product distance
between the given column or expression and the given value.

## Examples

```ts
// Sort cars by embedding similarity
// to the given embedding
db.select().from(cars)
  .orderBy(innerProduct(cars.embedding, embedding));
```

```ts
// Select distance of cars and embedding
// to the given embedding
db.select({ distance: innerProduct(cars.embedding, embedding) }).from(cars)
```

## Parameters

### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

### value

`string` \| `string`[] \| `number`[] \| `TypedQueryBuilder`\<`any`, `unknown`, `unknown`\>

## Returns

[`SQL`](/core/api-reference/classes/sql/)
