---
title: Creating Commands
description: Create, validate, register, and execute Xeno.JS CQRS commands, and invalidate cached query results after successful writes.
keywords:
- Xeno.JS commands
- TypeScript commands
- CQRS commands
- Xeno.JS CQRS
- command validation
- command handlers
- command cache invalidation
- query cache
tags:
- application
- cqrs
- command
- validation
faqs:
- question: How do I create a Command in Xeno.JS?
  answer: Extend the Command class, define the command data as properties, and pass the command intent to super().
- question: What is the Command intent?
  answer: The intent is the string identifier used to identify the Command and resolve its Handler.
- question: Do I need to set the Command type manually?
  answer: No. Command sets type to REQUEST_TYPE.COMMAND automatically.
- question: How do I register a Command Handler?
  answer: Register the handler in the service container using the Command intent as its token.
- question: How do I execute a Command?
  answer: Call mediator.send(command, signal) inside an active service scope; use runInScope for operations outside an existing request.
- question: Can I validate a Command with Zod?
  answer: Yes. Add the withZodValidation plugin to addPipeline and register a schema under the Command intent.
- question: Can Commands use idempotency or concurrency handling?
  answer: Yes. Add withIdempotency or withConcurrency to addPipeline to configure the Command pipeline.
- question: How can a Command invalidate cached query results?
  answer: Enable withQueryCaching() and set cacheInvalidation keys or patterns on the Command. Use the actual stored cache keys, including their context.
---

## Introduction

Use a Command to represent an application operation that the Xeno.JS CQRS pipeline sends to its Handler. A Command can also declare cache keys or patterns to invalidate when query caching is enabled.

A Command consists of:

1. a class extending `Command`;
2. an `intent` identifying the Command;
3. the data required by the operation;
4. a Handler registered with the same intent;
5. optionally, validation and other Command pipeline features.

## Before you start

You need:

- an `XenoAppBuilder`;
- the CQRS pipeline enabled with `addPipeline()`;
- a Command class;
- a Handler registered with the Command intent;
- execution within an active service scope (or use of `runInScope()` outside an existing request).

If you want validation, you also need a Zod schema.

## Enable CQRS

`addPipeline()` registers the CQRS infrastructure used to execute Commands and Queries.

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline()

await app.build()
```

Pass pipeline plugins to `addPipeline()` to enable optional behaviors such as validation, idempotency, concurrency, or performance tracking. The CQRS module also includes exception handling and logging behaviors.

---

## Create a Command

Extend the `Command` class and pass the Command intent to `super()`.

```ts
import { Command } from '@xeno-js/core'

export class CreateUserCommand extends Command<User> {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {
    super('CreateUserCommand')
  }
}
```

The `Command` base class automatically sets:

```ts
command.type === REQUEST_TYPE.COMMAND
```

Define the data required by the application operation. The optional second constructor argument can also declare cache keys or patterns to invalidate after a successful Command, when query caching is enabled. These must match the stored keys, including their context:

```ts
super('CreateUserCommand', {
  keys: ['users:list:public'],
})
```

This key matches a query whose logical key is `users:list`, whose `isUserScoped` is `false`, and whose active identity has no tenant. For tenant or user-scoped keys, use the configured key builder as described in [Cache invalidation for Commands](#add-cache-invalidation-to-a-command).

The `intent` identifies the Command and is used to resolve its Handler and any intent-specific pipeline configuration.

In this example:

```ts
super('CreateUserCommand')
```

means that the Handler must be registered with:

```text
CreateUserCommand
```

as its service token.

## Define the Command data

Command properties should contain the input required by the application operation.

For example:

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

The resulting Command contains:

```ts
{
  intent: 'CreateUserCommand',
  type: 'COMMAND',
  email: 'john@example.com',
  name: 'John Doe',
}
```

You do not need to manually add `intent` or `type` to the class.

---

## Add Command validation

If the Command accepts external input, add a validation plugin to `addPipeline()` to validate it before the Handler runs.

First enable validation:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

const app = new XenoAppBuilder().addPipeline(
  withZodValidation((options) => {
    options.schemas = {}
  }),
)

await app.build()
```

Then register the schema using the Command intent as the key.

For example:

```ts
import { z } from 'zod'
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

const createUserSchema = z.object({
  intent: z.literal('CreateUserCommand'),
  type: z.literal('COMMAND'),
  email: z.string().email(),
  name: z.string().min(1),
})

const app = new XenoAppBuilder().addPipeline(
  withZodValidation((options) => {
    options.schemas = {
      CreateUserCommand: createUserSchema,
    }
  }),
)

await app.build()
```

