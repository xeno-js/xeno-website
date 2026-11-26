---
title: DateHelper
description: Use DateHelper in Xeno.JS to format dates as UTC, add elapsed days, and compare expiry times.
keywords: [Xeno.JS, DateHelper, TypeScript dates, expiration, UTC]
tags: [utilities, date, typescript]
faqs:
  - question: Does addDays use calendar days?
    answer: No. It adds 86400000 milliseconds per day, independently of local daylight-saving changes.
  - question: Is a date expired at the exact reference time?
    answer: No. isExpired returns true only when the expiry timestamp is strictly earlier than the reference time.
---

## Format and compare dates

`DateHelper` works with JavaScript `Date` objects and timestamps. Import it from `@xeno-js/core` or `@xeno-js/shared`:

```ts
import { DateHelper } from '@xeno-js/core'

const createdAt = new Date('2026-01-01T12:00:00.000Z')
const expiresAt = DateHelper.addDays(createdAt, 2)

console.log(DateHelper.toISOString(expiresAt)) // 2026-01-03T12:00:00.000Z
console.log(DateHelper.isAfter(expiresAt, createdAt)) // true
console.log(DateHelper.isExpired(expiresAt, expiresAt.getTime())) // false
```

## Methods

- `toISOString(date)` delegates to `Date.toISOString()` and returns a UTC string. An invalid date throws.
- `addDays(date, days)` returns a new date by adding `days * 86400000` milliseconds. Negative and fractional values are accepted; the original date is not modified.
- `isExpired(expiresAt, nowMs?)` compares the expiry timestamp with `nowMs`, or `Date.now()` when omitted. Equality is not expired.
- `isAfter(after, before)` returns `true` only for valid dates where the first is strictly later.
- `isFuture(date)` returns `true` only for a valid date strictly later than the current time.

## Common problems

Adding 24 hours is not the same as adding a local calendar day across a daylight-saving transition. Use calendar-aware logic when local wall-clock time must stay constant. `isExpired()` does not validate its date; an invalid date produces a `false` comparison, so validate untrusted dates with [Guards](/docs/utils/guards) first.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
