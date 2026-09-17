---
editUrl: false
next: false
prev: false
title: "SQL"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:60

Any value that implements the `getSQL` method. The implementations include:
- `Table`
- `Column`
- `View`
- `Subquery`
- `SQL`
- `SQL.Aliased`
- `Placeholder`
- `Param`

## Type Parameters

### T

`T` = `unknown`

## Implements

- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new SQL**\<`T`\>(`queryChunks`): `SQL`\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:68

#### Parameters

##### queryChunks

[`SQLChunk`](/core/api-reference/type-aliases/sqlchunk/)[]

#### Returns

`SQL`\<`T`\>

## Properties

### \_

> **\_**: `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:63

#### brand

> **brand**: `"SQL"`

#### type

> **type**: `T`

***

### queryChunks

> `readonly` **queryChunks**: [`SQLChunk`](/core/api-reference/type-aliases/sqlchunk/)[]

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:61

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:62

## Methods

### append()

> **append**(`query`): `this`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:69

#### Parameters

##### query

`SQL`

#### Returns

`this`

***

### as()

#### Call Signature

> **as**(`alias`): [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:74

##### Parameters

###### alias

`string`

##### Returns

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`T`\>

#### Call Signature

> **as**\<`TData`\>(): `SQL`\<`TData`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:79

:::caution[Deprecated]
Use ``sql<DataType>`query`.as(alias)`` instead.
:::

##### Type Parameters

###### TData

`TData`

##### Returns

`SQL`\<`TData`\>

#### Call Signature

> **as**\<`TData`\>(`alias`): [`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`TData`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:84

:::caution[Deprecated]
Use ``sql<DataType>`query`.as(alias)`` instead.
:::

##### Type Parameters

###### TData

`TData`

##### Parameters

###### alias

`string`

##### Returns

[`Aliased`](/core/api-reference/xeno-js/namespaces/sql/classes/aliased/)\<`TData`\>

***

### buildQueryFromSourceParams()

> **buildQueryFromSourceParams**(`chunks`, `_config`): [`Query`](/core/api-reference/interfaces/query/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:71

#### Parameters

##### chunks

[`SQLChunk`](/core/api-reference/type-aliases/sqlchunk/)[]

##### \_config

[`BuildQueryConfig`](/core/api-reference/interfaces/buildqueryconfig/)

#### Returns

[`Query`](/core/api-reference/interfaces/query/)

***

### getSQL()

> **getSQL**(): `SQL`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:73

#### Returns

`SQL`

#### Implementation of

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)

***

### if()

> **if**(`condition`): `SQL`\<`T`\> \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:93

This method is used to conditionally include a part of the query.

#### Parameters

##### condition

`any`

Condition to check

#### Returns

`SQL`\<`T`\> \| `undefined`

itself if the condition is `true`, otherwise `undefined`

***

### inlineParams()

> **inlineParams**(): `this`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:86

#### Returns

`this`

***

### mapWith()

> **mapWith**\<`TDecoder`\>(`decoder`): `SQL`\<[`GetDecoderResult`](/core/api-reference/type-aliases/getdecoderresult/)\<`TDecoder`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:85

#### Type Parameters

##### TDecoder

`TDecoder` *extends* [`DriverValueDecoder`](/core/api-reference/interfaces/drivervaluedecoder/)\<`any`, `any`\> \| ((`value`) => `any`)

#### Parameters

##### decoder

`TDecoder`

#### Returns

`SQL`\<[`GetDecoderResult`](/core/api-reference/type-aliases/getdecoderresult/)\<`TDecoder`\>\>

***

### toQuery()

> **toQuery**(`config`): [`QueryWithTypings`](/core/api-reference/interfaces/querywithtypings/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:70

#### Parameters

##### config

[`BuildQueryConfig`](/core/api-reference/interfaces/buildqueryconfig/)

#### Returns

[`QueryWithTypings`](/core/api-reference/interfaces/querywithtypings/)
