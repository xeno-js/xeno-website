---
editUrl: false
next: false
prev: false
title: "getOrderByOperators"
---

> **getOrderByOperators**(): `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:93

## Returns

### asc

> **asc**: (`column`) => [`SQL`](/core/api-reference/classes/sql/)

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

#### Parameters

##### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

desc to sort in descending order

### desc

> **desc**: (`column`) => [`SQL`](/core/api-reference/classes/sql/)

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

#### Parameters

##### column

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

asc to sort in ascending order

### sql

> **sql**: *typeof* [`sql`](/core/api-reference/functions/sql/)
