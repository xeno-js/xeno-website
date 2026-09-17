---
editUrl: false
next: false
prev: false
title: "notInArray"
---

## Call Signature

> **notInArray**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:187

Test whether the first parameter, a column or expression,
has a value that is not present in a list passed as the
second argument.

## Examples

```ts
// Select cars made by any company except Ford or GM.
db.select().from(cars)
  .where(notInArray(cars.make, ['Ford', 'GM']))
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

inArray for the inverse of this test

## Call Signature

> **notInArray**\<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:188

Test whether the first parameter, a column or expression,
has a value that is not present in a list passed as the
second argument.

## Examples

```ts
// Select cars made by any company except Ford or GM.
db.select().from(cars)
  .where(notInArray(cars.make, ['Ford', 'GM']))
```

### Type Parameters

#### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\>

### Parameters

#### column

`TColumn`

#### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `TColumn`\[`"_"`\]\[`"data"`\])[]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

inArray for the inverse of this test

## Call Signature

> **notInArray**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:189

Test whether the first parameter, a column or expression,
has a value that is not present in a list passed as the
second argument.

## Examples

```ts
// Select cars made by any company except Ford or GM.
db.select().from(cars)
  .where(notInArray(cars.make, ['Ford', 'GM']))
```

### Type Parameters

#### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

### Parameters

#### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

#### values

`unknown`[] \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

inArray for the inverse of this test
