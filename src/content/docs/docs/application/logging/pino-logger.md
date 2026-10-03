---
title: Pino Logger
description: Learn how to configure Pino as a logging provider in Xeno.JS, choose its destination and formatting, and use the application logger with Pino.
keywords:
- Xeno.JS
- Pino
- pino logger
- logging
- observability
- logger
- prettyPrint
- log destination
- structured logging
- TypeScript
tags:
- observability
- logging
- pino
- typescript
faqs:
- question: How do I enable Pino in Xeno.JS?
  answer: Call addLogger() and provide options.pino.config.
- question: Do I resolve the Pino instance directly from the Xeno.JS container?
  answer: No. Xeno.JS registers the application ILogger under TOKENS.LOGGER. Pino is one of the logger clients used by that logger.
- question: What Pino destinations does Xeno.JS support?
  answer: Xeno.JS supports stdout and file destinations.
- question: Where does Pino write logs by default?
  answer: Pino writes to stdout by default.
- question: What file does Xeno.JS use when the Pino file destination is selected?
  answer: The default file path is logs/app.log.
- question: Is Pino pretty printing enabled by default?
  answer: Yes. Xeno.JS enables pretty printing by default when the Pino environment is development.
- question: Can I disable Pino pretty printing?
  answer: Yes. Set prettyPrint to false in the Pino configuration.
- question: Does Pino use the Xeno.JS log level?
  answer: Yes. Xeno.JS passes the configured minimum log level to its Pino logger adapter, which filters messages below that level.
- question: Does Xeno.JS redact sensitive fields in Pino?
  answer: Yes. Xeno.JS configures Pino redaction for password, token, secret, authorization, and headers.authorization.
- question: Can Pino be used together with Console or Sentry?
  answer: Yes. Pino can be configured alongside the other Xeno.JS logger providers.
---

## Introduction

Xeno.JS provides a Pino integration through its application logger.

You do not replace the Xeno.JS logger with a Pino-specific API. Instead, you enable Pino as a logging provider and continue to use the Xeno.JS `ILogger` abstraction.

The basic configuration is:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options) => {
  options.pino.config = {
    destination: 'stdout',
  }
})

const container = await app.build()
```

After the application is built, resolve `TOKENS.LOGGER` and use the returned logger.

---

## Prerequisites

Install Xeno.JS and Pino:

```bash
npm install @xeno-js/core @xeno-js/shared pino
```

`pino` is an optional peer dependency of `@xeno-js/core`.

If you enable pretty printing, Xeno.JS configures Pino to use the `pino-pretty` transport. Install it as well:

```bash
npm install pino-pretty
```

You only need `pino-pretty` when pretty printing is enabled.

---

## Enable Pino

Pino is enabled when `options.pino.config` is defined.

For example:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options) => {
  options.pino.config = {}
})

const container = await app.build()
```

The empty configuration uses the Xeno.JS defaults.

Pino is not enabled by merely installing the `pino` package. It becomes a Xeno.JS logging provider when `pino.config` is configured.

---

## Configure the Log Level

