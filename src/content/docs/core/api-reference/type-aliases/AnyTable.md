---
editUrl: false
next: false
prev: false
title: "AnyTable"
---

> **AnyTable**\<`TPartial`\> = [`Table`](/core/api-reference/classes/table/)\<[`UpdateTableConfig`](/core/api-reference/type-aliases/updatetableconfig/)\<[`TableConfig`](/core/api-reference/interfaces/tableconfig/), `TPartial`\>\>

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/table.d.ts:48

Any table with a specified boundary.

## Type Parameters

### TPartial

`TPartial` *extends* `Partial`\<[`TableConfig`](/core/api-reference/interfaces/tableconfig/)\>

## Example

```ts
   // Any table with a specific name
   type AnyUsersTable = AnyTable<{ name: 'users' }>;
   ```

To describe any table with any config, simply use `Table` without any type arguments, like this:

   ```ts
   function needsTable(table: Table) {
       ...
   }
   ```
