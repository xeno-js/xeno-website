---
title: Validation Pipeline
description: Learn how to enable validation for Xeno.JS commands and queries using the built-in Zod validator or custom validation strategies.
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
  answer: Configure validation.zod or validation.customValidationStrategy in the AppBuilder pipeline configuration.
- question: How do I register a Zod schema?
  answer: Add the schema to validation.zod.schemas using the request intent as the key.
- question: Where should I define the Zod schema for a command or query?
  answer: Define the schema in the corresponding CQRS command or query documentation, then register it in the validation pipeline during application bootstrap.
- question: Can I use validation without Zod?
  answer: Yes. Register one or more custom validation strategies through validation.customValidationStrategy.
- question: What happens when validation fails?
  answer: The validation pipeline returns a failed Result and does not execute the next pipeline stage or the handler.
- question: What happens if a Zod schema is not registered for an intent?
  answer: Xeno.JS logs a warning and continues without applying Zod validation for that request.
---

## Introduction

Use the Validation Pipeline to validate commands and queries before they reach the handler.

Xeno.JS supports two validation approaches:

* the built-in Zod validator;
* custom validation strategies.

The pipeline is used for both commands and queries.

> **Note:** This page explains how to enable and register validation. For creating the Zod schema itself, see the CQRS documentation for [Commands](../cqrs/command) and [Queries](../cqrs/query).

## Before you start

You need:

* an `AppBuilder` instance;
* a Command or Query;
* a request `intent`;
* a Zod schema registered for that intent, or a custom validation strategy.

If you are creating the request and its schema, start with:

* [Create a Command](../cqrs/command)
* [Create a Query](../cqrs/query)

## Enable validation

Validation is enabled through the `addPipeline()` configuration.

You do not need to register `ValidationPipeline` manually.

Configure either `validation.zod` or `validation.customValidationStrategy`:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {},
    }
  })
  .build()
```

If at least one validation strategy is configured, Xeno.JS adds validation to both the command and query pipelines.

You can also configure Zod and custom validation at the same time.

## Use the built-in Zod validator

Xeno.JS provides a Zod-based validator that can be configured during application bootstrap.

The configuration is a map where:

* the key is the request `intent`;
* the value is the corresponding Zod schema.

The intent is the identifier associated with the registered command or query handler.

### Register a Zod schema

For example, assume a command uses the intent:

```ts
CREATE_USER_HANDLER
```

Register its schema during bootstrap:

```ts
import { z } from 'zod'

import { AppBuilder } from '@xeno-js/shared'

import { createUserSchema } from './application/users/create-user.schema'

const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        CREATE_USER_HANDLER: createUserSchema,
      },
    }
  })
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

* [Create a Command](../cqrs/command)
* [Create a Query](../cqrs/query)

### Register multiple schemas

You can register schemas for multiple commands and queries in the same bootstrap configuration:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        CREATE_USER_HANDLER: createUserSchema,
        UPDATE_USER_HANDLER: updateUserSchema,
        GET_USER_HANDLER: getUserSchema,
      },
    }
  })
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
validation.zod.schemas
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

### Missing schema

A missing schema does **not** produce a validation failure.

If no schema is registered for the request intent, the built-in Zod validator:

1. logs a warning;
2. returns a successful validation result;
3. allows the request to continue.

The warning identifies the missing intent.

Therefore, if a request is expected to be validated with Zod, make sure its intent is present in `validation.zod.schemas`.

## Add custom validation

Use `validation.customValidationStrategy` when the validation logic cannot or should not be expressed as a Zod schema.

A custom validation strategy implements:

```ts
IStrategy<IRequest, boolean>
```

and exposes:

```ts
execute(request)
```

The method must return a `Result`.

### Basic custom validator

For example:

```ts
import type { IRequest, IStrategy } from '@xeno-js/shared'
import { AppError, Result } from '@xeno-js/shared'

const validateUser: IStrategy<IRequest, boolean> = {
  async execute(request) {
    const email = (request as { email?: string }).email

    if (!email?.endsWith('@example.com')) {
      return Result.fail(
        AppError.validationError(
          request.intent,
          'Email must use the @example.com domain',
        ),
      )
    }

    return Result.ok(true)
  },
}
```

Register the strategy during bootstrap:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.customValidationStrategy = [
      () => validateUser,
    ]
  })
  .build()
```

The factory function receives the active service scope.

This allows a custom strategy to resolve application services when validation requires dependencies.

For example:

```ts
import type {
  IRequest,
  IStrategy,
  IServiceScope,
} from '@xeno-js/shared'