The schema key must match:

```ts
super('CreateUserCommand')
```

The validation pipeline uses the Command's `intent` to select the schema.

### Keep schemas next to the Command

For larger applications, keep the Command and its schema together:

```text
src/
└── application/
    └── users/
        ├── create-user.command.ts
        └── create-user.schema.ts
```

For example:

```ts
// create-user.schema.ts

import { z } from 'zod'

export const createUserSchema = z.object({
  intent: z.literal('CreateUserCommand'),
  type: z.literal('COMMAND'),
  email: z.string().email(),
  name: z.string().min(1),
})
```

Then register it during application bootstrap:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withZodValidation } from '@xeno-js/zod'

import { createUserSchema } from './application/users/create-user.schema'

const app = new XenoAppBuilder().addPipeline(
  withZodValidation((options) => {
    options.schemas = {
      CreateUserCommand: createUserSchema,
    }
  }),
)

await app.build()
```

For more details about validation behavior and custom validation, see [Validation](../pipelines/validation).

---

## Create the Command Handler

A Command must have a Handler registered with the same intent.

For the previous example:

```ts
super('CreateUserCommand')
```

the Handler must be registered as:

```text
CreateUserCommand
```

A Handler extends `BaseHandler` and implements `executeAsync()`.

```ts
import { BaseHandler } from '@xeno-js/core'
import { Result, type ResultType } from '@xeno-js/shared'

import type { CreateUserCommand, User } from './create-user.command'

export class CreateUserHandler extends BaseHandler<
  CreateUserCommand,
  User
> {
  protected async executeAsync(
    request: CreateUserCommand,
  ): Promise<ResultType<User>> {
    const user = {
      id: crypto.randomUUID(),
      email: request.email,
      name: request.name,
    }

    return Result.ok(user)
  }
}
```

See [Creating Handlers](./handler) for the complete Handler configuration and dependency injection patterns.

---

## Register the Handler

Register the Handler in the service container using the Command intent. `BaseHandler` requires a user-context factory; the context module provides it under `TOKENS.USER_CONTEXT_FACTORY`.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { TOKENS } from '@xeno-js/shared'

import { CreateUserHandler } from './application/users/create-user.handler'

const app = new XenoAppBuilder()
  .addServices((container) => {
    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve(TOKENS.USER_CONTEXT_FACTORY),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

The registration token:

```ts
'CreateUserCommand'
```

must match the Command intent:

```ts
super('CreateUserCommand')
```

If the names do not match, Xeno.JS cannot resolve the Handler when the Command is executed.

### Register Handler dependencies

If your Handler requires application services, resolve them from the active service scope.

For example:

```ts
export class CreateUserHandler extends BaseHandler<
  CreateUserCommand,
  User
> {
  constructor(
    identityFactory: IFactory<void, UserContext>,
    private readonly userRepository: UserRepository,
  ) {
    super(identityFactory)
  }

  protected async executeAsync(
    request: CreateUserCommand,
  ): Promise<ResultType<User>> {
    const user = await this.userRepository.create({
      email: request.email,
      name: request.name,
    })

    return Result.ok(user)
  }
}
```

Register the dependencies explicitly:

```ts
import { TOKENS } from '@xeno-js/shared'

