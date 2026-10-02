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
  answer: Call addPipeline() on AppBuilder.
- question: What is the default performance threshold?
  answer: The default global threshold is 500 milliseconds.
- question: Can I configure a different threshold for a specific intent?
  answer: Yes. Use config.performance.intentThresholdMs and set the threshold using the request intent as the key.
- question: What happens when an intent has no specific threshold?
  answer: Xeno.JS uses the global config.performance.thresholdMs value as the fallback.
---

## Introduction

The Performance Pipeline measures how long commands and queries take to execute and logs a warning when their execution time exceeds the configured threshold.

You enable it through `AppBuilder.addPipeline()`.

The pipeline supports two levels of configuration:

* `thresholdMs`: global threshold used for all intents.
* `intentThresholdMs`: optional thresholds for specific intents.

When an intent has a specific threshold configured, that value takes precedence over the global threshold.

## Enable the Performance Pipeline

Add the pipeline when configuring your application:

```ts
const app = new AppBuilder()
  .addPipeline()
  .build()
```

Calling `addPipeline()` enables the CQRS pipelines, including the Performance Pipeline.

## Configure the Global Threshold

Use `config.performance.thresholdMs` to define the default threshold for commands and queries.

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.performance.thresholdMs = 500
  })
  .build()
```

The default value is:

```ts
500
```

The value is expressed in milliseconds.

The global threshold is used whenever the current request intent does not have a specific threshold configured.

## Configure Thresholds by Intent

You can configure a different threshold for individual intents with `config.performance.intentThresholdMs`.

The object key is the request `intent`, which corresponds to the token associated with the registered handler.

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.performance.thresholdMs = 500

    config.performance.intentThresholdMs = {
      CREATE_USER_HANDLER: 300,
    }
  })
  .build()
```

In this example:

* all requests use `500ms` by default;
* requests with intent `CREATE_USER_HANDLER` use `300ms`;
* the specific `CREATE_USER_HANDLER` threshold overrides the global threshold.

This is useful when different application operations have different expected execution times.

## Global and Intent-Specific Thresholds

You can configure multiple intents independently:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.performance.thresholdMs = 500

    config.performance.intentThresholdMs = {
      CREATE_USER_HANDLER: 300,
      UPDATE_USER_HANDLER: 400,
      DELETE_USER_HANDLER: 250,
      GET_USER_HANDLER: 100,
    }
  })
  .build()
```

The effective threshold for a request is selected in this order:

1. `config.performance.intentThresholdMs[request.intent]`
2. `config.performance.thresholdMs`
3. the default global threshold of `500ms`

For example, with:

```ts
config.performance.thresholdMs = 500

config.performance.intentThresholdMs = {
  CREATE_USER_HANDLER: 300,
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
const app = new AppBuilder()
  .addPipeline((config) => {
    config.performance.thresholdMs = 1000

    config.performance.intentThresholdMs = {
      CREATE_USER_HANDLER: 300,
      CHECKOUT_HANDLER: 800,
    }
  })
  .build()
```

Here:

* `CREATE_USER_HANDLER` uses `300ms`;
* `CHECKOUT_HANDLER` uses `800ms`;
* every other intent uses `1000ms`.

## Performance Warnings

When execution exceeds the effective threshold, the pipeline logs a warning:

```text
Performance warning: CREATE_USER_HANDLER took 342.17ms
```

The warning contains:

* the request intent;
* the measured execution time in milliseconds.

A warning is logged only when the execution time is **greater than** the effective threshold.

For example, with a threshold of `300ms`:

* `299ms` → no warning;
* `300ms` → no warning;
* `301ms` → warning.

## Threshold Validation

All thresholds must be positive integers.

For example, this configuration is invalid:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    config.performance.thresholdMs = 0

    config.performance.intentThresholdMs = {
      CREATE_USER_HANDLER: -100,
    }
  })
```

Threshold values must be greater than zero and must be integers.

For intent-specific thresholds, each configured value is validated independently.

## Complete Example

The following example configures a global threshold together with different thresholds for selected handlers:

```ts
const app = new AppBuilder()
  .addPipeline((config) => {
    // Fallback threshold for all intents.
    config.performance.thresholdMs = 500

    // Overrides for specific handler intents.
    config.performance.intentThresholdMs = {
      CREATE_USER_HANDLER: 300,
      UPDATE_USER_HANDLER: 400,
      CHECKOUT_HANDLER: 1000,
    }
  })
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
config.performance.intentThresholdMs = {
  CREATE_USER_HANDLER: 300,
  GET_USER_HANDLER: 100,
}
```

The intent identifies the operation being executed, regardless of whether it is a command or query.

## Troubleshooting

### My intent-specific threshold is ignored

Check that the key in `intentThresholdMs` exactly matches the request `intent`:

```ts
config.performance.intentThresholdMs = {
  CREATE_USER_HANDLER: 300,
}

// Check if you added the handler in the container with the same key
container.addScoped('CREATE_USER_HANDLER', () => new CreateUserHandler())

// Check if you are using the correct intent in the command or query
export class CreateUserCommand extends Command<null> {
  constructor() {
    super('CREATE_USER_HANDLER')
  }
}

// Che if you are using the correct key in the registry
export type MyRegistry {
  CREATE_USER_HANDLER: CreateUserHandler
}
```

The key must be the same intent associated with the handler.

If the intent does not match, Xeno.JS falls back to:

```ts
config.performance.thresholdMs
```

### I expected a warning at exactly the threshold

The pipeline logs a warning only when execution time is greater than the threshold.

With:

```ts
config.performance.thresholdMs = 500
```

an execution time of exactly `500ms` does not generate a warning.

### My threshold value is rejected

Check that the value is a positive integer.

Valid:

```ts
300
500
1000
```

Invalid:

```ts
0
-100
250.5
```

## Related Documentation

* [Application](../overview)
* [CQRS](../cqrs/overview)
* [Commands](../cqrs/command)
* [Queries](../cqrs/query)
* [Handlers](../cqrs/handler)
* [Exception Pipeline](./exception)
* [Logging Pipeline](./logging)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
