---
title: Validation Pipeline
description: Learn how to validate Xeno.JS commands and queries with the Zod integration or custom validation strategies.
keywords:
- Xeno.JS validation
- Xeno.JS validation pipeline
- Zod validation
- TypeScript validation
- CQRS validation
- command validation
- query validation
- custom validation
tags:
- application
- pipelines
- validation
- cqrs
faqs:
- question: How do I enable validation in Xeno.JS?
  answer: Pass withZodValidation() from @xeno-js/zod or withValidation() from @xeno-js/core to XenoAppBuilder.addPipeline().
- question: How do I register a Zod schema?
  answer: Configure withZodValidation() with a schemas object keyed by request intent.
- question: Where should I define the Zod schema for a command or query?
  answer: Define the schema in the corresponding CQRS command or query documentation, then register it in the validation pipeline during application bootstrap.
- question: Can I use validation without Zod?
  answer: Yes. Register one or more IStrategy instances with withValidation().
- question: What happens when validation fails?
  answer: The validation pipeline returns a failed Result and does not execute the next pipeline stage or the handler.
---

## Introduction

Use the Validation Pipeline to validate commands and queries before they reach the handler.

Xeno.JS supports two validation approaches:

- the Zod integration from `@xeno-js/zod`;
- custom validation strategies.

The pipeline is used for both commands and queries.

> **Note:** This page explains how to enable and register validation. For creating the Zod schema itself, see the CQRS documentation for [Commands](../cqrs/command) and [Queries](../cqrs/query).

## Before you start

You need:

- an `XenoAppBuilder` instance;
- a Command or Query;
- a request `intent`;
- a Zod schema registered for that intent, or a custom validation strategy.

If you are creating the request and its schema, start with:

- [Create a Command](../cqrs/command)
- [Create a Query](../cqrs/query)

## Enable validation

Add validation plugins to `XenoAppBuilder.addPipeline()`. The Zod plugin is provided by `@xeno-js/zod`; the generic validation plugin is provided by `@xeno-js/core`.

You do not need to register `ValidationPipeline` manually.

For Zod validation:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

const app = new XenoAppBuilder()
  .addPipeline(withZodValidation((options) => {
    options.schemas = {}
  }))
  .build()
```

For custom validation, pass strategy instances to `withValidation()`:

```ts
import { XenoAppBuilder, withValidation } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withValidation((strategies) => {
    strategies.push(validateUser)
  }))
  .build()
```

The configured validation strategy is added to the common pipeline, so it applies to both commands and queries.

## Use the Zod integration

The `@xeno-js/zod` package provides a Zod-based validator that you configure during application bootstrap with `withZodValidation()`.

The configuration is a map where:

- the key is the request `intent`;
- the value is the corresponding Zod schema.

The key must match the value exposed as the request's `intent`.

### Register a Zod schema

For example, assume a command uses the intent:

```ts
CREATE_USER_HANDLER
```

Register its schema during bootstrap:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

import { createUserSchema } from './application/users/create-user.schema'

const app = new XenoAppBuilder()
  .addPipeline(withZodValidation((options) => {
    options.schemas = {
      CREATE_USER_HANDLER: createUserSchema,
    }
  }))
  .build()
```

The schema itself belongs with the command or query it validates.

For example:

```text
src/
├── application/
│   └── users/
│       ├── create-user.command.ts
│       ├── create-user.handler.ts
│       └── create-user.schema.ts
└── app.ts
```

The schema can be defined in `create-user.schema.ts`:

```ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2),
})
```

The details of how the schema is associated with a Command or Query are documented in the corresponding CQRS guides:

- [Create a Command](../cqrs/command)
- [Create a Query](../cqrs/query)

### Register multiple schemas

You can register schemas for multiple commands and queries in the same bootstrap configuration:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

const app = new XenoAppBuilder()
  .addPipeline(withZodValidation((options) => {
    options.schemas = {
      CREATE_USER_HANDLER: createUserSchema,
      UPDATE_USER_HANDLER: updateUserSchema,
      GET_USER_HANDLER: getUserSchema,
    }
  }))
  .build()
```

Each request is validated against the schema registered for its `intent`.

## Understand schema lookup

The Zod validator uses the request `intent` to find its schema.

For example:

```text
Request
  intent: CREATE_USER_HANDLER
        │
        ▼
withZodValidation({ schemas })
        │
        └── CREATE_USER_HANDLER → createUserSchema
```

This means the registration key must match the request intent exactly.

If the request has:

```ts
{
  intent: 'CREATE_USER_HANDLER',
}
```

the schema must be registered as:

```ts
schemas: {
  CREATE_USER_HANDLER: createUserSchema,
}
```

The validation strategy passes the request intent and request to the configured validator service. The behavior for an intent with no registered schema depends on that validator service; this specific behavior cannot be verified from the current context.

## Add custom validation

Use `withValidation()` when the validation logic cannot or should not be expressed as a Zod schema.

A custom validation strategy implements:

```ts
IStrategy<IRequest, boolean>
```

and exposes:

```ts
execute(request)
```

The method returns a result. Return a failed `Result` to stop pipeline execution; the pipeline treats any successful result as validation success.

### Basic custom validator

For example:

```ts
import type { IRequest, IStrategy } from '@xeno-js/shared'
import { AppError, Result } from '@xeno-js/shared'

