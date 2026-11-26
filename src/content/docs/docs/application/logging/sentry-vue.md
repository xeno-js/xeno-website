---
title: Sentry Vue Logger
description: Configure Sentry error tracking, Vue Router tracing, and session replay in a Xeno.JS frontend, with practical guidance on log levels and privacy.
keywords:
  - Xeno.JS
  - Sentry Vue
  - Vue 3
  - frontend logging
  - error tracking
  - Vue Router
  - session replay
  - tracing
  - TypeScript
tags:
  - observability
  - logging
  - sentry
  - vue
  - frontend
  - typescript
faqs:
  - question: How do I add Sentry to a Xeno.JS Vue application?
    answer: Register withSentryVueLogger() with XenoAppBuilder.addLogger(), supply the Vue app and DSN, and build the application before mounting Vue.
  - question: Does the Sentry Vue plugin require Vue Router?
    answer: No. Pass a router to attach browser tracing to it; without one, the plugin creates browser tracing without a router.
  - question: What is the default Sentry Vue log level?
    answer: The Sentry Vue logger defaults to WARN. Set its level option to DEBUG, INFO, WARN, or ERROR, subject to the application logger's minimum level.
  - question: Does disabling the Sentry Vue plugin initialize Sentry?
    answer: No. Setting isEnabled to false skips registration of the Sentry logger and its SDK initialization.
  - question: Is session replay enabled by default?
    answer: The plugin includes the replay integration and defaults to a 0.1 session sample rate and a 1.0 error sample rate. Review privacy and consent requirements before enabling replay.
  - question: Can Sentry Vue be used during server-side rendering?
    answer: The package configures the browser SDK. Disable the plugin during server-side rendering and initialize it only for the browser instance.
---

## Sentry for Vue frontends

`@xeno-js/sentry-vue` connects a Vue application to Sentry through the Xeno.JS logger. Register `withSentryVueLogger()` during bootstrap, then use the application's `ILogger` instead of resolving a separate Sentry logger.

The plugin initializes `@sentry/vue` with browser tracing and session replay integrations. It can attach tracing to Vue Router when a router is supplied. For server applications, use the separate [Sentry Node logger](/docs/application/logging/sentry-node).

## Install

In an existing Vue 3 application using Vite, install the Xeno.JS packages and Pinia integration:

```bash
npm install @xeno-js/core @xeno-js/vue @xeno-js/sentry-vue pinia
```

The Sentry Vue package depends on `@sentry/vue`. Install `vue-router` when your application uses routing. The plugin works without a router.

## Configure Sentry during Vue bootstrap

This example enables Sentry in production browser builds, attaches the Vue app and router, and disables replay sampling until your application has established an appropriate privacy and consent policy.

Set `VITE_SENTRY_DSN` to the public DSN for the frontend Sentry project. Vite exposes `VITE_` variables in client bundles, so do not put secrets in them.

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { LOG_LEVEL, withConsoleLogger, XenoAppBuilder } from '@xeno-js/core'
import { withSentryVueLogger } from '@xeno-js/sentry-vue'
import { ServicesUtils, withPiniaContext } from '@xeno-js/vue'

import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(createPinia())

const xenoApp = await new XenoAppBuilder(undefined, 'vite')
  .addContext(withPiniaContext())
  .addLogger([
    withConsoleLogger((options) => {
      options.isEnabled = config.getEnvironment() === 'development'
      options.level = LOG_LEVEL.DEBUG
    }),
    withSentryVueLogger((options, config) => {
      options.isEnabled = !import.meta.env.SSR && config.getEnvironment() === 'production'
      if (!options.isEnabled) return

      const dsn = config.getOrThrow('VITE_SENTRY_DSN')

      options.dsn = dsn
      options.environment = config.getEnvironment()
      options.app = app
      options.router = router
      options.level = LOG_LEVEL.WARN
      options.tracesSampleRate = 0.2
      options.replaysSessionSampleRate = 0
      options.replaysOnErrorSampleRate = 0
    }),
  ])
  .build()

ServicesUtils.provide(app, xenoApp)
app.use(router)
app.mount('#app')
```

`App.vue` and `router` belong to the application. Omit `options.router` and `app.use(router)` when the frontend does not use Vue Router. Supplying the router before installing it lets Sentry configure router tracing during bootstrap.

`withPiniaContext()` provides the browser context used by Xeno.JS services. Install Pinia before building and call `ServicesUtils.provide()` before using the logger from Vue components. See [Vue Plugin](/docs/vue/plugin-vue) for the context and service lifecycle.

### Options

| Option | Purpose |
| --- | --- |
| `isEnabled` | Controls whether the Xeno.JS plugin registers the provider. Defaults to `true`. |
| `dsn` | Identifies the Sentry project receiving browser events. |
| `app` | Supplies the Vue app to the Sentry Vue SDK. |
| `router` | Supplies Vue Router to the browser tracing integration. Optional. |
| `environment`, `release` | Label events with the deployment environment and release. |
| `level` | Sets the Sentry logger's minimum Xeno.JS log level. Defaults to `LOG_LEVEL.WARN`. |
| `tracesSampleRate` | Sampling rate for tracing. Defaults to `0.2`. |
| `replaysSessionSampleRate` | Sampling rate for session replay. Defaults to `0.1`. |
| `replaysOnErrorSampleRate` | Error-triggered replay sampling rate. Defaults to `1.0`. |

Rates range from `0` to `1`. The factory includes browser tracing and replay integrations even when a sample rate is zero. Supplying a custom `integrations` option replaces the factory's integration array; include any integrations you still need.

`isEnabled` is the Xeno.JS plugin switch. When it is `false`, the plugin skips the provider factory and does not initialize Sentry. It is distinct from Sentry SDK options passed through to `Sentry.init()`.

The setup callback receives the Xeno.JS configuration service. In Vite mode, its keys use the `VITE_` prefix and `getEnvironment()` reads the Vite mode. The current Vite configuration service converts a missing value to the string `"undefined"`, so `getOrThrow()` alone is not sufficient to validate a missing DSN. The example checks the Vite environment variable directly.

## Use the application logger

After building and providing the application, use the combined Xeno.JS logger in a Vue component or composable:

```ts
import { ServicesUtils } from '@xeno-js/vue'

