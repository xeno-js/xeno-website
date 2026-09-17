---
editUrl: false
next: false
prev: false
title: "asc"
---

> **asc**(`column`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/select.d.ts:21

Used in sorting, this specifies that the given
column or expression should be sorted in ascending
order. By the SQL standard, ascending order is the
default, so it is not usually necessary to specify
ascending sort order.

## Examples

```ts
// Return cars, starting with the oldest models
// and going in ascending order to the newest.
db.select().from(cars)
  .orderBy(asc(cars.year));
```

## Parameters

### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## See

desc to sort in descending order
