---
editUrl: false
next: false
prev: false
title: "getOperators"
---

> **getOperators**(): `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:68

## Returns

### and

> **and**: (...`conditions`) => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

Combine a list of conditions with the `and` operator. Conditions
that are equal `undefined` are automatically ignored.

## Examples

```ts
db.select().from(cars)
  .where(
    and(
      eq(cars.make, 'Volvo'),
      eq(cars.year, 1950),
    )
  )
```

#### Parameters

##### conditions

...([`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `undefined`)[]

#### Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

### between

> **between**: \{\<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/); \<`TColumn`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/); \<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/); \}

#### Call Signature

> \<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

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

##### Type Parameters

###### T

`T`

##### Parameters

###### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)

###### min

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

###### max

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

notBetween for the inverse of this test

#### Call Signature

> \<`TColumn`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

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

##### Type Parameters

###### TColumn

`TColumn` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

##### Parameters

###### column

`TColumn`

###### min

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

###### max

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

notBetween for the inverse of this test

#### Call Signature

> \<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

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

##### Type Parameters

###### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

##### Parameters

###### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

###### min

`unknown`

###### max

`unknown`

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

notBetween for the inverse of this test

### eq

> **eq**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

### exists

> **exists**: (`subquery`) => [`SQL`](/core/api-reference/classes/sql/)

Test whether a subquery evaluates to have any rows.

## Examples

```ts
// Users whose `homeCity` column has a match in a cities
// table.
db
  .select()
  .from(users)
  .where(
    exists(db.select()
      .from(cities)
      .where(eq(users.homeCity, cities.id))),
  );
```

#### Parameters

##### subquery

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

notExists for the inverse of this test

### gt

> **gt**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

### gte

> **gte**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

### ilike

> **ilike**: (`column`, `value`) => [`SQL`](/core/api-reference/classes/sql/)

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

#### Parameters

##### column

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>

##### value

`string` \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

like for a case-sensitive version of this condition

### inArray

> **inArray**: \{\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/); \<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/); \<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/); \}

#### Call Signature

> \<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Test whether the first parameter, a column or expression,
has a value from a list passed as the second argument.

## Examples

```ts
// Select cars made by Ford or GM.
db.select().from(cars)
  .where(inArray(cars.make, ['Ford', 'GM']))
```

##### Type Parameters

###### T

`T`

##### Parameters

###### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

###### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `T`)[]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

notInArray for the inverse of this test

#### Call Signature

> \<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Test whether the first parameter, a column or expression,
has a value from a list passed as the second argument.

## Examples

```ts
// Select cars made by Ford or GM.
db.select().from(cars)
  .where(inArray(cars.make, ['Ford', 'GM']))
```

##### Type Parameters

###### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\>

##### Parameters

###### column

`TColumn`

###### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| readonly ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `TColumn`\[`"_"`\]\[`"data"`\])[]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

notInArray for the inverse of this test

#### Call Signature

> \<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Test whether the first parameter, a column or expression,
has a value from a list passed as the second argument.

## Examples

```ts
// Select cars made by Ford or GM.
db.select().from(cars)
  .where(inArray(cars.make, ['Ford', 'GM']))
```

##### Type Parameters

###### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

##### Parameters

###### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

###### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| readonly `unknown`[]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

notInArray for the inverse of this test

### isNotNull

> **isNotNull**: (`value`) => [`SQL`](/core/api-reference/classes/sql/)

Test whether an expression is not NULL. By the SQL standard,
NULL is neither equal nor not equal to itself, so
it's recommended to use `isNull` and `notIsNull` for
comparisons to NULL.

## Examples

```ts
// Select cars that have been discontinued.
db.select().from(cars)
  .where(isNotNull(cars.discontinuedAt))
```

#### Parameters

##### value

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

isNull for the inverse of this test

### isNull

> **isNull**: (`value`) => [`SQL`](/core/api-reference/classes/sql/)

Test whether an expression is NULL. By the SQL standard,
NULL is neither equal nor not equal to itself, so
it's recommended to use `isNull` and `notIsNull` for
comparisons to NULL.

## Examples

```ts
// Select cars that have no discontinuedAt date.
db.select().from(cars)
  .where(isNull(cars.discontinuedAt))
```

#### Parameters

##### value

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

isNotNull for the inverse of this test

### like

> **like**: (`column`, `value`) => [`SQL`](/core/api-reference/classes/sql/)

Compare a column to a pattern, which can include `%` and `_`
characters to match multiple variations. Including `%`
in the pattern matches zero or more characters, and including
`_` will match a single character.

## Examples

```ts
// Select all cars with 'Turbo' in their names.
db.select().from(cars)
  .where(like(cars.name, '%Turbo%'))
```

#### Parameters

##### column

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>

##### value

`string` \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

ilike for a case-insensitive version of this condition

### lt

> **lt**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

### lte

