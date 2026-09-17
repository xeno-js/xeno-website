---
editUrl: false
next: false
prev: false
title: "between"
---

## Call Signature

> **between**\<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:286

Test whether an expression is between two values. This
is an easier way to express range tests, which would be
expressed mathematically as `x <= a <= y` but in SQL
would have to be like `a >= x AND a <= y`.

Between is inclusive of the endpoints: if `column`
is equal to `min` or `max`, it will be TRUE.

## Examples

```ts
// Select cars made between 1990 and 2000
db.select().from(cars)
  .where(between(cars.year, 1990, 2000))
```

### Type Parameters

#### T

`T`

### Parameters

#### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)

#### min

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

#### max

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

notBetween for the inverse of this test

## Call Signature

> **between**\<`TColumn`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:287

Test whether an expression is between two values. This
is an easier way to express range tests, which would be
expressed mathematically as `x <= a <= y` but in SQL
would have to be like `a >= x AND a <= y`.

Between is inclusive of the endpoints: if `column`
is equal to `min` or `max`, it will be TRUE.

## Examples

```ts
// Select cars made between 1990 and 2000
db.select().from(cars)
  .where(between(cars.year, 1990, 2000))
```

### Type Parameters

#### TColumn

`TColumn` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

### Parameters

#### column

`TColumn`

#### min

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

#### max

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

notBetween for the inverse of this test

## Call Signature

> **between**\<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:288

Test whether an expression is between two values. This
is an easier way to express range tests, which would be
expressed mathematically as `x <= a <= y` but in SQL
would have to be like `a >= x AND a <= y`.

Between is inclusive of the endpoints: if `column`
is equal to `min` or `max`, it will be TRUE.

## Examples

```ts
// Select cars made between 1990 and 2000
db.select().from(cars)
  .where(between(cars.year, 1990, 2000))
```

### Type Parameters

#### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

### Parameters

#### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

#### min

`unknown`

#### max

`unknown`

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

notBetween for the inverse of this test
