---
editUrl: false
next: false
prev: false
title: "createTableRelationsHelpers"
---

> **createTableRelationsHelpers**\<`TTableName`\>(`sourceTable`): `object`

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/relations.d.ts:189

## Type Parameters

### TTableName

`TTableName` *extends* `string`

## Parameters

### sourceTable

[`AnyTable`](/core/api-reference/type-aliases/anytable/)\<\{ `name`: `TTableName`; \}\>

## Returns

`object`

### many

> **many**: \<`TForeignTable`\>(`referencedTable`, `config?`) => [`Many`](/core/api-reference/classes/many/)\<`TForeignTable`\[`"_"`\]\[`"name"`\]\>

#### Type Parameters

##### TForeignTable

`TForeignTable` *extends* [`Table`](/core/api-reference/classes/table/)\<[`TableConfig`](/core/api-reference/interfaces/tableconfig/)\<[`Column`](/core/api-reference/classes/column/)\<`any`, `object`, `object`\>\>\>

#### Parameters

##### referencedTable

`TForeignTable`

##### config?

###### relationName

`string`

#### Returns

[`Many`](/core/api-reference/classes/many/)\<`TForeignTable`\[`"_"`\]\[`"name"`\]\>

### one

> **one**: \<`TForeignTable`, `TColumns`\>(`table`, `config?`) => [`One`](/core/api-reference/classes/one/)\<`TForeignTable`\[`"_"`\]\[`"name"`\], [`Equal`](/core/api-reference/type-aliases/equal/)\<`TColumns`\[`number`\]\[`"_"`\]\[`"notNull"`\], `true`\>\>

#### Type Parameters

##### TForeignTable

`TForeignTable` *extends* [`Table`](/core/api-reference/classes/table/)\<[`TableConfig`](/core/api-reference/interfaces/tableconfig/)\<[`Column`](/core/api-reference/classes/column/)\<`any`, `object`, `object`\>\>\>

##### TColumns

`TColumns` *extends* \[[`AnyColumn`](/core/api-reference/type-aliases/anycolumn/)\<\{ `tableName`: `TTableName`; \}\>, `...AnyColumn<{ tableName: TTableName }>[]`\]

#### Parameters

##### table

`TForeignTable`

##### config?

[`RelationConfig`](/core/api-reference/interfaces/relationconfig/)\<`TTableName`, `TForeignTable`\[`"_"`\]\[`"name"`\], `TColumns`\>

#### Returns

[`One`](/core/api-reference/classes/one/)\<`TForeignTable`\[`"_"`\]\[`"name"`\], [`Equal`](/core/api-reference/type-aliases/equal/)\<`TColumns`\[`number`\]\[`"_"`\]\[`"notNull"`\], `true`\>\>
