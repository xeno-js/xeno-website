---
editUrl: false
next: false
prev: false
title: "inArray"
---

## Call Signature

> **inArray**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:169

Test whether the first parameter, a column or expression,
has a value from a list passed as the second argument.

## Examples

```ts
// Select cars made by Ford or GM.
db.select().from(cars)
  .where(inArray(cars.make, ['Ford', 'GM']))
```

### Type Parameters

#### T

`T`

### Parameters

#### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

#### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `T`)[]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

notInArray for the inverse of this test

## Call Signature

> **inArray**\<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:170

Test whether the first parameter, a column or expression,
has a value from a list passed as the second argument.

## Examples

```ts
// Select cars made by Ford or GM.
db.select().from(cars)
  .where(inArray(cars.make, ['Ford', 'GM']))
```

### Type Parameters

#### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\>

### Parameters

#### column

`TColumn`

#### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| readonly ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `TColumn`\[`"_"`\]\[`"data"`\])[]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

notInArray for the inverse of this test

## Call Signature

> **inArray**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:171

Test whether the first parameter, a column or expression,
has a value from a list passed as the second argument.

## Examples

```ts
// Select cars made by Ford or GM.
db.select().from(cars)
  .where(inArray(cars.make, ['Ford', 'GM']))
```

### Type Parameters

#### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

### Parameters

#### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

#### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| readonly `unknown`[]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

notInArray for the inverse of this test