import { AppError, Result } from '@xeno-js/shared'

const validateUser = (
  scope: IServiceScope,
): IStrategy<IRequest, boolean> => {
  const userRepository = scope.resolve('USER_REPOSITORY')

  return {
    async execute(request) {
      const email = (request as { email?: string }).email

      if (!email) {
        return Result.fail(
          AppError.validationError(
            request.intent,
            'Email is required',
          ),
        )
      }

      const exists = await userRepository.existsByEmail(email)

      if (exists) {
        return Result.fail(
          AppError.validationError(
            request.intent,
            'Email is already registered',
          ),
        )
      }

      return Result.ok(true)
    },
  }
}
```

Register it with the application:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.customValidationStrategy = [
      (scope) => validateUser(scope),
    ]
  })
  .build()
```

The exact dependency token and repository API depend on your application.

## Register multiple custom validators

You can register more than one custom validation strategy:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.customValidationStrategy = [
      (scope) => validateUser(scope),
      (scope) => validateAccount(scope),
      (scope) => validateBusinessRules(scope),
    ]
  })
  .build()
```

Strategies are executed in registration order.

If a strategy returns a failed `Result`, validation stops immediately and the remaining strategies are not executed.

The request also does not continue to the next pipeline stage or handler.

## Combine Zod and custom validation

Zod and custom strategies can be used together.

For example:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        CREATE_USER_HANDLER: createUserSchema,
      },
    }

    config.validation.customValidationStrategy = [
      (scope) => validateUser(scope),
    ]
  })
  .build()
```

This is useful when:

* Zod validates the structure and basic constraints of the request;
* custom validation checks application-specific rules.

For example:

```text
CREATE_USER_HANDLER
        │
        ▼
   Zod validation
        │
        ▼
 custom validation
        │
        ▼
     Handler
```

If any validation strategy fails, execution stops at that point.

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

For a Zod validation failure, Xeno.JS produces a validation error containing the validation details.

For example, a Zod schema failure can result in an error describing the invalid field:

```text
Validation failed for schema: [email] Invalid email address
```

Multiple Zod issues are combined into the validation error message.

The validation error uses the `VALIDATION_FAILED` error category and a `400` status.

## Validation for commands and queries

The same validation configuration is used for both commands and queries.

For example:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.validation.zod = {
      schemas: {
        CREATE_USER_HANDLER: createUserSchema,
        GET_USER_HANDLER: getUserSchema,
      },
    }
  })
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

* [Create a Command](../cqrs/command)
* [Create a Query](../cqrs/query)

## Troubleshooting

### Validation is not running

Check the following:

1. `addPipeline()` is called on the `AppBuilder`;
2. either `validation.zod` or `validation.customValidationStrategy` is configured;
3. the Zod schema is registered under the correct request `intent`;
4. the request is executed through the Xeno.JS mediator;
5. the request reaches the configured application pipeline.

### The Zod schema is never applied

Check the schema registry:

```ts
config.validation.zod = {
  schemas: {
    CREATE_USER_HANDLER: createUserSchema,
  },
}

// Check if you added the handler in the container with the same key
container.addScoped('CREATE_USER_HANDLER', () => new CreateUserHandler())

// Check if you are using the correct intent in the command or query
export class CreateUserCommand extends Command<null> {
  constructor() {
    super('CREATE_USER_HANDLER')
  }
}

// Che if you are using the correct key in the registry
export type MyRegistry {
  CREATE_USER_HANDLER: CreateUserHandler
}
```

Then check the request intent:

```ts
request.intent === 'CREATE_USER_HANDLER'
```

The two values must match exactly.

If the schema is missing for an intent, Xeno.JS logs a warning and continues without Zod validation.

### The custom validator is not running

Check that the strategy is registered through:

```ts
config.validation.customValidationStrategy = [
  (scope) => createCustomValidator(scope),
]
```

Also verify that:

* the factory returns an object implementing `execute()`;
* `execute()` returns a `Result`;
* the strategy is configured before `build()`.

### One custom validator prevents the others from running

This is expected when the previous validator returns a failed `Result`.

Validation stops at the first failure. This prevents the request from continuing to the handler or to subsequent validation strategies.

## Related docs

* [Application Overview](../overview)
* [Create a Command](../cqrs/command)
* [Create a Query](../cqrs/query)
* [Create a Handler](../cqrs/handler)
* [Exception Pipeline](./exception)
* [Performance Pipeline](./performance)
* [Logging Pipeline](./logging)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
