---
slug: core/database/base-datasource
title: Base Data Sources and Type Safety in Xeno
description: Learn how to implement data sources using Xeno's BasePostgresSqlDataSource and BaseSqliteSqlDataSource to ensure strict Drizzle ORM type safety in Clean Architecture.
authors:
  - Xeno Team
tags:
  - database
  - clean-architecture
  - ddd
  - typescript
  - drizzle
---

## Base Data Sources & Type Safety

In a Clean Architecture setup, the infrastructure layer is responsible for database communication.To maintain strict type safety with Drizzle ORM while avoiding union - type resolution conflicts between different SQL engines, Xeno provides specialized base classes: **`BasePostgresSqlDataSource`** and **`BaseSqliteSqlDataSource`**.

This guide explains how to implement domain contracts and choose the correct base data source according to your target database driver.

---

## Architecture Overview

A Data Source sits strictly within the **Infrastructure Layer**.It implements a persistence contract defined by the Domain layer(e.g., `IUserDataSource`) and uses Drizzle ORM via `this.db` to execute queries safely.

Depending on your database setup, you extend either:

* **\`BasePostgresSqlDataSource\`** for PostgreSQL(`NodePgDatabase`)
* **\`BaseSqliteSqlDataSource\`** for SQLite / libSQL(`LibSQLDatabase`)

---

## Implementation Guide

### Step 1: Implement the Contract

Your data source class must implement the specific persistence contract expected by your repository.

### Step 2: Extend the Appropriate Base Class

Pass your database schema to the generic base class. This automatically types `this.db` to your specific driver, giving you full autocompletion and compile - time safety without any manual casting.

---

## 3. Code Example(`UserDataSource`)

Below is an example of a concrete implementation using PostgreSQL:

```typescript
import {  } from '@xeno-js/core'
import type { IWriteDataSource, Optional, UserContext } from '@xeno-js/core'
import { AppError, and, Enumerable, eq, Guards } from '@xeno-js/core'
import { UserDto, users } from '../schemas/user.schema'
import type { DbSchema } from '../../../schema'
import { BasePostgresSqlDataSource } from './base-postgres-sql.datasource'

export class UserDataSource extends BasePostgresSqlDataSource<DbSchema> implements IWriteDataSource<UserDto> {
    
    public async findById(
        id: string | number, 
        ctx: UserContext, 
        signal: Optional<AbortSignal>
    ): Promise<Optional<UserDto>> {
        AppError.throwIfAborted(signal, 'UserDataSource.findById')
        
        const conditions = [eq(users.id, String(id))]
        if (Guards.isDefined(ctx.tenantId)) {
            conditions.push(eq(users.tenantId, ctx.tenantId))
        }

        // 'this.db' is fully typed as NodePgDatabase<DbSchema>
        const result = await this.db
            .select()
            .from(users)
            .where(and(...conditions))
            .limit(1)
            .execute()
            
        return Enumerable.firstOrDefault(result)
    }

    // Implement remaining methods (findAll, insert, update, delete, etc.)
}

```

---

## Summary of Base Classes

| Database Engine | Base Class to Extend | Inferred Type for `this.db` |
| --- | --- | --- |
| **PostgreSQL** | `BasePostgresSqlDataSource<TSchema>` | `NodePgDatabase<TSchema>` |
| **SQLite / libSQL** | `BaseSqliteSqlDataSource<TSchema>` | `LibSQLDatabase<TSchema>` |

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)