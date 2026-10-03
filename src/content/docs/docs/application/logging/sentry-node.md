---
title: Sentry Node Logger
description: Learn how to configure Sentry Node as a logging provider in Xeno.JS, understand warning and error behavior, resolve the application logger, and control the context sent to Sentry.
keywords:
- Xeno.JS
- Sentry
- Sentry Node
- "@sentry/node"
- logging
- logger
- observability
- error tracking
- DSN
- LOG_LEVEL
- safe context
tags:
- observability
- logging
- sentry
- sentry-node
- errors
- warnings
- typescript
faqs:
- question: How do I enable Sentry logging in Xeno.JS?
  answer: Call app.addLogger() and configure options.sentry.config with a Sentry DSN.
- question: Which package do I need for Sentry logging?
  answer: Install @sentry/node alongside the Xeno.JS packages used by your application.
- question: What Sentry configuration does Xeno.JS require?
  answer: A Sentry DSN is required. The environment is optional and defaults to NODE_ENV or development.
- question: Does Xeno.JS send every log level to Sentry?
  answer: No. The Sentry logger only forwards WARN and ERROR log levels.
- question: How are warnings sent to Sentry?
  answer: A warning without an error is sent as a Sentry warning message. A warning with an error is captured as a Sentry exception.
- question: How are errors sent to Sentry?
  answer: An error with an error object is captured with captureException. If no error object is provided, Xeno.JS sends the message through Sentry's message capture path using warning severity.
- question: Can I use Sentry together with Console or Pino?
  answer: Yes. Xeno.JS can configure Sentry alongside the Console logger, Pino, and custom logger clients.
- question: How do I resolve the Sentry logger?
  answer: Resolve TOKENS.LOGGER. Xeno.JS exposes the combined application logger rather than a separate Sentry logger token.
- question: What context does Xeno.JS send to Sentry?
  answer: The application logger uses a restricted safe context for observability. Sentry attaches that context as event extras rather than serializing the complete request context.
- question: Does safe context guarantee that no sensitive data reaches Sentry?
  answer: No. Safe context limits the automatically propagated context, but application code must still avoid explicitly logging secrets, tokens, passwords, credentials, or other sensitive application data.
- question: Are Zod validation errors sent to Sentry?
  answer: No. Xeno.JS filters events whose original exception is a ZodError before sending them to Sentry.

---

## Introduction

Use Sentry Node when you want Xeno.JS logging to report warnings and errors to Sentry while keeping the application code independent from the Sentry SDK.

Xeno.JS integrates `@sentry/node` as a logging provider. You configure it through `AppBuilder.addLogger()`, while application code continues to use the Xeno.JS `ILogger` abstraction.

## Prerequisites

Install the Xeno.JS packages used by your application and the Sentry Node SDK:

```bash
npm install @xeno-js/core @xeno-js/shared @sentry/node
```

Xeno.JS loads the Sentry integration when Sentry logging is configured.

You do not need to call `Sentry.init()` yourself. Xeno.JS initializes Sentry from the configuration passed to `addLogger()`.

## Configure Sentry

Configure Sentry through `AppBuilder.addLogger()`:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options, config) => {
  options.sentry.config = {
    dsn: config.getOrThrow('SENTRY_DSN'),
    environment: config.get('NODE_ENV', 'development'),
  }
})
```

The Sentry configuration exposes:

| Option        | Required | Description                                                                   |
| ------------- | -------- | ----------------------------------------------------------------------------- |
| `dsn`         | Yes      | Sentry Data Source Name used to send events to the configured Sentry project. |
| `environment` | No       | Environment associated with the Sentry events.                                |

If `environment` is not provided, Xeno.JS uses `process.env.NODE_ENV`. If `NODE_ENV` is also undefined, it uses `development`.

A DSN is required when Sentry logging is enabled.

### Configure the log level

The application log level is configured through the same `LoggerConfig` used by the other Xeno.JS providers:

```ts
import { AppBuilder, LOG_LEVEL } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options, config) => {
  options.level = LOG_LEVEL.INFO

  options.sentry.config = {
    dsn: config.getOrThrow('SENTRY_DSN'),
    environment: config.get('NODE_ENV', 'development'),
  }
})
```

Xeno.JS supports these log levels:

* `DEBUG`
* `INFO`
* `WARN`
* `ERROR`

The configured level is the minimum level accepted by the application logger.

Sentry has an additional provider-specific rule: **only `WARN` and `ERROR` messages are sent to Sentry**. `DEBUG` and `INFO` messages are not converted into Sentry events.

For example, with:

```ts
options.level = LOG_LEVEL.ERROR
```

only errors can reach Sentry.

With:

```ts
options.level = LOG_LEVEL.INFO
```

the application logger accepts `INFO`, `WARN`, and `ERROR`, but Sentry still receives only `WARN` and `ERROR`.

## Build the application

The logger is registered during application bootstrap:

```ts
const container = await app.build()
```

Configure Sentry before calling `build()`.

A complete minimal setup is:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options, config) => {
  options.sentry.config = {
    dsn: config.getOrThrow('SENTRY_DSN'),
    environment: config.get('NODE_ENV', 'development'),
  }
})

const container = await app.build()
```

