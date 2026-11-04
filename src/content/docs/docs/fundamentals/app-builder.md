---
title: App Builder
description: Learn how to compose and bootstrap a Xeno.JS application with XenoAppBuilder.
keywords:
- Xeno.JS
- XenoAppBuilder
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
- question: What is XenoAppBuilder in Xeno.JS?
  answer: XenoAppBuilder is the composition root used to configure services, modules, middleware, pipelines, and infrastructure integrations before startup.
- question: How do I create a Xeno.JS application with XenoAppBuilder?
  answer: Create an XenoAppBuilder instance, configure the capabilities and services required by the application, then call build().
- question: What does build() do?
  answer: build() initializes queued modules in ascending priority order and returns the configured runtime application instance.
- question: How do I register application services?
  answer: Use addServices() to register services in the dependency-injection container during bootstrap.
- question: How do I add a custom module?
  answer: Use addModule() with a name, an asynchronous module factory, optional configuration, and an optional priority.
- question: How do I resolve a service from XenoAppBuilder?
  answer: After build(), call resolve() with a registered token. Scoped services must be resolved from an active service scope, not from the builder's root container.
- question: Does XenoAppBuilder automatically add dependencies for pipelines and middleware?
  answer: The builder adds the default Node context during build when no context has been configured. CQRS and middleware modules add a logger when needed; the default cache is added when query caching, idempotency, or rate limiting requires it.
- question: What cache does XenoAppBuilder use by default?
  answer: The default cache configuration uses the in-memory cache.
---

## Introduction

`XenoAppBuilder` is the composition root of a Xeno.JS application.

Use it to configure the application before startup:

- application services
- custom modules
- context
- middleware
- CQRS pipelines
- cache
- database
- authentication
- logging
- HTTP infrastructure
- concurrency services

The typical lifecycle is:

```text
AppBuilder
    ↓
configure
    ↓
build()
    ↓
configured runtime application
    ↓
application runtime
```

## Create an Application

Create an `XenoAppBuilder` and configure the capabilities your application needs:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/shared'

interface AppRegistry extends XenoRegistry { 
  greeting: { 
    greet(): string 
  } 
}

const app = new XenoAppBuilder<AppRegistry>()

app.addServices((services) => {
  services.addSingleton('greeting', () => ({
    greet: () => 'Hello Xeno!',
  }))
})

const application = await app.build()

const { greeting } = app.getServices()

console.log(greeting.greet())
```

There are three main steps:

1. Create the builder.
2. Configure the application.
3. Call `build()`.

Configuration methods return the same `XenoAppBuilder`, so they can also be chained.

## Register Services

Use `addServices()` to register application-specific dependencies. Its setup callback receives the service container and configuration service. The method's optional second argument sets the module priority, which defaults to `99`.

Custom service tokens used with `addServices()` must also appear in the registry type passed to `XenoAppBuilder`.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/shared'

interface UserRegistry extends XenoRegistry { 
  USER_REPOSITORY: UserRepository; 
  USER_SERVICE: UserService 
}

const app = new XenoAppBuilder<UserRegistry>()

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

In the example, `services` is the application's service container.

Choose a lifetime based on how long an instance should be reused:

- `addSingleton()` creates one instance shared by the container.
- `addScoped()` reuses an instance within a service scope. Resolve it through a scope; resolving a scoped registration from the builder's root container throws.
- `addTransient()` creates a new instance for each resolution.

Avoid injecting a scoped service into a singleton: the container rejects this captive dependency. Disposable instances are disposed with their owning scope or container.

For service lifetimes and dependency registration, see the dependency injection documentation.

## Add a Custom Module

Use `addModule()` when a feature needs to register several related services or perform its own configuration.

```ts
const app = new XenoAppBuilder<UserRegistry>()

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

An optional configuration object can be passed as the third argument. A fourth argument sets the module priority; the default is `50`, and modules run in ascending priority order:

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
  40,
)
```

Use `addRoutes()` to queue route definitions for the route module. Route registration runs during bootstrap at priority `5`.

HTTP server integrations are supplied as plugins to `addHttpServer()`; their specific setup is defined by the integration package.

## Enable Context

If no context has been configured, `build()` adds the default context module when using the Node configuration service. The builder does not configure context in its constructor.

For a Node application, the default is added automatically:

```ts
const app = new XenoAppBuilder()
```

This does not configure context in the constructor; the default Node context is queued by `build()` if you have not called `addContext()`.

You can also configure it explicitly:

```ts
const app = new XenoAppBuilder()

