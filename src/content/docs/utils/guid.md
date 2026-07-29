---
title: 'GuidHelper Utility Specification: UUID v4 Generation & Validation'
description:
  'Technical specification for the GuidHelper utility module in Xeno, detailing
  UUID v4 generation, regex-based validation, empty GUID identification, and
  safe string parsing.'
keywords:
  [
    'GuidHelper',
    'Guid',
    'UUID v4',
    'Xeno Utilities',
    'Correlation ID',
    'Request ID',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Secure UUID v4 Generation & Validation with `GuidHelper`

The `GuidHelper` utility namespace provides cryptographically secure **UUID v4**
generation, pattern validation, empty GUID detection, and safe string parsing.
Frozen at initialization (`Object.freeze`), it serves as the foundational
identifier utility across Xeno—powering correlation IDs, request tracking
tokens, and domain entity primary keys.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/guid.utils.ts`, `GuidHelper` centralizes all unique
identifier operations to ensure consistent ID formats across transport headers,
logging context, and database layers.

### Key Features

- **Cryptographic Randomness**: Leverages Web Crypto API's native
  `crypto.randomUUID()` for non-deterministic UUID generation.

- **Strict RFC 4122 Compliance**: Validates canonical 8-4-4-4-12 UUID v4
  formatting
  (`/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`).

- **Case-Insensitive Checking**: Accurately parses and validates both lowercase
  and uppercase UUID strings.

- **Nil/Empty GUID Filtering**: Distinguishes between valid UUID v4 tokens and
  empty placeholder GUIDs (`00000000-0000-0000-0000-000000000000`).

---

## API Reference Specification

### 1. Identifier Generation & Type Branding

#### `GuidHelper.generate(): Guid`

Generates a cryptographically random, lowercase UUID v4 string conforming to the
`Guid` template literal type
(`${string}-${string}-${string}-${string}-${string}`).

- **Returns**: A newly minted UUID v4 string (e.g.,
  `'550e8400-e29b-41d4-a716-446655440000'`).

- **Example**:

```typescript
const correlationId: Guid = GuidHelper.generate()
```

---

### 2. Validation Predicates

#### `GuidHelper.isValid(value: string): value is Guid`

Evaluates whether an arbitrary input string matches the formal syntax structure
of a UUID v4. Uses type narrowing (`value is Guid`) to inform TypeScript that
the string is a valid identifier.

- **Returns**: `true` if the candidate matches the UUID v4 pattern; `false` for
  empty strings, non-UUID strings, or non-v4 UUID formats (such as UUID v1).

#### `GuidHelper.isEmpty(value: string): boolean`

Checks if a given GUID string represents the Nil/Empty GUID
(`'00000000-0000-0000-0000-000000000000'`).

- **Returns**: `true` if `value === '00000000-0000-0000-0000-000000000000'`;
  otherwise `false`.

#### `GuidHelper.isValidGuid(value: Guid): boolean`

A compound validation check that verifies whether a typed `Guid` candidate is
structurally valid **and** not an empty/nil GUID.

- **Returns**: `true` if the candidate is both a valid UUID v4 syntax and
  non-empty.

---

### 3. Parsing & Conversion

#### `GuidHelper.parse(value: Optional<string>): Optional<Guid>`

Safely converts an untrusted or optional string into a strongly-typed `Guid`.

- **Behavior**: Evaluates `value`. If `value` is defined, non-empty,
  structurally valid according to `isValid()`, and not an empty Nil GUID
  (`isEmpty()`), it returns `value as Guid`. Otherwise, it returns `undefined`
  safely without throwing an exception.

- **Example**:

```typescript
const rawHeader = req.headers['x-correlation-id']
const validGuid = GuidHelper.parse(rawHeader) // Returns Guid or undefined
```

---

## Quick Method Summary Table

| Method                   | Return Type      | Description                                                               |
| ------------------------ | ---------------- | ------------------------------------------------------------------------- |
| **`generate()`**         | `Guid`           | Creates a new random UUID v4 using native `crypto.randomUUID()`.          |
| **`isValid(value)`**     | `value is Guid`  | Type-guard predicate verifying strict RFC 4122 UUID v4 formatting.        |
| **`isEmpty(value)`**     | `boolean`        | Determines if string matches `'00000000-0000-0000-0000-000000000000'`.    |
| **`isValidGuid(value)`** | `boolean`        | Verifies candidate is both syntactically valid and non-empty.             |
| **`parse(value)`**       | `Optional<Guid>` | Parses optional strings into valid `Guid` objects or returns `undefined`. |

---

## Practical Implementation Example

The example below illustrates using `GuidHelper` inside an incoming HTTP header
extractor to trace distributed execution flows:

```typescript
import { GuidHelper, type Guid, type HttpHeaders } from '@xeno/core'

export class CorrelationExtractor {
  public extractCorrelationId(headers: HttpHeaders): Guid {
    const headerValue = Array.isArray(headers['x-correlation-id'])
      ? headers['x-correlation-id'][0]
      : headers['x-correlation-id']

    // 1. Safely attempt to parse incoming correlation header
    const parsedGuid = GuidHelper.parse(headerValue)

    // 2. Fall back to generating a fresh UUID v4 if missing or invalid
    if (parsedGuid) {
      return parsedGuid
    }

    return GuidHelper.generate()
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
