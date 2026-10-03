---
title: Logging Overview
description: Learn how to configure, resolve, and use logging in Xeno.JS with Console, Pino, Sentry, or custom logger providers.
keywords:
- Xeno.JS
- logging
- observability
- Console logger
- Pino
- Sentry
- custom logger
- log level
- safe context
- ILogger
- dependency injection
tags:
- observability
- logging
- console
- pino
- sentry
- dependency-injection
- typescript
faqs:
- question: What logging providers does Xeno.JS support?
  answer: Xeno.JS provides Console, Pino, and Sentry providers, and also allows applications to register custom logger clients.
- question: How do I enable the default Console logger?
  answer: Call addLogger() on AppBuilder. Console logging is enabled by default.
- question: How do I disable the Console logger?
  answer: Pass a logger setup callback that sets console to false.
- question: Can I use Console, Pino, and Sentry at the same time?
  answer: Yes. Xeno.JS broadcasts each accepted log event to all configured logger providers.
- question: Can I add a custom logger?
  answer: Yes. LoggerConfig accepts custom logger factories that can be registered alongside the built-in providers.
- question: How do I resolve the Xeno.JS logger?
  answer: Resolve TOKENS.LOGGER from the built application service container.
- question: Which log levels does Xeno.JS support?
  answer: Xeno.JS supports DEBUG, INFO, WARN, and ERROR.
- question: What context does Xeno.JS add to log messages?
  answer: Xeno.JS converts the current request context into a safe logging context containing selected identity, network, tracing, and messaging information.
- question: Is the client IP logged directly?
  answer: No. The client IP is passed through Xeno.JS IP masking before it is included in the safe logging context.
- question: Does Sentry receive INFO and DEBUG logs?
  answer: No. The Xeno.JS Sentry provider only sends WARN and ERROR events after the configured minimum level is applied.
- question: Where does Xeno.JS use the logger automatically?
  answer: Xeno.JS uses ILogger in the CQRS logging pipeline and in other infrastructure components that emit diagnostic, warning, or error messages.
---

## Introduction

Xeno.JS provides an application-level logger that can send the same log event to one or more logging providers.

You can use:

* the built-in Console logger;
* Pino;
* Sentry Node;
* one or more custom logger clients;
* any combination of the providers above.

The application code uses the Xeno.JS `ILogger` abstraction rather than depending directly on a provider.

This lets you configure logging without changing the code that writes log messages.

## Add the Default Console Logger

The simplest configuration is:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger()

const container = await app.build()
```

Calling `addLogger()` enables the Console provider with the default `DEBUG` minimum level.

The logger is registered in the application container and can then be resolved through `TOKENS.LOGGER`.

## Configure the Log Level

Xeno.JS supports four log levels:

| Level   | Value | Purpose                                      |
| ------- | ----: | -------------------------------------------- |
| `DEBUG` |   `0` | Detailed diagnostic information              |
| `INFO`  |   `1` | Normal application activity                  |
| `WARN`  |   `2` | Potentially harmful or unexpected situations |
| `ERROR` |   `3` | Errors and failures                          |

The configured level is a minimum level.

For example, with `INFO`, `DEBUG` messages are ignored while `INFO`, `WARN`, and `ERROR` messages are accepted.

Configure it through the `addLogger()` setup callback:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.level = LOG_LEVEL.INFO
})

const container = await app.build()
```

The default level is `LOG_LEVEL.DEBUG`.

The minimum level is applied by the Xeno.JS logger before the event is sent to the configured providers.

## Disable the Console Logger

Console logging is enabled by default.

To disable it:

```ts
app.addLogger((options) => {
  options.console = false
})
```

This does not disable the Xeno.JS logger itself. It only removes the Console provider.

You can therefore disable Console while keeping another provider enabled:

```ts
app.addLogger((options) => {
  options.console = false

  options.pino.config = {
    destination: 'stdout',
  }
})
```

## Use Multiple Providers

The logger configuration is not limited to one provider.

For example, an application can configure Console, Pino, and Sentry together:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.level = LOG_LEVEL.INFO

  options.console = true

  options.pino.config = {
    destination: 'stdout',
    env: 'production',
  }

  options.sentry.config = {
    dsn: process.env.SENTRY_DSN,
    environment: 'production',
  }
})

const container = await app.build()
```

Each accepted log event is sent to every configured provider.

This means the same application log can be:

* printed to the Console;
* written as a structured Pino log;
* reported to Sentry when its level is eligible.

You can also combine built-in providers with custom logger clients.

## Add a Custom Logger

Xeno.JS accepts custom logger clients through `customLoggers`.

A custom logger is provided as a factory receiving the application service scope:

```ts
app.addLogger((options) => {
  options.customLoggers = [
    () => customLogger,
  ]
})
```

The custom logger must implement the Xeno.JS `ILoggerClient` contract:

```ts
interface ILoggerClient {
  track<T>(
    level: LogLevel,
    message: string,
    context: T | undefined,
    error: unknown | undefined,
  ): void
}
```

For example:

```ts
import type { ILoggerClient } from '@xeno-js/shared'

