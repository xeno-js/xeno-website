---
title: App Builder
description: Learn how to compose and bootstrap a Xeno.JS application with AppBuilder.
keywords:
- Xeno.JS
- AppBuilder
- application composition
- application bootstrap
- ServiceContainer
- dependency injection
- addServices
- addModule
- addPipeline
- addCache
- addDb
- addLogger
tags:
- fundamentals
- app-builder
- application-composition
- dependency-injection
- bootstrap
faqs:
- question: What is AppBuilder in Xeno.JS?
  answer: AppBuilder is the composition root used to configure application services, modules, middleware, pipelines, infrastructure integrations, and the runtime ServiceContainer.
- question: How do I create a Xeno.JS application with AppBuilder?
  answer: Create an AppBuilder instance, configure the capabilities and services required by the application, then call build().
- question: What does build() do?
  answer: build() initializes the modules queued by AppBuilder in priority order and returns the configured ServiceContainer.
- question: How do I register application services?
  answer: Use addServices() to register services in the application ServiceContainer.
- question: How do I add a custom module?
  answer: Use addModule() with a module name, an asynchronous factory, and optional module configuration.
- question: How do I resolve a service from AppBuilder?
  answer: Call resolve() with the registered dependency token after the application has been built.
- question: Does AppBuilder automatically add dependencies for pipelines and middleware?
  answer: Yes. addPipeline() and addMiddlewares() automatically enable Context, Logger, and Cache when they have not already been configured.
- question: What cache does AppBuilder use by default?
  answer: The default cache configuration uses the in-memory cache.
---

## Introduction

`AppBuilder` is the composition root of a Xeno.JS application.

Use it to configure the application before startup:

* application services
* custom modules
* context
* middleware
* CQRS pipelines
* cache
* database
* authentication
* logging
* HTTP infrastructure
* concurrency services

The typical lifecycle is:

```text
AppBuilder
    ↓
configure
    ↓
build()
    ↓
ServiceContainer
    ↓
application runtime
```

## Create an Application

Create an `AppBuilder` and configure the capabilities your application needs:

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

There are three main steps:

1. Create the builder.
2. Configure the application.
3. Call `build()`.

Configuration methods return the same `AppBuilder`, so they can also be chained.

## Register Services

Use `addServices()` to register application-specific dependencies:

```ts
const app = new AppBuilder()

app.addServices((services) => {
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

The callback receives the application's `ServiceContainer`.

For service lifetimes and dependency registration, see the dependency injection documentation.

## Add a Custom Module

Use `addModule()` when a feature needs to register several related services or perform its own configuration.

```ts
const app = new AppBuilder()

app.addModule(
  'UsersModule',
  async () => ({
    async configure(container) {
      container.addScoped('USER_SERVICE', () => {
        return new UserService()
      })
    },
  }),
)

await app.build()
```

The module factory is executed during `build()`.

An optional configuration object can be passed as the third argument:

```ts
app.addModule(
  'UsersModule',
  async () => ({
    async configure(container, options) {
      container.addScoped('USER_SERVICE', () => {
        return new UserService(options)
      })
    },
  }),
  {
    enabled: true,
  },
)
```

## Enable Context

Context is enabled automatically when the builder is created.

You can therefore use:

```ts
const app = new AppBuilder()
```

without explicitly calling `addContext()`.

Calling `addContext()` is also safe and keeps the method available when composing application configuration explicitly:

```ts
const app = new AppBuilder()

app.addContext()
```

## Configure Middleware

Use `addMiddlewares()` to configure Xeno.JS middleware:

```ts
const app = new AppBuilder()

app.addMiddlewares((options) => {
  options.cors = true
  options.withCredentials = true
})

await app.build()
```

Middleware configuration can also enable authentication-related behavior when authentication has been configured.

### Automatic Dependencies

Calling `addMiddlewares()` automatically enables the following capabilities when they have not already been queued:

* Context
* Logger
* Cache

You therefore do not need to manually call `addLogger()` or `addCache()` just to satisfy middleware dependencies.

If you want to configure them explicitly, configure them before or after `addMiddlewares()`:

```ts
const app = new AppBuilder()

app.addLogger((options) => {
  options.console = true
})

app.addCache((options) => {
  options.inMemory = true
})

app.addMiddlewares((options) => {
  options.cors = true
})
```

## Configure the CQRS Pipeline

Use `addPipeline()` to enable the CQRS pipeline:

```ts
const app = new AppBuilder()

