---
title: "App Builder"
description: "Learn how AppBuilder composes a Xeno.JS application by configuring services, modules, middleware, pipelines, infrastructure, and the application runtime."
canonical: "https://www.xeno-js.it/docs/fundamentals/app-builder"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "fundamentals"
category: "application-composition"
topics: "Xeno.JS App Builder, AppBuilder, Application Composition, Dependency Injection, Service Container, Xeno.JS Modules, Application Bootstrap, Middleware, CQRS Pipeline"
keywords: "Xeno.JS AppBuilder, Xeno.JS App Builder, Xeno.JS application composition, Xeno.JS bootstrap, Xeno.JS Service Container, Xeno.JS addServices, Xeno.JS addModule, Xeno.JS addPipeline, Xeno.JS addDb"
sidebar:
  group: "Fundamentals"
  order: 3
breadcrumbs:
- name: "Docs"
  url: "https://www.xeno-js.it/docs"
- name: "Fundamentals"
  url: "https://www.xeno-js.it/docs/fundamentals"
- name: "App Builder"
  url: "https://www.xeno-js.it/docs/fundamentals/app-builder"
related:
  next:
  - "/docs/fundamentals/service-container"
prerequisites:
- "/docs/fundamentals/xeno-registry"
relatedTopics:
- "/docs/fundamentals/service-container"
- "/docs/fundamentals/dependency-injection"
- "/docs/fundamentals/modules"
- "/docs/application/pipelines"
faqs:
- question: "What is AppBuilder in Xeno.JS?"
  answer: "AppBuilder is the fluent composition root used to configure application services, modules, middleware, pipelines, infrastructure integrations, and the runtime ServiceContainer."
- question: "How do I create a Xeno.JS application with AppBuilder?"
  answer: "Create an AppBuilder instance, configure the required application capabilities, and call build() to initialize the queued modules and obtain the configured ServiceContainer."
- question: "What does addServices() do?"
  answer: "addServices() exposes the underlying ServiceContainer during the composition phase so application services can be registered explicitly."
- question: "What does addModule() do?"
  answer: "addModule() queues a custom module factory and initializes the resulting module during build()."
- question: "What does build() do?"
  answer: "build() initializes the modules queued by AppBuilder in priority order and returns the configured ServiceContainer."
answerSummary: "AppBuilder is the composition root of a Xeno.JS application. It provides a fluent API for configuring services, modules, middleware, pipelines, databases, authentication, caching, logging, HTTP infrastructure, and other application capabilities before building the runtime container."
directAnswer:
  question: "What is AppBuilder in Xeno.JS?"
  answer: "AppBuilder is the fluent composition root used to assemble a Xeno.JS application and initialize its configured ServiceContainer."
keyFacts:
- "AppBuilder is exported by @xeno-js/core."
- "AppBuilder is generic over a XenoRegistry."
- "AppBuilder creates or accepts a ServiceContainer."
- "Application configuration is queued as modules and initialized by build()."
- "AppBuilder exposes addServices() for registering application services."
- "AppBuilder supports custom modules through addModule()."
- "build() returns the configured ServiceContainer."

---

## What is AppBuilder

`AppBuilder` is the **composition root** of a Xeno.JS application.

It is where you decide which capabilities your application needs and how they are composed:

* services
* modules
* context
* middleware
* CQRS pipelines
* database
* cache
* authentication
* logging
* HTTP infrastructure

The important idea is simple:

```text
Configure
    ↓
AppBuilder
    ↓
Queue application modules
    ↓
build()
    ↓
ServiceContainer
    ↓
Application runtime
```

## Basic usage

The smallest useful pattern is:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addServices((services) => {
  services.addSingleton('GREETING_SERVICE', () => ({
    greet: () => 'Hello Xeno!',
  }))
})

const container = await app.build()

const greeting = container.resolve('GREETING_SERVICE')

console.log(greeting.greet())
```

There are three important steps:

1. create the builder
2. configure the application
3. call `build()`

`build()` is the point where the queued modules are initialized and the configured `ServiceContainer` becomes ready for application execution.

---

## Fluent composition

`AppBuilder` methods return the builder itself, so application configuration can be chained:

```ts
const app = new AppBuilder()
  .addContext()
  .addPipeline()
  .addServices((services) => {
    services.addSingleton('USER_REPOSITORY', () => {
      return new UserRepository()
    })
  })

