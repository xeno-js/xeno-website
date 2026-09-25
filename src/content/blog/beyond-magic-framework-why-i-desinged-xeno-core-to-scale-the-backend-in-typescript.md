---
title: "How I implemented CSRF protection in TypeScript with Xeno.JS"
description: "Discover why Xeno Core was designed to scale TypeScript backends without \"magic\" or hidden decorators, focusing instead on DDD, CQRS, and explicit Dependency Injection."
keywords: 'Xeno.JS, Xeno Core, TypeScript backend framework, Domain-Driven Design, CQRS, Explicit Dependency Injection, Clean Architecture, AsyncLocalStorage, AppBuilder, @xeno-js/core'
author: "Xeno"
pubDate: 2026-09-24
robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
---

## Beyond "Magic" Frameworks: Why I Designed Xeno Core to Scale the Backend (and the Entire Ecosystem) in TypeScript

When managing the development of complex software systems in Node.js, the choice of architectural framework determines the long-term fate of the code. Developers often face a crossroads: relying on monolithic, "magical" frameworks that make heavy use of experimental decorators and reflection (such as `reflect-metadata`)—thereby accepting their global rules—or building everything from scratch, risking a descent into "spaghetti code" and structural inconsistency.

As Tech Leads and developers, we know that enterprise maintainability requires deterministic control, zero runtime surprises, and clear architectural boundaries.

It is precisely from this need that Xeno.JS—and specifically its core engine, Xeno Core (`@xeno-js/core`)—was born.

---

## What is Xeno Core, and what sets it apart?

Xeno Core is an enterprise architectural framework—runtime-agnostic and strictly typed in TypeScript—designed from the ground up to implement Domain-Driven Design (DDD), Command Query Responsibility Segregation (CQRS), and pure, explicit Dependency Injection (DI).

Unlike other tools, Xeno Core stands out thanks to three fundamental pillars:
* **Zero Magic Decorators:** No hidden magic or directory auto-scanning based on `reflect-metadata`. The Inversion of Control container (`ServiceContainer`) relies on explicit, functional factories, ensuring total control over the dependency graph at compile time.
* **Complete Decoupling from the Transport Layer:** Xeno does not mandate a specific HTTP server. Whether you are using Fastify, Hono, or a serverless architecture on AWS Lambda, your business logic remains intact and isolated thanks to clean presentation contracts.
* **Asynchronous Context Isolation:** By natively leveraging `AsyncLocalStorage`, the engine manages request-scoped lifecycles, tracking tracing metadata (`correlationId`, `requestId`) and multi-tenant identities in a thread-safe manner.

---

## The Full-Stack Philosophy: Beyond the Backend

Although Xeno Core handles the server-side backbone, the Xeno ecosystem was conceived with an isomorphic and holistic vision.

Fragmentation between client and server is a major source of technical debt. To address this, the ecosystem consists of integrated modules:
* **`@xeno-js/shared`:** The isomorphic foundation uniting server and client through universal contracts, standardized DTOs (`ResponseDto`), and runtime validation utilities.
* **`@xeno-js/vue`:** The native browser extension bringing DDD, CQRS, and Dependency Injection (`XenoAppBuilder`) directly into Vue.js applications, featuring reactive composables and cooperative cancellation (`AbortSignal`).
* **`@xeno-js/cli`:** An enterprise-grade code generator that automates the scaffolding of projects, commands, queries, and handlers in seconds.

---

## Architecture in Action: Configuring Xeno Core with AppBuilder

The heart of Xeno Core is the `AppBuilder`, a fluent bootstrapper that orchestrates modules, registrations, and execution priorities in a clean, sequential manner. 

Here is a practical example of how to configure the IoC container, enable security middleware, set up CQRS pipelines (including idempotency and concurrency management), and register services within a Node.js application:

```typescript
import { AppBuilder, LOG_LEVEL, TOKENS, XenoRegistry } from '@xeno-js/core'
import { FindUserQueryHandler } from './user/cqrs/handlers/find-user.handler'
import { FindUserController } from './user/controllers/find-user.controller'
import { UserMapper } from './user/mappers/user.mapper'
import { UserWriteRepository } from './user/repositories/user-write.repository'
import { UserDataSource } from './user/datasources/user.datasource'

// 1. Declare the strongly typed register.
type AppRegistry = XenoRegistry<{ /* Schema Database */ }, {
  USER_MAPPER_TOKEN: UserMapper
  USER_DS_TOKEN: UserDataSource
  USER_REPOSITORY_TOKEN: UserWriteRepository
  FIND_USER_QUERY_HANDLER_TOKEN: FindUserQueryHandler
  FIND_USER_CONTROLLER_TOKEN: FindUserController
}>

// 2. Build the container using AppBuilder.
export async function bootstrap() {
  const builder = new AppBuilder<AppRegistry>()
    
    // Configuration of presentation and security middleware
    .addMiddlewares((opts, config) => {
      opts.routeRegistry = {
        '/api/v1/users/:id': ['GET', 'DELETE'],
      }
      opts.rateLimit = {
        maxRequests: 30,
        windowSeconds: 60
      }
      opts.isSSR = true
      opts.cors = true
      opts.optionsMiddleware = true
      opts.allowOrigins = ['http://localhost:5173']
      opts.withCredentials = true
      opts.allowHeaders = [
        'Content-Type',
      ]
      opts.csrf = {
        secret: config.getOrThrow('CSRF_SECRET'),
        cookieName: config.getOrThrow('CSRF_COOKIE_NAME'),
        headerName: config.getOrThrow('CSRF_COOKIE_HEADER'),
        cookieMaxAgeSeconds: 3600,
        sameSite: 'lax',
      }
    })

    // Configuring CQRS pipelines and cross-cutting behaviors
    .addPipeline((config) => {
      // Defining authorization policies for intents
      config.authorization.policies = {
        'FIND_USER_QUERY_HANDLER_TOKEN': {
          userId: true,
          tenantId: true,
          roles: ['admin', 'manager'],
        },
      }
      // Idempotency and retries with jitter for command concurrency
      config.commandBus.idempotency = { lockTtlSeconds: 30, processedTtlSeconds: 60 }
      config.commandBus.concurrency = { maxRetries: 3, delayConfig: { baseDelayMs: 100, maxJitterMs: 500 } }
      // Enabling in-memory caching for queries
      config.queryBus.isEnabled = true
    })

    // Configuring Database (es. Drizzle ORM)
    .addDb((opts, config) => {
      opts.connectionString = config.getOrThrow('DATABASE_URL')
    })

    // Security configuration and authentication (es. Supabase)
    .addAuth((opts, config) => {
      opts.url = config.getOrThrow('SUPABASE_URL')
      opts.key = config.getOrThrow('SUPABASE_KEY')
    })

    // Configuration of the composite logging system
    .addLogger((opts, config) => {
      opts.level = LOG_LEVEL.INFO
      opts.console = true
      opts.sentry.config = config.get('NODE_ENV') !== 'development' ? { dsn: config.getOrThrow('SENTRY_DSN'), environment: config.getOrThrow('SENTRY_ENVIRONMENT') } : undefined
    })

    // Explicit registration of services in the IoC container
    .addServices((services) => {
      services.addScoped('USER_MAPPER_TOKEN', () => new UserMapper())
      services.addScoped('USER_DS_TOKEN', (c) => new UserDataSource(c.resolve(TOKENS.DB_CONTEXT)))
      services.addScoped('USER_REPOSITORY_TOKEN', (c) => new UserWriteRepository(c.resolve('USER_DS_TOKEN'), c.resolve('USER_MAPPER_TOKEN')))
      
      services.addScoped('FIND_USER_QUERY_HANDLER_TOKEN', (c) => {
        return new FindUserQueryHandler(c.resolve('USER_REPOSITORY_TOKEN'), c.resolve(TOKENS.USER_CONTEXT_FACTORY))
      })

      services.addTransient('FIND_USER_CONTROLLER_TOKEN', (c) => {
        return new FindUserController(c.resolve(TOKENS.CONTEXT_ACCESSOR), c.resolve(TOKENS.MEDIATOR))
      })
    })

  return await builder.build()
}

```

---

## Why adopt Xeno for your next project?

If you are tired of chasing the latest "magic" framework that breaks compatibility with every minor release, Xeno.JS offers a solution focused on industrial-grade stability:

* **Predictability** — no hidden behaviors; every component is explicit and testable in isolation.
* **Full-stack alignment** — enables the team to use the same architectural patterns (Handlers, Commands, Queries, Result Monads) across both the Node.js backend and the Vue.js frontend.

* **Production-ready** — includes native resilience management (circuit breakers, retries), advanced security (dual-token CSRF, GDPR-compliant log masking), and long-term maintainability.

The packages are fully open-source, modular, and available on npm:

* Core: `npm install @xeno-js/core`
* Vue: `npm install @xeno-js/vue`
* Shared: `npm install @xeno-js/shared`
* CLI: `npx @xeno-js/cli`

---

Head over to the GitHub repository [Xeno GitHub Repository](https://github.com/xeno-js/xeno-js), leave a ⭐ if you appreciate the engineering approach, and try integrating Xeno into your next clean TypeScript architecture!