## Resolve the application logger

Xeno.JS does not expose a separate DI token for the Sentry logger.

Resolve the application logger through `TOKENS.LOGGER`:

```ts
import { TOKENS } from '@xeno-js/core'

const logger = container.resolve(TOKENS.LOGGER)
```

The resolved object is the Xeno.JS `ILogger` abstraction.

This is important when multiple providers are configured. For example:

```text
ILogger
  ├── Console
  ├── Pino
  ├── Sentry
  └── Custom logger
```

Your application calls the same logger regardless of which providers are enabled.

## Write logs

Use the Xeno.JS logger methods:

```ts
logger.debug('Debug information')
logger.info('User created')
logger.warn('User profile is incomplete')
logger.error('Failed to create user', error)
```

The public error signature accepts the message first and the error as the second argument:

```ts
logger.error('Failed to create user', error)
```

You do not need to import or call the Sentry SDK from application code.

### Example in an application service

```ts
import { TOKENS } from '@xeno-js/core'
import type { ILogger } from '@xeno-js/core'

export class UserService {
  constructor(private readonly logger: ILogger) {}

  async createUser(): Promise<void> {
    try {
      // Application work...
      this.logger.info('User created')
    } catch (error) {
      this.logger.error('Failed to create user', error) //Sentry recieves only the error's log
      throw error
    }
  }
}
```

When Sentry is enabled, the same `logger.error()` call is forwarded to Sentry according to the Xeno.JS Sentry provider rules.

## Warning behavior

Sentry receives `WARN` messages.

When a warning does not include an error object:

```ts
logger.warn('User profile is incomplete')
```

Xeno.JS calls Sentry's message capture mechanism with warning severity.

Conceptually, the resulting Sentry event is a warning message rather than an exception.

If a warning is associated with an error object, Xeno.JS captures the error as an exception:

```ts
logger.warn('User profile validation failed', error)
```

The provider therefore distinguishes between:

```text
WARN + no error
    ↓
Sentry message with warning severity

WARN + error
    ↓
Sentry exception
```

## Error behavior

Errors are sent to Sentry only when the configured application log level allows them.

When an error includes an error object:

```ts
logger.error('Database operation failed', error)
```

Xeno.JS uses Sentry's exception capture mechanism.

When no error object is supplied:

```ts
logger.error('Database operation failed')
```

the Sentry provider uses Sentry's message capture path with warning severity.

Therefore, when reporting an actual exception, pass the `Error` object:

```ts
try {
  await repository.save(user)
} catch (error) {
  logger.error('Failed to save user', error)
  throw error
}
```

This preserves the exception for Sentry rather than reducing the event to a message.

## Zod errors

Xeno.JS filters out events whose original exception is a `ZodError`.

This is done before the event is sent to Sentry.

As a result, validation failures represented by `ZodError` are not reported as Sentry events through this integration.

This behavior is specific to the Xeno.JS Sentry integration and should not be interpreted as a general Sentry SDK behavior.

## Safe context

Xeno.JS does not send the complete request context to logging providers.

The application logger builds a restricted safe context for observability. This context is intended to provide useful diagnostic information without automatically serializing arbitrary request/application state.

The safe context can include information such as:

* `userId`
* `tenantId`
* `requestId`
* request `path`
* request `origin`
* masked client IP
* `correlationId`
* `spanId`
* `startTime`
* `parentSpanId`
* applicable messaging context

The full request context can contain additional information that is not appropriate for automatic logging, such as authentication details, cookies, CSRF values, user profile information, or transport-specific objects.

For Sentry, Xeno.JS attaches the available safe context to the Sentry scope as event extras.

### Safe context is not a security boundary for application messages

Safe context does not prevent application code from explicitly sending sensitive information to a logger.

Avoid code such as:

```ts
logger.info(`User password: ${password}`)
```

or:

```ts
logger.error('Authentication failed', {
  token,
  authorizationHeader,
})
```

Do not explicitly log:

* passwords;
* access tokens;
* refresh tokens;
* API keys;
* authorization credentials;
* session cookies;
* secrets;
* sensitive personal data that is not required for diagnostics.

The safe-context mechanism limits automatically propagated context. It cannot remove sensitive information that application code explicitly places in a log message or error.

## What reaches Sentry?

