---
title: Logging Pipeline
description: Learn how to enable application logging and configure the logger used by Xeno.JS commands and queries.
keywords:
- Xeno.JS logging
- Xeno.JS Logging Pipeline
- TypeScript logging
- Xeno.JS logger
- CQRS logging
- application logging
- Pino logging
- Sentry logging
tags:
- application
- pipelines
- logging
- observability
- cqrs
faqs:
- question: How do I enable logging for commands and queries?
  answer: Add the CQRS pipeline with XenoAppBuilder. The CQRS module adds the Logging Pipeline as a common behavior for commands and queries.
- question: How do I configure the minimum log level?
  answer: Use addLogger() and set config.level.
- question: Does the Logging Pipeline log successful requests?
  answer: Yes. It logs when a command or query starts and when it completes successfully.
- question: Does the Logging Pipeline log failed Results?
  answer: Yes. When the request returns a failed Result, the pipeline logs the error and returns the original Result unchanged.
- question: Does the Logging Pipeline log thrown exceptions?
  answer: The Logging Pipeline logs and rethrows thrown exceptions to the surrounding behavior; the CQRS Exception Pipeline can then return a failed Result.
- question: Can I send logs to Pino or Sentry?
  answer: Yes. Register the corresponding provider plugins with addLogger(); provider-specific options belong to those plugins.
---

## Introduction

The Logging Pipeline logs the execution of commands and queries handled through the Xeno.JS CQRS pipeline.

It records:

- when a request starts;
- when a request completes successfully;
- when a request returns a failed `Result`;
- when request execution throws an exception.

The pipeline uses the application logger, so you can configure where logs are written without changing your commands or handlers.

## Before you start

You need:

- an `XenoAppBuilder` instance;
- a command or query handled through the Xeno.JS mediator;
- the CQRS pipeline enabled with `addPipeline()`.

You do **not** need to register the `LoggingPipeline` manually.

## Enable logging

Enable the CQRS pipeline through `XenoAppBuilder`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline()

const application = await app.build()
```

When `addPipeline()` is configured, the CQRS module adds the Logging Pipeline as a common behavior. It also adds a logger if none has been registered.

Both commands and queries use the logging pipeline.

## Configure the logger

Use `addLogger()` to configure the logger used by the application.

For example, to configure the minimum log level:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new XenoAppBuilder()
  .addLogger((config) => {
    config.level = LOG_LEVEL.INFO
  })
  .addPipeline()

const application = await app.build()
```

The `addLogger()` setup callback configures core logger settings. Provider
options are configured through the provider's logger plugin:

| Option          | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `level`         | Minimum log level forwarded to the configured logging clients. |
| `console`       | Enables or disables console logging.                           |
| `customLoggers` | Registers custom logging clients.                              |

`addLogger()` also accepts a logger plugin or an array of plugins. If the CQRS
module needs a logger and none has been registered, it adds one during
application build. See the [logger overview](../logging/overview) for logger
defaults and provider setup.

## Choose the log level

Xeno.JS filters messages below the configured minimum level.

For example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new XenoAppBuilder()
  .addLogger((config) => {
    config.level = LOG_LEVEL.WARN
  })
  .addPipeline()

const application = await app.build()
```

With `LOG_LEVEL.WARN`, informational messages from the Logging Pipeline are filtered out, while warnings and errors remain available to logging clients.

The Logging Pipeline itself uses:

- `info` for request start;
- `info` for successful completion;
- `error` for failed `Result` values;
- `error` for thrown exceptions.

## Configure console logging

The default Console provider is enabled by default. The CQRS module adds a
logger when needed, so logging works without manually registering one.

You can configure it explicitly:

```ts
const app = new XenoAppBuilder()
  .addLogger((config) => {
    config.console = true
  })

app.addPipeline()

const application = await app.build()
```

To disable the console logger:

```ts
const app = new XenoAppBuilder()
  .addLogger((config) => {
    config.console = false
  })

app.addPipeline()

const application = await app.build()
```

Disabling the Console provider does not disable the Logging Pipeline itself.
Logs can still be sent to other configured logger clients.

## Configure Pino

Register the Pino logger plugin from `@xeno-js/pino`. The plugin callback
receives Pino-specific options; these are separate from the core logger setup
callback:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPinoLogger } from '@xeno-js/pino'

const app = new XenoAppBuilder()
  .addLogger(withPinoLogger((options) => {
    options.destination = 'stdout'
  }))

app.addPipeline()

const application = await app.build()
```

### Write Pino logs to a file

Set `destination` to `file` and provide a file path through the Pino plugin:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withPinoLogger } from '@xeno-js/pino'

const app = new XenoAppBuilder()
  .addLogger(withPinoLogger((options) => {
    options.destination = 'file'
    options.filePath = 'logs/app.log'
  }))
```

Supported destinations are:

- `stdout`;
- `file`.

If `filePath` is omitted when using the `file` destination, Xeno.JS uses
`logs/app.log`.

For Pino behavior, including formatting, defaults, and redaction, see
[Pino Logger](../logging/pino-logger). Those options belong to the Pino
integration, not to the core logger configuration.

## Configure Sentry

Register the Sentry Node logger plugin from `@xeno-js/sentry-node`. Sentry
provider options belong to that plugin; the core logger setup callback does
not configure them.

Configure the Sentry DSN:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

const app = new XenoAppBuilder()
  .addLogger(withSentryNodeLogger((options) => {
    options.dsn = process.env.SENTRY_DSN ?? ''
    options.environment = process.env.NODE_ENV
  }))

app.addPipeline()

const application = await app.build()
```

