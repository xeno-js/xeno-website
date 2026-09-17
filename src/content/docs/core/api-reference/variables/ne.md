---
editUrl: false
next: false
prev: false
title: "ne"
---

> `const` **ne**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:46

Test that two values are not equal.

Remember that the SQL standard dictates that
two NULL values are not equal, so if you want to test
whether a value is not null, you may want to use
`isNotNull` instead.

## Examples

```ts
// Select cars not made by Ford
db.select().from(cars)
  .where(ne(cars.make, 'Ford'))
```

## See

isNotNull for a way to test whether a value is not null.
