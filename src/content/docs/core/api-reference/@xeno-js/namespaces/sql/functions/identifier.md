---
editUrl: false
next: false
prev: false
title: "identifier"
---

> **identifier**(`value`): [`Name`](/core/api-reference/classes/name/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:178

Create a SQL chunk that represents a DB identifier (table, column, index etc.).
When used in a query, the identifier will be escaped based on the DB engine.
For example, in PostgreSQL, identifiers are escaped with double quotes.

**WARNING: This function does not offer any protection against SQL injections, so you must validate any user input beforehand.**

## Parameters

### value

`string`

## Returns

[`Name`](/core/api-reference/classes/name/)

## Example

**\`\`\`ts
const query = sql\`SELECT \* FROM $\{sql.identifier('my-table')\}\`;
// 'SELECT \* FROM "my-table"'
\`\`\`**
