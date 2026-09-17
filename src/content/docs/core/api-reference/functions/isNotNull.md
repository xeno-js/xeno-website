---
editUrl: false
next: false
prev: false
title: "isNotNull"
---

> **isNotNull**(`value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:223

Test whether an expression is not NULL. By the SQL standard,
NULL is neither equal nor not equal to itself, so
it's recommended to use `isNull` and `notIsNull` for
comparisons to NULL.

## Examples

```ts
// Select cars that have been discontinued.
db.select().from(cars)
  .where(isNotNull(cars.discontinuedAt))
```

## Parameters

### value

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## See

isNull for the inverse of this test
