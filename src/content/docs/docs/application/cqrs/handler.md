---
title: Creating and Registering Handlers
description: Learn how to create, register, and use Xeno.JS command and query handlers with BaseHandler and dependency injection.
keywords:

- Xeno.JS handler
- BaseHandler
- CQRS handler
- command handler
- query handler
- Xeno.JS dependency injection
- handler registration
tags:
- application
- cqrs
- handler
- dependency-injection
faqs:
- question: How do I create a handler in Xeno.JS?
  answer: Extend BaseHandler with the request and response types and implement the executeAsync() method.
- question: How do I register a handler?
  answer: Register the handler in AppBuilder.addServices() using the request intent as the service token.
- question: How is a handler connected to a command or query?
  answer: The handler registration token must exactly match the command or query intent.
- question: How do I inject dependencies into a handler?
  answer: Declare the dependencies in the handler constructor and resolve them from the service scope when registering the handler.
- question: Can a handler access the current user context?
  answer: Yes. A BaseHandler can use the protected _getCurrentContext() method to access the current UserContext.
---

## Introduction

A handler contains the application logic that executes a Command or Query.

In Xeno.JS, create a handler by extending `BaseHandler`, implement `executeAsync()`, and register the handler in the application service container.

The handler is associated with a Command or Query through its `intent`.

## Before you start

You need:

* a Xeno.JS `AppBuilder`;
* a Command or Query;
* a handler extending `BaseHandler`;
* the CQRS pipeline enabled with `addPipeline()`;
* a handler registration whose token matches the request `intent`.

For example:

```ts
const app = new AppBuilder()
  .addPipeline()
```

`AppBuilder` also creates the application context during initialization, so `BaseHandler` can access the current user context when needed.

## Create a Handler

Extend `BaseHandler` with:

1. the request type;
2. the response type.

Then implement `executeAsync()`.

For example, for a `CreateUserCommand`:

```ts
import { Result, type ResultType } from '@xeno-js/shared'
import { BaseHandler } from '@xeno-js/core'

import type { CreateUserCommand } from './create-user.command'

interface User {
  id: string
  email: string
  name: string
}

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

`executeAsync()` receives the Command or Query that was sent through the mediator.

Return a `ResultType<TResponse>` using the Xeno.JS `Result` API.

## Implement `executeAsync()`

`BaseHandler` requires subclasses to implement:

```ts
protected abstract executeAsync(
  request: TRequest,
  signal?: AbortSignal,
): Promise<ResultType<TResponse>>
```

The request is the Command or Query being processed.

The response type is defined by the generic parameters passed to `BaseHandler`.

For example:

```ts
export class FindUserHandler extends BaseHandler<
  FindUserQuery,
  User
> {
  protected async executeAsync(
    request: FindUserQuery,
  ): Promise<ResultType<User>> {
    // Execute the application use case.
  }
}
```

### Cancellation

The public `handle()` method receives an `AbortSignal` and checks whether the operation has already been aborted before executing the handler.

The current `BaseHandler` implementation pass that signal from `handle()` into `executeAsync()`.

So, the `signal` parameter declared by `executeAsync()` is automatically populated by `BaseHandler`.

## Inject Dependencies

Handlers can receive application dependencies through their constructor.

For example:

```ts
import type { ResultType } from '@xeno-js/shared'
import { BaseHandler } from '@xeno-js/core'

import type { CreateUserCommand } from './create-user.command'

export interface UserRepository {
  create(email: string, name: string): Promise<User>
}

interface User {
  id: string
  email: string
  name: string
}

export class CreateUserHandler extends BaseHandler<
  CreateUserCommand,
  User
> {
  constructor(
    private readonly userRepository: UserRepository,
    userContextFactory: UserContextFactory,
  ) {
    super(userContextFactory)
  }

  protected async executeAsync(
    request: CreateUserCommand,
  ): Promise<ResultType<User>> {
    const user = await this.userRepository.create(
      request.email,
      request.name,
    )

    return Result.ok(user)
  }
}
```

The dependencies are supplied when the handler is registered with the service container.

This keeps dependency construction outside the handler itself.

## Register a Handler

Register handlers through `AppBuilder.addServices()`.

The registration token must match the request `intent`.

For example, if the command uses:

```ts
super('CreateUserCommand')
```

register the handler as:

```ts
container.addTransient(
  'CreateUserCommand',
  (scope) => {
    return new CreateUserHandler(
      scope.resolve('USER_REPOSITORY'),
      scope.resolve('USER_CONTEXT_FACTORY'),
    )
  },
)
```

The important relationship is:

```text
CreateUserCommand
      │
      │ intent = "CreateUserCommand"
      ▼
