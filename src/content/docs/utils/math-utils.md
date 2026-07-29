---
title:
  'MathHelper Utility Specification: Safe Mathematical Operations & Conversions'
description:
  'Technical specification for the MathHelper utility module in Xeno, detailing
  bounds clamping, precision rounding, safe zero-division handling, percentage
  calculations, and fallback-safe number conversions.'
keywords:
  [
    'MathHelper',
    'Xeno Utilities',
    'Safe Division',
    'Clamp Number',
    'Round Precision',
    'Percentage Calculation',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Safe Mathematical Operations & Conversions with `MathHelper`

The `MathHelper` utility namespace provides safe mathematical calculations and
numeric conversion primitives. Frozen at initialization (`Object.freeze`), it
delivers fault-tolerant arithmetic logic across Xeno—preventing zero-division
crashes, precision rounding anomalies, and unhandled `NaN` outputs during
numeric operations.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/math.utils.ts`, `MathHelper` centralizes numeric
utilities across domain services, pagination helpers, and metric calculators to
eliminate boundary errors and floating-point irregularities.

### Key Features

- **Zero-Division Protection**: `safeDivide` and `toPercentage` gracefully
  process zero denominators using configurable fallback values instead of
  outputting `Infinity` or `NaN`.

- **Boundary Clamping**: `clamp` constrains numbers within inclusive bounds.

- **Exact Decimal Rounding**: `roundTo` rounds floating-point values to defined
  decimal precisions without floating-point arithmetic artifacts.

- **Fallback Casting**: `toNumber` safely parses arbitrary or optional inputs
  into numeric primitives, falling back on default values if parsing fails.

---

## API Reference Specification

### 1. Clamping & Precision Rounding

#### `MathHelper.clamp(value: number, min: number, max: number): number`

Constrains `value` within an inclusive `[min, max]` range.

- **Behavior**: Evaluates $\min(\max(\text{value}, \text{min}), \text{max})$.

- **Returns**: Clamped number within the designated bounds.

- **Example**:

```typescript
MathHelper.clamp(15, 0, 10) // Output: 10
MathHelper.clamp(-5, 0, 10) // Output: 0
MathHelper.clamp(5, 0, 10) // Output: 5
```

#### `MathHelper.roundTo(value: number, decimals: number): number`

Rounds a number to the specified number of decimal places.

- **Behavior**: Multiplies `value` by $10^{\text{decimals}}$, applies
  `Math.round`, and divides by $10^{\text{decimals}}$.

- **Returns**: Rounded numeric floating-point or integer value.

- **Example**:

```typescript
MathHelper.roundTo(3.14159, 2) // Output: 3.14
MathHelper.roundTo(1.005, 2) // Output: 1.01
```

---

### 2. Safe Arithmetic & Ratios

#### `MathHelper.safeDivide(numerator: number, denominator: number, fallback = 0): number`

Divides two numbers, returning a safe fallback value if the denominator is zero.

- **Parameters**:
- `numerator`: The dividend number.

- `denominator`: The divisor number.

- `fallback`: The value returned when `denominator === 0` (defaults to `0`).

- **Returns**: Division result or `fallback`.

- **Example**:

```typescript
MathHelper.safeDivide(10, 2) // Output: 5
MathHelper.safeDivide(10, 0) // Output: 0 (No Infinity exception)
MathHelper.safeDivide(10, 0, -1) // Output: -1
```

#### `MathHelper.toPercentage(part: number, total: number): number`

Calculates the percentage of `part` relative to `total` on a $0 - 100$ scale.

- **Behavior**: Returns $(\text{part} / \text{total}) \times 100$. Automatically
  returns `0` if `total === 0`.

- **Returns**: Percentage value.

- **Example**:

```typescript
MathHelper.toPercentage(25, 100) // Output: 25
MathHelper.toPercentage(10, 0) // Output: 0
```

---

### 3. Safe Number Conversion

#### `MathHelper.toNumber(value: Optional<unknown>, fallback = 0): number`

Converts an untrusted input into a valid primitive number.

- **Behavior**: Uses `Guards.isDefined` and `Guards.isNumber`. If `value` cannot
  be coerced to a valid, finite number (or results in `NaN`), it returns
  `fallback`.

- **Returns**: A valid numeric value or `fallback`.

- **Example**:

```typescript
MathHelper.toNumber(42) // Output: 42
MathHelper.toNumber('abc', 1) // Output: 1
MathHelper.toNumber(undefined) // Output: 0
```

---

## Quick Method Summary Table

| Method                                  | Return Type | Description                                                                        |
| --------------------------------------- | ----------- | ---------------------------------------------------------------------------------- |
| **`clamp(value, min, max)`**            | `number`    | Restricts a number to an inclusive min-max range.                                  |
| **`roundTo(value, decimals)`**          | `number`    | Rounds a number to a specific decimal precision.                                   |
| **`safeDivide(num, denom, fallback?)`** | `number`    | Performs division; returns fallback on zero denominator.                           |
| **`toPercentage(part, total)`**         | `number`    | Calculates percentage ratio ($0-100$ scale); returns `0` if total is zero.         |
| **`toNumber(value, fallback?)`**        | `number`    | Safely coerces values to numbers; returns fallback on non-numeric inputs or `NaN`. |

---

## Practical Implementation Example

The snippet below demonstrates how `MathHelper` is used inside a rate-limiting
and pagination calculation service:

```typescript
import { MathHelper } from '@xeno/core'

export class MetricsCalculator {
  public calculateProgress(
    completedItems: unknown,
    totalItems: unknown,
  ): { percentage: number; rate: number } {
    // 1. Safely convert unknown inputs to numbers with fallbacks
    const completed = MathHelper.toNumber(completedItems, 0)
    const total = MathHelper.toNumber(totalItems, 0)

    // 2. Calculate percentage safely without divide-by-zero risk
    const rawPercentage = MathHelper.toPercentage(completed, total)

    // 3. Clamp percentage within 0-100 range and round to 2 decimal places
    const percentage = MathHelper.roundTo(
      MathHelper.clamp(rawPercentage, 0, 100),
      2,
    )

    // 4. Calculate execution rate per item
    const rate = MathHelper.roundTo(MathHelper.safeDivide(completed, total), 4)

    return { percentage, rate }
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
