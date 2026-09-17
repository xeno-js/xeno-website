---
editUrl: false
next: false
prev: false
title: "and"
---

> **and**(...`conditions`): [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:63

Combine a list of conditions with the `and` operator. Conditions
that are equal `undefined` are automatically ignored.

## Examples

```ts
db.select().from(cars)
  .where(
    and(
      eq(cars.make, 'Volvo'),
      eq(cars.year, 1950),
    )
  )
```

## Parameters

### conditions

...([`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `undefined`)[]

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`
