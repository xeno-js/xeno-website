---
editUrl: false
next: false
prev: false
title: "Column"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:35

Any value that implements the `getSQL` method. The implementations include:
- `Table`
- `Column`
- `View`
- `Subquery`
- `SQL`
- `SQL.Aliased`
- `Placeholder`
- `Param`

## Extends

- [`DriverValueMapper`](/core/api-reference/interfaces/drivervaluemapper/)\<`T`\[`"data"`\], `T`\[`"driverParam"`\]\>.[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Type Parameters

### T

`T` *extends* [`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\> = [`ColumnBaseConfig`](/core/api-reference/interfaces/columnbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>

### TRuntimeConfig

`TRuntimeConfig` *extends* `object` = `object`

### TTypeConfig

`TTypeConfig` *extends* `object` = `object`

## Implements

- [`DriverValueMapper`](/core/api-reference/interfaces/drivervaluemapper/)\<`T`\[`"data"`\], `T`\[`"driverParam"`\]\>
- [`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/)

## Constructors

### Constructor

> **new Column**\<`T`, `TRuntimeConfig`, `TTypeConfig`\>(`table`, `config`): `Column`\<`T`, `TRuntimeConfig`, `TTypeConfig`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:58

#### Parameters

##### table

[`Table`](/core/api-reference/classes/table/)

##### config

[`ColumnRuntimeConfig`](/core/api-reference/type-aliases/columnruntimeconfig/)\<`T`\[`"data"`\], `TRuntimeConfig`\>

#### Returns

`Column`\<`T`, `TRuntimeConfig`, `TTypeConfig`\>

#### Inherited from

`DriverValueMapper<T['data'], T['driverParam']>.constructor`

## Properties

### \_

> `readonly` **\_**: [`ColumnTypeConfig`](/core/api-reference/type-aliases/columntypeconfig/)\<`T`, `TTypeConfig`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:40

***

### columnType

> `readonly` **columnType**: `T`\[`"columnType"`\]

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:53

***

### dataType

> `readonly` **dataType**: `T`\[`"dataType"`\]

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:52

***

### default

> `readonly` **default**: [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `T`\[`"data"`\] \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:45

***

### defaultFn

> `readonly` **defaultFn**: (() => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `T`\[`"data"`\]) \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:46

***

### enumValues

> `readonly` **enumValues**: `T`\[`"enumValues"`\]

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:54

***

### generated

> `readonly` **generated**: [`GeneratedColumnConfig`](/core/api-reference/type-aliases/generatedcolumnconfig/)\<`T`\[`"data"`\]\> \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:55

***

### generatedIdentity

> `readonly` **generatedIdentity**: [`GeneratedIdentityConfig`](/core/api-reference/type-aliases/generatedidentityconfig/) \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:56

***

### hasDefault

> `readonly` **hasDefault**: `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:48

***

### isUnique

> `readonly` **isUnique**: `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:49

***

### keyAsName

> `readonly` **keyAsName**: `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:42

***

### name

> `readonly` **name**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:41

***

### notNull

> `readonly` **notNull**: `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:44

***

### onUpdateFn

> `readonly` **onUpdateFn**: (() => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `T`\[`"data"`\]) \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:47

***

### primary

> `readonly` **primary**: `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:43

***

### table

> `readonly` **table**: [`Table`](/core/api-reference/classes/table/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:38

***

### uniqueName

> `readonly` **uniqueName**: `string` \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:50

***

### uniqueType

> `readonly` **uniqueType**: `string` \| `undefined`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:51

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:39

## Methods

### getSQL()

> **getSQL**(): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:50

#### Returns

[`SQL`](/core/api-reference/classes/sql/)

#### Inherited from

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`getSQL`](/core/api-reference/interfaces/sqlwrapper/#getsql)

***

### getSQLType()

> `abstract` **getSQLType**(): `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:59

#### Returns

`string`

***

### mapFromDriverValue()

> **mapFromDriverValue**(`value`): `unknown`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:60

#### Parameters

##### value

`unknown`

#### Returns

`unknown`

#### Inherited from

`DriverValueMapper.mapFromDriverValue`

***

### mapToDriverValue()

> **mapToDriverValue**(`value`): `unknown`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column.d.ts:61

#### Parameters

##### value

`unknown`

#### Returns

`unknown`

#### Inherited from

[`DriverValueMapper`](/core/api-reference/interfaces/drivervaluemapper/).[`mapToDriverValue`](/core/api-reference/interfaces/drivervaluemapper/#maptodrivervalue)

***

### shouldOmitSQLParens()?

> `optional` **shouldOmitSQLParens**(): `boolean`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:51

#### Returns

`boolean`

#### Inherited from

[`SQLWrapper`](/core/api-reference/interfaces/sqlwrapper/).[`shouldOmitSQLParens`](/core/api-reference/interfaces/sqlwrapper/#shouldomitsqlparens)