const customLogger: ILoggerClient = {
  track(level, message, context, error) {
    // Send the event to your logging system.
    console.log({
      level,
      message,
      context,
      error,
    })
  },
}
```

Register it through `addLogger()`:

```ts
app.addLogger((options) => {
  options.customLoggers = [
    () => customLogger,
  ]
})
```

A custom logger can be used by itself:

```ts
app.addLogger((options) => {
  options.console = false

  options.customLoggers = [
    () => customLogger,
  ]
})
```

or together with the built-in providers:

```ts
app.addLogger((options) => {
  options.customLoggers = [
    () => customLogger,
  ]

  options.pino.config = {
    destination: 'stdout',
  }
})
```

The custom logger receives the same Xeno.JS log event that is sent to the other configured providers.

## Resolve the Logger

Xeno.JS registers the application logger under `TOKENS.LOGGER`.

After building the application, resolve it from the service container:

```ts
import { AppBuilder } from '@xeno-js/core'
import { TOKENS } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger()

const container = await app.build()

const logger = container.resolve(TOKENS.LOGGER)
```

The resolved value implements `ILogger`.

The public logger API is intentionally small:

```ts
interface ILogger {
  info(message: string): void
  warn(message: string): void
  debug(message: string): void
  error(message: string, error: unknown): void
}
```

## Write Log Messages

Use the resolved logger directly:

```ts
logger.debug('Loading configuration')
logger.info('Application started')
logger.warn('Cache entry was not available')
logger.error('Unable to process request', error)
```

`error()` accepts the message followed by the associated error value.

Context from the current Xeno.JS request is added automatically. Application code therefore does not need to pass the request context to every logging call.

## What Does Xeno.JS Log?

Xeno.JS creates a log event containing:

1. the log level;
2. the log message;
3. the current safe context;
4. the optional error.

The logger converts the current request context into a restricted `LoggerContext` before passing it to providers.

The safe context contains:

```text
identity
├── userId
└── tenantId

network
├── requestId
├── path
├── origin
└── masked clientIp

tracing
├── correlationId
├── spanId
├── startTime
└── parentSpanId