The minimum log level is configured through the Xeno.JS logger configuration:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.level = LOG_LEVEL.INFO

  options.pino.config = {
    destination: 'stdout',
  }
})
```

Xeno.JS supports:

* `LOG_LEVEL.DEBUG`
* `LOG_LEVEL.INFO`
* `LOG_LEVEL.WARN`
* `LOG_LEVEL.ERROR`

The configured level is the minimum level accepted by the Xeno.JS logger.

For example:

```ts
options.level = LOG_LEVEL.WARN
```

allows:

```text
WARN
ERROR
```

and filters:

```text
DEBUG
INFO
```

The Pino adapter applies the same minimum level before calling the corresponding Pino method.

---

## Configure the Destination

Xeno.JS supports two Pino destinations:

```ts
type Destination = 'stdout' | 'file'
```

### Write to stdout

This is the default:

```ts
app.addLogger((options) => {
  options.pino.config = {
    destination: 'stdout',
  }
})
```

If `destination` is omitted, Xeno.JS uses `stdout`.

### Write to a file

Configure:

```ts
app.addLogger((options) => {
  options.pino.config = {
    destination: 'file',
    filePath: 'logs/app.log',
  }
})
```

If `destination` is `file` and `filePath` is omitted, Xeno.JS uses:

```text
logs/app.log
```

The file path is passed to Pino's destination stream.

Make sure the application process has permission to create and write to the configured path.

---

## Configure the Environment

Pino has an optional `env` configuration:

```ts
app.addLogger((options) => {
  options.pino.config = {
    env: 'production',
    destination: 'stdout',
  }
})
```

If `env` is not specified, Xeno.JS uses:

1. `process.env.NODE_ENV`, when defined;
2. otherwise `development`.

The environment affects the default value of `prettyPrint`.

---

## Pretty Printing

Xeno.JS enables pretty printing by default when the configured environment is `development`.

For example:

```ts
app.addLogger((options) => {
  options.pino.config = {
    env: 'development',
  }
})
```

is equivalent to using:

```ts
app.addLogger((options) => {
  options.pino.config = {
    env: 'development',
    prettyPrint: true,
  }
})
```

To explicitly disable it:

```ts
app.addLogger((options) => {
  options.pino.config = {
    env: 'development',
    prettyPrint: false,
  }
})
```

To explicitly enable it:

```ts
app.addLogger((options) => {
  options.pino.config = {
    env: 'production',
    prettyPrint: true,
  }
})
```

When pretty printing is enabled, Xeno.JS configures the Pino `pino-pretty` transport with:

* colorized output;
* standard translated timestamps;
* `pid` and `hostname` omitted from the pretty output.

If you enable pretty printing, make sure `pino-pretty` is installed.

---

## Resolve and Use the Logger

Pino is not exposed as a separate DI service token.

Xeno.JS registers the application logger under `TOKENS.LOGGER`.

Resolve it after building the application:

```ts
import { AppBuilder } from '@xeno-js/core'
import { TOKENS } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.pino.config = {
    destination: 'stdout',
  }
})

const container = await app.build()

const logger = container.resolve(TOKENS.LOGGER)
```

The returned value implements the Xeno.JS `ILogger` interface.

Use the normal Xeno.JS logging methods:

```ts
logger.debug('Loading configuration')
logger.info('Application started')
logger.warn('Cache entry was not available')
logger.error('Unable to process request', error)
```

You do not need to call Pino's `debug()`, `info()`, `warn()`, or `error()` methods directly in application code.

Xeno.JS forwards each accepted log event to the configured Pino provider.

---

## Use Pino Together With Other Providers

Pino does not have to be the only provider.

For example, you can enable Console and Pino together:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options) => {
  options.console = true

  options.pino.config = {
    destination: 'stdout',
  }
})
```

You can also configure Pino and Sentry:

```ts
app.addLogger((options) => {
  options.console = false

  options.pino.config = {
    destination: 'stdout',
  }

  options.sentry.config = {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  }
})
```

The Xeno.JS logger sends accepted events to all configured logger clients.

This allows the same application logging API to feed different observability systems.

---

## Structured Pino Output

Xeno.JS passes the log context to Pino as structured data.

The Pino adapter maps Xeno.JS levels to Pino methods:

| Xeno.JS level | Pino method |
| ------------- | ----------- |
| `DEBUG`       | `debug()`   |
| `INFO`        | `info()`    |
| `WARN`        | `warn()`    |
| `ERROR`       | `error()`   |

For example, an informational event is passed to Pino conceptually as:

```ts
pinoLogger.info(
  {
    ...context,
  },
  message,
)
```

An error event includes the error in the structured payload:

```ts
pinoLogger.error(
  {
    ...context,
    error,
  },
  message,
)
```

Pino is configured by Xeno.JS with ISO timestamps and its standard error serializer.

A structured log therefore contains information such as:

```json
{
  "level": 30,
  "time": "2026-10-03T16:00:00.000Z",
  "msg": "[INFO] Application started",
  "requestId": "...",
  "correlationId": "..."
}
```

The exact JSON representation is produced by Pino.

---

## Safe Context

Xeno.JS does not pass the complete request context directly to Pino.

The Xeno.JS logger builds a safe logging context before sending it to logger clients.

