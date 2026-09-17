---
editUrl: false
next: false
prev: false
title: "lte"
---

> `const` **lte**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:154

Test that the first expression passed is less than
or equal to the second expression.

## Examples

```ts
// Select cars made before 2000.
db.select().from(cars)
  .where(lte(cars.year, 2000))
```

## See

lt for a strictly less-than condition
