---
title:
  'PinoLogger Driver: Structured High-Performance Logging & Sensitive Data
  Redaction'
description:
  'Technical guide to configuring the PinoLogger driver in Xeno, covering
  AppBuilder host setup, environment configuration mappings, and native
  sensitive data redaction.'
keywords:
  [
    'PinoLogger',
    'Structured Logging',
    'Pino Configuration',
    'Sensitive Data Redaction',
    'AppBuilder Logger',
    'Xeno Logging',
    'Pino Factory',
  ]
author: 'Xeno'
---

## High-Performance Structured Logging with PinoLogger

Production environments demand high-throughput, structured log outputs that can
be easily parsed by log aggregators (e.g., ElasticSearch, Datadog, or AWS
CloudWatch) without introducing event loop blocking. Xeno provides native
integration with the Pino logging library through the `PinoLogger` driver.

---

## How to Register and Configure PinoLogger via AppBuilder

Registering PinoLogger in Xeno involves calling the fluent addLogger method on
AppBuilder and populating the options.pino.config property object. This
activates the PinoLoggerFactory during host bootstrapping, binding a structured
JSON logging client driver to the composite logger framework container.

To activate Pino logging, configure the `options.pino.config` property inside
the `.addLogger()` configuration block during host initialization. When
`PinoLoggerFactory` detects a non-null configuration object, it instantiates a
Pino instance tuned with ISO 8601 timestamps, standard error serializers, and
active redaction rules.

### Programmatic Bootstrap Registration Example

```typescript
// src/infrastructure/bootstrap-pino.ts
import { AppBuilder, LOG_LEVEL } from '@xeno/core'
import type { AppRegistry } from './xeno-registry/app-registry'

export const bootstrap = async () => {
  const builder = new AppBuilder<AppRegistry>()

  builder.addContext().addLogger((options, configuration) => {
    // 1. Set global minimum log level threshold
    options.level = LOG_LEVEL.INFO

    // 2. Disable default raw console logging if desired
    options.console = false

    // 3. Populate Pino configuration settings
    options.pino.config = {
      env: configuration.get('NODE_ENV', 'development'),
      destination: configuration.get('LOG_DESTINATION', 'stdout')
      filePath: configuration.get('LOG_FILE_PATH', 'logs/app.log'),
      prettyPrint: configuration.get('LOG_PRETTY_PRINT') === 'true',
    }
  })

  return await builder.build()
}
```

---

## Understanding Pino Configuration Settings and Execution Parameters

Pino configuration settings in Xeno govern runtime output targets,
pretty-printing modes, and environment behavior flags. Configured via the
LoggerConfig interface, parameters such as destination, filePath, env, and
prettyPrint dictate whether log entries stream as formatted terminal output or
asynchronous file writes.

The framework maps options defined in `options.pino.config` to internal Pino
instance options during bootstrap.

### Key-Value Specification of Pino Configuration Attributes

- **env** — The runtime environment identifier string (defaults to
  `process.env.NODE_ENV` or `'development'`) used to determine fallback
  pretty-printing behaviors.

- **destination** — The physical logging output stream target, accepting
  `'stdout'` for non-blocking standard process output or `'file'` for disk-bound
  file persistence.

- **filePath** — The physical relative or absolute disk location path (defaults
  to `'logs/app.log'`) targeted when `destination` is set to `'file'`.

- **prettyPrint** — A boolean flag that toggles human-readable, colorized
  console output via `pino-pretty` for local development loops.

---

## How PinoLogger Manages Sensitive Data Redaction

PinoLogger enforces native sensitive data redaction by applying path-based
censorship rules across log serialization pipelines. Automatically masking
fields like passwords, access tokens, and authorization headers with generic
asterisks, the driver prevents security credential leakage into plain-text log
stores or external telemetry aggregation services.

Log outputs often capture request headers, authentication payloads, or user
DTOs. If unmanaged, sensitive credentials like bearer tokens or user passwords
can accidentally leak into persistent log stores. `PinoLogger` prevents this by
configuring native path-based redaction at the serializer layer.

### Redaction Execution Flow

When a log payload is passed to `PinoLogger`, Pino evaluates object properties
against its internal `redact` path registry before converting the object to
JSON. Matched paths are replaced with a censor string (`'***'`) prior to output
formatting.

```mermaid
graph LR
    A[Log Payload Received] --> B[Pino JSON Serializer]

    subgraph Redaction Filter Pipeline [Path-Based Censorship]
        B --> C{Contains Sensitive Path?}
        C -->|Match: password / token / authorization| D[Replace Value with '***']
        C -->|No Match| E[Retain Original Value]
      end

    D --> F[Formatted JSON Output String]
    E --> F
    F --> G[stdout / Log File Destination]

```

### Automatically Redacted Key Paths

The `PinoLoggerFactory` enforces redaction rules across the following default
paths:

- **password** — Automatically masks any top-level or nested `password` field in
  log payloads.

- **token** — Masks API access tokens or refresh tokens.

- **secret** — Masks internal client secrets, cryptographic keys, or signature
  strings.

- **authorization** — Masks raw authorization header strings.

- **headers.authorization** — Masks nested transport authorization headers
  inside HTTP request metadata records.

### Redaction Serialization Example

When an application handler logs a request payload containing sensitive data:

```typescript
// Incoming payload logged by BaseLogger / PinoLogger
logger.info('Processing user authentication request', {
  username: 'john.doe',
  password: 'super-secret-password-123',
  headers: {
    authorization: 'Bearer eyJhbGciOiJIUzI1NiR9...',
  },
})
```

Pino serializes and outputs the JSON entry with credentials censored:

```json
{
  "level": 30,
  "time": "2026-07-21T11:33:00.000Z",
  "msg": "Processing user authentication request",
  "username": "john.doe",
  "password": "***",
  "headers": {
    "authorization": "***"
  }
}
```

---

## Installing Mandatory Peer Dependencies for PinoLogger

Integrating PinoLogger requires explicitly installing the pino peer dependency
alongside the pino-pretty development library in your project workspace. Because
Xeno-JS uses an optional peer dependency model, logging libraries are
lazy-loaded and must be installed before enabling Pino configuration inside
AppBuilder.

To maintain a lightweight core bundle footprint, Xeno-JS classifies external
logging libraries as **optional peer dependencies**. If your application
architecture relies on standard console output or third-party log collectors,
the core framework avoids pulling unnecessary logging frameworks into your
`node_modules` directory.

When you choose to activate structured JSON logging via the
`options.pino.config` setup block in `AppBuilder`, you must install the `pino`
engine alongside its terminal formatting utility.

### Key-Value Specification of Pino Dependencies

- **pino** — The primary structured JSON logging framework required at runtime
  to process log streams and execute sensitive data redaction.

- **pino-pretty** — An optional development-only utility that transforms raw
  JSON log lines into colorized, human-readable terminal output.

### Installation Command

Execute the package manager installation command within your project root:

```
# Install the mandatory Pino core peer dependency
npm install pino

# Install pino-pretty for colorized console formatting during development
npm install --save-dev pino-pretty

```

> **Note**: Ensure that the installed `pino` package version satisfies the
> framework's peer dependency requirement (`^10.3.1` or higher). If
> `options.pino.config` is configured without `pino` present in your project's
> dependencies, Node.js will throw a runtime module resolution exception during
> host initialization.
