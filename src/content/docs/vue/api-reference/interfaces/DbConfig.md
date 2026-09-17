---
editUrl: false
next: false
prev: false
title: "DbConfig"
---

Defined in: .temp/xeno-shared/dist/domain/config/db.config.d.ts:11

## Description

Configuration options for the Database Module.
Contains the connection string for PostgreSQL and a dictionary mapping schema names to Drizzle PgTable definitions.

  *
  *

## Author

Xeno
  *

## Version

1.0.0
  *

## Since

2025-09-30
  *

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### connectionString

> **connectionString**: `string`

Defined in: .temp/xeno-shared/dist/domain/config/db.config.d.ts:19

#### Description

The connection string used to connect to the PostgreSQL database. This should include the necessary credentials and connection details (e.g., host, port, database name, username, password) required for establishing a connection to the database.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### enableSqlLite

> **enableSqlLite**: `boolean`

Defined in: .temp/xeno-shared/dist/domain/config/db.config.d.ts:27

#### Description

A boolean flag indicating whether to enable SQLite support in the database configuration. If set to true, the application will be configured to use SQLite as the underlying database engine, allowing for lightweight and file-based database operations. This option is useful for scenarios where a full-fledged PostgreSQL server is not required or when running in environments with limited resources.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
