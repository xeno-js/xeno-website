---
title:
  'PromiseHelper Utility Specification: Asynchronous Timing & Backoff Control'
description:
  'Technical specification for the PromiseHelper utility module in Xeno,
  detailing asynchronous delays, randomized jitter computation, and Thundering
  Herd mitigation strategies.'
keywords:
  [
    'PromiseHelper',
    'Xeno Utilities',
    'Async Delay',
    'Jitter',
    'Thundering Herd',
    'Exponential Backoff',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Asynchronous Timing & Backoff Control with `PromiseHelper`

The `PromiseHelper` utility namespace provides non-blocking asynchronous timing
controls, execution pauses, and randomized backoff primitives. Frozen at
initialization (`Object.freeze`), it abstracts time-based operations to
streamline asynchronous processing and prevent distributed service degradation.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/promise.utils.ts`, `PromiseHelper` provides
standardized timing mechanisms used internally across retry pipelines and
resilience policies.

### Key Features

- **Thundering Herd Mitigation**: Combines base delay durations with randomized
  jitter offsets to prevent simultaneous client retries from overwhelming
  downstream services.

- **Pure Promise Mechanics**: Uses standard JavaScript `Promise` and
  `setTimeout` APIs without blocking the Node.js event loop.

- **Immutable Primitive**: Namespace is frozen to guarantee reliable runtime
  execution across all application layers.

---

## API Reference Specification

### 1. Fixed Execution Delays

#### `PromiseHelper.delay(ms: number): Promise<void>`

Suspends asynchronous execution for an exact duration specified in milliseconds.

- **Parameters**:
- `ms`: The exact duration in milliseconds to pause execution.

- **Returns**: A `Promise<void>` that resolves when the specified timer elapses.

- **Example**:

```typescript
// Pause execution for 500ms
await PromiseHelper.delay(500)
```

---

### 2. Backoff with Randomized Jitter

#### `PromiseHelper.delayWithJitter(baseDelayMs: number, maxJitterMs: number): Promise<void>`

Introduces a composite asynchronous delay consisting of a guaranteed minimum
base duration plus a randomized jitter offset.

- **Formula**:
  $\text{Total Delay} = \text{baseDelayMs} + \lfloor \text{random}() \times \text{maxJitterMs} \rfloor$

- **Parameters**:
- `baseDelayMs`: The minimum guaranteed delay duration in milliseconds.

- `maxJitterMs`: The maximum additional random variance in milliseconds.

- **Returns**: A `Promise<void>` that resolves after the combined delay
  finishes.

- **Use Case**: Critical for retry mechanisms where multiple distributed workers
  detect a failure simultaneously. Adding random jitter prevents all instances
  from retrying at the exact same millisecond mark.

- **Example**:

```typescript
// Pause for 100ms + random jitter between 0 and 50ms (100ms - 150ms total)
await PromiseHelper.delayWithJitter(100, 50)
```

---

## Quick Method Summary Table

| Method                                          | Return Type     | Description                                                                                            |
| ----------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| **`delay(ms)`**                                 | `Promise<void>` | Pauses asynchronous execution for an exact number of milliseconds.                                     |
| **`delayWithJitter(baseDelayMs, maxJitterMs)`** | `Promise<void>` | Pauses execution for a base delay plus a randomized jitter value to mitigate thundering herd problems. |

---

## Practical Implementation Example

The snippet below demonstrates using `PromiseHelper` within a custom exponential
backoff retry loop:

```typescript
import { PromiseHelper } from '@xeno/core'

export class ResilientWorker {
  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    baseDelayMs = 200,
    maxJitterMs = 100,
  ): Promise<T> {
    let attempt = 0

    while (attempt < maxAttempts) {
      try {
        return await operation()
      } catch (error) {
        attempt++

        if (attempt >= maxAttempts) {
          throw error
        }

        // Calculate exponential backoff multiplier (2^attempt)
        const exponentialBase = baseDelayMs * Math.pow(2, attempt - 1)

        // Wait with base exponential delay + randomized jitter before next attempt
        await PromiseHelper.delayWithJitter(exponentialBase, maxJitterMs)
      }
    }

    throw new Error('Max retry attempts exceeded.')
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
