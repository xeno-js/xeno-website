---
editUrl: false
next: false
prev: false
title: "ilike"
---

> **ilike**(`column`, `value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:364

Case-insensitively compare a column to a pattern,
which can include `%` and `_`
characters to match multiple variations. Including `%`
in the pattern matches zero or more characters, and including
`_` will match a single character.

Unlike like, this performs a case-insensitive comparison.

## Examples

```ts
// Select all cars with 'Turbo' in their names.
db.select().from(cars)
  .where(ilike(cars.name, '%Turbo%'))
```

## Parameters

### column

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>

### value

`string` \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## See

like for a case-sensitive version of this condition
