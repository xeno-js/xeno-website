---
editUrl: false
next: false
prev: false
title: "BinaryOperator"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:4

## Call Signature

> **BinaryOperator**\<`TColumn`\>(`left`, `right`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:5

### Type Parameters

#### TColumn

`TColumn` *extends* [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\>

### Parameters

#### left

`TColumn`

#### right

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `TColumn`\[`"_"`\]\[`"data"`\]

### Returns

[`SQL`](/core/api-reference/classes/sql/)

## Call Signature

> **BinaryOperator**\<`T`\>(`left`, `right`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:6

### Type Parameters

#### T

`T`

### Parameters

#### left

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

#### right

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/) \| `T`

### Returns

[`SQL`](/core/api-reference/classes/sql/)

## Call Signature

> **BinaryOperator**\<`T`\>(`left`, `right`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/expressions/conditions.d.ts:7

### Type Parameters

#### T

`T` *extends* [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

### Parameters

#### left

`Exclude`\<`T`, [`Column`](/core/api-reference/classes/column/)\<[`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>, `object`, `object`\> \| [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`unknown`\>\>

#### right

`unknown`

### Returns

[`SQL`](/core/api-reference/classes/sql/)
