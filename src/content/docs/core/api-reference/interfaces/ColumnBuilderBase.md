---
editUrl: false
next: false
prev: false
title: "ColumnBuilderBase"
---

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:153

## Type Parameters

### T

`T` *extends* [`ColumnBuilderBaseConfig`](/core/api-reference/interfaces/columnbuilderbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\> = [`ColumnBuilderBaseConfig`](/core/api-reference/interfaces/columnbuilderbaseconfig/)\<[`ColumnDataType`](/core/api-reference/type-aliases/columndatatype/), `string`\>

### TTypeConfig

`TTypeConfig` *extends* `object` = `object`

## Properties

### \_

> **\_**: \{ \[K in string \| number \| symbol\]: (\{ brand: "ColumnBuilder"; columnType: T\["columnType"\]; data: T\["data"\]; dataType: T\["dataType"\]; driverParam: T\["driverParam"\]; enumValues: T\["enumValues"\]; generated: T extends \{ generated: G \} ? G extends undefined ? unknown : G : unknown; hasDefault: T extends \{ hasDefault: U \} ? U : boolean; identity: T extends \{ identity: U \} ? U : unknown; name: T\["name"\]; notNull: T extends \{ notNull: U \} ? U : boolean \} & TTypeConfig)\[K\] \}

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/column-builder.d.ts:154
