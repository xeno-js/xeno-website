---
editUrl: false
next: false
prev: false
title: "avgDistinct"
---

> **avgDistinct**(`expression`): [`SQL`](/core/api-reference/classes/sql/)\<`string` \| `null`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/aggregate.d.ts:56

Returns the average (arithmetic mean) of all non-null and non-duplicate values in `expression`.

## Examples

```ts
// Average salary of an employee where `salary` is distinct
db.select({ value: avgDistinct(employees.salary) }).from(employees)
```

## Parameters

### expression

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`string` \| `null`\>

## See

avg to get the average of all non-null values in `expression`, including duplicates
