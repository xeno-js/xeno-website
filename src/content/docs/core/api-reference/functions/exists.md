---
editUrl: false
next: false
prev: false
title: "exists"
---

> **exists**(`subquery`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:244

Test whether a subquery evaluates to have any rows.

## Examples

```ts
// Users whose `homeCity` column has a match in a cities
// table.
db
  .select()
  .from(users)
  .where(
    exists(db.select()
      .from(cities)
      .where(eq(users.homeCity, cities.id))),
  );
```

## Parameters

### subquery

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## See

notExists for the inverse of this test
