---
editUrl: false
next: false
prev: false
title: "DbContext"
---

> **DbContext**\<`TSchema`\> = `NodePgDatabase`\<`TSchema`\> \| `LibSQLDatabase`\<`TSchema`\> & `object`

Defined in: .temp/xeno-js/src/infrastructure/db/db.types.ts:15

## Type Parameters

### TSchema

`TSchema` *extends* [`Dictionary`](/core/api-reference/type-aliases/dictionary/) = [`Dictionary`](/core/api-reference/type-aliases/dictionary/)

## Description

Type definition for the database context used in the application.
Polymorphically handles both PostgreSQL and libSQL (SQLite/Turso) engines.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js
