---
editUrl: false
next: false
prev: false
title: "arrayContained"
---

## Call Signature

> **arrayContained**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:428

Test that the list passed as the second argument contains
all elements of a column or expression.

## Throws

The argument passed in the second array can't be empty:
if an empty is provided, this method will throw.

## Examples

```ts
// Select posts where its tags contain "Typescript", "ORM" or both,
// but filtering posts that have additional tags.
db.select().from(posts)
  .where(arrayContained(posts.tags, ['Typescript', 'ORM']))
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

 - arrayContains to find if a column or expression contains all elements of an array
 - arrayOverlaps to find if a column or expression contains any elements of an array

## Call Signature

> **arrayContained**\<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:429

Test that the list passed as the second argument contains
all elements of a column or expression.

## Throws

The argument passed in the second array can't be empty:
if an empty is provided, this method will throw.

## Examples

```ts
// Select posts where its tags contain "Typescript", "ORM" or both,
// but filtering posts that have additional tags.
db.select().from(posts)
  .where(arrayContained(posts.tags, ['Typescript', 'ORM']))
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

 - arrayContains to find if a column or expression contains all elements of an array
 - arrayOverlaps to find if a column or expression contains any elements of an array

## Call Signature

> **arrayContained**\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:430

Test that the list passed as the second argument contains
all elements of a column or expression.

## Throws

The argument passed in the second array can't be empty:
if an empty is provided, this method will throw.

## Examples

```ts
// Select posts where its tags contain "Typescript", "ORM" or both,
// but filtering posts that have additional tags.
db.select().from(posts)
  .where(arrayContained(posts.tags, ['Typescript', 'ORM']))
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

 - arrayContains to find if a column or expression contains all elements of an array
 - arrayOverlaps to find if a column or expression contains any elements of an array
