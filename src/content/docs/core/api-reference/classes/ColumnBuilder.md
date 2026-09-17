---
editUrl: false
next: false
prev: false
title: "ColumnBuilder"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:156

## Type Parameters

### T

`T` *extends* [`ColumnBuilderBaseConfig`](/core/api-reference/interfaces/columnbuilderbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\> = [`ColumnBuilderBaseConfig`](/core/api-reference/interfaces/columnbuilderbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>

### TRuntimeConfig

`TRuntimeConfig` *extends* `object` = `object`

### TTypeConfig

`TTypeConfig` *extends* `object` = `object`

### TExtraConfig

`TExtraConfig` *extends* [`ColumnBuilderExtraConfig`](/core/api-reference/interfaces/columnbuilderextraconfig/) = [`ColumnBuilderExtraConfig`](/core/api-reference/interfaces/columnbuilderextraconfig/)

## Implements

- [`ColumnBuilderBase`](/core/api-reference/interfaces/columnbuilderbase/)\<`T`, `TTypeConfig`\>

## Constructors

### Constructor

> **new ColumnBuilder**\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>(`name`, `dataType`, `columnType`): `ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:160

#### Parameters

##### name

`T`\[`"name"`\]

##### dataType

`T`\[`"dataType"`\]

##### columnType

`T`\[`"columnType"`\]

#### Returns

`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>

## Properties

### \_

> **\_**: \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \}

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:158

#### Implementation of

[`ColumnBuilderBase`](/core/api-reference/interfaces/columnbuilderbase/).[`_`](/core/api-reference/interfaces/columnbuilderbase/#_)

***

### $default

> **$default**: (`fn`) => [`HasRuntimeDefault`](/core/api-reference/type-aliases/hasruntimedefault/)\<[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:201

Alias for [$defaultFn](/core/api-reference/classes/columnbuilder/#defaultfn).

#### Parameters

##### fn

() => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \} *extends* `object` ? `U` : \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: ... \} ? (...) extends (...) ? (...) : (...) : unknown; hasDefault: T extends \{ hasDefault: ... \} ? U : boolean; identity: T extends \{ identity: ... \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: ... \} ? U : boolean \} & TTypeConfig)\[K\] \}\[`"data"`\]

#### Returns

[`HasRuntimeDefault`](/core/api-reference/type-aliases/hasruntimedefault/)\<[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>

***

### $onUpdate

> **$onUpdate**: (`fn`) => [`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:217

Alias for [$onUpdateFn](/core/api-reference/classes/columnbuilder/#onupdatefn).

#### Parameters

##### fn

() => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \} *extends* `object` ? `U` : \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: ... \} ? (...) extends (...) ? (...) : (...) : unknown; hasDefault: T extends \{ hasDefault: ... \} ? U : boolean; identity: T extends \{ identity: ... \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: ... \} ? U : boolean \} & TTypeConfig)\[K\] \}\[`"data"`\]

#### Returns

[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

***

### \[entityKind\]

> `readonly` `static` **\[entityKind\]**: `string`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:157

## Methods

### $defaultFn()

> **$defaultFn**(`fn`): [`HasRuntimeDefault`](/core/api-reference/type-aliases/hasruntimedefault/)\<[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:195

Adds a dynamic default value to the column.
The function will be called when the row is inserted, and the returned value will be used as the column value.

**Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.

#### Parameters

##### fn

() => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \} *extends* `object` ? `U` : \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \}\[`"data"`\]

#### Returns

[`HasRuntimeDefault`](/core/api-reference/type-aliases/hasruntimedefault/)\<[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>

***

### $onUpdateFn()

> **$onUpdateFn**(`fn`): [`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:211

Adds a dynamic update value to the column.
The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.

**Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.

#### Parameters

##### fn

() => [`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \} *extends* `object` ? `U` : \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \}\[`"data"`\]

#### Returns

[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

***

### $type()

> **$type**\<`TType`\>(): [`$Type`](/core/api-reference/type-aliases/type/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>, `TType`\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:172

Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.

#### Type Parameters

##### TType

`TType`

#### Returns

[`$Type`](/core/api-reference/type-aliases/type/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>, `TType`\>

#### Example

```ts
const users = pgTable('users', {
	id: integer('id').$type<UserId>().primaryKey(),
	details: json('details').$type<UserDetails>().notNull(),
});
```

***

### default()

> **default**(`value`): [`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:186

Adds a `default <value>` clause to the column definition.

Affects the `insert` model of the table - columns *with* `default` are optional on insert.

If you need to set a dynamic default value, use [$defaultFn](/core/api-reference/classes/columnbuilder/#defaultfn) instead.

#### Parameters

##### value

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \} *extends* `object` ? `U` : \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \}\[`"data"`\]

#### Returns

[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

***

### generatedAlwaysAs()

> `abstract` **generatedAlwaysAs**(`as`, `config?`): [`HasGenerated`](/core/api-reference/type-aliases/hasgenerated/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>, \{ `type`: `"always"`; \}\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:226

#### Parameters

##### as

[`SQL`](/core/api-reference/classes/sql/)\<`unknown`\> \| `T`\[`"data"`\] \| (() => [`SQL`](/core/api-reference/classes/sql/))

##### config?

`Partial`\<[`GeneratedColumnConfig`](/core/api-reference/type-aliases/generatedcolumnconfig/)\<`unknown`\>\>

#### Returns

[`HasGenerated`](/core/api-reference/type-aliases/hasgenerated/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>, \{ `type`: `"always"`; \}\>

***

### notNull()

> **notNull**(): [`NotNull`](/core/api-reference/type-aliases/notnull/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:178

Adds a `not null` clause to the column definition.

Affects the `select` model of the table - columns *without* `not null` will be nullable on select.

#### Returns

[`NotNull`](/core/api-reference/type-aliases/notnull/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>

***

### primaryKey()

> **primaryKey**(): `TExtraConfig`\[`"primaryKeyHasDefault"`\] *extends* `true` ? [`IsPrimaryKey`](/core/api-reference/type-aliases/isprimarykey/)\<[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<[`NotNull`](/core/api-reference/type-aliases/notnull/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>\> : [`IsPrimaryKey`](/core/api-reference/type-aliases/isprimarykey/)\<[`NotNull`](/core/api-reference/type-aliases/notnull/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:225

Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.

In SQLite, `integer primary key` implicitly makes the column auto-incrementing.

#### Returns

`TExtraConfig`\[`"primaryKeyHasDefault"`\] *extends* `true` ? [`IsPrimaryKey`](/core/api-reference/type-aliases/isprimarykey/)\<[`HasDefault`](/core/api-reference/type-aliases/hasdefault/)\<[`NotNull`](/core/api-reference/type-aliases/notnull/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>\> : [`IsPrimaryKey`](/core/api-reference/type-aliases/isprimarykey/)\<[`NotNull`](/core/api-reference/type-aliases/notnull/)\<`ColumnBuilder`\<`T`, `TRuntimeConfig`, `TTypeConfig`, `TExtraConfig`\>\>\>
