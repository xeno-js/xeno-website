---
editUrl: false
next: false
prev: false
title: "min"
---

> **min**\<`T`\>(`expression`): [`SQL`](/core/api-reference/classes/sql/)\<`T` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/) ? `T`\[`"_"`\]\[`"data"`\] : `string` \| `null`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/functions/aggregate.d.ts:104

Returns the minimum value in `expression`.

## Examples

```ts
// The employee with the lowest salary
db.select({ value: min(employees.salary) }).from(employees)
```

## Type Parameters

### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Parameters

### expression

`T`

## Returns

[`SQL`](/core/api-reference/classes/sql/)\<`T` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/) ? `T`\[`"_"`\]\[`"data"`\] : `string` \| `null`\>
