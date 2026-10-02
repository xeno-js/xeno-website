---
title: Creating Zod Schemas for Commands and Queries
description: Learn how to create Xeno.JS Zod schemas for commands and queries with ZodUtils without manually defining the request metadata and query cache options.
keywords:
- Xeno.JS ZodUtils
- Xeno.JS Zod schema
- command schema
- query schema
- CQRS validation
- Zod validation
- TypeScript Zod
tags:
- application
- cqrs
- validation
- zod
faqs:
- question: How do I create a Zod schema for a Xeno.JS command?
  answer: Use ZodUtils.createCommandSchema() and pass the command intent and the additional command fields.
- question: How do I create a Zod schema for a Xeno.JS query?
  answer: Use ZodUtils.createQuerySchema() and pass the query intent and the additional query fields.
- question: Do I need to add intent and type to the schema manually?
  answer: No. ZodUtils adds the correct intent and request type to the base schema automatically.
- question: Do query schemas include cache options?
  answer: Yes. ZodUtils.createQuerySchema() adds the cacheOptions object to the base query schema automatically.
- question: What should I pass as the second argument to ZodUtils?
  answer: Pass a ZodRawShape containing only the fields specific to your command or query, not a complete z.object() schema.
---

## Introduction

When you validate Xeno.JS commands and queries with Zod, use `ZodUtils` to create the schema instead of manually rebuilding the request metadata.

`ZodUtils` is exported by `@xeno-js/shared` and provides:

* `createCommandSchema()` for commands;
* `createQuerySchema()` for queries.

Both helpers combine your application-specific fields with the Xeno.JS base schema and return a strict Zod object.

This means you do not need to manually add:

* `intent`;
* `type`;
* query `cacheOptions`.

## Before you start

You need:

* `@xeno-js/shared`;
* `zod`;
* a Command or Query;
* the Zod validation pipeline enabled;
* a schema registered under the same `intent` as the request.

For validation configuration, see [Validation Pipeline](../pipelines/validation).

---

## Create a Command Schema

Use `ZodUtils.createCommandSchema()` when creating a schema for a `Command`.

```ts
import { z } from 'zod'
import { ZodUtils } from '@xeno-js/shared'

const createUserSchema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
    name: z.string().min(1),
  },
)
```

The second argument is the command-specific Zod shape.

You should **not** wrap it in `z.object()`.

### What ZodUtils adds

The resulting schema includes the fields required by the Xeno.JS command contract:

```ts
{
  intent: z.literal('CreateUserCommand'),
  type: z.literal(REQUEST_TYPE.COMMAND),
  email: z.string().email(),
  name: z.string().min(1),
}
```

You only define the fields belonging to your command.

This avoids repeating request metadata in every schema.

---

## Create a Query Schema

Use `ZodUtils.createQuerySchema()` for a `Query`.

```ts
import { z } from 'zod'
import { ZodUtils } from '@xeno-js/shared'

const getUserSchema = ZodUtils.createQuerySchema(
  'GetUserQuery',
  {
    userId: z.string().uuid(),
  },
)
```

The generated schema includes:

```ts
{
  intent: z.literal('GetUserQuery'),
  type: z.literal(REQUEST_TYPE.QUERY),
  cacheOptions: {
    cacheKey: z.string().min(1),
    ttl: z.number().int().positive().optional(),
    bypassCache: z.boolean().optional(),
    consistentRead: z.boolean().optional(),
    isUserScoped: z.boolean()
  },
  userId: z.string().uuid(),
}
```

You therefore do not need to add `intent`, `type`, or `cacheOptions` to your application-specific shape.

---

## Add Query Cache Options

A Xeno.JS `Query` contains `cacheOptions`.

For example:

```ts
import { Query } from '@xeno-js/shared'

export class GetUserQuery extends Query<User> {
  constructor(
    public readonly userId: string,
  ) {
    super('GetUserQuery', {
      cacheKey: `user:${userId}`,
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: false
    })
  }
}
```

The generated query schema validates these cache options automatically.

### Available cache options

| Property         | Required | Description                                     |
| ---------------- | -------- | ----------------------------------------------- |
| `cacheKey`       | Yes      | Key used to identify the cached result.         |
| `ttl`            | No       | Cache lifetime in seconds.                      |
| `bypassCache`    | No       | Bypasses a cached value for the request.        |
| `consistentRead` | No       | Requests a read that bypasses the cached value. |
| `isUserScoped`   | yes      | Whether the cache is user-scoped.               |

`cacheKey` must be a non-empty string.

`ttl`, when provided, must be a positive integer.

---

## Add Only Application-Specific Fields

The purpose of `ZodUtils` is to let the schema focus on the data defined by your command or query.

For example, given:

```ts
export class CreateUserCommand extends Command<User> {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {
    super('CreateUserCommand')
  }
}
```

create the schema with:

```ts
const createUserSchema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
    name: z.string().min(1),
  },
)
```

Do not repeat:

```ts
intent: z.literal('CreateUserCommand'),
type: z.literal(...),
```

Those fields are provided by `ZodUtils`.

---

## Do Not Pass a Complete `z.object()`

`ZodUtils` expects a `ZodRawShape`, not an already-created Zod object.

Use:

```ts
const schema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
    name: z.string().min(1),
  },
)
```

Not:

```ts
const schema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  z.object({
    email: z.string().email(),
    name: z.string().min(1),
  }),
)
```

The helper creates and extends the base Zod object itself.

---

## Register the Schema

Once the schema is created, register it under the same command or query `intent`.

