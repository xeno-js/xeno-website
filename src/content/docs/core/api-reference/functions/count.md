---
editUrl: false
next: false
prev: false
title: "count"
---

> **count**(`expression?`): [`SQL`](/core/api-reference/classes/sql/)\<`number`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/aggregate.d.ts:17

Returns the number of values in `expression`.

## Examples

```ts
// Number employees with null values
db.select({ value: count() }).from(employees)
// Number of employees where `name` is not null
db.select({ value: count(employees.name) }).from(employees)
```

## Parameters

### expression?

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`number`\>

## See

countDistinct to get the number of non-duplicate values in `expression`
