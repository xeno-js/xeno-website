---
title: CQRS Overview
description: Learn how to use CQRS in Xeno.JS and find the guides for creating commands, queries, handlers, and configuring CQRS pipeline features.
keywords:
- Xeno.JS CQRS
- TypeScript CQRS
- Xeno.JS commands
- Xeno.JS queries
- Xeno.JS handlers
- Xeno.JS mediator
- CQRS pipelines
tags:
- application
- cqrs
- commands
- queries
- handlers
faqs:
- question: How do I create a Command in Xeno.JS?
  answer: Extend the Command class, define the command data, and connect it to a handler. See Create a Command.
- question: How do I create a Query in Xeno.JS?
  answer: Extend the Query class, define the query data and cache options, and connect it to a handler. See Create a Query.
- question: How do I create a Handler?
  answer: Extend BaseHandler, implement executeAsync, register the handler using its request intent, and execute the request through the mediator.
- question: How do I execute a Command?
  answer: Send the Command through the mediator.
- question: How do I execute a Query?
  answer: Execute the Query through the mediator.
- question: Can I validate Commands and Queries?
  answer: Yes. Xeno.JS provides validation pipeline support for both Commands and Queries.
- question: Can I cache Query results?
  answer: Yes. Enable the Query pipeline and configure cache options on the Query.
- question: Can I add idempotency to Commands?
  answer: Yes. Configure commandBus.idempotency to add idempotency to the Command pipeline.
- question: Can I add concurrency handling to Commands?
  answer: Yes. Configure commandBus.concurrency to add concurrency retry handling to the Command pipeline.
---

## Introduction

Use the CQRS features in Xeno.JS to build application operations as **Commands** and **Queries**, and execute them through their corresponding **Handlers**.

The Application module provides the main building blocks you need:

* **Commands** for operations that perform application actions;
* **Queries** for operations that retrieve data;
* **Handlers** for executing Commands and Queries;
* **Mediator** for sending Commands and executing Queries;
* **Pipeline behaviors** for cross-cutting concerns such as validation, logging, performance monitoring, caching, idempotency, concurrency, and exception handling.

If you already know which task you need to perform, use the corresponding guide below.

## Choose what you need to do

| I need to...                      | Go to                                                         |
| --------------------------------- | ------------------------------------------------------------- |
| Create a Command                  | [Create a Command](./command)                                 |
| Create a Query                    | [Create a Query](./query)                                     |
| Create a Command or Query Handler | [Create a Handler](./handler)                                 |
| Add validation                    | [Enable Validation](../pipelines/validation)                  |
| Add logging                       | [Configure Logging](../pipelines/logging)                     |
| Track slow Commands and Queries   | [Configure Performance Tracking](../pipelines/performance)    |
| Add idempotency to Commands       | [Configure Idempotency](../pipelines/idempotency)             |
| Handle concurrency conflicts      | [Configure Concurrency](../pipelines/concurrency)             |
| Cache Query results               | [Enable Caching](../pipelines/caching)                        |
| Handle exceptions                 | [Handle Exceptions](../pipelines/exception)                   |

## Before you start

You typically need:

* an `AppBuilder` instance;
* a Command or Query;
* a corresponding Handler;
* the mediator to execute the request.

If you are building an application from scratch, start with [Create a Command](./command) or [Create a Query](./query).

## Commands

Use a Command when the application needs to perform an operation.

Examples include:

* creating a user;
* updating an order;
* deleting a resource;
* changing application state;
* triggering an application action.

Create a Command by following:

[Create a Command](./command)

The Command is then executed through the mediator:

```ts
const result = await mediator.send(command, signal)
```

The Command is associated with a Handler using its request intent.

For the complete registration and Handler workflow, see [Create a Handler](./handler).

### Add Command-specific features

Commands can use the common application pipeline features, such as:

* validation;
* authorization;
* logging;
* performance monitoring;
* exception handling.

Commands can also use Command-specific features:

* idempotency;
* concurrency retry handling.

For example, to enable idempotency:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.commandBus.idempotency = {
      lockTtlSeconds: 30,
      processedTtlSeconds: 300,
    }
  })
  .build()
```

See [Configure Idempotency](../pipelines/idempotency) for the complete configuration.

For concurrency handling, see [Configure Concurrency](../pipelines/concurrency).

## Queries

Use a Query when the application needs to retrieve data.

Examples include:

* retrieving a user;
* loading an order;
* searching products;
* loading a paginated list;
* retrieving application data for a screen.

Create a Query by following:

[Create a Query](./query)

A Query can be executed through the mediator:

```ts
const result = await mediator.query(query, signal)
```

The Query is associated with a Handler using its request intent.

For the complete Handler workflow, see [Create a Handler](./handler).

### Cache Query results

Query caching is available through the Query pipeline.

Enable the Query pipeline together with a cache:

```ts
const app = new AppBuilder()
  .addCache()
  .addPipeline((config) => {
    config.queryBus.isEnabled = true
  })
  .build()
