---
editUrl: false
next: false
prev: false
title: "desc"
---

> **desc**(`column`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/select.d.ts:38

Used in sorting, this specifies that the given
column or expression should be sorted in descending
order.

## Examples

```ts
// Select users, with the most recently created
// records coming first.
db.select().from(users)
  .orderBy(desc(users.createdAt));
```

## Parameters

### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## See

asc to sort in ascending order
