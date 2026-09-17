---
editUrl: false
next: false
prev: false
title: "gte"
---

> `const` **gte**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:124

Test that the first expression passed is greater than
or equal to the second expression. Use `gt` to
test whether an expression is strictly greater
than another.

## Examples

```ts
// Select cars made on or after 2000.
db.select().from(cars)
  .where(gte(cars.year, 2000))
```

## See

gt for a strictly greater-than condition
