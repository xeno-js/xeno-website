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
  answer: Register withSentryNodeLogger() with app.addLogger() and configure its DSN.
- question: Which package do I need for Sentry logging?
  answer: Install @xeno-js/sentry-node and the Sentry Node SDK alongside the Xeno.JS packages used by your application.
- question: What Sentry configuration does Xeno.JS require?
  answer: The plugin accepts a DSN, release, and environment; it initializes these from SENTRY_DSN, SENTRY_RELEASE, and SENTRY_ENVIRONMENT when configured.
- question: Does Xeno.JS send every log level to Sentry?
  answer: No. The Sentry logger only forwards WARN and ERROR log levels.
- question: How are warnings sent to Sentry?
  answer: A warning without an error is sent as a Sentry warning message. A warning with an error is captured as a Sentry exception.
- question: How are errors sent to Sentry?
  answer: An error with an error object is captured with captureException. If no error object is provided, Xeno.JS sends the message through Sentry's message capture path using warning severity.
- question: Can I use Sentry together with Console or Pino?
  answer: Yes. Xeno.JS can configure Sentry alongside the Console logger, Pino, and custom logger clients.
- question: How do I resolve the Sentry logger?
  answer: Resolve the application logger from the application instance returned by build(). Xeno.JS exposes the combined application logger rather than a separate Sentry logger token.
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
npm install @xeno-js/core @xeno-js/sentry-node
```

Register the `@xeno-js/sentry-node` plugin to add Sentry as a logging provider.

Configure the integration through `withSentryNodeLogger()` rather than calling Sentry APIs from application code.

## Configure Sentry

Configure Sentry through `AppBuilder.addLogger()`:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

const app = new XenoAppBuilder()

app.addLogger(withSentryNodeLogger((options, config) => {
  options.dsn = config.get('SENTRY_DSN') ?? ''
  options.release = config.get('SENTRY_RELEASE') ?? ''
  options.environment = config.get('SENTRY_ENVIRONMENT') ?? ''
}))
```

The Sentry configuration exposes:

| Option        | Description                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| `dsn`         | Sentry Data Source Name used to send events to the configured Sentry project. |
| `release`     | Release associated with the Sentry events.                                    |
| `environment` | Environment associated with the Sentry events.                                |

The plugin initializes these options from `SENTRY_DSN`, `SENTRY_RELEASE`, and `SENTRY_ENVIRONMENT` via the configuration service. Its setup callback can override them.

### Configure the log level

The application log level is configured through the same `LoggerConfig` used by the other Xeno.JS providers:

```ts
import { LOG_LEVEL } from '@xeno-js/shared'
import { XenoAppBuilder, withConsoleLogger } from '@xeno-js/core'
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

const app = new XenoAppBuilder()

app.addLogger([
  withConsoleLogger((options) => {
    options.level = LOG_LEVEL.INFO
  }),
  withSentryNodeLogger((options, config) => {
    options.dsn = config.get('SENTRY_DSN') ?? ''
    options.release = config.get('SENTRY_RELEASE') ?? ''
    options.environment = config.get('SENTRY_ENVIRONMENT') ?? ''
  }),
])
```

Xeno.JS supports these log levels:

- `DEBUG`
- `INFO`
- `WARN`
- `ERROR`

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
const application = await app.build()
```

Configure Sentry before calling `build()`.

A complete minimal setup is:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

const app = new XenoAppBuilder()

app.addLogger(withSentryNodeLogger((options, config) => {
  options.dsn = config.get('SENTRY_DSN') ?? ''
  options.release = config.get('SENTRY_RELEASE') ?? ''
  options.environment = config.get('SENTRY_ENVIRONMENT') ?? ''
}))

const application = await app.build()
```

## Resolve the application logger

Xeno.JS does not expose a separate DI token for the Sentry logger.

Resolve the application logger through the built application's service proxy:

```ts
const { logger } = application.getServices()
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
import type { ILogger } from '@xeno-js/shared'

export class UserService {
  constructor(private readonly logger: ILogger) {}

  async createUser(): Promise<void> {
    try {
      // Application work...
      this.logger.info('User created')
    } catch (error) {
      this.logger.error('Failed to create user', error)
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

- `userId`
- `tenantId`
- `requestId`
- request `path`
- request `origin`
- masked client IP
- `correlationId`
- `spanId`
- `startTime`
- `parentSpanId`
- applicable messaging context

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

- passwords;
- access tokens;
- refresh tokens;
- API keys;
- authorization credentials;
- session cookies;
- secrets;
- sensitive personal data that is not required for diagnostics.

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
import { XenoAppBuilder, withConsoleLogger } from '@xeno-js/core'
import { withPinoLogger } from '@xeno-js/pino'
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

const app = new XenoAppBuilder()

app.addLogger([
  withConsoleLogger(),
  withPinoLogger((options) => {
    options.destination = 'stdout'
  }),
  withSentryNodeLogger((options, config) => {
    options.dsn = config.get('SENTRY_DSN') ?? ''
    options.release = config.get('SENTRY_RELEASE') ?? ''
    options.environment = config.get('SENTRY_ENVIRONMENT') ?? ''
  }),
])

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

When the plugin is enabled, it creates the Sentry logger through `SentryLoggerFactory.create(options)`, passing the configured DSN, release, and environment.

The exact `@sentry/node` initialization behavior, including integrations, sampling rates, and event filters, cannot be verified from the current context; checking the factory implementation is required.

## Complete example

A typical application can configure Sentry and keep application logging independent from Sentry:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { LOG_LEVEL } from '@xeno-js/shared'
import { withSentryNodeLogger } from '@xeno-js/sentry-node'

async function bootstrap() {
  const app = new XenoAppBuilder()

  app.addLogger(withSentryNodeLogger((options, config) => {
    options.dsn = config.get('SENTRY_DSN') ?? ''
    options.release = config.get('SENTRY_RELEASE') ?? ''
    options.environment = config.get('SENTRY_ENVIRONMENT') ?? ''
  }))

  const application = await app.build()

  const { logger } = application.getServices()

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
2. `withSentryNodeLogger()` is passed to `addLogger()`.
3. A valid `dsn` is provided.
4. `app.build()` is called after the logger configuration.
5. The log level allows the event.
6. The event is `WARN` or `ERROR`.
7. The exception is not a `ZodError`.

For example:

```ts
app.addLogger([
  withConsoleLogger((options) => {
    options.level = LOG_LEVEL.WARN
  }),
  withSentryNodeLogger((options, config) => {
    options.dsn = config.get('SENTRY_DSN') ?? ''
    options.release = config.get('SENTRY_RELEASE') ?? ''
    options.environment = config.get('SENTRY_ENVIRONMENT') ?? ''
  }),
])
```

### Bootstrap fails with a Sentry configuration error

Check that `withSentryNodeLogger()` is registered and that the DSN is configured:

```ts
app.addLogger(withSentryNodeLogger((options, config) => {
  options.dsn = config.get('SENTRY_DSN') ?? ''
}))
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

- [Observability Overview](./overview)
- [Pino Logger](./pino-logger)
- [Dependency Injection — Resolution](../dependency-injection/resolution)
- [Fundamentals — Context & Scopes](../fundamentals/context-scopes)
- [Application — Pipelines](../application/pipelines/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