app.addContext()
```

When using the Vite configuration service, configure an explicit context plugin with `addContext()`; `build()` does not substitute the Node context in that environment.

The constructor optionally accepts a service container as its first argument. Its second argument selects the configuration service: it defaults to Node, and also accepts `'vite'` or a custom `IConfigurationService` instance. Select Vite when composing a browser application and provide its context plugin explicitly.

## Configure Middleware

Use `addMiddlewares()` to configure Xeno.JS middleware:

```ts
const app = new XenoAppBuilder()

app.addMiddlewares((options) => {
  options.cors = {
    enabled: true,
    withCredentials: true,
  }
})

await app.build()
```

Middleware configuration can also enable authentication-related behavior when authentication has been configured.

### Automatic Dependencies

During configuration, `addMiddlewares()` queues the middleware module. During `build()`, that module adds a logger if one has not been registered. The default middleware settings enable rate limiting, which also configures the default in-memory cache if no cache has been registered. Context is added by the build process for Node configurations, as described above.

You do not need to call `addLogger()` or `addCache()` merely to use the default middleware configuration. Add either explicitly when you need to customize its provider or settings.

If you want to configure them explicitly, configure them before or after `addMiddlewares()`:

```ts
const app = new XenoAppBuilder()

app.addLogger((options) => {
  options.console = true
})

app.addCache((options) => {
  options.inMemory = true
})

app.addMiddlewares((options) => {
  options.cors = {
    enabled: true,
  }
})
```

## Configure the CQRS Pipeline

Use `addPipeline()` to register one or more CQRS pipeline plugins:

```ts
import { XenoAppBuilder, withQueryCaching } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addPipeline(withQueryCaching())

await app.build()
```

Plugins configure pipeline behavior, including:

- performance
- authorization
- validation
- command and query behaviors

For example, `withQueryCaching()` enables query caching:

```ts
app.addPipeline(withQueryCaching())
```

### Dependencies configured by the CQRS module

The CQRS module adds a logger if none has been registered. It also adds the default in-memory cache if query caching or command idempotency is enabled and no cache has been registered. If context is not explicitly configured, the build process adds the default Node context; Vite requires an explicit context plugin.

For example:

```ts
import { XenoAppBuilder, withQueryCaching } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addPipeline(withQueryCaching())
```

This enables query caching and its cache dependency; it does not turn on unrelated pipeline behaviors.

If you need custom logging or cache configuration, configure those capabilities explicitly:

```ts
const app = new XenoAppBuilder()

app.addLogger((options) => {
  options.console = true
})

app.addCache((options) => {
  options.inMemory = true
})

app.addPipeline(withQueryCaching())
```

## Configure the Cache

Use `addCache()` to configure application caching:

```ts
const app = new XenoAppBuilder()

app.addCache((options) => {
  options.inMemory = true
})
```

The default `XenoAppBuilder` cache configuration uses the in-memory implementation:

```ts
const app = new XenoAppBuilder()

app.addCache()
```

The cache can also be configured with Redis.

See [Cache Overview](../cache/overview) and [Redis Cache](../cache/redis) for the complete cache configuration.

## Configure the Database

`addDb()` accepts a database plugin. The plugin configures and queues the provider-specific database module; `addDb()` does not accept a configuration callback directly.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { DbPlugin } from '@xeno-js/shared'

declare const databasePlugin: DbPlugin

const app = new XenoAppBuilder()
app.addDb(databasePlugin)
```

Here, `databasePlugin` is provided by the database integration selected by the application. Its options and initialization behavior are provider-specific.

Configure the database once at the application composition root and inject the required database services into application components.

## Configure Authentication

