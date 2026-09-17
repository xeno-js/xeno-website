---
editUrl: false
next: false
prev: false
title: "or"
---

> **or**(...`conditions`): [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:80

Combine a list of conditions with the `or` operator. Conditions
that are equal `undefined` are automatically ignored.

## Examples

```ts
db.select().from(cars)
  .where(
    or(
      eq(cars.make, 'GM'),
      eq(cars.make, 'Ford'),
    )
  )
```

## Parameters

### conditions

...([`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `undefined`)[]

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`
