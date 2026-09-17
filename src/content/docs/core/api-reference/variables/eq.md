---
editUrl: false
next: false
prev: false
title: "eq"
---

> `const` **eq**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:27

Test that two values are equal.

Remember that the SQL standard dictates that
two NULL values are not equal, so if you want to test
whether a value is null, you may want to use
`isNull` instead.

## Examples

```ts
// Select cars made by Ford
db.select().from(cars)
  .where(eq(cars.make, 'Ford'))
```

## See

isNull for a way to test equality to NULL.
