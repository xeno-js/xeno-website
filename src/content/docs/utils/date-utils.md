---
title:
  'DateHelper Utility Specification: Timezone-Agnostic Date Calculations &
  Comparisons'
description:
  'Technical specification for the DateHelper utility module in Xeno, detailing
  ISO string conversions, date arithmetic, expiration evaluations, and temporal
  comparison predicates.'
keywords:
  [
    'DateHelper',
    'Xeno Utilities',
    'Date Manipulation',
    'Timezone Agnostic',
    'ISO 8601',
    'Expiration Check',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Timezone-Agnostic Date Calculations with `DateHelper`

The `DateHelper` utility namespace provides timezone-agnostic date calculation,
formatting, and temporal comparison primitives. Frozen at initialization
(`Object.freeze`), it delivers consistent, predictable date logic across
Xeno—powering cache expiration tracking, token validity checks, and domain
timestamp operations.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/date.utils.ts`, `DateHelper` centralizes date
manipulations to prevent timezone offset bugs, leap-year calculation errors, and
direct reliance on mutable date objects.

### Key Features

- **ISO 8601 Standardization**: Generates uniform UTC ISO 8601 strings across
  environments.

- **Immutable Date Arithmetic**: Methods return newly instantiated `Date`
  objects without mutating original instances.

- **Custom Reference Timestamps**: Expiration and validity helpers accept
  optional reference timestamps for deterministic unit testing.

- **Guarded Comparisons**: Integrates internal `Guards.isDate` checks to ensure
  validity before making temporal comparisons.

---

## API Reference Specification

### 1. Formatting & Conversions

#### `DateHelper.toISOString(date: Date): string`

Converts a JavaScript `Date` instance into a standardized ISO 8601 UTC string
representation.

- **Returns**: ISO string (e.g., `'2026-07-28T15:00:00.000Z'`).

- **Example**:

```typescript
const formatted = DateHelper.toISOString(new Date())
```

---

### 2. Date Arithmetic

#### `DateHelper.addDays(date: Date, days: number): Date`

Calculates a new `Date` instance with a specific number of days added or
subtracted.

- **Behavior**: Multiplies `days` by `86_400_000` ms
  ($24 \times 60 \times 60 \times 1000$) and adds it to the target epoch
  timestamp. Negative numbers subtract days.

- **Returns**: A new, independent `Date` object.

- **Example**:

```typescript
const today = new Date()
const nextWeek = DateHelper.addDays(today, 7)
const lastWeek = DateHelper.addDays(today, -7)
```

---

### 3. Expiration & Comparison Predicates

#### `DateHelper.isExpired(expiresAt: Date, nowMs?: number): boolean`

Determines whether an expiry timestamp has elapsed relative to a reference time.

- **Parameters**:
- `expiresAt`: The target expiry date.

- `nowMs`: Optional reference epoch timestamp in milliseconds (defaults to
  `Date.now()`).

- **Returns**: `true` if `expiresAt.getTime() < now`.

#### `DateHelper.isAfter(after: Date, before: Date): boolean`

Verifies if one date occurs strictly after another.

- **Behavior**: Evaluates both dates using `Guards.isDate`.

- **Returns**: `true` if both dates are valid and
  `after.getTime() > before.getTime()`; otherwise `false`.

#### `DateHelper.isFuture(date: Date): boolean`

Checks whether a given date occurs in the future relative to the current
execution time.

- **Returns**: `true` if `date` is a valid date instance and
  `date.getTime() > Date.now()`.

---

## Quick Method Summary Table

| Method                             | Return Type | Description                                                               |
| ---------------------------------- | ----------- | ------------------------------------------------------------------------- |
| **`toISOString(date)`**            | `string`    | Converts a `Date` instance to an ISO 8601 UTC string.                     |
| **`addDays(date, days)`**          | `Date`      | Returns a new `Date` with the specified offset in days added/subtracted.  |
| **`isExpired(expiresAt, nowMs?)`** | `boolean`   | Checks if `expiresAt` is in the past relative to `nowMs` or `Date.now()`. |
| **`isAfter(after, before)`**       | `boolean`   | Returns `true` if `after` is strictly later than `before`.                |
| **`isFuture(date)`**               | `boolean`   | Returns `true` if `date` is strictly later than `Date.now()`.             |

---

## Practical Implementation Example

The snippet below demonstrates how `DateHelper` is used to validate
time-sensitive tokens and schedule record expiration:

```typescript
import { DateHelper } from '@xeno/core'

export class TokenValidationService {
  public isTokenValid(issuedAt: Date, expiresInDays: number): boolean {
    // 1. Calculate future expiration threshold
    const expirationDate = DateHelper.addDays(issuedAt, expiresInDays)

    // 2. Check if the token is already expired
    if (DateHelper.isExpired(expirationDate)) {
      return false
    }

    // 3. Ensure the issuance date is not set in the future (skew guard)
    return !DateHelper.isFuture(issuedAt)
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
