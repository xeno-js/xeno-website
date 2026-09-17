---
editUrl: false
next: false
prev: false
title: "gt"
---

> `const` **gt**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:107

Test that the first expression passed is greater than
the second expression.

## Examples

```ts
// Select cars made after 2000.
db.select().from(cars)
  .where(gt(cars.year, 2000))
```

## See

gte for greater-than-or-equal