For a typical Xeno.JS log:

```text
Application code
      │
      ▼
  ILogger
      │
      ├── minimum log-level check
      │
      ▼
  Sentry provider
      │
      ├── DEBUG → ignored
      ├── INFO  → ignored
      ├── WARN  → Sentry message or exception
      └── ERROR → Sentry exception/message
```

The Sentry provider adds the available safe context as event extras.

Sentry itself then stores and presents the resulting event according to the Sentry project configuration.

## Configure Sentry together with other providers

Sentry does not have to be the only logging provider.

For example, you can enable Console, Pino, and Sentry together:

```ts
import { AppBuilder } from '@xeno-js/core'

const app = new AppBuilder()

app.addLogger((options, config) => {
  options.sentry.config = {
    dsn: config.getOrThrow('SENTRY_DSN'),
    environment: config.get('NODE_ENV', 'development'),
  }

  options.pino.config = {
    destination: 'stdout',
  }
})

await app.build()
```

The same application log can then be processed by the configured providers.

For example:

```text
logger.error('Failed to process payment', error)
        │
        ├── Console
        ├── Pino
        └── Sentry
```

Each provider handles the log according to its own integration rules.

## Sentry initialization performed by Xeno.JS

When Sentry is configured, Xeno.JS initializes `@sentry/node` with:

* the configured DSN;
* the configured environment;
* HTTP integration;
* a traces sample rate of `1.0` outside production;
* a traces sample rate of `0.1` in production.

Xeno.JS also installs an event filter that discards events whose original exception is a `ZodError`.

These settings are part of the Xeno.JS integration. You should therefore configure the integration through `addLogger()` rather than separately initializing Sentry for the same application logger.

## Complete example

A typical application can configure Sentry and keep application logging independent from Sentry:

```ts
import { AppBuilder, LOG_LEVEL, TOKENS } from '@xeno-js/core'

async function bootstrap() {
  const app = new AppBuilder()

  app.addLogger((options, config) => {
    options.level = LOG_LEVEL.INFO

    options.sentry.config = {
      dsn: config.getOrThrow('SENTRY_DSN'),
      environment: config.get('NODE_ENV', 'development'),
    }
  })

  const container = await app.build()

  const logger = container.resolve(TOKENS.LOGGER)

  logger.info('Application started')

  try {
    throw new Error('Example failure')
  } catch (error) {
    logger.error('Application operation failed', error)
  }
}

await bootstrap()
```

The application knows only about `ILogger`. It does not need to depend on the Sentry API to report the error.

## Troubleshooting

### Sentry does not receive any events

Check the following:

1. `app.addLogger()` is called.
2. `options.sentry.config` is configured.
3. A valid `dsn` is provided.
4. `app.build()` is called after the logger configuration.
5. The log level allows the event.
6. The event is `WARN` or `ERROR`.
7. The exception is not a `ZodError`.

For example:

```ts
app.addLogger((options, config) => {
  options.level = LOG_LEVEL.WARN

  options.sentry.config = {
    dsn: config.getOrThrow('SENTRY_DSN'),
  }
})
```

### Bootstrap fails with a Sentry configuration error

If Sentry logging is enabled without a Sentry configuration, Xeno.JS throws:

```text
Sentry configuration is required when Sentry logging is enabled.
```

If the configuration exists but has no DSN, Xeno.JS throws:

```text
Sentry DSN is required when Sentry logging is enabled.
```

Check:

```ts
options.sentry.config = {
  dsn: process.env.SENTRY_DSN,
}
```

and verify that `SENTRY_DSN` is actually defined.

### `INFO` logs do not appear in Sentry

This is expected.

The Sentry provider only forwards `WARN` and `ERROR` levels.

For example:

```ts
logger.info('User created')
```

is not sent to Sentry.

Use an appropriate warning or error when the event should be reported to Sentry:

```ts
logger.warn('User profile requires attention')
```

or:

```ts
logger.error('User creation failed', error)
```

### An error appears as a message instead of an exception

Pass the actual error object to `logger.error()`:

```ts
logger.error('Failed to process request', error)
```

instead of only logging a string:

```ts
logger.error('Failed to process request')
```

The Sentry integration uses `captureException()` when an error object is provided.

### Sensitive information appears in Sentry

The safe context only controls automatically propagated contextual information.

Inspect the message, error, and application data passed to the logger directly.

Remove secrets, credentials, tokens, passwords, and unnecessary sensitive information from application-level log calls.

## Related documentation

* [Observability Overview](./overview)
* [Pino Logger](./pino-logger)
* [Dependency Injection — Resolution](../dependency-injection/resolution)
* [Fundamentals — Context & Scopes](../fundamentals/context-scopes)
* [Application — Pipelines](../application/pipelines/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