Depending on the active request context, this can contain information such as:

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
```

The purpose is to provide useful correlation and diagnostic information without serializing the complete request context.

For example, request-specific information such as authentication state, tracing identifiers, and the request path can be available to Pino without automatically copying arbitrary request data.

The client IP is masked before being included in the safe logging context.

### Application Data Is Still Your Responsibility

Safe context does not make arbitrary application logging safe.

If application code explicitly logs:

```ts
logger.info(`Password: ${password}`)
```

the password is part of the message.

Likewise, application-provided structured data or error objects can contain sensitive information.

Avoid logging:

* passwords;
* authentication tokens;
* secrets;
* credentials;
* cookies;
* authorization headers;
* complete request bodies;
* other sensitive application data.

---

## Pino Redaction

Xeno.JS configures Pino redaction for the following paths:

```text
password
token
secret
authorization
headers.authorization
```

These values are censored as:

```text
***
```

For example, a payload containing:

```ts
{
  token: 'secret-token',
  userId: 'user-123',
}
```

is redacted by Pino before output.

Redaction is an additional protection layer. It does not replace careful logging practices.

Do not deliberately include sensitive information in log messages simply because Pino has redaction configured.

---

## Error Logging

Use the Xeno.JS error API:

```ts
try {
  await processOrder()
} catch (error) {
  logger.error('Unable to process order', error)
}
```

Xeno.JS passes the error to the Pino adapter.

The adapter adds the error to the structured payload and calls Pino's `error()` method.

Pino is configured with its standard error serializer, so error information is serialized using Pino's error serialization behavior.

---

## Complete Example

A complete application configuration can look like this:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL, TOKENS } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options, config) => {
  options.level = LOG_LEVEL.INFO

  options.console = false

  options.pino.config = {
    destination: 'file',
    filePath: config.get('LOG_FILE_PATH', 'logs/app.log'),
    env: 'production',
    prettyPrint: false,
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

This configuration:

* filters out `DEBUG`;
* accepts `INFO`, `WARN`, and `ERROR`;
* disables Console;
* writes Pino logs to `logs/app.log`;
* uses structured JSON output;
* uses the Xeno.JS safe context;
* applies Pino redaction;
* exposes the logger through `TOKENS.LOGGER`.

---

## Development Configuration

For local development, pretty printing can make Pino output easier to read:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.level = LOG_LEVEL.DEBUG

  options.pino.config = {
    env: 'development',
    destination: 'stdout',
    prettyPrint: true,
  }
})

await app.build()
```

Make sure `pino-pretty` is installed when using this configuration.

---

## Production Configuration

For structured logs, disable pretty printing:

```ts
import { AppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'

const app = new AppBuilder()

app.addLogger((options) => {
  options.level = LOG_LEVEL.INFO

  options.pino.config = {
    env: 'production',
    destination: 'stdout',
    prettyPrint: false,
  }
})

await app.build()
```

This keeps the output in Pino's structured format, which can then be consumed by the application's log collection infrastructure.

---

## Common Problems

### Pino Does Not Produce Any Logs

Make sure `pino.config` is defined:

```ts
app.addLogger((options) => {
  options.pino.config = {}
})
```

Installing Pino alone does not enable the Xeno.JS Pino provider.

Also check the configured minimum level:

```ts
options.level = LOG_LEVEL.INFO
```

A `DEBUG` event will not be emitted with that configuration.

### Pino Cannot Be Imported

Make sure the provider dependency is installed:

```bash
npm install pino
```

`pino` is an optional peer dependency of `@xeno-js/core`.

### Pretty Printing Fails

If `prettyPrint` is enabled, install:

```bash
npm install pino-pretty
```

Xeno.JS configures the Pino transport with `pino-pretty` when pretty printing is enabled.

### Logs Are Not Written to the Expected File

Check:

```ts
options.pino.config = {
  destination: 'file',
  filePath: 'logs/app.log',
}
```

If `filePath` is omitted, Xeno.JS uses:

```text
logs/app.log
```

Also make sure the Node.js process has permission to write to the selected directory.

### I Cannot Resolve a Pino Logger Directly

This is expected.

Xeno.JS registers the application `ILogger`, not the Pino instance, under the DI token:

```ts
TOKENS.LOGGER
```

Resolve:

```ts
const logger = container.resolve(TOKENS.LOGGER)
```

and use the Xeno.JS logging API.

Pino remains an implementation behind the Xeno.JS logger abstraction.

---

## Related Docs

* [Logging Overview](./overview)
* [Sentry Node](./sentry-node)
* [Dependency Injection — Resolution](../dependency-injection/resolution)
* [Context & Scopes](../fundamentals/context-scopes)
* [Pipelines — Logging](../application/pipelines/logging)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