messaging
└── optional messaging context
```

The original request context contains additional information such as email, name, roles, permissions, user-agent, CSRF values, cookies, and the transport object. These fields are not copied into the safe logging context.

The client IP is passed through Xeno.JS IP masking before it is included.

### Why Safe Context Matters

The safe context gives log entries useful information for correlating and diagnosing requests without serializing the complete request context.

For example, a log can identify:

* which request produced the event;
* which user or tenant was involved;
* which correlation/span identifiers belong to the execution;
* which request path was involved.

It does not automatically serialize the entire authenticated identity or network request.

Safe context does not mean that arbitrary application data is safe to log.

If application code explicitly puts secrets, tokens, passwords, request bodies, or other sensitive information into a log message, that data can still reach the configured providers.

Treat application-provided log messages and error objects as potentially sensitive.

## Console Output

The Console provider maps Xeno.JS levels to the corresponding console method:

| Xeno.JS level | Console method    |
| ------------- | ----------------- |
| `DEBUG`       | `console.debug()` |
| `INFO`        | `console.info()`  |
| `WARN`        | `console.warn()`  |
| `ERROR`       | `console.error()` |

The Xeno.JS logger adds the textual level name to the message before passing it to the provider.

For example:

```text
[INFO] Application started
```

The Console provider then prefixes the numeric Xeno.JS level.

A representative Console call therefore looks like:

```text
[1] [INFO] Application started
{
  identity: {
    userId: "...",
    tenantId: "..."
  },
  network: {
    requestId: "...",
    path: "/users",
    origin: "...",
    clientIp: "..."
  },
  tracing: {
    correlationId: "...",
    spanId: "...",
    startTime: 1234567890,
    parentSpanId: "..."
  }
}
```

For an error, the provider adds the error to the payload:

```text
[3] [ERROR] Unable to process request
{
  ...safeContext,
  error: Error(...)
}
```

The exact values depend on the active request context.

## Pino Output

The Pino provider receives the safe context as a structured object and the Xeno.JS message as the Pino message.

Xeno.JS configures Pino with:

* ISO timestamps;
* standard Pino error serialization;
* redaction for `password`, `token`, `secret`, `authorization`, and `headers.authorization`.

The default Pino destination is `stdout`.

Pino pretty printing defaults to enabled when the configured Pino environment is `development`.

A structured Pino event is therefore conceptually represented as:

```json
{
  "level": 30,
  "time": "2026-10-03T16:00:00.000Z",
  "msg": "[INFO] Application started",
  "identity": {
    "userId": "...",
    "tenantId": "..."
  },
  "network": {
    "requestId": "...",
    "path": "/users",
    "origin": "...",
    "clientIp": "..."
  },
  "tracing": {
    "correlationId": "...",
    "spanId": "...",
    "startTime": 1234567890,
    "parentSpanId": "..."
  }
}
```

The exact serialized representation is produced by Pino.

See [Pino Logger](./pino-logger) for Pino-specific configuration.

## Sentry Behavior

The Xeno.JS Sentry provider is intended for warning and error events.

It applies the configured minimum level first.

`DEBUG` and `INFO` events are not sent to Sentry.

For `WARN` and `ERROR`:

* when an error object is supplied, Xeno.JS calls Sentry `captureException()`;
* when no error object is supplied, Xeno.JS calls Sentry `captureMessage()` with the Sentry severity `"warning"`;
* the safe context is attached to the Sentry scope as extras.

This means an `ERROR` log without an error object is still captured as a Sentry message with warning severity.

Configure Sentry through:

```ts
app.addLogger((options) => {
  options.sentry.config = {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  }
})
```

The Sentry configuration requires a DSN.

See [Sentry Node](./sentry-node) for the complete Sentry configuration and warning/error behavior.

## Where Xeno.JS Uses the Logger

The logger is used by Xeno.JS infrastructure and application pipelines.

One important automatic use is the CQRS logging pipeline.

For each command or query handled by that pipeline, Xeno.JS logs:

```text
Handling <request.type> <request.intent>
```

When the request succeeds:

```text
Successfully handled <request.type> <request.intent>
```

When a result contains an error:

```text
Failed to handle <request.type> <request.intent>: <error.message>
```

When handling throws an exception:

```text
Exception while handling <request.type> <request.intent>
```

The pipeline uses:

* `INFO` for start and successful completion;
* `ERROR` for failed results and thrown exceptions.

Other Xeno.JS infrastructure components also use `ILogger` for warnings, errors, and diagnostic messages. For example, the performance pipeline emits a warning when an operation exceeds its configured threshold.

## Complete Example

The following example enables Console and Pino while keeping Sentry disabled:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL, TOKENS } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.level = LOG_LEVEL.INFO

  options.console = true

  options.pino.config = {
    destination: 'stdout',
    env: 'development',
    prettyPrint: true,
  }
})

const container = await app.build()

const logger = container.resolve(TOKENS.LOGGER)

logger.info('Application started')
logger.warn('Example warning')

try {
  throw new Error('Example failure')
} catch (error) {
  logger.error('Application operation failed', error)
}
```

With this configuration:

* `DEBUG` events are filtered out;
* `INFO`, `WARN`, and `ERROR` events are accepted;
* Console receives all accepted events;
* Pino receives all accepted events;
* the same safe context is supplied to both providers.

## Common Problems

### No Logs Are Printed

Check that the logger module was added:

```ts
app.addLogger()
```

Then make sure the message is at or above the configured level.

For example, this configuration suppresses `DEBUG`:

```ts
app.addLogger((options) => {
  options.level = LOG_LEVEL.INFO
})
```

### Console Logs Are Missing

Check whether Console was disabled:

```ts
options.console = false
```

If Console is disabled, another configured provider must be used to receive the log.

### Pino Is Configured but Nothing Is Written

Check:

* the `pino` package is installed;
* `options.pino.config` is defined;
* the configured destination is valid;
* the log level allows the event.

See [Pino Logger](./pino-logger).

### Sentry Does Not Receive an INFO Log

This is expected.

The Xeno.JS Sentry provider only processes `WARN` and `ERROR` levels.

If you need an event in Sentry, use a warning or error that satisfies the configured minimum level.

### Sensitive Data Appears in a Log

Safe context only controls the request context that Xeno.JS automatically adds.

It does not sanitize arbitrary application messages or errors.

Avoid logging:

* passwords;
* authentication tokens;
* secrets;
* credentials;
* complete request bodies;
* cookies;
* authorization headers;
* other sensitive application data.

Pino also applies provider-level redaction for specific fields, but applications should not rely on redaction as a replacement for careful logging.

## Related Docs

* [Pino Logger](./pino-logger)
* [Sentry Node](./sentry-node)
* [Dependency Injection — Resolution](../dependency-injection/resolution)
* [Context & Scopes](../fundamentals/context-scopes)
* [CQRS — Handler](../application/cqrs/handler)
* [Pipelines — Logging](../application/pipelines/logging)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
