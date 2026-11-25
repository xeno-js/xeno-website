---
title: Vue Plugin
description: Learn how to use the Xeno.JS Vue plugin with Pinia context, mediator, and typed service access in Vue applications.
keywords:
- Xeno.JS Vue plugin
- withPiniaContext
- ServicesUtils
- Xeno.JS Vue integration
- CQRS in Vue
- Pinia request context
- Vue mediator pattern
tags:
- vue
- plugin
- context
- cqrs
- pinia
faqs:
- question: How do I enable the Xeno.JS Vue plugin?
  answer: Use addContext(withPiniaContext()) in XenoAppBuilder configured for Vite.
- question: Why is withPiniaContext required in Vue?
  answer: In Vite/browser applications, context is not auto-configured; withPiniaContext registers the request context and mediator wiring needed for CQRS execution.
- question: How do I access Xeno services inside a composable?
  answer: Call ServicesUtils.useApp() and read services such as mediator, logger, or configurationService.
- question: How do I expose Xeno services to Vue components?
  answer: After build(), call ServicesUtils.provide(app, xenoApp) before mounting the Vue app.
- question: What does requestIdWindowMs do?
  answer: It keeps the same generated requestId for requests executed within the configured time window, then rotates it for subsequent requests.
---

## Introduction

`@xeno-js/vue` provides the integration layer between Xeno.JS and a Vue + Pinia application.

The plugin solves three runtime needs:

1. create and expose request context in the browser;
2. wire a Vue-aware mediator that initializes and closes request boundaries;
3. expose Xeno services to Vue code through dependency injection (`provide`/`inject`) and a utility API.

In short, it lets Vue composables and components use `mediator.send()` / `mediator.query()` with the same pipeline model used by Xeno.JS applications.

## Before you start

You need:

- a Vue app (`createApp`);
- Pinia (`createPinia`);
- an `XenoAppBuilder` configured for Vite;
- your typed registry (for application handlers/services).

From the provided context:

- registry type: `MyRegistry`;
- bootstrap setup in `main.ts`;
- composable usage with `ServicesUtils.useApp()`.

## Install and enable the plugin

In a Vue app, configure the builder with Vite and add the context plugin:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPiniaContext } from '@xeno-js/vue'

const builder = new XenoAppBuilder<MyRegistry>(undefined, 'vite')
  .addContext(withPiniaContext({ requestIdWindowMs: 5000 }))
```

`withPiniaContext()` is the key integration point for Vue.

## How `withPiniaContext()` works

When enabled, the plugin:

1. creates a frontend DI scope (`createScope()`);
2. creates `VueRequestContext` bound to that scope;
3. registers a Vue-aware `Mediator` singleton;
4. registers `ContextModule` with the custom request context;
5. optionally configures request-id windowing via Pinia store (`requestIdWindowMs`).

Conceptually:

```text
Vue App
  ↓
XenoAppBuilder (vite)
  ↓ addContext(withPiniaContext)
Context + Mediator wiring
  ↓
build()
  ↓
xenoApp.getServices()
  ↓
ServicesUtils.provide(app, xenoApp)
  ↓
ServicesUtils.useApp() in composables/components
```

## Complete bootstrap example (from your context)

The following pattern is the one used in your `main.ts`:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { XenoAppBuilder } from '@xeno-js/core'
import { ServicesUtils, withPiniaContext } from '@xeno-js/vue'

const app = createApp(App)
app.use(createPinia())

const builder = new XenoAppBuilder<MyRegistry>(undefined, 'vite')
  .addContext(withPiniaContext({ requestIdWindowMs: 5000 }))
  // addLogger(...)
  // addCache(...)
  // addPipeline(...)
  // addHttpClient(...)
  // addServices(...)

const xenoApp = await builder.build()
ServicesUtils.provide(app, xenoApp)

app.use(router)
app.mount('#app')
```

Important: call `ServicesUtils.provide(app, xenoApp)` before trying to access services with `useApp()`.

## Register typed handlers in the registry

Your Vue app uses a typed registry:

```ts
export interface MyRegistry extends XenoRegistry {
  CREATE_ORDER: IHandler<CreateOrderCommand, void>
  GET_PRODUCTS: IHandler<GetProductsQuery, IPaginatedResult<ProductDto>>
  // ...
}
```

This keeps request intent tokens (`CREATE_ORDER`, `GET_PRODUCTS`, etc.) and handler result types aligned at compile time.

## Resolve services in composables

Inside a composable, access services through `ServicesUtils.useApp()`:

```ts
import { ServicesUtils } from '@xeno-js/vue'

const { mediator } = ServicesUtils.useApp()
```

From your `useCreateOrder` composable:

```ts
const command = new CreateOrderCommand(items)
const result = await mediator.send(command)
```

This is the recommended integration style for Vue presentation logic.

## Request lifecycle in Vue

The Vue mediator in `@xeno-js/vue` wraps each request lifecycle:

1. `initRequest()` is called before pipeline execution;
2. command/query is executed through the configured pipelines;
3. `stopRequest()` is always called in `finally`.

This ensures context cleanup even when the request fails.

## Request context fields provided in browser

Through the Pinia context store, the plugin provides:

- identity (default guest when not set);
- network context (`requestId`, `userAgent`, `path`, `origin`, cookies, csrf);
- tracing context (`correlationId`, `spanId`, `startTime`, `referer`);
- active request context caching for the current request lifecycle.

`requestIdWindowMs` controls when request IDs rotate. Requests in the same time window reuse the same generated request ID; after the window, a new one is generated.

## Update identity during runtime

Identity is managed by the request context. When auth/session flows update identity, downstream pipelines and handlers can read the updated context in subsequent requests.

In your app, this works together with auth handlers such as `CHECK_SESSION`, `LOGIN`, `LOGOUT`, and `SYNC_USER`.

## Troubleshooting

### `XenoServices not found...`

If you see:

```text
[Xeno Error]: XenoServices not found. Did you provide them using app.provide(XENO_SERVICES_KEY, services)?
```

it means `ServicesUtils.provide(app, xenoApp)` was not executed (or executed too late).

### `mediator` is undefined in composables

Verify:

- builder `build()` completed;
- services were provided to Vue app;
- composable runs after app initialization.

### Pipelines or handlers are not executed

Verify:

- `addPipeline(...)` is configured;
- request intent key in command/query matches the registered handler token in `addServices(...)`;
- registry keys and runtime registrations are aligned.

## Best practices

- Keep `withPiniaContext()` as the context plugin for Vue/Vite builds.
- Keep `ServicesUtils.provide()` in bootstrap and `useApp()` in presentation code.
- Use typed registry keys consistently across command/query, handler registration, and validation schema maps.
- Keep composables focused on orchestration (`mediator.send/query`) and UI state (`loading`, `error`).

## Related documentation

- [Fundamentals Overview](../fundamentals/overview)
- [Context and Scopes](../fundamentals/context-scopes)
- [Creating Commands](../application/cqrs/command)
- [Creating Queries](../application/cqrs/query)
- [Validation Pipeline](../application/pipelines/validation)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)