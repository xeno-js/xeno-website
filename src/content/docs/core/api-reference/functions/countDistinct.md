---
editUrl: false
next: false
prev: false
title: "countDistinct"
---

> **countDistinct**(`expression`): [`SQL`](/core/api-reference/classes/sql/)\<`number`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/aggregate.d.ts:30

Returns the number of non-duplicate values in `expression`.

## Examples

```ts
// Number of employees where `name` is distinct
db.select({ value: countDistinct(employees.name) }).from(employees)
```

## Parameters

### expression

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`number`\>

## See

count to get the number of values in `expression`, including duplicates