await app.build()
```

This makes the composition root easy to read:

```text
Application
    │
    ├── Context
    ├── Pipeline
    └── Services
         │
         ▼
       build()
         │
         ▼
    ServiceContainer
```

---

## Registering application services

For application-specific services, use `addServices()`.

The callback receives the `ServiceContainer` used by the builder:

```ts
const app = new AppBuilder()
  .addServices((services) => {
    services.addSingleton('USER_REPOSITORY', () => {
      return new UserRepository()
    })

    services.addScoped('USER_SERVICE', (container) => {
      return new UserService(
        container.resolve('USER_REPOSITORY'),
      )
    })
  })

await app.build()
```

This keeps dependency registration at the composition root.

The dependency graph is therefore visible:

```text
USER_SERVICE
     │
     └── USER_REPOSITORY
```

For more information about service registration and lifetimes, see [Service Container](/docs/fundamentals/service-container).

---

## Configuring modules

Xeno.JS capabilities are composed as modules.

`AppBuilder` provides `addModule()` for application-specific modules:

```ts
const app = new AppBuilder()

app.addModule(
  'UsersModule',
  async () => {
    return {
      async configure(container) {
        container.addScoped('USER_SERVICE', () => {
          return new UserService()
        })
      },
    }
  },
)

await app.build()
```

A module factory is executed during `build()`.

The module then receives the application's container and can configure it.

This is useful when a feature owns several related registrations:

```text
UsersModule
    │
    ├── USER_REPOSITORY
    ├── USER_SERVICE
    └── USER_HANDLER
```

Instead of putting all registrations directly in `addServices()`, a larger feature can encapsulate its composition inside a module.

---

## Application capabilities

`AppBuilder` also exposes dedicated methods for common Xeno.JS capabilities.

## Context

```ts
const app = new AppBuilder()
  .addContext()
```

This queues the context module.

Use this when the application needs Xeno.JS application/request context capabilities.

---

## Middleware

Middleware configuration is provided through a setup callback:

```ts
const app = new AppBuilder()
  .addMiddlewares((options) => {
    options.cors = true
    options.withCredentials = true
  })
```

The callback receives the middleware configuration and the configuration service.

The exact available options depend on the current `MiddlewareConfig` type.

---

## CQRS pipeline

Pipelines are configured with `addPipeline()`:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.performance.thresholdMs = 100
    config.queryBus.isEnabled = true
})
```

The pipeline configuration currently exposes areas including:

* performance
* authorization
* validation
* command bus
* query bus

For example:

```ts
.addPipeline((config) => {
  config.queryBus.isEnabled = true

  config.performance.thresholdMs = 100
})
```

Pipeline configuration belongs to application execution rather than basic dependency composition.

See [Pipelines](/docs/application/pipelines) for the execution model.

---

## Database

Database configuration is handled through `addDb()`:

```ts
const app = new AppBuilder()
  .addDb((options, config) => {
    options.connectionString = config.getOrThrow('DATABSE_URL')
  })
```

The current implementation also supports SQLite through the database configuration:

```ts
.addDb((config) => {
  config.connectionString = './database.db'
  config.enableSqlLite = true
})
```

The database module is initialized during `build()`.

Do not instantiate the database infrastructure manually inside every service. Configure it once at the composition root and inject the required abstractions into application services.

---

## Cache

Caching can be enabled with:

```ts
const app = new AppBuilder()
  .addCache()
```

Or configured explicitly:

```ts
const app = new AppBuilder()
  .addCache((config) => {
    config.inMemory = true
  })
```

The actual cache configuration depends on the integrations enabled by the application.

---

## Authentication

Authentication can be configured through `addAuth()`:

```ts
const app = new AppBuilder()
  .addAuth((options, config) => {
    options.url = config.getOrThrow('SUPABASE_URL')
    options.key = config.getOrThrow('SUPABASE_KEY')
  })
```

The current Core implementation uses the authentication configuration to initialize its authentication module.

Authentication is therefore part of application composition rather than something that needs to be manually initialized by every request handler.

---

## Logging

Logging is configured with `addLogger()`:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.console = true
  })
```

The logger configuration supports the logging integrations exposed by the current Core implementation, including console logging, Pino, Sentry, and custom loggers.

---

## HTTP infrastructure

`AppBuilder` also exposes `addHttpCore()` for configuring Xeno.JS HTTP infrastructure:

```ts
const app = new AppBuilder()
  .addHttpCore((options, config) => {
    options.http.client.baseURL = config.get('API_BASE_URL', 'https://api.example.com')
    options.http.client.timeoutMs = 5000
  })