app.addPipeline((config) => {
  config.queryBus.isEnabled = true
  config.performance.thresholdMs = 100
})

await app.build()
```

The pipeline configuration includes:

* performance
* authorization
* validation
* command bus
* query bus

For example:

```ts
app.addPipeline((config) => {
  config.queryBus.isEnabled = true
  config.performance.thresholdMs = 100
})
```

### Automatic Dependencies Injection

Calling `addPipeline()` automatically enables:

* Context
* Logger
* Cache

when they have not already been queued.

For example, this:

```ts
const app = new AppBuilder()

app.addPipeline((config) => {
  config.queryBus.isEnabled = true
})
```

also queues the default logger and cache configuration.

If you need custom logging or cache configuration, configure those capabilities explicitly:

```ts
const app = new AppBuilder()

app.addLogger((options) => {
  options.console = true
})

app.addCache((options) => {
  options.inMemory = true
})

app.addPipeline((config) => {
  config.queryBus.isEnabled = true
})
```

## Configure the Cache

Use `addCache()` to configure application caching:

```ts
const app = new AppBuilder()

app.addCache((options) => {
  options.inMemory = true
})
```

The default AppBuilder cache configuration is in-memory:

```ts
const app = new AppBuilder()

app.addCache()
```

The cache can also be configured with Redis.

See [Cache Overview](../cache/overview) and [Redis Cache](../cache/redis) for the complete cache configuration.

## Configure the Database

Use `addDb()` to configure the database:

```ts
const app = new AppBuilder()

app.addDb((options) => {
  options.connectionString = process.env.DATABASE_URL ?? ''
})

await app.build()
```

SQLite can be enabled through the same configuration:

```ts
app.addDb((options) => {
  options.connectionString = './database.db'
  options.enableSqlLite = true
})
```

The database is initialized during `build()`.

Configure the database once at the application composition root and inject the required database services into application components.

## Configure Authentication

Use `addAuth()` to configure authentication:

```ts
const app = new AppBuilder()

app.addAuth((options, config) => {
  options.url = config.getOrThrow('SUPABASE_URL')
  options.key = config.getOrThrow('SUPABASE_KEY')
})
```

Authentication is initialized during `build()`.

## Configure Logging

Use `addLogger()` to configure logging:

```ts
const app = new AppBuilder()

app.addLogger((options) => {
  options.console = true
})
```

The logger configuration supports the logging providers exposed by Xeno.JS, including:

* Console
* Pino
* Sentry
* custom loggers

For example:

```ts
app.addLogger((options) => {
  options.console = true

  options.pino.config = {
    level: 'info',
  }
})
```

See the observability documentation for provider-specific configuration.

## Configure HTTP Infrastructure

Use `addHttpCore()` to configure HTTP infrastructure:

```ts
const app = new AppBuilder()

app.addHttpCore((options, config) => {
  options.http.client.baseURL = config.get(
    'API_BASE_URL',
    'https://api.example.com',
  )

  options.http.client.timeoutMs = 5000
})
```

HTTP configuration includes the HTTP client and resilience settings exposed by the current `HttpCoreConfig`.

HTTP is an infrastructure capability of Xeno.JS. It does not make HTTP the application boundary.

## Configure an HTTP Adapter

Use `addAdapter()` to configure the transport adapter:

```ts
const app = new AppBuilder()

app.addAdapter((options) => {
  options.native = true
})
```

The current adapter configuration supports:

* native
* Vercel
* Fastify
* custom adapters

Configure the adapter that matches the transport used by the application.

## Add the Concurrency Service

Use `addConcurrencyService()` when application code needs the Xeno.JS concurrency service:

```ts
const app = new AppBuilder()

app.addConcurrencyService()

await app.build()
```

The service is registered in the application container and can then be resolved through its dependency token.

## Resolve Services

`AppBuilder` exposes `resolve()` as a convenience for resolving a registered dependency:

```ts
const app = new AppBuilder()

app.addServices((services) => {
  services.addSingleton('GREETING_SERVICE', () => ({
    greet: () => 'Hello Xeno!',
  }))
})

await app.build()

const greeting = app.resolve('GREETING_SERVICE')

console.log(greeting.greet())
```

You can also use the `ServiceContainer` returned by `build()`:

```ts
const container = await app.build()

