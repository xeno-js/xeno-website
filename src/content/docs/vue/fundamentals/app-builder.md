---
title: 'AppBuilder & Lazy Bootstrapping: Frontend IoC and Code-Splitting'
description: 'Technical specification for XenoAppBuilder in Vue. Learn how to configure the frontend IoC container, utilize dynamic imports for Web Vitals optimization, and bootstrap the ClientMediator.'
keywords: 'XenoAppBuilder, Vue IoC, Dependency Injection Vue, Code-Splitting, Lazy Bootstrapping, Vite, Frontend Architecture, Xeno'
author: 'Xeno'
---

# AppBuilder & Lazy Bootstrapping in Vue

In modern Single Page Applications (SPAs), bundle size directly impacts Core Web Vitals (such as Largest Contentful Paint and Time to Interactive). Loading heavy infrastructural dependencies (like logging SDKs, caching engines, or resilience libraries) during the initial browser parse phase degrades the user experience.

Xeno Vue solves this through the **`XenoAppBuilder`**: a fluent composition root that enforces pure Dependency Injection (DI) while aggressively utilizing dynamic imports (`import()`) to defer the resolution of non-critical infrastructure modules until the actual bootstrap execution.

---

## What is XenoAppBuilder?

The `XenoAppBuilder` is the programmatic entry point for configuring your frontend architecture. It acts as a deterministic Inversion of Control (IoC) container builder, replacing the implicit, "magic" injection mechanisms often found in native Vue plugins.

Instead of globally registering mixins or polluting the Vue prototype, `XenoAppBuilder` constructs a strongly-typed, frozen registry (`XenoVueRegistry`) containing all your handlers, logging clients, data sources, and CQRS pipelines. This registry is then securely provided to the Vue component tree.

---

## The Performance Advantage: Lazy Bootstrapping

The primary architectural difference between the backend `AppBuilder` and the frontend `XenoAppBuilder` is how modules are loaded into memory.

When you chain configuration methods (e.g., `.addLogger()`, `.addPipeline()`), the builder does not instantiate the underlying classes immediately. Instead, it registers a `SetupAction` callback and pushes an asynchronous task into an internal queue.

These tasks utilize **ECMAScript dynamic imports** to load the corresponding modules (and their external heavy dependencies, like `@sentry/vue` or `cockatiel`) only when `.build()` is explicitly invoked:

```typescript
// Internal XenoAppBuilder mechanics (Example)
this._tasks.push(async (services) => {
  // The LoggerModule and its dependencies are NOT bundled in the main chunk
  const { LoggerModule } = await import('../modules/logger.module');
  const logger = await LoggerModule.create(this._loggerConfig, services.contextAccessor);
  services.logger = logger;
});

```

This ensures that Vite (or Webpack) can automatically code-split your infrastructure logic, keeping the initial `main.ts` payload extremely lightweight.

---

## Configuring the Builder Pipeline

The `XenoAppBuilder` exposes a fluent API designed to orchestrate the configuration of core frontend subsystems. Each method accepts a configuration callback, granting you access to environment variables via the `IConfigurationService`.

### 1. Context and Environment

The `.addContext()` method initializes the browser-specific context accessor (`RequestContextAccessor`), which is responsible for generating request IDs and tracking the network state (user agent, current path).

```typescript
builder.addContext((opts, config) => {
  // Custom context configuration
});

```

### 2. Observability (Logging & Sentry)

The `.addLogger()` method configures the composite logger. You can toggle standard console output or dynamically inject remote APM trackers like Sentry.

```typescript
builder.addLogger((opts, config) => {
  opts.console = config.get('VITE_APP_ENV') === 'development';
  opts.sentry = {
    dsn: config.getOrThrow('VITE_SENTRY_DSN'),
    env: config.get('VITE_APP_ENV') ?? 'production',
  };
});

```

### 3. Identity and Authentication

The `.addAuth()` method provisions the authentication module (e.g., Supabase). It maps the credentials and handles session storage configuration.

```typescript
builder.addAuth((opts, config) => {
  opts.url = config.getOrThrow('VITE_SUPABASE_URL');
  opts.key = config.getOrThrow('VITE_SUPABASE_KEY');
});

```

### 4. Remote Data Sources and Resiliency

The `.addHttpCore()` method securely registers remote API clients. It isolates `Axios` instances and wraps them in `Cockatiel` resilience policies (retries, circuit breakers) without leaking HTTP specifics into your UI.

```typescript
builder.addHttpCore('BFF_REMOTE_DS', (opts, config) => {
  opts.client = {
    baseURL: config.getOrThrow('VITE_API_BASE_URL'),
    timeoutMs: 10000,
  };
  opts.resilience = { retry: { attempts: 3 } };
  opts.factory = (http, resilience) => new BffRemoteDataSource(http, resilience);
});

```

### 5. CQRS Pipelines

The `.addPipeline()` method orchestrates the `ClientMediator`. It enables cross-cutting behaviors such as client-side schema validation (Zod), performance tracking, and aggressive in-memory query caching.

```typescript
builder.addPipeline((config) => {
  config.queryCaching = true;
  config.threshold = 300; // Log performance warnings if handlers take > 300ms
});

```

### 6. Application Services and Handlers

Finally, `.addServices()` acts as the terminal configuration block where you map your custom domain logic (CQRS Handlers) to the strictly-typed registry.

```typescript
builder.addServices((config, register, services) => {
  register('CREATE_USER_HANDLER', new CreateUserHandler(services.BFF_REMOTE_DS));
});

```

---

## The Build Phase: Finalizing the Registry

Once the configuration chain is complete, invoking `await builder.build()` triggers the resolution phase:

1. It sequentially executes all queued asynchronous tasks.


2. It triggers the dynamic imports for modules like `AuthModule`, `PipelineModule`, and `LoggerModule`.


3. It populates a `Partial<TRegistry>` object with the instantiated services.


4. It freezes the object (`Object.freeze`) to prevent runtime mutations and returns it as a fully initialized, strictly-typed `XenoVueRegistry`.



```typescript
// src/bootstrap.ts
export async function bootstrap() {
  return await builder.build();
}

```

If any configuration is missing (e.g., a missing environment variable flagged by `config.getOrThrow()`) or a module fails to load, the builder throws a critical runtime error, preventing the Vue application from mounting in a corrupted state.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)