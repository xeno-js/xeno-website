---
title: 'Shared Utilities Overview: System Primitives & Helpers'
description:
  'Overview specification for shared utility modules in Xeno, detailing type
  guards, date manipulation, string helpers, HTTP envelope formatters, math
  functions, and async controls.'
keywords:
  [
    'Shared Utils',
    'Xeno Utilities',
    'Guards',
    'DateHelper',
    'GuidHelper',
    'HttpHelper',
    'MathHelper',
    'PromiseHelper',
    'StringHelper',
    'Enumerable',
    'Xeno',
  ]
author: 'Xeno'
---

## Shared Utilities Subsystem Overview

The `@xeno/core` framework exposes a centralized set of **Shared Utilities**
located under the `shared/utils/` namespace. These helpers provide immutable,
timezone-agnostic, type-safe primitives used internally across Xeno modules
(such as pipelines, controllers, and middleware) and exposed to application
developers to streamline domain and infrastructure implementations.

---

## Utility Architecture & Design Principles

All utility objects in Xeno strictly adhere to three architectural rules:

1. **Object Immutability (`Object.freeze`)**: Utility namespaces are frozen at
   runtime to prevent prototype pollution or method tampering.

2. **Type Safety & Predicates**: Methods leverage TypeScript type guards
   (`value is T`) and strict validation routines to eliminate runtime type
   errors (`TypeError`).

3. **Zero External Dependencies**: Core utilities rely on native ECMAScript and
   Node.js features, keeping the base library lightweight and fast.

---

## Summary of Shared Utility Namespaces

The `shared/utils` barrel exports nine core utility modules:

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                          shared/utils Subsystem                           │
│                                                                           │
│   ┌───────────────────┐    ┌───────────────────┐    ┌─────────────────┐   │
│   │    Guards         │    │   GuidHelper      │    │   HttpHelper    │   │
│   │  (Type Guards)    │    │  (UUID v4 Engine) │    │(Response DTOs)  │   │
│   └───────────────────┘    └───────────────────┘    └─────────────────┘   │
│             │                        │                       │            │
│   ┌───────────────────┐    ┌───────────────────┐    ┌─────────────────┐   │
│   │   DateHelper      │    │   StringHelper    │    │   MathHelper    │   │
│   │ (Time & Expiry)   │    │(Format & Truncate)│    │ (Safe Division) │   │
│   └───────────────────┘    └───────────────────┘    └─────────────────┘   │
│             │                        │                       │            │
│   ┌───────────────────┐    ┌───────────────────┐    ┌─────────────────┐   │
│   │  PromiseHelper    │    │   Enumerable      │    │AbortSignalHelper│   │
│   │(Jitter & Delays)  │    │(Array Operators)  │    │ (Cancellation)  │   │
│   └───────────────────┘    └───────────────────┘    └─────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘

```

### 1. `Guards`

Centralized runtime type guards and assertion functions. Provides methods like
`isDefined`, `isNullOrEmpty`, `isString`, `isNumber`, `isDate`,
`isObjectRecord`, and assertion throwing helpers like `throwIfNullOrEmpty` and
`throwIfNegative`.

### 2. `GuidHelper`

Cryptographically secure UUID v4 generation and validation module. Features
`generate()` via standard `crypto.randomUUID()`, UUID pattern validation
(`isValid`), empty GUID checks (`isEmpty`), and parsing routines (`parse`).

### 3. `HttpHelper`

Standardized HTTP response builder and header normalization module. Formats
success payloads (`HttpHelper.success` producing `ResponseDto<T>`), error
envelopes (`HttpHelper.error` producing `ErrorResponseDto`), and converts header
maps into uniform string key-value dictionaries.

### 4. `DateHelper`

Timezone-agnostic date calculation and evaluation tools. Includes ISO string
converters (`toISOString`), date arithmetic (`addDays`), and expiration check
helpers (`isExpired`, `isFuture`, `isAfter`).

### 5. `StringHelper`

Safe string manipulations, template interpolation, and formatting. Provides
circular-safe JSON serialization (`safeStringify`), fault-tolerant parsing
(`safeParse`), string case conversions (`camelCase`), placeholder interpolation
(`interpolate`), truncation (`truncate`), and header extraction
(`getSingleValue`).

### 6. `MathHelper`

Safe mathematical calculations designed to prevent divide-by-zero or precision
rounding bugs. Includes bounds clamping (`clamp`), rounding (`roundTo`), safe
division (`safeDivide`), percentage calculation (`toPercentage`), and safe
number casting (`toNumber`).

### 7. `PromiseHelper`

Asynchronous timing and backoff primitives. Offers millisecond delay suspenders
(`delay`) and randomized exponential backoff helpers (`delayWithJitter`)
engineered specifically to mitigate Thundering Herd scenarios.

### 8. `Enumerable`

Type-safe array operators inspired by LINQ / sequence evaluation. Provides
strict (`first`) and safe (`firstOrDefault`) element finders based on predicate
callbacks.

### 9. `AbortSignalHelper`

Cancellation-aware Promise execution wrapper. Listens to `AbortSignal` events
and rejects immediately when an execution cancellation is requested by a client
or timeout policy.

---

## Import & Usage Pattern

All utilities are exported directly from `@xeno/core` (or internally via
`@/shared`):

```typescript
import {
  Guards,
  GuidHelper,
  HttpHelper,
  DateHelper,
  StringHelper,
  MathHelper,
  PromiseHelper,
  Enumerable,
  AbortSignalHelper,
} from '@xeno/core'

// Example: Validating defined state and creating a tracking GUID
if (Guards.isDefined(payload)) {
  const correlationId = GuidHelper.generate()
  // ...
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
