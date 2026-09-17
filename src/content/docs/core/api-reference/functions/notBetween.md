---
editUrl: false
next: false
prev: false
title: "notBetween"
---

## Call Signature

> **notBetween**\<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:306

Test whether an expression is not between two values.

This, like `between`, includes its endpoints, so if
the `column` is equal to `min` or `max`, in this case
it will evaluate to FALSE.

## Examples

```ts
// Exclude cars made in the 1970s
db.select().from(cars)
  .where(notBetween(cars.year, 1970, 1979))
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

between for the inverse of this test

## Call Signature

> **notBetween**\<`TColumn`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:307

Test whether an expression is not between two values.

This, like `between`, includes its endpoints, so if
the `column` is equal to `min` or `max`, in this case
it will evaluate to FALSE.

## Examples

```ts
// Exclude cars made in the 1970s
db.select().from(cars)
  .where(notBetween(cars.year, 1970, 1979))
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

between for the inverse of this test

## Call Signature

> **notBetween**\<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:308

Test whether an expression is not between two values.

This, like `between`, includes its endpoints, so if
the `column` is equal to `min` or `max`, in this case
it will evaluate to FALSE.

## Examples

```ts
// Exclude cars made in the 1970s
db.select().from(cars)
  .where(notBetween(cars.year, 1970, 1979))
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

between for the inverse of this test
