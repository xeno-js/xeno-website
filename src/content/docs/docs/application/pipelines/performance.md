---
title: Performance Pipeline
description: Configure performance thresholds for commands and queries in Xeno.JS, including global and intent-specific thresholds.
keywords:
- Xeno.JS performance pipeline
- Xeno.JS performance
- Xeno.JS threshold
- Xeno.JS intent threshold
- TypeScript performance monitoring
- CQRS performance
tags:
- application
- pipelines
- performance
- cqrs
faqs:
- question: How do I enable the Performance Pipeline?
  answer: Pass withPerformance() to XenoAppBuilder.addPipeline().
- question: What is the default performance threshold?
  answer: The default global threshold is 500 milliseconds.
- question: Can I configure a different threshold for a specific intent?
  answer: Yes. Configure intentThresholdMs with request intents as keys and thresholdMs objects as values.
- question: What happens when an intent has no specific threshold?
  answer: Xeno.JS uses the global thresholdMs option, or 500 milliseconds if no global value is configured.
---

## Introduction

The Performance Pipeline measures how long commands and queries take to execute and logs a warning when their execution time exceeds the configured threshold.

You enable it by passing `withPerformance()` to `XenoAppBuilder.addPipeline()`.

The pipeline supports two levels of configuration:

- `thresholdMs`: global threshold used for all intents.
- `intentThresholdMs`: optional thresholds for specific intents.

When an intent has a specific threshold configured, that value takes precedence over the global threshold.

## Enable the Performance Pipeline

Add the pipeline when configuring your application:

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance())
  .build()
```

`withPerformance()` adds the Performance Pipeline to the common pipeline behaviors used by commands and queries.

## Configure the Global Threshold

Use the `thresholdMs` option to define the default threshold for commands and queries.

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance((options) => {
    options.thresholdMs = 500
  }))
  .build()
```

The default value is:

```ts
500
```

The value is expressed in milliseconds.

The global threshold is used whenever the current request intent does not have a specific threshold configured.

## Configure Thresholds by Intent

Use `intentThresholdMs` as a registry of per-intent threshold overrides. Each key must match the request's `intent`; each value is an object containing a `thresholdMs` property.

An intent-specific threshold takes precedence over the global `thresholdMs` option.

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance((options) => {
    options.thresholdMs = 500
    options.intentThresholdMs = {
      CREATE_USER_HANDLER: { thresholdMs: 300 },
    }
  }))
  .build()
```

In this example:

- all requests use `500ms` by default;
- requests with intent `CREATE_USER_HANDLER` use `300ms`;
- the specific `CREATE_USER_HANDLER` threshold overrides the global threshold.

This is useful when different application operations have different expected execution times.

## Global and Intent-Registry Thresholds

You can configure multiple intents independently in the `intentThresholdMs` registry:

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance((options) => {
    options.thresholdMs = 500
    options.intentThresholdMs = {
      CREATE_USER_HANDLER: { thresholdMs: 300 },
      UPDATE_USER_HANDLER: { thresholdMs: 400 },
      DELETE_USER_HANDLER: { thresholdMs: 250 },
      GET_USER_HANDLER: { thresholdMs: 100 },
    }
  }))
  .build()
```

The effective threshold for a request is selected in this order:

1. `options.intentThresholdMs[request.intent].thresholdMs`
2. `options.thresholdMs`
3. the default global threshold of `500ms`

For example, with:

```ts
options.thresholdMs = 500
options.intentThresholdMs = {
  CREATE_USER_HANDLER: { thresholdMs: 300 },
}
```

the behavior is:

| Intent                  | Effective threshold |
| ----------------------- | ------------------: |
| `CREATE_USER_HANDLER`   |             `300ms` |
| `UPDATE_USER_HANDLER`   |             `500ms` |
| `DELETE_USER_HANDLER`   |             `500ms` |
| Any unconfigured intent |             `500ms` |

An intent-specific threshold is therefore an override, not an additional threshold.

## Configure Only Specific Intents