```

The current configuration also contains HTTP client and resilience settings.

HTTP remains an integration capability of Xeno.JS; it does not redefine Xeno.JS as an HTTP framework.

---

## Concurrency service

A concurrency service can be added explicitly:

```ts
const app = new AppBuilder()
  .addConcurrencyService()
```

The current implementation registers a concurrency service in the container.

This is useful when application logic needs explicit control over concurrent asynchronous operations.

---

## Building the application

Configuration does not immediately initialize every module.

The final step is:

```ts
const container = await app.build()
```

During `build()` Xeno.JS:

1. checks whether the application has already been built
2. orders queued modules by priority
3. initializes each module
4. returns the configured `ServiceContainer`

Conceptually:

```text
addServices()
addDb()
addCache()
addPipeline()
addModule()
      │
      ▼
  queued modules
      │
      ▼
    build()
      │
      ▼
initialize modules
      │
      ▼
ServiceContainer
```

If module initialization fails, `build()` throws an error identifying the module where bootstrap failed and preserves the original error as the cause.

---

## Build once

`AppBuilder` keeps track of whether it has already been built.

Calling `build()` again returns the existing container rather than rebuilding the modules:

```ts
const first = await app.build()
const second = await app.build()

console.log(first === second)
// true
```

This behavior is covered by the project's test suite.

The practical implication is that application bootstrap should normally happen once during application startup.

---

## A realistic composition root

A real application can combine several capabilities:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder<MyRegistry>()
  .addContext()

  .addLogger((config) => {
    config.console = true
  })

  .addPipeline((config) => {
    config.queryBus.isEnabled = true
    config.performance.thresholdMs = 100
  })

  .addDb((options, config) => {
    options.connectionString = config.getOrThrow('DATABASE_URL')
  })

  .addCache()

  .addServices((services) => {
    services.addScoped('USER_REPOSITORY', (container) => {
      return new UserRepository(
        container.resolve('DB_CONTEXT'),
      )
    })

    services.addScoped('USER_SERVICE', (container) => {
      return new UserService(
        container.resolve('USER_REPOSITORY'),
      )
    })
  })

await app.build()
```

The composition root now expresses the application's architecture in one place:

```text
AppBuilder
   │
   ├── Context
   ├── Logging
   ├── CQRS Pipeline
   ├── Database
   ├── Cache
   └── Application Services
            │
            ▼
       ServiceContainer
```

---

## AppBuilder and ServiceContainer

The two objects have different responsibilities.

| Component          | Responsibility                            |
| ------------------ | ----------------------------------------- |
| `AppBuilder`       | Compose and bootstrap the application     |
| `ServiceContainer` | Register and resolve runtime dependencies |

In practice:

```ts
const app = new AppBuilder()

app.addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

const container = await app.build()

const service = container.resolve('USER_SERVICE')
```

The builder is therefore the **composition API**.

The container is the **runtime dependency mechanism**.

---

## AppBuilder and the Registry

`AppBuilder` is generic over the application's `XenoRegistry`:

```ts
const app = new AppBuilder<MyRegistry>()
```

This allows the type system to associate dependency tokens with their expected service types.

The relationship is:

```text
Xeno Registry
      │
      │ defines dependency vocabulary
      ▼
AppBuilder<TRegistry>
      │
      │ composes application
      ▼
ServiceContainer<TRegistry>
      │
      │ resolves dependencies
      ▼
Application
```

See [Xeno Registry](/docs/fundamentals/xeno-registry) for the registry model.

---

## When to use AppBuilder

Use `AppBuilder` when you are defining the application's composition root.

Good candidates include:

* registering application services
* enabling modules
* configuring infrastructure
* enabling context
* configuring pipelines
* configuring logging
* configuring authentication
* configuring databases and caches

Do not use the builder as a general-purpose runtime service locator.

Once the application is built, application components should receive their dependencies through the dependency injection system rather than repeatedly reaching back into the builder.

---

## The key idea

`AppBuilder` answers one question:

> **How is this application composed?**

The answer should be visible in code:

```ts
const app = new AppBuilder()
  .addContext()
  .addPipeline()
  .addDb(...)
  .addCache(...)
  .addServices(...)

await app.build()
```

That is the role of the composition root: configure the application's capabilities and dependencies in one explicit place, then hand execution over to the configured runtime.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
