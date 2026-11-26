---
title: MathHelper
description: Apply Xeno.JS MathHelper for clamping, rounding, numeric conversion, division, and percentages in TypeScript.
keywords: [Xeno.JS, MathHelper, TypeScript, rounding, percentage, number conversion]
tags: [utilities, math, typescript]
faqs:
  - question: Does toPercentage limit results to 100?
    answer: No. It calculates part divided by total times 100, so the result can exceed 100 or be negative.
  - question: Does safeDivide reject every invalid numeric value?
    answer: No. It only returns the fallback when the denominator is zero.
---

## Numeric operations

```ts
import { MathHelper } from '@xeno-js/core'

const quantity = MathHelper.clamp(15, 0, 10) // 10
const ratio = MathHelper.safeDivide(5, 0, -1) // -1
const completion = MathHelper.toPercentage(3, 4) // 75
const amount = MathHelper.toNumber('12.5') // 12.5
```

## Methods

- `clamp(value, min, max)` applies inclusive bounds with `Math.min` and `Math.max`. Supply `min <= max`; the helper does not validate the bounds.
- `roundTo(value, decimals)` scales by a power of ten and uses `Math.round`.
- `safeDivide(numerator, denominator, fallback?)` returns the fallback, default `0`, only when the denominator is zero.
- `toPercentage(part, total)` returns `part / total * 100`, or `0` when the total is zero.
- `toNumber(value, fallback?)` uses `Number()` for conversion and returns the fallback, default `0`, for `null`, `undefined`, or `NaN` results.

## Common problems

JavaScript floating-point rounding is not exact decimal arithmetic. For monetary calculations, choose a representation and rounding policy appropriate for your application.

`toNumber()` can return infinity, and `Number()` can throw for some inputs, including symbols. Empty strings convert to zero. Validate inputs and require a finite result when those behaviors are unsuitable.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