Use `addAuth()` to configure authentication:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addAuth((options, config) => {
  // ApplicationAuthService is the application's implementation of the auth contract.
  options.authService = (scope) => new ApplicationAuthService(scope)
})
```

The callback configures `AuthModuleOptions`; `authService` is required. Authentication integration details belong to the service implementation or its provider package.

## Configure Logging

Use `addLogger()` to configure logging:

```ts
const app = new XenoAppBuilder()

app.addLogger((options) => {
  options.console = true
})
```

The setup callback configures the core logger settings, including:

- log level;
- console output;
- custom logger clients.

`addLogger()` also accepts one logger plugin or an array of logger plugins. Provider-specific options belong to those plugins; the callback above only configures the core logger settings.

See the observability documentation for provider-specific configuration.

## Configure HTTP Clients

Use `addHttpClient()` to register HTTP clients. It accepts an HTTP plugin or a setup callback. The callback receives a `HttpConfig` whose `clients` entries contain a name, an `IHttpClient` factory, and an optional resilience factory.

HTTP clients are infrastructure dependencies; registering an HTTP client does not configure an inbound server.

## Configure the HTTP Server

Use `addHttpServer()` with an HTTP server plugin from the selected transport integration. Use `addRoutes()` to queue route definitions. Server and transport options are integration-specific.

## Add the Concurrency Service

Use `addConcurrencyService()` when application code needs the Xeno.JS concurrency service. It registers a singleton available through `TOKENS.CONCURRENCY_SERVICE`:

```ts
import { XenoAppBuilder, TOKENS } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addConcurrencyService()

await app.build()

const { concurrencyService } = app.getServices()
```

This service is separate from the command retry behavior configured with a CQRS pipeline plugin.

## Resolve Services

`XenoAppBuilder` exposes `resolve()` as a convenience for resolving a registered dependency:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/shared'

interface AppRegistry extends XenoRegistry { 
  greeting: { 
    greet(): string 
  } 
}

const app = new XenoAppBuilder<AppRegistry>()

app.addServices((services) => {
  services.addSingleton('greeting', () => ({
    greet: () => 'Hello Xeno!',
  }))
})

await app.build()

const { greeting } = app.getServices()

console.log(greeting.greet())
```

`build()` does not return the `ServiceContainer`; it returns the configured runtime application instance. Use the builder's `resolve()` method for root-container registrations:

```ts
const greeting = app.resolve('GREETING_SERVICE')
```

Root resolution cannot retrieve scoped services. Resolve those from an active service scope instead. For application code, prefer dependency injection rather than repeatedly reaching back into `XenoAppBuilder`.

## Build the Application

Call `build()` when configuration is complete:

```ts
const application = await app.build()
```

`build()` initializes queued modules according to their priority and returns the configured runtime application instance (by default, a `XenoApplication`). It does not expose the container as its return value.

The important behavior is:

1. Modules are ordered by priority.
2. Each module is initialized.
3. If all modules initialize successfully, the configured runtime application instance is returned.

If module initialization fails, `build()` throws a bootstrap error identifying the module that failed.

For example:

```text
Bootstrap failed at [CacheModule]: ...
```

The module failure is logged and wrapped in a bootstrap error; the original error is preserved as its cause.

## Build Only Once

After a successful build, `XenoAppBuilder` keeps the build promise and returns the same runtime application instance on subsequent calls:

```ts
const first = await app.build()
const second = await app.build()

console.log(first === second)
// true
```

If a build fails, the builder clears the failed promise, disposes and recreates its container, and a subsequent `build()` call can retry after that reset. Application bootstrap should normally happen once during startup.

## Module Ordering

AppBuilder queues modules with priorities and initializes them in ascending order. Integrations do not declare dependency relationships automatically; choose a priority when a custom module must run before or after another module. The source-defined priorities include:

| Priority | Module                   |
| -------: | ------------------------ |
|        0 | Context                  |
|        1 | Logger                   |
|        2 | Cache                    |
|        2 | Authentication           |
|        4 | Middleware               |
|        5 | CQRS and Routes          |
|       40 | Concurrency Service      |
|       50 | Custom modules (default) |
|       99 | Application services     |

The HTTP client module and custom modules use priority `50` unless another priority is specified. Database and HTTP server plugins can queue provider-specific modules, so their priorities depend on the integration.

`addServices()` uses priority `99` by default, so its registrations run after the built-in modules listed above.

