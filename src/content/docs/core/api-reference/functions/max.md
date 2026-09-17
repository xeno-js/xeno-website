---
editUrl: false
next: false
prev: false
title: "max"
---

> **max**\<`T`\>(`expression`): [`SQL`](/core/api-reference/classes/sql/)\<`T` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/) ? `T`\[`"_"`\]\[`"data"`\] : `string` \| `null`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/aggregate.d.ts:93

Returns the maximum value in `expression`.

## Examples

```ts
// The employee with the highest salary
db.select({ value: max(employees.salary) }).from(employees)
```

## Type Parameters

### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Parameters

### expression

`T`

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`T` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/) ? `T`\[`"_"`\]\[`"data"`\] : `string` \| `null`\>
