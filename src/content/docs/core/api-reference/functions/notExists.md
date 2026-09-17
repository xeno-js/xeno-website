---
editUrl: false
next: false
prev: false
title: "notExists"
---

> **notExists**(`subquery`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:266

Test whether a subquery doesn't include any result
rows.

## Examples

```ts
// Users whose `homeCity` column doesn't match
// a row in the cities table.
db
  .select()
  .from(users)
  .where(
    notExists(db.select()
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

exists for the inverse of this test
