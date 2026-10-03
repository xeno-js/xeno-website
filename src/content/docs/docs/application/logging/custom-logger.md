---
title: Custom Logger
description: Learn how to create, register, and use a custom logger in Xeno.JS.
keywords:
- Xeno.JS
- custom logger
- ILoggerClient
- addLogger
- TOKENS.LOGGER
- logging
tags:
- observability
- logging
- custom logger
- typescript
faqs:
- question: How do I create a custom logger in Xeno.JS?
  answer: Implement the ILoggerClient interface and its track method.
- question: How do I register a custom logger?
  answer: Pass a factory returning the ILoggerClient implementation through options.customLoggers in app.addLogger().
- question: How do I use the configured logger?
  answer: Resolve TOKENS.LOGGER from AppBuilder after build() and use the ILogger API.
---

## Introduction

Xeno.JS lets you add your own logging provider by implementing `ILoggerClient`.

## Create a Custom Logger

Implement `ILoggerClient` and its `track()` method:

```ts
import type { ILoggerClient, LogLevel } from '@xeno-js/shared'

class MyLogger implements ILoggerClient {
  track<T>(
    level: LogLevel,
    message: string,
    context: T,
    error?: unknown,
  ): void {
    console.log({
      level,
      message,
      context,
      error,
    })
  }
}
```

The `track()` method receives the log level, message, logging context, and optional error.

## Register the Logger

Pass a factory through `customLoggers`:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options) => {
  options.customLoggers = [
    () => new MyLogger(),
  ]
})
```

The factory receives the current service scope:

```ts
options.customLoggers = [
  (container) => new MyLogger(),
]
```

Use the container only when the custom logger needs to resolve application services.

## Resolve and Use the Logger

After building the application, resolve `TOKENS.LOGGER`:

```ts
import { AppBuilder, TOKENS } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options) => {
  options.customLoggers = [
    () => new MyLogger(),
  ]
})

await app.build()

const logger = app.resolve(TOKENS.LOGGER)

logger.info('Application started')
logger.error('Something went wrong', new Error('Example error'))
```

`TOKENS.LOGGER` resolves the Xeno.JS application logger. Your custom logger is registered as one of its logging clients, so it receives the log events together with any other configured providers.

## Complete Example

```ts
import { AppBuilder, TOKENS } from '@xeno-js/core'
import type { ILoggerClient, LogLevel } from '@xeno-js/shared'

class MyLogger implements ILoggerClient {
  track<T>(
    level: LogLevel,
    message: string,
    context: T,
    error?: unknown,
  ): void {
    console.log({
      level,
      message,
      context,
      error,
    })
  }
}

const app = new AppBuilder()

app.addLogger((options) => {
  options.customLoggers = [
    () => new MyLogger(),
  ]
})

await app.build()

const logger = app.resolve(TOKENS.LOGGER)

logger.info('Hello from Xeno.JS')
```

---

Related

* [Observability Overview](./overview)
* [Pino Logger](./pino-logger)
* [Sentry Node Logger](./sentry-node).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
