---
editUrl: false
next: false
prev: false
title: "lt"
---

> `const` **lt**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:139

Test that the first expression passed is less than
the second expression.

## Examples

```ts
// Select cars made before 2000.
db.select().from(cars)
  .where(lt(cars.year, 2000))
```

## See

lte for less-than-or-equal