const validateUser: IStrategy<IRequest, boolean> = {
  async execute(request) {
    if (!('email' in request) || typeof request.email !== 'string') {
      return Result.fail(
        AppError.validationError(
          request.intent,
          'Email is required',
        ),
      )
    }

    return Result.ok(true)
  },
}
```

Register the strategy instance during bootstrap:

```ts
import { XenoAppBuilder, withValidation } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withValidation((strategies) => {
    strategies.push(validateUser)
  }))
  .build()
```

`withValidation()` accepts strategy instances in its setup callback; the provided plugin does not supply a service scope or create a strategy from a scope-aware factory. The exact approach for injecting dependencies into a strategy cannot be verified from the current context.

## Register multiple custom validators

You can register more than one custom validation strategy:

```ts
import { XenoAppBuilder, withValidation } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withValidation((strategies) => {
    strategies.push(validateUser, validateAccount, validateBusinessRules)
  }))
  .build()
```

Strategies in the array passed to a single `withValidation()` call are executed in array order.

The validation pipeline awaits each strategy in order. If a strategy returns a failed `Result`, validation stops immediately and the remaining strategies are not executed.

The request also does not continue to the next pipeline stage or handler.

## Combine Zod and custom validation

Zod and custom strategies can be used together.

For example:

```ts
import { XenoAppBuilder, withValidation } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

const app = new XenoAppBuilder()
  .addPipeline(
    withZodValidation((options) => {
      options.schemas = {
        CREATE_USER_HANDLER: createUserSchema,
      }
    }),
    withValidation((strategies) => {
      strategies.push(validateUser)
    }),
  )
  .build()
```

This is useful when:

- Zod validates the structure and basic constraints of the request;
- custom validation checks application-specific rules.

For example:

```text
CREATE_USER_HANDLER
        │
        ▼
 Validation strategies
        │
        ▼
     Handler
```

If any validation strategy fails, execution stops at that point. The exact ordering between separate validation plugins depends on pipeline assembly and is not specified by the implementation context provided here.

## What happens when validation succeeds?

When every configured validation strategy returns a successful `Result`, the request continues through the remaining pipeline and eventually reaches its handler.

Conceptually:

```text
Command / Query
      │
      ▼
Validation
      │
      ├── failed → Result.fail(...)
      │
      └── passed
            │
            ▼
       next pipeline
            │
            ▼
          Handler
```

The validation pipeline does not modify a successful request result. It allows execution to continue.

## What happens when validation fails?

A failed validation returns a failed `Result`.

The next pipeline stage is not executed, and the handler is not called.

For a Zod validation failure, the schema strategy converts the validator service's error into an `AppError.validationError`. The strategy prefixes the message with `Validation failed:`.

The strategy prefixes the validator service's error message, but its exact formatting cannot be verified from the current context.

## Validation for commands and queries

The same validation configuration is used for both commands and queries.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

const app = new XenoAppBuilder()
  .addPipeline(withZodValidation((options) => {
    options.schemas = {
      CREATE_USER_HANDLER: createUserSchema,
      GET_USER_HANDLER: getUserSchema,
    }
  }))
  .build()
```

Both requests can be validated through the same pipeline configuration:

```text
Command
  │
  └── Validation
        └── CREATE_USER_HANDLER → createUserSchema

Query
  │
  └── Validation
        └── GET_USER_HANDLER → getUserSchema
```

For request-specific schema definitions, see:

- [Create a Command](../cqrs/command)
- [Create a Query](../cqrs/query)

## Troubleshooting

### Validation is not running

Check the following:

1. `addPipeline()` is called on the `XenoAppBuilder`;
2. `withZodValidation()` or `withValidation()` is passed to `addPipeline()`;
3. the Zod schema is registered under the correct request `intent`;
4. the request is executed through the Xeno.JS mediator;
5. the request reaches the configured application pipeline.

### The Zod schema is never applied

Check the schema registry:

```ts
withZodValidation((options) => {
  options.schemas = {
    CREATE_USER_HANDLER: createUserSchema,
  }
})
```

The schema lookup uses the request `intent`. Check that it exactly matches the registry key:

```ts
request.intent === 'CREATE_USER_HANDLER'
```

The two values must match exactly.

The behavior when no schema exists for an intent depends on the validator service and cannot be verified from the current context.

### The custom validator is not running

Check that the strategy is registered through:

```ts
withValidation((strategies) => {
  strategies.push(validateUser)
})
```

Also verify that:

- the setup callback adds an `IStrategy` instance to the array;
- the strategy's `execute()` returns a successful or failed result;
- the plugin is passed to `addPipeline()` before `build()`.

### One custom validator prevents the others from running

This is expected when the previous validator returns a failed `Result`.

Validation stops at the first failure. This prevents the request from continuing to the handler or to subsequent validation strategies.

## Related docs

- [Application Overview](../overview)
- [Create a Command](../cqrs/command)
- [Create a Query](../cqrs/query)
- [Create a Handler](../cqrs/handler)
- [Exception Pipeline](./exception)
- [Performance Pipeline](./performance)
- [Logging Pipeline](./logging)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
