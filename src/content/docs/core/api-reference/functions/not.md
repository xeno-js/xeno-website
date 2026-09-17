---
editUrl: false
next: false
prev: false
title: "not"
---

> **not**(`condition`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:92

Negate the meaning of an expression using the `not` keyword.

## Examples

```ts
// Select cars _not_ made by GM or Ford.
db.select().from(cars)
  .where(not(inArray(cars.make, ['GM', 'Ford'])))
```

## Parameters

### condition

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)