## A Typical Composition Root

A real application can combine the capabilities it needs:

```ts
import { XenoAppBuilder, withQueryCaching } from '@xeno-js/core'
import type { DbPlugin, XenoRegistry } from '@xeno-js/shared'

interface AppRegistry extends XenoRegistry { 
  USER_REPOSITORY: UserRepository; 
  USER_SERVICE: UserService 
}

declare const databasePlugin: DbPlugin<AppRegistry>

const app = new XenoAppBuilder<AppRegistry>()

app.addLogger((options) => {
  options.console = true
})

app.addCache()

app.addPipeline(withQueryCaching())

// databasePlugin is supplied by the selected database integration.
app.addDb(databasePlugin)

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

const application = await app.build()
```

The composition root now makes the application's infrastructure and services explicit:

```text
AppBuilder
    │
    ├── Context
    ├── Logging
    ├── Cache
    ├── CQRS Pipeline
    ├── Database integration
    └── Application Services
             │
             ▼
configured runtime application
```

## XenoAppBuilder and ServiceContainer

The builder and its internal service container have different responsibilities:

| Component          | Responsibility                            |
| ------------------ | ----------------------------------------- |
| `XenoAppBuilder`       | Compose and bootstrap the application     |
| `ServiceContainer` | Register and resolve runtime dependencies |

Use `XenoAppBuilder` during application composition:

```ts
const app = new XenoAppBuilder<UserRegistry>()

app.addServices((services) => {
  services.addScoped('USER_SERVICE', () => {
    return new UserService()
  })
})

await app.build()
```

The builder retains the dependency-injection container internally; `build()` returns the runtime application rather than that container. Resolve root registrations through the builder:

```ts
import { XenoAppBuilder, TOKENS } from '@xeno-js/core'

const app = new XenoAppBuilder()
app.addLogger()
await app.build()

const { logger } = app.getServices()
```

`XenoAppBuilder` is the composition API and uses `ServiceContainer` internally for dependency registration and resolution. A scoped service cannot be resolved through the root builder; it needs an active scope. The returned runtime instance is discussed separately in the XenoApplication documentation.

## XenoAppBuilder and the Registry

`XenoAppBuilder` is generic over the application's registry. Add custom service tokens to the registry so that registration and resolution remain type-safe:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { XenoRegistry } from '@xeno-js/shared'

interface AppRegistry extends XenoRegistry { 
  GREETING_SERVICE: { 
    greet(): string 
  }
}

const app = new XenoAppBuilder<AppRegistry>()
```

The registry associates dependency tokens with their expected types.

This makes calls such as:

```ts
import { TOKENS } from '@xeno-js/core'

const logger = app.resolve(TOKENS.LOGGER)
```

type-safe when `TOKENS.LOGGER` is part of the registry.

See [Xeno Registry](./xeno-registry) for the registry model.

## When to Use XenoAppBuilder

Use `XenoAppBuilder` when defining the application's composition root.

Typical responsibilities include:

- registering application services;
- enabling application modules;
- configuring infrastructure;
- configuring context;
- configuring middleware;
- configuring CQRS pipelines;
- configuring logging;
- configuring authentication;
- configuring databases;
- configuring caches;
- configuring HTTP infrastructure.

Do not use `XenoAppBuilder` as a general-purpose runtime service locator.

Once the application is built, application components should receive their dependencies through dependency injection.

## The Key Idea

`XenoAppBuilder` answers one practical question:

> **How is this application composed?**

The answer should be visible in one place:

```ts
const app = new XenoAppBuilder()

app.addLogger(...)
app.addCache(...)
app.addPipeline(...)
app.addDb(...)
app.addServices(...)

await app.build()
```

Configure the application's capabilities and dependencies at the composition root, then hand execution to the configured runtime.

## Related Documentation

- [Service Container](../dependency-injection/service-container)
- [Registration](../dependency-injection/registration)
- [Resolution](../dependency-injection/resolution)
- [Xeno Registry](./xeno-registry)
- [CQRS Pipelines](../application/pipelines/overview)
- [Cache Overview](../cache/overview)
- [Redis Cache](../cache/redis)
- [Observability Overview](../observability/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