const { logger } = ServicesUtils.useApp()

logger.warn('Unable to load the latest catalog')
logger.error('Checkout request failed', new Error('Request failed'))
```

Outside Vue presentation code, use `xenoApp.getServices().logger` or inject `ILogger` into an application service. `logger.error()` takes the message first and an error value second; `logger.warn()`, `logger.info()`, and `logger.debug()` take a message.

Use the logger after `ServicesUtils.provide()` when the Vue context plugin is active. The logger reads the current context when it emits an event.

### Log levels and event mapping

The application logger applies its minimum level before the Sentry Vue provider applies `options.level`. Both thresholds must allow an event. In the bootstrap example, the console plugin sets the application minimum to `DEBUG`, and the Sentry provider accepts `WARN` and above.

Sentry Vue maps `DEBUG`, `INFO`, `WARN`, and `ERROR` to Sentry severities `debug`, `info`, `warning`, and `error`. Unlike the Node provider, the Vue provider can receive `DEBUG` and `INFO` when its level and the application minimum allow them.

The provider calls `captureException()` when it receives an error value; otherwise it calls `captureMessage()` with the mapped severity. The core application logger currently normalizes every error argument into an object, including an omitted error on `warn()`, `info()`, and `debug()`. Consequently, normal calls through `ILogger` reach the Vue provider's exception path even for a warning without an explicit error. The original `Error` is also normalized to an object before reaching the provider. Check event grouping and stack presentation in your Sentry project rather than assuming the original exception object is passed unchanged.

The provider attaches the log message as `log_message` on the Sentry scope when it captures an exception. It adds the available safe logging context as event extras.

## Tracing, replay, and privacy

The plugin creates a browser tracing integration with the configured router, or without a router when none is supplied. `tracesSampleRate` controls the configured trace sampling rate; it does not change the Sentry logger's severity threshold.

Session replay can contain information from a user's browser session. Review Sentry's replay masking and blocking settings, your application's consent requirements, and your data-retention policy before collecting sessions. The bootstrap example sets both replay sampling rates to zero. Raising either rate should be a deliberate production decision.

Xeno.JS restricts the request fields copied into the logging context, but the result can still contain identifiers, paths, origins, tracing information, and messaging metadata. Error messages, normalized error properties, browser instrumentation, and replay can contain additional data. Do not log credentials, tokens, personal data, or sensitive payloads. Configure Sentry-side filtering and SDK hooks to suit your application; the Vue plugin does not configure a Zod error filter.

## Vite SSG and server-side rendering

The browser SDK should only initialize in the browser. In a Vite SSG callback, use the callback's `isClient` flag when configuring the provider:

```ts
withSentryVueLogger((options, config) => {
  options.isEnabled = isClient && config.getEnvironment() === 'production'
  if (!options.isEnabled) return

  const dsn = config.getOrThrow('VITE_SENTRY_DSN')

  options.dsn = dsn
  options.app = app
  options.router = router
  options.environment = config.getEnvironment()
  options.replaysSessionSampleRate = 0
  options.replaysOnErrorSampleRate = 0
})
```

Here `isClient`, `app`, and `router` are supplied by the application's SSG bootstrap. Configure the plugin in the same `addLogger()` call as other logger providers. Server-side error reporting requires a separate server integration and lifecycle.

## Common problems

### No events appear in Sentry

Check that `isEnabled` is true in the running browser, that the DSN points to the intended project, and that the application was built with the plugin. Verify both log-level thresholds, network requests, SDK filtering, and Sentry project settings. An enabled plugin with a missing or invalid DSN is not a working transport.

### Debug and info logs do not appear

The Vue provider defaults to `WARN`. Set `options.level` to `LOG_LEVEL.DEBUG` or `LOG_LEVEL.INFO` and ensure the application logger's minimum also permits that level. Review the volume and privacy impact before sending lower-level logs.

### Router traces are missing

Pass the same router instance used by the app in `options.router`, build the Xeno application before installing the router, and choose a nonzero trace sample rate. Sampling means not every navigation is expected to appear.

### Sentry initializes during static generation

Set `isEnabled` from `isClient` in Vite SSG or guard with the runtime's server-side flag. Do not read a required browser DSN or initialize the browser provider on the server path.

### The console or Sentry provider is missing

Pass all logger plugins in one `addLogger([...])` call. The builder ignores later `addLogger()` calls. The plugin-array form does not enable Console by itself; add `withConsoleLogger()` when you need it.

### A warning appears as an exception

The core logger currently passes a normalized error object even for `logger.warn()`. The Sentry Vue provider therefore calls `captureException()` for that call. See [Log levels and event mapping](#log-levels-and-event-mapping).

## Related documentation

- [Logging Overview](/docs/application/logging/overview)
- [Sentry Node Logger](/docs/application/logging/sentry-node)
- [Vue Plugin](/docs/vue/plugin-vue)
- [Context Scopes](/docs/fundamentals/context-scopes)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