The Sentry Node integration requires a DSN when enabled. Its environment and
other provider-specific behavior are described in [Sentry Node Logger](../logging/sentry-node).

## Use multiple logging clients

You can configure more than one logging destination.

For example, console and Pino can be enabled together:

```ts
import { XenoAppBuilder, withConsoleLogger } from '@xeno-js/core'
import { withPinoLogger } from '@xeno-js/pino'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new XenoAppBuilder()
  .addLogger([
    withConsoleLogger((options) => {
      options.level = LOG_LEVEL.INFO
    }),
    withPinoLogger((options) => {
      options.destination = 'stdout'
    }),
  ])
  .addPipeline()

const application = await app.build()
```

Pass provider plugins together in one `addLogger()` call. The application
logger forwards each accepted message to the configured logging clients.

## Add a custom logger

Use `customLoggers` when you need to integrate a logging destination that is not provided by Xeno.JS.

A custom logger must implement the `ILoggerClient` contract from `@xeno-js/shared`.

For example:

```ts
import type { ILoggerClient } from '@xeno-js/shared'

const customLogger = (): ILoggerClient => ({
  track(level, message, context, error) {
    console.log({
      level,
      message,
      context,
      error,
    })
  },
})
```

Register it with `addLogger()`:

```ts
const app = new XenoAppBuilder()
  .addLogger((config) => {
    config.customLoggers = [
      () => customLogger(),
    ]
  })

app.addPipeline()

const application = await app.build()
```

Custom logger factories use the scope contract described in the
[logger overview](../logging/overview) when they need service resolution.

## What does the Logging Pipeline log?

For a request such as:

```ts
{
  type: 'COMMAND',
  intent: 'CREATE_USER'
}
```

the pipeline logs the start of the request:

```text
Handling COMMAND CREATE_USER
```

When the request succeeds:

```text
Successfully handled COMMAND CREATE_USER
```

When the handler returns a failed `Result`:

```text
Failed to handle COMMAND CREATE_USER: User already exists
```

When request execution throws:

```text
Exception while handling COMMAND CREATE_USER
```

The failed `Result` is returned unchanged.

The Logging Pipeline logs a thrown value and rethrows it. When the CQRS
Exception Pipeline is also active, it can convert that thrown value into a
failed `Result`; see [Exception Pipeline](./exception).

## Logging failed Results

A command or query can complete without throwing but still return a failed `Result`.

For example:

```ts
const result = await mediator.send(command)

if (!result.isOk()) {
  // The Logging Pipeline has already logged the failure.
}
```

The Logging Pipeline does not replace or transform the `Result`.

It logs the error and returns the same result to the caller.

## Logging thrown exceptions

If execution throws an exception, the Logging Pipeline logs it and rethrows it
to the surrounding CQRS behavior. With the Exception Pipeline enabled, the
mediator returns a failed `Result`:

```ts
const result = await mediator.send(command)

if (!result.isOk()) {
  // The failure is available as a Result.
}
```

The Logging Pipeline does not convert exceptions itself; the CQRS Exception
Pipeline handles that conversion.

## Complete example

A typical application can configure logging and the CQRS pipeline together:

```ts
import { XenoAppBuilder, withConsoleLogger } from '@xeno-js/core'
import { withPinoLogger } from '@xeno-js/pino'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new XenoAppBuilder()
  .addLogger([
    withConsoleLogger((options) => {
      options.level = LOG_LEVEL.INFO
    }),
    withPinoLogger((options) => {
      options.destination = 'stdout'
    }),
  ])
  .addPipeline()

const application = await app.build()
```

After the application is built, commands and queries executed through the configured mediator are logged automatically.

## Logging is not running

If commands or queries are not producing logs, check:

1. `addPipeline()` is called;
2. the command or query is executed through the Xeno.JS mediator;
3. console logging has not been disabled with `config.console = false`;
4. the configured minimum `config.level` does not filter the messages you expect;
5. at least one logging client is configured.

For example, if you configure:

```ts
config.level = LOG_LEVEL.WARN
```

the normal `info` messages generated by the Logging Pipeline will not be forwarded.

## Pino logs are not written to the expected destination

Check that the Pino plugin is passed to `addLogger()` and configure its
destination in the plugin callback:

```ts
app.addLogger(withPinoLogger((options) => {
  options.destination = 'file'
  options.filePath = 'logs/app.log'
}))
```

For a file destination:

- `destination` must be `file`;
- `filePath` should point to the desired output file.

For standard output:

```ts
app.addLogger(withPinoLogger((options) => {
  options.destination = 'stdout'
}))
```

**[Pino Logger Documentation](../logging/pino-logger)**

## Sentry events are not appearing

Check that the Sentry Node plugin is registered and that it receives a DSN:

```ts
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

app.addLogger(withSentryNodeLogger((options, config) => {
  options.dsn = config.get('SENTRY_DSN') ?? ''
}))
```

For the Sentry plugin's configuration and environment-variable behavior, see
[Sentry Node Logger](../logging/sentry-node).

---

## See Loggers Documentation

- [Loggers Documentation](../logging/overview)

---

## Related docs

- [Application overview](../overview)
- [Exception Pipeline](./exception)
- [Performance Pipeline](./performance)
- [Creating Commands](../cqrs/command)
- [Creating Queries](../cqrs/query)
- [Creating Handlers](../cqrs/handler)
- [Loggers Documentation](../logging/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
