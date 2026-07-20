---
title: 'SQLite Database Integration & Security Manual'
description:
  'Comprehensive technical documentation for configuring, schema-binding, and
  securing SQLite database instances within the Xeno framework using Drizzle
  ORM.'
keywords:
  [
    'SQLite integration',
    'Drizzle ORM SQLite',
    'DbSqlLiteClientFactory',
    'XenoRegistry schemas',
    'file security',
    'libsql client',
    'database bootstrapping',
  ]
author: 'Xeno'
---

## SQLite Database Integration & Security Architecture

The database persistence layer polymorphically supports embedded storage systems
alongside traditional relational servers. By targeting local runtime execution
engines, the framework allows developers to alternate between high-throughput
cloud environments and lightweight embedded states while retaining uniform
database context primitives and transactional safety boundaries.

---

## How to Register and Configure SQLite with Drizzle

Registering SQLite within Xeno involves activating the polymorphic database
module via the AppBuilder fluent interface. By supplying a database
configuration object with the enableSqlLite flag activated, the bootstrapper
instantiates an underlying libSQL client driver, securely mapping the compiled
database context to the dependency graph.

The framework coordinates relational persistence through an explicit `DbContext`
abstraction type. When configured for SQLite, the engine transitions from the
default node-postgres pool infrastructure and initializes a lightweight client
container driven by the `@libsql/client` library behind the scenes.

### Key-Value Specification of SQLite Connection Parameters

- **enableSqlLite** — A boolean flag passed within the database configuration
  block that toggles the container from the default PostgreSQL client assembly
  to the specialized libSQL compiler loop.

- **connectionString** — The destination URI indicating either an in-memory
  database profile (`:memory:`) or a localized disk-bound database file-path
  directory.

### Implementing SQLite Bootstrapping Mechanics

During application startup, pass a `SetupAction` callback to the `.addDb()`
hosting method within the `AppBuilder` assembly loop to wire up the local
engine:

```typescript
// src/infrastructure/bootstrap-sqlite.ts
import { AppBuilder } from '@xeno/core'
import type { AppRegistry } from './xeno-registry/app-registry'

export const configureLocalPersistenceHost = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder
    // 1. Establish request-scoped asynchronous local storage boundaries
    .addContext()

    // 2. Programmatically register and configure the SQLite/libSQL engine
    .addDb((options, configuration) => {
      // Direct the bootstrapper to switch internal factories to SQLite mode
      options.enableSqlLite = true

      // Pull the secure file or connection endpoint from configuration services
      options.connectionString = configuration.getOrThrow('SQLITE_DATABASE_URL')
    })

  // Compile module queues and return the type-safe ServiceContainer
  return await builder.build()
}
```

---

## How to Build Schemas and Bind Them to XenoRegistry

Binding SQLite schemas to the application framework requires defining table
definitions using drizzle-orm libsql primitives. These schemas consolidate into
a unified structural configuration passed directly into the XenoRegistry generic
contract, ensuring compile-time type safety over database transactions and
entity mapping operations.

When building for embedded execution, table constraints must adapt to SQLite's
type boundaries. Developers author schemas using the `drizzle-orm/libsql`
package core, ensuring smooth transpilations across database context proxies.

### 1. Defining Drizzle SQLite Tables

```typescript
// src/infrastructure/db/sqlite-schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/libsql'

export const tenantsTable = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  workspaceToken: text('workspace_token').notNull().unique(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(1),
})

export type TenantSelectDto = typeof tenantsTable.$inferSelect
export type TenantInsertDto = typeof tenantsTable.$inferInsert
```

### 2. Compiling the Polymorphic AppRegistry Structure

Consolidate table definitions into a root schema shape and pass it directly to
the primary `XenoRegistry` generic contract. This automatically types the
internal `TOKENS.DB_CONTEXT` token and assures that all inline transactions map
smoothly to the polymorphic `DbTransaction` wrapper.

```typescript
// src/infrastructure/xeno-registry/app-registry.ts
import { type XenoRegistry, type IReadDao } from '@xeno/core'
import { tenantsTable } from '../db/sqlite-schema'
import { type Tenant } from '../../domain/entities/tenant'

export type SqliteSchema = {
  tenants: typeof tenantsTable
}

/**
 * AppRegistry specializes XenoRegistry with the SQLite database schema layout.
 * This guarantees type safety for both NodePgDatabase and LibSQLDatabase environments.
 */
export type AppRegistry = XenoRegistry<
  SqliteSchema,
  {
    TENANT_READ_DAO: IReadDao<Tenant>
  }
>
```

---

## How to Manage File Paths and File Security for SQLite

Securing embedded SQLite installations demands strict environment isolation,
absolute path sanitization, and strict directory permission rules. Developers
must store local database binaries outside the public application root, enforce
runtime process isolation, and apply appropriate filesystem access control lists
to prevent injection or corruption vulnerabilities.

Unlike connection-string reliances protected behind remote network firewalls, an
embedded database is entirely dependent on file-system boundaries. If file
layers are misconfigured, attackers could target database files through direct
downloads, local file inclusion (LFI) vulnerabilities, or arbitrary traversal
scripts.

### Key-Value Specification of File Security Controls

- **Directory Isolation** — Placing database files completely separate from
  version-controlled source files, static runtime configurations, and publicly
  accessible server root structures to prevent unauthorized raw database
  downloads.
- **Access Control Lists (ACL)** — Setting POSIX file system masks explicitly
  (e.g., `chmod 600` or `chmod 660`) to restrict database binary read and write
  access strictly to the specific operating system user profile running the
  Node.js application container process.
- **Path Sanitization** — Utilizing strict, absolute path compilation parameters
  (`path.resolve`) combined with node file-system invariants to block arbitrary
  directory-traversal injection vectors during runtime connection string
  instantiation.