const app = new XenoAppBuilder()
  .addServices((container) => {
    container.addScoped(
      'USER_REPOSITORY',
      (scope) => new UserRepository(
        scope.resolve(TOKENS.DB_CONTEXT),
      ),
    )

    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve(TOKENS.USER_CONTEXT_FACTORY),
          scope.resolve('USER_REPOSITORY'),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

Xeno.JS uses explicit dependency registration. The Handler's dependencies are resolved from the service scope passed to the factory.

For more information, see [Dependency Injection](../../fundamentals/dependency-injection).

---

## Execute a Command

Once the Command and Handler are registered, execute the Command through the mediator inside an active service scope. For non-HTTP work, `runInScope()` creates that scope and disposes it when the operation completes.

```ts
import { TOKENS } from '@xeno-js/shared'

const command = new CreateUserCommand(
  'john@example.com',
  'John Doe',
)

const application = await app.build()
const result = await application.runInScope(async (services) => {
  const mediator = services[TOKENS.MEDIATOR]
  return mediator.send(command, new AbortController().signal)
})
```

The mediator executes the Command pipeline and eventually resolves the Handler using:

```ts
command.intent
```

For this Command:

```ts
command.intent === 'CreateUserCommand'
```

so the mediator resolves the Handler registered with:

```ts
'CreateUserCommand'
```

The returned value is a `ResultType<TResponse>`.

Handle the result according to your application's error-handling conventions.

---

## Complete example

A simple Command implementation can be organized as follows:

```text
src/
├── application/
│   └── users/
│       ├── create-user.command.ts
│       ├── create-user.handler.ts
│       └── create-user.schema.ts
└── bootstrap.ts
```

### Command

```ts
// application/users/create-user.command.ts

import { Command } from '@xeno-js/core'

export interface User {
  id: string
  email: string
  name: string
}

export class CreateUserCommand extends Command<User> {
  constructor(
    public readonly email: string,
    public readonly name: string,
  ) {
    super('CreateUserCommand')
  }
}
```

### Schema

```ts
// application/users/create-user.schema.ts

import { z } from 'zod'

export const createUserSchema = z.object({
  intent: z.literal('CreateUserCommand'),
  type: z.literal('COMMAND'),
  email: z.string().email(),
  name: z.string().min(1),
})
```

### Handler

```ts
// application/users/create-user.handler.ts

import { BaseHandler } from '@xeno-js/core'
import { Result, type ResultType } from '@xeno-js/shared'

import type { CreateUserCommand, User } from './create-user.command'

export class CreateUserHandler extends BaseHandler<
  CreateUserCommand,
  User
> {
  protected async executeAsync(
    request: CreateUserCommand,
  ): Promise<ResultType<User>> {
    const user: User = {
      id: crypto.randomUUID(),
      email: request.email,
      name: request.name,
    }

    return Result.ok(user)
  }
}
```

### Application bootstrap

```ts
// bootstrap.ts

import { XenoAppBuilder } from '@xeno-js/core'
import { TOKENS } from '@xeno-js/shared'
import { withZodValidation } from '@xeno-js/zod'

import { createUserSchema } from './application/users/create-user.schema'
import { CreateUserHandler } from './application/users/create-user.handler'

const builder = new XenoAppBuilder()
  .addServices((container) => {
    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve(TOKENS.USER_CONTEXT_FACTORY),
        )
      },
    )
  })
  .addPipeline(withZodValidation((options) => {
    options.schemas = {
      CreateUserCommand: createUserSchema,
    }
  }))

const application = await builder.build()
await application.runInScope(async (services) => {
  const mediator = services[TOKENS.MEDIATOR]
  return mediator.send(
    new CreateUserCommand('john@example.com', 'John Doe'),
    new AbortController().signal,
  )
})
```

The important relationship is:

```text
CreateUserCommand
       │
       │ intent = "CreateUserCommand"
       ▼
"CreateUserCommand" service registration
       │
       ▼
CreateUserHandler
```

The same intent connects the Command to its Handler and to its validation schema.

---

## Add cache invalidation to a Command

When a Command changes data used by a cached Query, declare the affected stored keys in `cacheInvalidation`. Enable the behavior with `withQueryCaching()`:

```ts
import { XenoAppBuilder, withQueryCaching } from '@xeno-js/core'

const application = await new XenoAppBuilder()
  .addPipeline(withQueryCaching())
  .build()
```

Add your Handler registrations before building the application. If no cache is registered, Xeno.JS configures the default in-memory cache. `addCache()` alone does not enable command invalidation.

The optional `ICommand.cacheInvalidation` property accepts `keys?: string[]` and `patterns?: string[]`. When extending `Command`, pass that object as the second argument to `super()`:

```ts
import { Command } from '@xeno-js/core'
import type { ICacheKeyBuilder } from '@xeno-js/core'

interface User {
  id: string
  name: string
}

export class UpdateUserCommand extends Command<User> {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    keyBuilder: ICacheKeyBuilder,
  ) {
    super('UpdateUserCommand', {
      keys: [keyBuilder.buildContextualKey(`user:${userId}`)],
    })
  }
}
```

For user ID `42`, this key matches a Query with `cacheKey: 'user:42'` and `isUserScoped: false`, provided the Query and Command use the same tenant context. Resolve the key builder through `TOKENS.CACHE_KEY_BUILDER` while the appropriate identity is active, then pass it to the Command constructor. Account for identity enrichment that may change the context later. For a user-scoped Query, use `buildUserScopedKey()` with the matching identity instead.

The pipeline passes declared keys and patterns directly to the cache provider. It does not add tenant or user context automatically. A key for the current identity does not invalidate other users' entries; list and user-scoped caches may need additional, carefully scoped keys or patterns.

The pipeline attempts invalidation after the downstream Command execution returns a successful `Result`. Failed Commands and thrown errors do not trigger it. If a cache removal fails, Xeno.JS logs a warning, stops the remaining removals, and returns the successful Command result. Invalidation is not atomic with the write, so plan for stale data and concurrent reads.

See [Command Cache Invalidation Pipeline](/docs/application/pipelines/cache-invalidation) for an example with a Query, scoped keys, pattern behavior, and troubleshooting.

---

## Add idempotency to a Command

Idempotency is a Command-specific pipeline feature.

Add the `withIdempotency` plugin to the Command pipeline:

```ts
import { XenoAppBuilder, withIdempotency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withIdempotency((options) => {
    options.lockTtlSeconds = 300
    options.processedTtlSeconds = 86400
  }))

await app.build()
```

The idempotency mechanism uses the active network context's `requestId` to identify an operation; it does not read an ID from the Command object. The options also support per-intent settings through `intentRegistry`.

See [Idempotency](../pipelines/idempotency) for the complete configuration and behavior.

---

## Add concurrency handling to a Command

Concurrency retry handling is also Command-specific.

```ts
import { XenoAppBuilder, withConcurrency } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withConcurrency((options) => {
    options.maxRetries = 3
    options.delayConfig = {
      baseDelayMs: 100,
      maxJitterMs: 50,
    }
  }))

await app.build()
```

See [Concurrency](../pipelines/concurrency) for the complete configuration and retry behavior.

---

## Add other pipeline features

Commands can also use the common CQRS pipeline features:

- [Validation](../pipelines/validation)
- [Exception handling](../pipelines/exception)
- [Logging](../pipelines/logging)
- [Performance tracking](../pipelines/performance)
- [Idempotency](../pipelines/idempotency)
- [Concurrency](../pipelines/concurrency)
- [Command Cache Invalidation](/docs/application/pipelines/cache-invalidation)

Add the corresponding pipeline plugins to `addPipeline()` where required. `addPipeline()` configures the CQRS module and does not take a configuration callback.

---

## Troubleshooting

### `HANDLER_NOT_FOUND`

If executing a Command produces a `HANDLER_NOT_FOUND` error, check that:

1. the Command has an intent;
2. the Handler is registered in the service container;
3. the registration token exactly matches the Command intent;
4. the Handler exposes a `handle()` method through `BaseHandler`;
5. `addPipeline()` has been called;
6. the application has been built with `await app.build()`.

For example:

```ts
super('CreateUserCommand')
```

must correspond to:

```ts
import { TOKENS } from '@xeno-js/shared'

container.addTransient(
  'CreateUserCommand',
  (scope) => new CreateUserHandler(
    scope.resolve(TOKENS.USER_CONTEXT_FACTORY),
  ),
)
```

### Validation is not running

Check that:

1. `addPipeline(withZodValidation(...))` is configured;
2. the Command runs inside an active service scope;
3. the schema is registered under the exact Command intent;
4. the Command is executed through the mediator;
5. the schema validates the Command request shape.

For example:

```ts
withZodValidation((options) => {
  options.schemas = {
    CreateUserCommand: createUserSchema,
  }
})
```

must match:

```ts
super('CreateUserCommand')
```

### Cached Query results remain stale

Check that `withQueryCaching()` is enabled, the Command runs through the mediator and returns a successful `Result`, and the declared keys match the actual stored keys. Check cache warnings and ensure the declared patterns are supported by the provider. See [Command Cache Invalidation](/docs/application/pipelines/cache-invalidation) for tenant and user key formats.

### The Handler is not receiving the expected data

The Command class defines the data passed to the Handler:

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

The Handler receives the same Command instance:

```ts
protected async executeAsync(
  request: CreateUserCommand,
) {
  request.email
  request.name
}
```

If validation is enabled, remember that the schema validates the request object before the Handler executes.

---

## Related documentation

- [CQRS Overview](./overview)
- [Creating Queries](./query)
- [Creating Handlers](./handler)
- [Validation](../pipelines/validation)
- [Exception Handling](../pipelines/exception)
- [Logging](../pipelines/logging)
- [Performance Tracking](../pipelines/performance)
- [Idempotency](../pipelines/idempotency)
- [Concurrency](../pipelines/concurrency)
- [Command Cache Invalidation](/docs/application/pipelines/cache-invalidation)
- [Dependency Injection](../../fundamentals/dependency-injection)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
