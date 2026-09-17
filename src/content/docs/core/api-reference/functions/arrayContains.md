---
editUrl: false
next: false
prev: false
title: "arrayContains"
---

## Call Signature

> **arrayContains**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:404

Test that a column or expression contains all elements of
the list passed as the second argument.

## Throws

The argument passed in the second array can't be empty:
if an empty is provided, this method will throw.

## Examples

```ts
// Select posts where its tags contain "Typescript" and "ORM".
db.select().from(posts)
  .where(arrayContains(posts.tags, ['Typescript', 'ORM']))
```

### Type Parameters

#### T

`T`

### Parameters

#### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

#### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `T`

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

 - arrayContained to find if an array contains all elements of a column or expression
 - arrayOverlaps to find if a column or expression contains any elements of an array

## Call Signature

> **arrayContains**\<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:405

Test that a column or expression contains all elements of
the list passed as the second argument.

## Throws

The argument passed in the second array can't be empty:
if an empty is provided, this method will throw.

## Examples

```ts
// Select posts where its tags contain "Typescript" and "ORM".
db.select().from(posts)
  .where(arrayContains(posts.tags, ['Typescript', 'ORM']))
```

### Type Parameters

#### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\>

### Parameters

#### column

`TColumn`

#### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| [`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `TColumn`\[`"_"`\]\[`"data"`\]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

### See

 - arrayContained to find if an array contains all elements of a column or expression
 - arrayOverlaps to find if a column or expression contains any elements of an array

## Call Signature

> **arrayContains**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:406

Test that a column or expression contains all elements of
the list passed as the second argument.

## Throws

The argument passed in the second array can't be empty:
if an empty is provided, this method will throw.

## Examples

```ts
// Select posts where its tags contain "Typescript" and "ORM".
db.select().from(posts)
  .where(arrayContains(posts.tags, ['Typescript', 'ORM']))
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

 - arrayContained to find if an array contains all elements of a column or expression
 - arrayOverlaps to find if a column or expression contains any elements of an array
