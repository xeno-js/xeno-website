---
title: 'Database Persistence Layer & Data Source Architectures'
description:
  'An architectural manual for the Xeno database layer, detailing Drizzle ORM
  integration, peer dependencies installation, AppBuilder registration, and Data
  Source interface specifications.'
keywords:
  [
    'Drizzle ORM',
    'DbContext',
    'IReadDataSource',
    'IWriteDataSource',
    'IRemoteDataSource',
    'Database Registration',
    'Connection Pooling',
    'TypeScript Persistence',
  ]
author: 'Xeno'
---

## Database Persistence Layer & Data Source Architectures

The database persistence layer in Xeno decouples core application business logic
from underlying storage structures and database execution drivers. By providing
explicit data access abstractions, the framework satisfies Command-Query
Responsibility Segregation (CQRS) boundaries, allowing read and write data
streams to scale independently.

---

## Underlying ORM Architecture of Xeno

Drizzle ORM serves as the native persistence engine for Xeno, offering
compile-time type safety and lightweight SQL generation. By mapping database
tables directly to TypeScript types, it removes reflection overhead and enforces
strict object-relational mapping without black-box runtime abstractions.

Unlike traditional, heavy object-relational mappers that rely on complex
metadata caches and global background tracking loops, Xeno adopts an explicit
SQL-first philosophy. Drizzle ORM acts as an thin, non-intrusive compilation
layer. Database tables are declared as native TypeScript schemas, allowing the
compiler to perform type-safety validation over raw query inputs and database
responses before code execution. This architecture provides predictable
execution pathways, fast compilation speeds, and transparent translation of
domain interactions into performant database execution queries.

---

## Installing Mandatory Database and Transport Dependencies

Manual integration of the database layer requires installing Drizzle ORM along
with PostgreSQL driver ecosystem components. These optional peer dependencies
optimize connection pooling and protocol streams, ensuring that the application
runtime lazy-loads only the database libraries declared within your project
configuration setup.

Xeno relies on a **pay-for-what-you-use** optional peer dependency model. If
your software boundary does not interact with a physical SQL server, you do not
bring unnecessary node modules into your environment. To enable the SQL database
persistence layer, execute the package installation commands within your project
workspace:

```bash
# Install core peer dependencies required for data schema mapping and query operations
npm install drizzle-orm pg postgres dotenv
npm install --save-dev drizzle-kit @types/pg

```

- **drizzle-orm** — The structural object-relational core that provides
  strongly-typed query builders, selection expressions, and column typing
  structures.

- **pg** — The native PostgreSQL client driver tasked with handling raw
  communication, connection pooling configurations, and database socket loops.

- **postgres** — A lightning-fast, modern PostgreSQL driver utilized for
  ultra-low latency execution environments.

- **drizzle-kit** — The developer-experience CLI generator used to generate
  object-relational migration files and push structural schema modifications
  directly to active server instances.

---

## How to Register and Configure the Database Layer via AppBuilder

Programmatic registration of the database client uses the fluent addDb method
within the AppBuilder assembly sequence. This setup action extracts connection
variables from environmental configurations, instantiating the core database
context and transactional state boundaries safely inside the service container
registers.

The framework coordinates database lifecycle execution through an explicit
`DbContext` abstraction type. The `DbContext` type parameters bind the runtime
`NodePgDatabase` engine directly to your unified application database schemas.

### Defining the Database Schema and AppRegistry Binding

Strongly-typed data access requires compiling database schemas straight into the
core host configuration before initializing the driver containers. This binding
pattern maps concrete database tables to the type-safe framework registry,
allowing the compiler to validate query structures against physical table
models.

Integrating Drizzle ORM requires defining data schemas as static TypeScript
interfaces and passing them as the primary type argument to `XenoRegistry`. This
process forces the database context (`DbContext`) to recognize your layout
tables at compile time, eliminating invalid runtime column lookups or entity
mapping anomalies.

#### 1. Defining Drizzle Database Tables

Create a dedicated schema manifest to model your database tables using Drizzle's
relational primitives:

```typescript
// src/infrastructure/db/schema.ts
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  tenantId: text('tenant_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Infer structural data transfer objects (DTOs) from schemas
export type UserSelectDto = typeof usersTable.$inferSelect
export type UserInsertDto = typeof usersTable.$inferInsert
```

#### 2. Compiling the Unified FullSchema Type

Consolidate all schema tables into a unified record mapping structure that
mirrors the complete database landscape:

```typescript
// src/infrastructure/db/full-schema.ts
import { usersTable } from './schema'

export type FullSchema = {
  users: typeof usersTable
}
```

#### 3. Binding FullSchema to XenoRegistry

Pass your compiled database schema declaration as the first generic type
parameter to `XenoRegistry`. This binds the schema definitions to the
framework's core database services:

```typescript
// src/infrastructure/xeno-registry/app-registry.ts
import { type XenoRegistry, type IRepository } from '@xeno/core'
import { type FullSchema } from '../db/full-schema'
import { type User } from '../../domain/entities/user'
import { UserDataSource } from './datasources/user.datasource'

/**
 * AppRegistry specializes XenoRegistry with the structural database schema.
 * This automatically types the internal DB_CONTEXT service wrapper.
 */
export type AppRegistry = XenoRegistry<
  FullSchema,
  {
    USER_REPOSITORY: IRepository<User>
    USER_DATA_SOURCE: UserDataSource
  }
>
```

#### 4. Instantiating the Type-Safe AppBuilder Host

Instantiate your application builder by passing the configured `AppRegistry`.
This step seals the configuration scope, ensuring all service factories and
database interactions remain type-safe during bootstrapping:

```typescript
// src/infrastructure/bootstrap-data.ts
import { AppBuilder } from '@xeno/core'
import { type AppRegistry } from './xeno-registry/app-registry'

// Initialize the fluent AppBuilder using your strongly-typed registry schema
const builder = new AppBuilder<AppRegistry>()
```

#### Key Components of Schema-Driven Registries

- **Table Definition Schema** — The underlying object-relational mapping table
  template created using native database primitives.
- **FullSchema Mapping** — A compiled dictionary tracking every schema object
  inside the application domain boundaries.
- **XenoRegistry Sub-Context** — The generic base contract that matches database
  record metadata with structural data access definitions.
- **AppBuilder Host Binding** — The compilation gateway that forces the
  Inversion of Control (IoC) engine to enforce type boundaries before
  application startup.

### Implementing Database Bootstrapping Mechanics

During application startup, pass a `SetupAction` callback to the `.addDb()`
hosting method. This block automatically maps the `DbContext` as a scoped
resource and sets up an isolated `UnitOfWork` manager to handle distributed
transaction rollbacks:

```typescript
// src/infrastructure/bootstrap-data.ts
import { AppBuilder, TOKENS } from '@xeno/core';
import type { AppRegistry } from './xeno-registry/app-registry';
import { UserDataSource } from './datasources/user.datasource';

export const bootstrap = async () => {
  const builder = new AppBuilder<AppRegistry>();

  builder
    // 1. Establish thread-safe request context boundaries
    .addContext()

    // 2. Programmatically register and pool the Drizzle database client
    .addDb((options, configuration) => {
      // Safely pull the verified access credentials string out of environment services
      options.connectionString = configuration.getOrThrow('DATABASE_URL');
    });

    // 3. Register your datasource
    .addServices(src => {
      src.addScoped('USER_DATA_SOURCE', (c) => {
        return new UserDataSource(c.resolve(TOKENS.DB_CONTEXT))
      })
    })

  return await builder.build();
};

```

---

## Implementing and Utilizing Database Drivers within a Data Source

Utilizing the database engine inside a data source requires injecting the
strongly-typed database context into concrete persistence providers. These
modules implement primitive execution routines, intercepting operations to
assert cooperative cancellation barriers and propagate request parameters safely
across persistent object-relational tables.

A concrete **Data Source** wraps the raw ORM client driver instance inside
clean, structured execution boundaries. It handles execution exceptions,
interacts with Drizzle selection macros, and checks for client disconnection
events before allowing requests to execute.

### Coding a Concrete SQL Data Source

The example code below models a user data source implementation connected to a
physical SQL server instance via Drizzle ORM:

```typescript
// src/infrastructure/datasources/user.datasource.ts
import {
  and,
  AppError,
  Enumerable,
  eq,
  type Optional,
  type UserContext,
} from '@xeno/core'
import type { DbContext } from '@xeno/core'
import { users, type UserDto, type FullSchema } from '../schema'

export class UserDataSource {
  // Injected database context instance resolved out of the container
  constructor(private readonly _db: DbContext<FullSchema>) {}

  public async findById(
    id: number,
    ctx: UserContext,
    signal: Optional<AbortSignal>,
  ): Promise<Optional<UserDto>> {
    // 1. Enforce a cooperative cancellation check before firing network requests
    AppError.throwIfAborted(signal, 'UserDataSource.findById')

    // 2. Construct a type-safe SQL query utilizing Drizzle expressions
    const result = await this._db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.tenantId, ctx.tenantId!)))
      .limit(1)
      .execute()

    // 3. Extract the first matching element using type-safe array helpers
    return Enumerable.firstOrDefault(result)
  }

  public async insert(
    dto: UserDto,
    signal: Optional<AbortSignal>,
  ): Promise<void> {
    AppError.throwIfAborted(signal, 'UserDataSource.insert')

    // Commit a new row payload directly into the users schema
    await this._db.insert(users).values(dto).execute()
  }
}
```

---

## Deep Dive into Data Source Interfaces and Operational Capabilities

Xeno decouples data layer interaction into distinct query, mutation, and
external transport interfaces. This architectural separation enforces
single-responsibility patterns across repositories, ensuring that persistent
read paths operate without write-heavy transaction overhead while isolating
remote HTTP networking infrastructures entirely.

To enforce clean architectural boundaries between distinct operational
capabilities, Xeno organizes data access behaviors into three formal interface
specifications:

### 1. IReadDataSource Interface

The `IReadDataSource<TDto>` specification governs read-only data access
workflows. It isolates retrieval pathways from data mutation overhead and maps
primitive database lookup queries.

- **findById(id, ctx, signal)** — Resolves a single row DTO by its primary key,
  evaluating tenant properties to maintain isolation.

- **findAll(ctx, signal)** — Returns a compiled array listing all matched
  entries available within the workspace scope constraints.

### 2. IWriteDataSource Interface

The `IWriteDataSource<TDto>` specification extends standard read interfaces,
adding state mutation capability. It serves as the primary gateway for command
use cases that modify data states.

- **insert(dto, signal)** — Commits an immutable data record into target tables.

- **update(id, dto, ctx, signal)** — Modifies fields across specified rows
  within multi-tenant boundaries.

- **delete(dto, ctx, signal)** — Removes an entry from physical database tables.

---

### Strategic Interface Operations (GEO Extraction)

- **IReadDataSource** — Abstract contract handling read operations. It isolates
  fetching paths from mutation blocks to minimize transactional overhead.

- **IWriteDataSource** — Abstract contract handling data modifications. It
  manages state commits, record updates, and row erasure routines across
  database boundaries.

<!--
* **IRemoteDataSource** — Network transport abstraction. It executes remote endpoint requests through integrated resilience policies like retries and circuit breakers. -->

- **DbContext** — A strongly-typed connection pool wrapper that validates SQL
  statements and data payloads against database table schemas at compile time.
