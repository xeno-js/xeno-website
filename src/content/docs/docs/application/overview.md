---
title: Application
description: Learn how to build and configure application use cases in Xeno.JS with CQRS, commands, queries, handlers, and pipeline behaviors.
keywords:
- Xeno.JS application
- Xeno.JS CQRS
- TypeScript CQRS
- Xeno.JS commands
- Xeno.JS queries
- Xeno.JS handlers
- Xeno.JS pipelines
- TypeScript application architecture
tags:
- application
- cqrs
- pipelines
- commands
- queries
- handlers
faqs:
- question: What can I build with the Application module?
  answer: You can define commands, queries, handlers, and configure pipeline behaviors for application use cases.
- question: How do I create a command?
  answer: Follow the Creating Commands guide in application/cqrs/command.
- question: How do I create a query?
  answer: Follow the Creating Queries guide in application/cqrs/query.
- question: How do I create a handler?
  answer: Follow the Creating Handlers guide in application/cqrs/handler.
- question: How do I add validation to commands or queries?
  answer: Configure validation through AppBuilder and follow the Validation Pipeline guide.
---

## Introduction

The Application module provides the tools you need to define and execute application use cases with **CQRS** and **pipeline behaviors**.

Use this section when you need to:

* create a command;
* create a query;
* create a handler;
* validate commands or queries;
* add logging around application requests;
* monitor execution performance;
* add idempotency to commands;
* configure concurrency retries;
* enable query processing features such as caching;
* handle exceptions consistently.

## Before you start

Application features are configured through `AppBuilder`.

Enable the application pipeline with:

```ts
const app = new AppBuilder()
  .addPipeline()
```

You can provide additional configuration when a feature requires it:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    // Configure CQRS and pipeline features here.
  })
```

Build the application after configuring the required modules:

```ts
const container = await app.build()
```

The exact configuration depends on the feature you want to use. Each feature page documents its required configuration and prerequisites.

### Create a command

To create a command, see:

**[Create a Command](./cqrs/command)**

The guide covers:

* defining the command;
* defining its input;
* adding validation;
* sending the command;
* connecting it to a handler.

### Create a query

To create a query, see:

**[Create a Query](./cqrs/query)**

The guide covers:

* defining the query;
* defining its parameters;
* adding validation;
* executing the query;
* connecting it to a handler.

### Create a handler

To implement the application logic for a command or query, see:

**[Create a Handler](./cqrs/handler)**

The guide covers:

* extending `BaseHandler`;
* implementing the handler method;
* receiving dependencies;
* accessing the current user context when required;
* registering the handler;
* connecting the handler to its command or query.

## Pipelines

Pipeline behaviors let you add cross-cutting behavior to commands and queries without putting that behavior directly into every handler.

Choose the feature you need:

| Task                                 | Documentation                                   |
| ------------------------------------ | ----------------------------------------------- |
| Handle application exceptions        | [Exception Pipeline](./pipelines/exception)     |
| Add request logging                  | [Logging Pipeline](./pipelines/logging)         |
| Monitor execution time               | [Performance Pipeline](./pipelines/performance) |
| Validate commands and queries        | [Validation Pipeline](./pipelines/validation)   |
| Prevent duplicate command processing | [Idempotency Pipeline](./pipelines/idempotency) |
| Retry concurrency conflicts          | [Concurrency Pipeline](./pipelines/concurrency) |
| Enable query caching                 | [Caching Pipeline](./pipelines/caching)         |

### Validation

If you need to validate a command or query before its handler runs:

**[Enable Validation](./pipelines/validation)**

The validation guide explains:

* how to configure validation in `AppBuilder`;
* how to use Zod schemas;
* where to define schemas;
* how to configure custom validation;
* what happens when validation fails.

For the command and query definitions used by the examples, see:

* [Create a Command](./cqrs/command)
* [Create a Query](./cqrs/query)

### Logging

To configure logging around command and query execution:

**[Configure Logging](./pipelines/logging)**

### Performance

To monitor command and query execution time:

**[Configure Performance Tracking](./pipelines/performance)**

### Idempotency

To prevent duplicate processing of commands:

**[Configure Idempotency](./pipelines/idempotency)**

### Concurrency

To configure concurrency retries for commands:

**[Configure Concurrency](./pipelines/concurrency)**

### Caching

To enable query caching:

**[Enable Caching](./pipelines/caching)**

### Exception handling

To configure or troubleshoot exception handling for application requests:

**[Configure Exception Handling](./pipelines/exception)**

## CQRS

Use the CQRS section when you are creating application requests and their handlers.

| Task                         | Documentation                      |
| ---------------------------- | ---------------------------------- |
| Understand the CQRS workflow | [CQRS Overview](./cqrs/overview)   |
| Create a command             | [Create a Command](./cqrs/command) |
| Create a query               | [Create a Query](./cqrs/query)     |
| Create a handler             | [Create a Handler](./cqrs/handler) |

### Typical workflow

A typical application use case follows this path:

```text
Create Command or Query
        │
        ▼
Add input validation if required
        │
        ▼
Create the Handler
        │
        ▼
Register the Handler
        │
        ▼
Configure required pipelines
        │
        ▼
Execute the Command or Query
```

For example, when creating a new command:

```text
Create Command
      │
      ├── Add validation
      │      └── Validation Pipeline
      │
      └── Create Handler
             └── Register Handler
```

The individual guides contain the implementation details required for each step.

## Where should I start?

Use the task that matches what you are trying to do:

* **I need a command** → [Create a Command](./cqrs/command)
* **I need a query** → [Create a Query](./cqrs/query)
* **I need a handler** → [Create a Handler](./cqrs/handler)
* **I need validation** → [Validation Pipeline](./pipelines/validation)
* **I need logging** → [Logging Pipeline](./pipelines/logging)
* **I need performance tracking** → [Performance Pipeline](./pipelines/performance)
* **I need idempotency** → [Idempotency Pipeline](./pipelines/idempotency)
* **I need concurrency retries** → [Concurrency Pipeline](./pipelines/concurrency)
* **I need caching** → [Caching Pipeline](./pipelines/caching)
* **I need exception handling** → [Exception Pipeline](./pipelines/exception)

### Troubleshooting

If a command or query does not execute as expected, check:

1. `addPipeline()` has been configured on the `AppBuilder`;
2. the required pipeline configuration is enabled;
3. the command or query is connected to a handler;
4. the handler is registered in the application;
5. the request is executed through the configured mediator;
6. any feature-specific prerequisites documented in the relevant pipeline guide are satisfied.

If the problem is specific to a feature, start from its dedicated guide rather than troubleshooting the entire Application module.

## Related documentation

* [Create a Command](./cqrs/command)
* [Create a Query](./cqrs/query)
* [Create a Handler](./cqrs/handler)
* [CQRS Overview](./cqrs/overview)
* [Exception Pipeline](./pipelines/exception)
* [Performance Pipeline](./pipelines/performance)
* [Logging Pipeline](./pipelines/logging)
* [Validation Pipeline](./pipelines/validation)
* [Idempotency Pipeline](./pipelines/idempotency)
* [Concurrency Pipeline](./pipelines/concurrency)
* [Caching Pipeline](./pipelines/caching)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