For example:

```ts
import { z } from 'zod'
import { AppBuilder } from '@xeno-js/core'
import { ZodUtils } from '@xeno-js/shared'

const createUserSchema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
    name: z.string().min(1),
  },
)

const getUserSchema = ZodUtils.createQuerySchema(
  'GetUserQuery',
  {
    userId: z.string().uuid(),
  },
)

const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        CreateUserCommand: createUserSchema,
        GetUserQuery: getUserSchema,
      },
    }
  })
```

The schema registry is keyed by request `intent`.

Therefore:

```ts
super('CreateUserCommand')
```

must correspond to:

```ts
CreateUserCommand: createUserSchema
```

Likewise:

```ts
super('GetUserQuery', ...)
```

must correspond to:

```ts
GetUserQuery: getUserSchema
```

---

## Complete Command Example

A command schema can be kept next to the command:

```text
src/
└── application/
    └── users/
        ├── create-user.command.ts
        └── create-user.schema.ts
```

### `create-user.command.ts`

```ts
import { Command } from '@xeno-js/shared'

export class CreateUserCommand extends Command<User> {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {
    super('CreateUserCommand')
  }
}
```

### `create-user.schema.ts`

```ts
import { z } from 'zod'
import { ZodUtils } from '@xeno-js/shared'

export const createUserSchema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
    name: z.string().min(1),
  },
)
```

### `bootstrap.ts`

```ts
import { AppBuilder } from '@xeno-js/core'
import { createUserSchema } from './application/users/create-user.schema'

const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        CreateUserCommand: createUserSchema,
      },
    }
  })

await app.build()
```

---

## Complete Query Example

For a query, define the query-specific fields and let `ZodUtils` add the request and cache fields.

```text
src/
└── application/
    └── users/
        ├── get-user.query.ts
        └── get-user.schema.ts
```

### `get-user.query.ts`

```ts
import { Query } from '@xeno-js/shared'

export class GetUserQuery extends Query<User> {
  constructor(
    public readonly userId: string,
  ) {
    super('GetUserQuery', {
      cacheKey: `user:${userId}`,
      ttl: 60,
      bypassCache: false,
      consistentRead: false,
      isUserScoped: false,
    })
  }
}
```

### `get-user.schema.ts`

```ts
import { z } from 'zod'
import { ZodUtils } from '@xeno-js/shared'

export const getUserSchema = ZodUtils.createQuerySchema(
  'GetUserQuery',
  {
    userId: z.string().uuid(),
  },
)
```

### `src/bootstrap.ts`

```ts
import { AppBuilder } from '@xeno-js/core'
import { getUserSchema } from './application/users/get-user.schema'

const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        GetUserQuery: getUserSchema,
      },
    }
  })

await app.build()
```

---

## Understand Strict Validation

`ZodUtils` calls `.strict()` on the resulting schema.

This means properties that are not part of the generated schema are rejected.

For example:

```ts
const schema = ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
  },
)
```

The schema does not accept an arbitrary additional property such as:

```ts
{
  email: 'john@example.com',
  unexpectedField: true,
}
```

Define every application-specific property that the request is expected to contain.

You should also avoid manually adding the base properties because `ZodUtils` already provides them.

---

## Troubleshooting

### `intent` validation fails

Check that the intent used by the request exactly matches the intent passed to `ZodUtils`.

For example:

```ts
super('CreateUserCommand')
```

must use:

```ts
ZodUtils.createCommandSchema('CreateUserCommand', ...)
```

Intent matching is exact.

---

### `type` validation fails

Do not manually define the `type` field.

Use the correct helper:

```ts
ZodUtils.createCommandSchema(...)
```

for commands and:

```ts
ZodUtils.createQuerySchema(...)
```

for queries.

The helpers add the appropriate request type automatically.

---

### Query validation fails on `cacheOptions`

Check that the query provides a `cacheOptions` object with a non-empty:

```ts
cacheKey
```

For example:

```ts
super('GetUserQuery', {
  cacheKey: `user:${userId}`,
})
```

If `ttl` is provided, it must be a positive integer.

---

### Validation rejects an unexpected property

The generated schema is strict.

Make sure the property is included in the shape passed to `ZodUtils`.

For example:

```ts
ZodUtils.createQuerySchema('GetUserQuery', {
  userId: z.string().uuid(),
})
```

If the request contains another application-specific property, add it to the shape.

---

### The schema is not being used

Check:

1. the Zod validation pipeline is enabled;
2. the schema is registered under the request `intent`;
3. the request's `intent` exactly matches the registry key;
4. the request is executed through the configured mediator;
5. the installed `@xeno-js/shared` version exposes `ZodUtils`.

See [Validation Pipeline](../pipelines/validation) for the complete validation configuration.

---

## When to Use `ZodUtils`

Use `ZodUtils` whenever you create a Zod schema for a Xeno.JS CQRS command or query.

It keeps the schema definition focused on application data:

```ts
ZodUtils.createCommandSchema(
  'CreateUserCommand',
  {
    email: z.string().email(),
    name: z.string().min(1),
  },
)
```

instead of duplicating Xeno.JS request metadata:

```ts
z.object({
  intent: z.literal('CreateUserCommand'),
  type: ...,
  email: z.string().email(),
  name: z.string().min(1),
})
```

For queries, it also supplies the base `cacheOptions` schema.

---

## Related Documentation

* [Creating Commands](./command)
* [Creating Queries](./query)
* [Validation Pipeline](../pipelines/validation)
* [Creating Handlers](./handler)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
