---
title:
  'StringHelper Utility Specification: Safe Manipulations, Interpolation &
  Parsing'
description:
  'Technical specification for the StringHelper utility module in Xeno,
  detailing safe JSON serialization/parsing, camelCase conversions, template
  placeholder interpolation, truncation, reference code generation, and single
  header value extraction.'
keywords:
  [
    'StringHelper',
    'Xeno Utilities',
    'JSON Serialization',
    'Template Interpolation',
    'camelCase',
    'Truncate String',
    'Header Extraction',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Safe String Manipulations & Template Interpolation with `StringHelper`

The `StringHelper` utility namespace provides safe string manipulations,
template placeholder interpolation, circular-reference-safe JSON serialization,
and case formatting utilities. Frozen at initialization (`Object.freeze`), it
delivers fault-tolerant processing of external string inputs, transport headers,
and template generation across Xeno.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/string.utils.ts`, `StringHelper` centralizes common
string transformations to prevent unexpected runtime crashes when dealing with
invalid JSON strings, circular references, or multi-value transport headers.

### Key Features

- **Fault-Tolerant JSON Handling**: `safeStringify` handles circular object
  structures gracefully without throwing exceptions, while `safeParse` provides
  custom or original input fallbacks on invalid JSON payloads.

- **Template Placeholder Engine**: `interpolate` resolves `{{key}}` tokens
  within strings using key-value substitution maps.

- **Format Normalization**: `camelCase` converts `snake_case`, `kebab-case`, or
  space-separated strings into standard camelCase.

- **Transport Utilities**: `getSingleValue` safely unwraps single string values
  from mixed string or array headers.

---

## API Reference Specification

### 1. JSON Serialization & Parsing

#### `StringHelper.safeStringify<T>(value: T): string`

Converts a value to a JSON string. If serialization fails (e.g., due to circular
object references), it safely catches the exception and falls back to
`String(value)`.

- **Returns**: A valid JSON string or stringified representation.

- **Example**:

```typescript
const circular: Record<string, unknown> = {}
circular.self = circular

const result = StringHelper.safeStringify(circular)
// Output: '[object Object]' (No crash)
```

#### `StringHelper.safeParse<T unknown>(input: string, fallback: Optional<T> = undefined): T | Optional<string>`

Parses a JSON string into a strongly-typed payload. If parsing fails, it returns
`fallback` (if defined) or the raw `input` string.

- **Returns**: Parsed object of type `T` or fallback.

---

### 2. Case Conversion & Formatting

#### `StringHelper.camelCase(input: string): string`

Converts a string with `snake_case`, `kebab-case`, or space separators into
`camelCase`.

- **Returns**: Clean camelCase string.

- **Example**:

```typescript
StringHelper.camelCase('user_first_name') // 'userFirstName'
StringHelper.camelCase('x-request-id') // 'xRequestId'
```

#### `StringHelper.truncate(input: string, maxLength: number, suffix = ' '): string`

Truncates `input` to `maxLength` characters and appends `suffix` if the string
exceeds the target length.

- **Behavior**: Ensures the resulting length including `suffix` does not exceed
  `maxLength`.

---

### 3. Template Interpolation & Reference Generators

#### `StringHelper.interpolate(template: string, vars: Readonly<Dictionary<string number |>>): string`

Replaces `{{key}}` tokens inside a template string using key-value pairs from
`vars`. Unmatched placeholders remain intact in the output.

- **Example**:

```typescript
const template = 'Hello {{name}}, order {{orderId}} is confirmed.'
const result = StringHelper.interpolate(template, {
  name: 'Alice',
  orderId: 1042,
})
// Output: 'Hello Alice, order 1042 is confirmed.'
```

#### `StringHelper.generateReferenceCode(prefix: string): string`

Generates a unique, human-readable reference code formatted as
`${prefix}-${random6AlphaNum}-${currentYear}`.

- **Example**:

```typescript
const ref = StringHelper.generateReferenceCode('TRV')
// Output example: 'TRV-XJ82L9-2026'
```

---

### 4. Transport Header Extraction

#### `StringHelper.getSingleValue(value: string | string[]): Optional<string>`

Extracts the first string value if `value` is an array; returns `value` as-is if
it is a string; returns `undefined` if empty or undefined.

- **Example**:

```typescript
StringHelper.getSingleValue(['Bearer token1', 'Bearer token2']) // 'Bearer token1'
StringHelper.getSingleValue('application/json') // 'application/json'
StringHelper.getSingleValue([]) // undefined
```

---

## Quick Method Summary Table

| Method                              | Return Type        | Description                                                                       |
| ----------------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| **`safeStringify(value)`**          | `string`           | Converts a value to JSON; falls back to `String(value)` on circular references.   |
| **`safeParse(input, fallback?)`**   | `T \| string`      | Safely parses a JSON string; returns fallback/input on syntax error.              |
| **`camelCase(input)`**              | `string`           | Transforms `snake_case`, `kebab-case`, or space-separated strings to `camelCase`. |
| **`interpolate(template, vars)`**   | `string`           | Replaces `{{key}}` tokens with matching key values from a dictionary.             |
| **`truncate(input, max, suffix?)`** | `string`           | Truncates strings exceeding `maxLength` and appends a suffix.                     |
| **`generateReferenceCode(prefix)`** | `string`           | Generates a formatted code string with custom prefix, 6 random chars, and year.   |
| **`getSingleValue(value)`**         | `Optional<string>` | Unwraps single string values from string or array header definitions.             |

---

## Practical Implementation Example

The snippet below demonstrates using `StringHelper` to safely interpolate
dynamic log messages and normalize header parameters:

```typescript
import { StringHelper, type HttpHeaders } from '@xeno/core'

export class NotificationService {
  public formatMessage(rawUserHeader: HttpHeaders, template: string): string {
    // 1. Safely extract user name from dynamic headers
    const authHeader = StringHelper.getSingleValue(rawUserHeader['x-user-name'])
    const userName = authHeader ?? 'Guest'

    // 2. Generate a reference tracking code for the notification
    const trackingCode = StringHelper.generateReferenceCode('NTF')

    // 3. Interpolate tokens safely inside the template string
    return StringHelper.interpolate(template, {
      user: userName,
      code: trackingCode,
    })
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
