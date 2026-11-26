---
title: PromiseHelper
description: Add asynchronous delays and retry jitter with Xeno.JS PromiseHelper.
keywords: [Xeno.JS, PromiseHelper, async delay, retry jitter, TypeScript]
tags: [utilities, promises, resilience, typescript]
faqs:
  - question: What range does delayWithJitter add?
    answer: For a positive integer maximum, it adds an integer from zero through maxJitterMs minus one.
  - question: Does PromiseHelper retry an operation?
    answer: No. It only waits; retry decisions and error handling belong to the caller.
---

## Wait asynchronously

`delay(ms)` resolves after a timer. `delayWithJitter(baseDelayMs, maxJitterMs)` adds `Math.floor(Math.random() * maxJitterMs)` milliseconds to the base delay.

```ts
import { PromiseHelper } from '@xeno-js/core'

await PromiseHelper.delay(100)
await PromiseHelper.delayWithJitter(100, 50)
```

For positive integer `maxJitterMs`, the second call schedules a delay from 100 through 149 milliseconds. Jitter can spread retry attempts across clients, but this helper does not perform retries. For client resilience configuration, see [HTTP Client](/docs/http/client).

## Common problems

Both helpers use `setTimeout`: event-loop scheduling can delay completion, and there is no cancellation or exact timing guarantee. Validate delay values before use. `Math.random()` is not suitable for cryptographic randomness.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