> **lte**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

### ne

> **ne**: [`BinaryOperator`](/core/api-reference/interfaces/binaryoperator/)

### not

> **not**: (`condition`) => [`SQL`](/core/api-reference/classes/sql/)

Negate the meaning of an expression using the `not` keyword.

## Examples

```ts
// Select cars _not_ made by GM or Ford.
db.select().from(cars)
  .where(not(inArray(cars.make, ['GM', 'Ford'])))
```

#### Parameters

##### condition

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

### notBetween

> **notBetween**: \{\<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/); \<`TColumn`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/); \<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/); \}

#### Call Signature

> \<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

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

##### Type Parameters

###### T

`T`

##### Parameters

###### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)

###### min

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

###### max

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

between for the inverse of this test

#### Call Signature

> \<`TColumn`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

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

##### Type Parameters

###### TColumn

`TColumn` *extends* [`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)

##### Parameters

###### column

`TColumn`

###### min

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

###### max

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

between for the inverse of this test

#### Call Signature

> \<`T`\>(`column`, `min`, `max`): [`SQL`](/core/api-reference/classes/sql/)

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

##### Type Parameters

###### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

##### Parameters

###### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

###### min

`unknown`

###### max

`unknown`

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

between for the inverse of this test

### notExists

> **notExists**: (`subquery`) => [`SQL`](/core/api-reference/classes/sql/)

Test whether a subquery doesn't include any result
rows.

## Examples

```ts
// Users whose `homeCity` column doesn't match
// a row in the cities table.
db
  .select()
  .from(users)
  .where(
    notExists(db.select()
      .from(cities)
      .where(eq(users.homeCity, cities.id))),
  );
```

#### Parameters

##### subquery

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

exists for the inverse of this test

### notIlike

> **notIlike**: (`column`, `value`) => [`SQL`](/core/api-reference/classes/sql/)

The inverse of ilike - this case-insensitively tests that a given column
does not match a pattern, which can include `%` and `_`
characters to match multiple variations. Including `%`
in the pattern matches zero or more characters, and including
`_` will match a single character.

## Examples

```ts
// Select all cars that don't have "Rover" in their name.
db.select().from(cars)
  .where(notLike(cars.name, '%Rover%'))
```

#### Parameters

##### column

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>

##### value

`string` \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

 - ilike for the inverse condition
 - notLike for a case-sensitive version of this condition

### notInArray

> **notInArray**: \{\<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/); \<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/); \<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/); \}

#### Call Signature

> \<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Test whether the first parameter, a column or expression,
has a value that is not present in a list passed as the
second argument.

## Examples

```ts
// Select cars made by any company except Ford or GM.
db.select().from(cars)
  .where(notInArray(cars.make, ['Ford', 'GM']))
```

##### Type Parameters

###### T

`T`

##### Parameters

###### column

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

###### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `T`)[]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

inArray for the inverse of this test

#### Call Signature

> \<`TColumn`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Test whether the first parameter, a column or expression,
has a value that is not present in a list passed as the
second argument.

## Examples

```ts
// Select cars made by any company except Ford or GM.
db.select().from(cars)
  .where(notInArray(cars.make, ['Ford', 'GM']))
```

##### Type Parameters

###### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\>

##### Parameters

###### column

`TColumn`

###### values

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| ([`Placeholder`](/core/api-reference/classes/placeholder/)\<`string`, `any`\> \| `TColumn`\[`"_"`\]\[`"data"`\])[]

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

inArray for the inverse of this test

#### Call Signature

> \<`T`\>(`column`, `values`): [`SQL`](/core/api-reference/classes/sql/)

Test whether the first parameter, a column or expression,
has a value that is not present in a list passed as the
second argument.

## Examples

```ts
// Select cars made by any company except Ford or GM.
db.select().from(cars)
  .where(notInArray(cars.make, ['Ford', 'GM']))
```

##### Type Parameters

###### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

##### Parameters

###### column

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

###### values

`unknown`[] \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

##### Returns

[`SQL`](/core/api-reference/classes/sql/)

##### See

inArray for the inverse of this test

### notLike

> **notLike**: (`column`, `value`) => [`SQL`](/core/api-reference/classes/sql/)

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

#### Parameters

##### column

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>

##### value

`string` \| [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### See

 - like for the inverse condition
 - notIlike for a case-insensitive version of this condition

### or

> **or**: (...`conditions`) => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

Combine a list of conditions with the `or` operator. Conditions
that are equal `undefined` are automatically ignored.

## Examples

```ts
db.select().from(cars)
  .where(
    or(
      eq(cars.make, 'GM'),
      eq(cars.make, 'Ford'),
    )
  )
```

#### Parameters

##### conditions

...([`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `undefined`)[]

#### Returns

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `undefined`

### sql

> **sql**: *typeof* [`sql`](/core/api-reference/functions/sql/)
