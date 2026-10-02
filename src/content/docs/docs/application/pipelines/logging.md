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
  answer: Add the CQRS pipeline with AppBuilder. The Logging Pipeline is included automatically.
- question: How do I configure the minimum log level?
  answer: Use addLogger() and set config.level.
- question: Does the Logging Pipeline log successful requests?
  answer: Yes. It logs when a command or query starts and when it completes successfully.
- question: Does the Logging Pipeline log failed Results?
  answer: Yes. When the request returns a failed Result, the pipeline logs the error and returns the original Result unchanged.
- question: Does the Logging Pipeline log thrown exceptions?
  answer: Yes. If the request execution throws, the pipeline logs the exception and rethrows it.
- question: Can I send logs to Pino or Sentry?
  answer: Yes. Xeno.JS supports console logging, Pino, Sentry, and custom logger clients.
---

## Introduction

The Logging Pipeline logs the execution of commands and queries handled through the Xeno.JS CQRS pipeline.

It records:

* when a request starts;
* when a request completes successfully;
* when a request returns a failed `Result`;
* when request execution throws an exception.

The pipeline uses the application logger, so you can configure where logs are written without changing your commands or handlers.

## Before you start

You need:

* an `AppBuilder` instance;
* a command or query handled through the Xeno.JS mediator;
* the CQRS pipeline enabled with `addPipeline()`.

You do **not** need to register the `LoggingPipeline` manually.

## Enable logging

Enable the CQRS pipeline through `AppBuilder`:

```ts
import { AppBuilder } from 'xeno-js'

const app = new AppBuilder()
  .addPipeline()
  .build()
```

When `addPipeline()` is configured, Xeno.JS adds the logging pipeline together with the other common CQRS pipelines.

Both commands and queries use the logging pipeline.

## Configure the logger

Use `addLogger()` to configure the logger used by the application.

For example, to configure the minimum log level:

```ts
import { AppBuilder } from 'xeno-js'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()
  .addLogger((config) => {
    config.level = LOG_LEVEL.INFO
  })
  .addPipeline()
  .build()
```

The available configuration includes:

| Option          | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `level`         | Minimum log level forwarded to the configured logging clients. |
| `console`       | Enables or disables console logging.                           |
| `sentry.config` | Configures Sentry logging.                                     |
| `pino.config`   | Configures Pino logging.                                       |
| `customLoggers` | Registers custom logging clients.                              |

The default `AppBuilder` configuration uses console logging and the `DEBUG` level.

## Choose the log level

Xeno.JS filters messages below the configured minimum level.

For example:

```ts
import { AppBuilder } from 'xeno-js'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()
  .addLogger((config) => {
    config.level = LOG_LEVEL.WARN
  })
  .addPipeline()
  .build()
```

With `LOG_LEVEL.WARN`, informational messages from the Logging Pipeline are filtered out, while warnings and errors remain available to logging clients.

The Logging Pipeline itself uses:

* `info` for request start;
* `info` for successful completion;
* `error` for failed `Result` values;
* `error` for thrown exceptions.

## Configure console logging

Console logging is enabled by default.

You can configure it explicitly:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.console = true
  })
  .addPipeline()
  .build()
```

To disable the console logger:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.console = false
  })
  .addPipeline()
  .build()
```

Disabling the console logger does not disable the Logging Pipeline itself. The pipeline can still send logs to other configured logging clients.

## Configure Pino

Xeno.JS can use Pino as a logging client.

Configure it through `pino.config`:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.pino.config = {
      destination: 'stdout',
      prettyPrint: true,
      env: 'development',
    }
  })
  .addPipeline()
  .build()
```

### Write Pino logs to a file

Set `destination` to `file` and provide a file path:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.pino.config = {
      destination: 'file',
      filePath: 'logs/app.log',
      prettyPrint: false,
      env: 'production',
    }
  })
  .addPipeline()
  .build()
```

Supported destinations are:

* `stdout`;
* `file`.

If `filePath` is omitted when using the `file` destination, Xeno.JS uses `logs/app.log`.

Pino logging also applies its own redaction for sensitive fields such as:

* `password`;
* `token`;
* `secret`;
* `authorization`;
* `headers.authorization`.

## Configure Sentry

Xeno.JS can also send warning and error logs to Sentry.

Configure the Sentry DSN:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.sentry.config = {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
    }
  })
  .addPipeline()
  .build()
```

The Sentry DSN is required when Sentry logging is enabled.

If `environment` is not provided, Xeno.JS uses `NODE_ENV` and falls back to `development`.

Sentry logging is primarily used for warnings and errors. Informational and debug messages are not sent as Sentry events.

## Use multiple logging clients

You can configure more than one logging destination.

For example, console and Pino can be enabled together:

```ts
const app = new AppBuilder()
  .addLogger((config) => {
    config.console = true

    config.pino.config = {
      destination: 'stdout',
      prettyPrint: true,
      env: 'development',
    }
  })
  .addPipeline()
  .build()
```

The application logger forwards each accepted message to the configured logging clients.

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
const app = new AppBuilder()
  .addLogger((config) => {
    config.customLoggers = [
      () => customLogger(),
    ]
  })
  .addPipeline()
  .build()
```

Custom logger factories receive the application service scope, so they can resolve application services when required.

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

Thrown exceptions are logged and then rethrown.

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

If execution throws an exception:

```ts
try {
  await mediator.send(command)
} catch (error) {
  // The Logging Pipeline has already logged the exception.
}
```

The pipeline logs the exception and rethrows it.

This means the Logging Pipeline does not act as the application's exception handler. Use the [Exception Pipeline](./exception) when you need to configure exception handling behavior.

## Complete example

A typical application can configure logging and the CQRS pipeline together:

```ts
import { AppBuilder } from 'xeno-js'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()
  .addLogger((config) => {
    config.level = LOG_LEVEL.INFO
    config.console = true

    config.pino.config = {
      destination: 'stdout',
      prettyPrint: true,
      env: 'development',
    }
  })
  .addPipeline()
  .build()
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

Check the Pino configuration:

```ts
config.pino.config = {
  destination: 'file',
  filePath: 'logs/app.log',
}
```

For a file destination:

* `destination` must be `file`;
* `filePath` should point to the desired output file.

For standard output:

```ts
config.pino.config = {
  destination: 'stdout',
}
```

## Sentry logging is failing during startup

If Sentry logging is enabled, verify that the configuration contains a DSN:

```ts
config.sentry.config = {
  dsn: process.env.SENTRY_DSN,
}
```

If the Sentry configuration is enabled without a DSN, application initialization fails with:

```text
Sentry DSN is required when Sentry logging is enabled.
```

---

## See Loggers Documentation

* [Loggers Documentation](../../observability/overview)

---

## Related docs

* [Application overview](../overview)
* [Exception Pipeline](./exception)
* [Performance Pipeline](./performance)
* [Creating Commands](../cqrs/command)
* [Creating Queries](../cqrs/query)
* [Creating Handlers](../cqrs/handler)
* [Loggers Documentation](../../observability/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
