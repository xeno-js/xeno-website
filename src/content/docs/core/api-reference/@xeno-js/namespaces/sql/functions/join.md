---
editUrl: false
next: false
prev: false
title: "join"
---

> **join**(`chunks`, `separator?`): [`SQL`](/core/api-reference/classes/sql/)

Defined in: .temp/xeno-js/node\_modules/drizzle-orm/sql/sql.d.ts:165

Join a list of SQL chunks with a separator.

## Parameters

### chunks

[`SQLChunk`](/core/api-reference/type-aliases/sqlchunk/)[]

### separator?

[`SQLChunk`](/core/api-reference/type-aliases/sqlchunk/)

## Returns

[`SQL`](/core/api-reference/classes/sql/)

## Examples

```ts
const query = sql.join([sql`a`, sql`b`, sql`c`]);
// sql`abc`
```

```ts
const query = sql.join([sql`a`, sql`b`, sql`c`], sql`, `);
// sql`a, b, c`
```