```

A cacheable Query defines its caching options when it is created.

For example:

```ts
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

For the complete caching workflow, see [Enable Caching](../pipelines/caching).

For the complete Query creation workflow, including Query parameters and schemas, see [Create a Query](./query).

## Handlers

Every Command or Query needs a Handler that performs the actual application operation.

Create a Handler by extending `BaseHandler` and implementing `executeAsync()`:

```ts
export class GetUserHandler extends BaseHandler<
  GetUserQuery,
  User
> {
  protected async executeAsync(
    request: GetUserQuery,
  ): Promise<ResultType<User>> {
    // execute the application operation
  }
}
```

The Handler receives the request and can use its dependencies to perform the operation.

See [Create a Handler](./handler) for:

* extending `BaseHandler`;
* injecting dependencies;
* implementing `executeAsync()`;
* accessing the current user context;
* registering the Handler;
* connecting the Handler to a Command or Query.

## Execute Commands and Queries

Commands and Queries are executed differently through the mediator.

### Execute a Command

```ts
const result = await mediator.send(command, signal)
```

Use `send()` for Commands.

### Execute a Query

```ts
const result = await mediator.query(query, signal)
```

Use `query()` for Queries.

Both operations return the result produced by the corresponding Handler or by a pipeline behavior that completes the request before the Handler runs.

For example, a cached Query can return a cached result without executing its Handler.

## Configure pipeline features

CQRS requests can use common pipeline features without putting that logic directly into every Handler.

### Validation

Enable validation when Commands or Queries need input validation.

See:

[Enable Validation](../pipelines/validation)

The validation guide explains:

* how to configure validation;
* how to register Zod schemas;
* how to add custom validation;
* what happens when validation fails.

For creating the actual Query or Command schema, use:

* [Create a Command](./command)
* [Create a Query](./query)

### Logging

Use the logging pipeline to record Command and Query execution.

See:

[Configure Logging](../pipelines/logging)

### Performance tracking

Use the performance pipeline to detect slow Command and Query executions.

See:

[Configure Performance Tracking](../pipelines/performance)

### Exception handling

Use the exception pipeline to handle errors raised during request execution.

See:

[Handle Exceptions](../pipelines/exception)

### Idempotency

Use idempotency when a Command must not be processed more than once for the same request ID.

Configure it under:

```ts
config.commandBus.idempotency
```

See:

[Configure Idempotency](../pipelines/idempotency)

Idempotency applies to Commands.

### Concurrency

Use concurrency retry handling when Commands can fail because of concurrency conflicts.

Configure it under:

```ts
config.commandBus.concurrency
```

See:

[Configure Concurrency](../pipelines/concurrency)

This feature applies to Commands.

### Caching

Use query caching when repeated Query executions can reuse a previously stored result.

Enable the Query pipeline:

```ts
.addPipeline((config) => {
  config.queryBus.isEnabled = true
})
```

and configure a cache:

```ts
.addCache()
```

Then define `cacheOptions` on the Query.

See:

[Enable Caching](../pipelines/caching)

## A typical CQRS workflow

A typical application flow looks like this:

```text
Create Command or Query
        │
        ▼
Create its Handler
        │
        ▼
Register the Handler
        │
        ▼
Configure required pipelines
        │
        ▼
Execute through the mediator
        │
        ▼
Receive the Result
```

For a Query with caching:

```text
Create Query
    │
    ▼
Define cacheOptions
    │
    ▼
Create Query Handler
    │
    ▼
Enable Query pipeline + cache
    │
    ▼
mediator.query(...)
    │
    ├── cached result ──► return result
    │
    └── cache miss
            │
            ▼
       Query Handler
            │
            ▼
       store result
            │
            ▼
       return result
```

For a Command:

```text
Create Command
    │
    ▼
Create Command Handler
    │
    ▼
Configure Command pipelines
    │
    ▼
mediator.send(...)
    │
    ▼
Command Handler
    │
    ▼
Result
```

## Where to go next

Choose the guide that matches your task:

### Create a Command

[Create a Command](./command)

Use this when you need to define an operation that changes application state or performs an application action.

### Create a Query

[Create a Query](./query)

Use this when you need to retrieve application data.

This guide also covers the Query-specific configuration used by features such as caching.

### Create a Handler

[Create a Handler](./handler)

Use this when you need to implement or register the Handler for a Command or Query.

### Configure application pipelines

Go to the relevant pipeline guide:

* [Enable Validation](../pipelines/validation)
* [Configure Logging](../pipelines/logging)
* [Configure Performance Tracking](../pipelines/performance)
* [Configure Idempotency](../pipelines/idempotency)
* [Configure Concurrency](../pipelines/concurrency)
* [Enable Caching](../pipelines/caching)
* [Handle Exceptions](../pipelines/exception)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