"CreateUserCommand"
      │
      ▼
CreateUserHandler
```

The intent and registration token must match exactly.

## Register a Handler with `AppBuilder`

A complete application configuration can look like this:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()
  .addServices((container) => {
    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve('USER_REPOSITORY'),
          scope.resolve('USER_CONTEXT_FACTORY'),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

`addServices()` gives you access to the service container so you can register the handler and its dependencies.

`addPipeline()` enables the CQRS execution pipeline required to process Commands and Queries through the mediator.

## Register Handler Dependencies

Register dependencies before resolving them from the handler factory.

For example:

```ts
const app = new AppBuilder()
  .addServices((container) => {
    container.addScoped(
      'USER_REPOSITORY',
      (scope) => {
        return new UserRepository(
          scope.resolve('USER_DATA_SOURCE'),
        )
      },
    )

    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve('USER_REPOSITORY'),
          scope.resolve('USER_CONTEXT_FACTORY'),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

Choose the handler lifetime according to its dependencies and application requirements.

A handler that has no state of its own is commonly suitable for transient registration, while dependencies with request or scope-specific state should be resolved through the active service scope.

## Access the Current User Context

`BaseHandler` provides the protected `_getCurrentContext()` method.

Use it when the handler needs the current `UserContext`.

For example:

```ts
export class GetProfileHandler extends BaseHandler<
  GetProfileQuery,
  Profile
> {
  protected async executeAsync(
    request: GetProfileQuery,
  ): Promise<ResultType<Profile>> {
    const context = this._getCurrentContext()

    const userId = context.userId
    const tenantId = context.tenantId

    // Load data for the current user and tenant.

    return Result.ok({
      userId,
      tenantId,
    })
  }
}
```

`BaseHandler` receives the `USER_CONTEXT_FACTORY` dependency from the application context.

When registering the handler manually, resolve it from the service scope:

```ts
scope.resolve('USER_CONTEXT_FACTORY')
```

This dependency is registered by Xeno.JS's application context setup.

## Connect a Handler to a Command

A Command defines its intent when it extends `Command`.

For example:

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

Register the corresponding handler with the same intent:

```ts
container.addTransient(
  'CreateUserCommand',
  (scope) => {
    return new CreateUserHandler(
      scope.resolve('USER_CONTEXT_FACTORY'),
    )
  },
)
```

The mediator can then associate the request with the registered handler.

## Connect a Handler to a Query

Queries use the same mechanism.

For example:

```ts
import { Query } from '@xeno-js/shared'

export class FindUserQuery extends Query<User> {
  constructor(
    public readonly userId: string,
  ) {
    super(
      'FindUserQuery',
      {
        cacheKey: `users:${userId}`,
        ttl: 60,
        bypassCache: false,
        consistentRead: false,
        isUserScoped: false,
      },
    )
  }
}
```

Register the handler using the same intent:

```ts
container.addTransient(
  'FindUserQuery',
  (scope) => {
    return new FindUserHandler(
      scope.resolve('USER_REPOSITORY'),
      scope.resolve('USER_CONTEXT_FACTORY'),
    )
  },
)
```

For query-specific caching configuration, see [Caching](../pipelines/caching).

## Execute the Handler Through the Mediator

Handlers are normally not called directly.

Send a Command through the mediator:

```ts
const result = await mediator.send(
  new CreateUserCommand(
    'john@example.com',
    'John Doe',
  ),
  new AbortController().signal,
)
```

Or execute a Query:

```ts
const result = await mediator.query(
  new FindUserQuery('user-123'),
  new AbortController().signal,
)
```

The mediator uses the request `intent` to resolve the corresponding handler.

This means that the following three pieces must agree:

```text
Command / Query
      │
      └── intent
             │
             ▼
       Handler registration
             │
             └── Handler
```

## Complete Command Handler Example

A minimal application can be organized like this:

```text
src/
├── application/
│   └── users/
│       ├── create-user.command.ts
│       └── create-user.handler.ts
└── app.ts
```

### `create-user.command.ts`

```ts
import { Command } from '@xeno-js/shared'

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

### `create-user.handler.ts`

```ts
import { Result, type ResultType } from '@xeno-js/shared'
import { BaseHandler } from '@xeno-js/core'

import type {
  CreateUserCommand,
  User,
} from './create-user.command'

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

### `app.ts`

```ts
import { AppBuilder } from '@xeno-js/core'

import { CreateUserHandler } from './application/users/create-user.handler'

const app = new AppBuilder()
  .addServices((container) => {
    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve('USER_CONTEXT_FACTORY'),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

Once the application is built, the handler is available to the CQRS execution flow.

## Create a Handler with a Repository

A more typical application handler delegates persistence to a repository:

```ts
export class CreateUserHandler extends BaseHandler<
  CreateUserCommand,
  User
> {
  constructor(
    private readonly userRepository: UserRepository,
    userContextFactory: UserContextFactory,
  ) {
    super(userContextFactory)
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

Register both services:

```ts
const app = new AppBuilder()
  .addServices((container) => {
    container.addScoped(
      'USER_REPOSITORY',
      (scope) => {
        return new UserRepository(
          scope.resolve('USER_DATA_SOURCE'),
        )
      },
    )

    container.addTransient(
      'CreateUserCommand',
      (scope) => {
        return new CreateUserHandler(
          scope.resolve('USER_REPOSITORY'),
          scope.resolve('USER_CONTEXT_FACTORY'),
        )
      },
    )
  })
  .addPipeline()

await app.build()
```

This keeps the handler focused on the application use case while the repository remains responsible for persistence.

## Handle Errors

A handler returns a `ResultType<TResponse>`.

For successful execution:

```ts
return Result.ok(user)
```

For an application failure, return a failed `Result` using the appropriate Xeno.JS error:

```ts
return Result.fail(
  AppError.validationError(
    request.intent,
    'User could not be created.',
  ),
)
```

The exact error should describe the failure that occurred in the application use case.

Pipeline behaviors can also affect the final result before or around handler execution. See the pipeline documentation for validation, authorization, idempotency, concurrency, and other cross-cutting behavior.

## Troubleshooting

### `HANDLER_NOT_FOUND`

If the application reports that the handler cannot be found, check:

1. the handler is registered with `addServices()`;
2. `await app.build()` is called;
3. the registration token exactly matches the request `intent`;
4. the handler factory returns an object with a `handle()` method;
5. all dependencies required by the handler are registered.

For example:

```ts
super('CreateUserCommand')
```

requires:

```ts
container.addTransient(
  'CreateUserCommand',
  (scope) => new CreateUserHandler(
    scope.resolve('USER_CONTEXT_FACTORY'),
  ),
)
```

`CreateUserCommand` and `createUserCommand` are different tokens.

### `SCOPE_NOT_AVAILABLE`

If the request cannot be processed because no service scope is available, make sure the Command or Query is being executed through the normal Xeno.JS application execution context.

Do not resolve and execute handlers manually outside the application scope when using the mediator.

### `PIPELINE_NOT_AVAILABLE`

If the mediator reports that the CQRS pipeline is unavailable, ensure that the application includes:

```ts
const app = new AppBuilder()
  .addPipeline()
```

before:

```ts
await app.build()
```

### Handler dependency cannot be resolved

If a handler constructor dependency cannot be resolved, verify that the dependency is registered before the handler is created:

```ts
.addServices((container) => {
  container.addScoped(
    'USER_REPOSITORY',
    (scope) => new UserRepository(
      scope.resolve('USER_DATA_SOURCE'),
    ),
  )

  container.addTransient(
    'CreateUserCommand',
    (scope) => new CreateUserHandler(
      scope.resolve('USER_REPOSITORY'),
      scope.resolve('USER_CONTEXT_FACTORY'),
    ),
  )
})
```

The token passed to `scope.resolve()` must correspond to a registered service.

## Handler Checklist

Before running your application, verify:

* [ ] the handler extends `BaseHandler`;
* [ ] the request type matches the Command or Query;
* [ ] the response type matches the request response;
* [ ] `executeAsync()` is implemented;
* [ ] required dependencies are declared in the constructor;
* [ ] the handler is registered with `addServices()`;
* [ ] the registration token exactly matches the request `intent`;
* [ ] `addPipeline()` is enabled;
* [ ] the application is built with `await app.build()`;
* [ ] the Command is sent with `mediator.send()`;
* [ ] the Query is executed with `mediator.query()`.

## Related Documentation

* [CQRS Overview](./overview)
* [Creating Commands](./command)
* [Creating Queries](./query)
* [Validation Pipeline](../pipelines/validation)
* [Caching](../pipelines/caching)
* [Idempotency](../pipelines/idempotency)
* [Concurrency](../pipelines/concurrency)
* [Dependency Injection](../../fundamentals/dependency-injection)
* [App Builder](../../fundamentals/app-builder)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
