---
editUrl: false
next: false
prev: false
title: "sum"
---

> **sum**(`expression`): [`SQL`](/core/api-reference/classes/sql/)\<`string` \| `null`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/aggregate.d.ts:69

Returns the sum of all non-null values in `expression`.

## Examples

```ts
// Sum of every employee's salary
db.select({ value: sum(employees.salary) }).from(employees)
```

## Parameters

### expression

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`string` \| `null`\>

## See

sumDistinct to get the sum of all non-null and non-duplicate values in `expression`