const greeting = container.resolve('GREETING_SERVICE')
```

For application code, prefer dependency injection rather than repeatedly reaching back into `AppBuilder`.

## Build the Application

Call `build()` when configuration is complete:

```ts
const container = await app.build()
```

`build()` initializes queued modules according to their priority and returns the configured `ServiceContainer`.

The important behavior is:

1. Modules are ordered by priority.
2. Each module is initialized.
3. If initialization succeeds, the application is marked as built.
4. The configured `ServiceContainer` is returned.

If module initialization fails, `build()` throws a bootstrap error identifying the module that failed.

For example:

```text
Bootstrap failed at [CacheModule]: ...
```

The original error is preserved as the cause.

## Build Only Once

`AppBuilder` keeps the built application container.

Calling `build()` again returns the same container:

```ts
const first = await app.build()
const second = await app.build()

console.log(first === second)
// true
```

Application bootstrap should therefore normally happen once during application startup.

## Module Ordering

AppBuilder queues modules with priorities so that required infrastructure is initialized before the components that depend on it.

The current built-in ordering includes:

| Priority | Module                   |
| -------: | ------------------------ |
|        0 | Context                  |
|        1 | Logger                   |
|        2 | Cache                    |
|        3 | Authentication           |
|        4 | Database / Middleware    |
|        5 | CQRS                     |
|       30 | HTTP Core                |
|       40 | Concurrency Service      |
|       50 | Adapter / custom modules |
|       99 | Application services     |

You normally do not need to manage these priorities yourself.

The important consequence is that application services registered through `addServices()` are initialized after the built-in infrastructure modules.

## A Typical Composition Root

A real application can combine the capabilities it needs:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options) => {
  options.console = true
})

app.addCache()

app.addPipeline((config) => {
  config.queryBus.isEnabled = true
})

app.addDb((options, config) => {
  options.connectionString = config.getOrThrow('DATABASE_URL')
})

app.addServices((services) => {
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

The composition root now makes the application's infrastructure and services explicit:

```text
AppBuilder
    │
    ├── Context
    ├── Logging
    ├── Cache
    ├── CQRS Pipeline
    ├── Database
    └── Application Services
             │
             ▼
       ServiceContainer
```

## AppBuilder and ServiceContainer

The two objects have different responsibilities:

| Component          | Responsibility                            |
| ------------------ | ----------------------------------------- |
| `AppBuilder`       | Compose and bootstrap the application     |
| `ServiceContainer` | Register and resolve runtime dependencies |

Use `AppBuilder` during application composition:

```ts
const app = new AppBuilder()

app.addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

await app.build()
```

Use the container to resolve runtime dependencies:

```ts
const container = await app.build()

const service = container.resolve('USER_SERVICE')
```

`AppBuilder` is therefore the composition API, while `ServiceContainer` is the runtime dependency mechanism.

## AppBuilder and the Registry

`AppBuilder` is generic over the application's registry:

```ts
const app = new AppBuilder<MyRegistry>()
```

The registry associates dependency tokens with their expected types.

This makes calls such as:

```ts
const logger = app.resolve(TOKENS.LOGGER)
```

type-safe when `TOKENS.LOGGER` is part of the registry.

See [Xeno Registry](./xeno-registry) for the registry model.

## When to Use AppBuilder

Use `AppBuilder` when defining the application's composition root.

Typical responsibilities include:

* registering application services;
* enabling application modules;
* configuring infrastructure;
* configuring context;
* configuring middleware;
* configuring CQRS pipelines;
* configuring logging;
* configuring authentication;
* configuring databases;
* configuring caches;
* configuring HTTP infrastructure.

Do not use `AppBuilder` as a general-purpose runtime service locator.

Once the application is built, application components should receive their dependencies through dependency injection.

## The Key Idea

`AppBuilder` answers one practical question:

> **How is this application composed?**

The answer should be visible in one place:

```ts
const app = new AppBuilder()

app.addLogger(...)
app.addCache(...)
app.addPipeline(...)
app.addDb(...)
app.addServices(...)

await app.build()
```

## Configure the application's capabilities and dependencies at the composition root, then hand execution over to the configured runtime

## Related Documentation

* [Service Container](../dependency-injection/service-container)
* [Registration](../dependency-injection/registration)
* [Resolution](../dependency-injection/resolution)
* [Xeno Registry](./xeno-registry)
* [CQRS Pipelines](../application/pipelines/overview)
* [Cache Overview](../cache/overview)
* [Redis Cache](../cache/redis)
* [Observability Overview](../observability/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
