---
editUrl: false
next: false
prev: false
title: "notLike"
---

> **notLike**(`column`, `value`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:344

The inverse of like - this tests that a given column
does not match a pattern, which can include `%` and `_`
characters to match multiple variations. Including `%`
in the pattern matches zero or more characters, and including
`_` will match a single character.

## Examples

```ts
// Select all cars that don't have "ROver" in their name.
db.select().from(cars)
  .where(notLike(cars.name, '%Rover%'))
```

## Parameters

### column

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>

### value

`string` \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## See

 - like for the inverse condition
 - notIlike for a case-insensitive version of this condition