You can keep the global threshold and override only the operations that require different limits:

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance((options) => {
    options.thresholdMs = 1000
    options.intentThresholdMs = {
      CREATE_USER_HANDLER: { thresholdMs: 300 },
      CHECKOUT_HANDLER: { thresholdMs: 800 },
    }
  }))
  .build()
```

Here:

- `CREATE_USER_HANDLER` uses `300ms`;
- `CHECKOUT_HANDLER` uses `800ms`;
- every other intent uses `1000ms`.

## Performance Warnings

When execution exceeds the effective threshold, the pipeline logs a warning:

```text
Performance warning: CREATE_USER_HANDLER took 342.17ms
```

The warning contains:

- the request intent;
- the measured execution time in milliseconds.

A warning is logged only when the execution time is **greater than** the effective threshold.

For example, with a threshold of `300ms`:

- `299ms` → no warning;
- `300ms` → no warning;
- `301ms` → warning.

## Threshold Validation

The global `thresholdMs` must be greater than zero. Intent-specific `thresholdMs` values must be positive integers.

For example, this configuration is invalid:

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance((options) => {
    options.thresholdMs = 0
    options.intentThresholdMs = {
      CREATE_USER_HANDLER: { thresholdMs: -100 },
    }
  }))
  .build()
```

The global threshold rejects negative values and zero, but is not checked for integer precision. The pipeline validates each intent-specific threshold as a positive integer.

Each configured intent threshold is validated independently.

## Complete Example

The following example configures a global threshold together with different thresholds for selected handlers:

```ts
import { XenoAppBuilder, withPerformance } from '@xeno-js/core'

const app = new XenoAppBuilder()
  .addPipeline(withPerformance((options) => {
    // Fallback threshold for all intents.
    options.thresholdMs = 500

    // Overrides for selected intents.
    options.intentThresholdMs = {
      CREATE_USER_HANDLER: { thresholdMs: 300 },
      UPDATE_USER_HANDLER: { thresholdMs: 400 },
      CHECKOUT_HANDLER: { thresholdMs: 1000 },
    }
  }))
  .build()
```

The resulting behavior is:

```text
CREATE_USER_HANDLER → 300ms
UPDATE_USER_HANDLER  → 400ms
CHECKOUT_HANDLER     → 1000ms
Everything else      → 500ms
```

## Commands and Queries

The Performance Pipeline applies to both commands and queries executed through the configured CQRS pipeline.

The intent-specific configuration works the same way for both:

```ts
withPerformance((options) => {
  options.intentThresholdMs = {
    CREATE_USER_HANDLER: { thresholdMs: 300 },
    GET_USER_HANDLER: { thresholdMs: 100 },
  }
})
```

The intent identifies the operation being executed, regardless of whether it is a command or query.

## Troubleshooting

### My intent-specific threshold is ignored

Check that the registry key in `intentThresholdMs` exactly matches the request `intent`, and that its value contains `thresholdMs`:

```ts
options.intentThresholdMs = {
  CREATE_USER_HANDLER: { thresholdMs: 300 },
}
```

The pipeline compares the key directly with `request.intent`.

If the intent does not match, Xeno.JS falls back to:

```ts
options.thresholdMs
```

### I expected a warning at exactly the threshold

The pipeline logs a warning only when execution time is greater than the threshold.

With:

```ts
options.thresholdMs = 500
```

an execution time of exactly `500ms` does not generate a warning.

### My threshold value is rejected

Check that the global value is greater than zero. Intent-specific values must be positive integers.

Valid:

```ts
300
500
1000
```

Invalid global values:

```ts
0
-100
```

An intent-specific value such as `250.5` is also invalid because intent thresholds must be integers.

## Related Documentation

- [Application](../overview)
- [CQRS](../cqrs/overview)
- [Commands](../cqrs/command)
- [Queries](../cqrs/query)
- [Handlers](../cqrs/handler)
- [Exception Pipeline](./exception)
- [Logging Pipeline](./logging)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
