---
title:
  'HttpHelper Utility Specification: Standardized Response Formatting & Header
  Normalization'
description:
  'Technical specification for the HttpHelper utility module in Xeno, detailing
  standardized success and error response DTO builders, header array
  normalization, and HTTP headers configuration.'
keywords:
  [
    'HttpHelper',
    'ResponseDto',
    'SuccessResponseDto',
    'ErrorResponseDto',
    'Header Normalization',
    'Xeno Utilities',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## Standardized Response Formatting & Header Normalization with `HttpHelper`

The `HttpHelper` utility namespace provides standardized builders for API
response envelopes and header normalization utilities. Frozen at initialization
(`Object.freeze`), it ensures that both successful outcomes and error responses
emitted across presentation layers strictly adhere to Xeno's unified
`ResponseDto<T>` structural contracts.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/http.utils.ts`, `HttpHelper` normalizes
multi-transport HTTP interfaces, bridging the gap between raw web framework
headers and functional monad serialization.

### Key Features

- **Uniform Response Envelopes**: Formats data payloads into consistent JSON
  structures (`ResponseDto<T>`), encapsulating status codes, boolean status
  flags (`ok`), and tracing headers.

- **Header Normalization**: Converts mixed string/array header representations
  into predictable string maps.

- **Automatic Tracing Propagation**: Automatically populates `X-Correlation-Id`,
  `X-Request-Id`, and `X-Span-Id` headers on error responses.

- **Cache Control Invalidation for Errors**: Injects strict no-cache headers
  (`no-store, no-cache, must-revalidate`) on error envelopes to prevent proxy
  edge caching of failures.

---

## API Reference Specification

### 1. Header Normalization

#### `HttpHelper.normalizeHeaders(headers: unknown): HttpHeaders`

Converts arbitrary or vendor-specific header objects into a normalized
`HttpHeaders` dictionary (`Record<string, string>`).

- **Behavior**: Skips keys with `undefined` or `null` values. If a header key
  contains an array of string values (e.g., multi-value headers),
  `normalizeHeaders` joins the elements into a single comma-separated string
  (`'val1,val2'`).

- **Returns**: A clean `HttpHeaders` dictionary. Returns `{}` if `headers` is
  invalid or undefined.

- **Example**:

```typescript
const rawHeaders = { 'accept': ['text/html', 'application/json'], 'x-retry': 3 }
const normalized = HttpHelper.normalizeHeaders(rawHeaders)
// Output: { 'accept': 'text/html,application/json', 'x-retry': '3' }
```

---

### 2. Success Response Formatting

#### `HttpHelper.success<T>(data: T | IPaginatedResult<T>, status = 200, meta: Dictionary = {}, customHeaders: HttpHeaders = {}): ResponseDto<T>`

Constructs a standardized success response envelope wrapping the expected
payload or paginated dataset.

- **Parameters**:
- `data`: The primary return payload or `IPaginatedResult<T>` instance.

- `status`: HTTP status code (defaults to `200` OK).

- `meta`: Optional key-value metadata map (defaults to `{}`).

- `customHeaders`: Optional HTTP response headers map.

- **Returns**: A `ResponseDto<T>` object where `ok = true` and `data` contains a
  `SuccessResponseDto<T>` (`{ success: true, data, meta }`).

---

### 3. Error Response Formatting

#### `HttpHelper.error<T>(dto: ErrorResponseDto, status = 500, customHeaders?: HttpHeaders): ResponseDto<T>`

Constructs a standardized error response envelope containing detailed failure
diagnostics and tracing metadata.

- **Parameters**:
- `dto`: An `ErrorResponseDto` containing error details (`code`, `message`,
  `details`, `path`) alongside tracing GUIDs (`correlationId`, `requestId`,
  `spanId`).

- `status`: HTTP status code (defaults to `500` Internal Server Error).

- `customHeaders`: Optional response headers to merge with default error
  headers.

- **Headers Injected**:
- `Content-Type`: `['application/json']`

- `X-Correlation-Id`: `[dto.correlationId]`

- `X-Request-Id`: `[dto.requestId]`

- `X-Span-Id`: `[dto.spanId]`

- `Cache-Control`: `['no-store, no-cache, must-revalidate, proxy-revalidate']`

- **Returns**: A `ResponseDto<T>` object where `ok = false` and `data` contains
  the structured `ErrorResponseDto`.

---

## Quick Method Summary Table

| Method                                        | Return Type      | Description                                                                            |
| --------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------- |
| **`normalizeHeaders(headers)`**               | `HttpHeaders`    | Normalizes header maps by joining arrays into comma-separated string values.           |
| **`success<T>(data, status, meta, headers)`** | `ResponseDto<T>` | Formats a successful payload envelope with `ok: true` and 2xx status code.             |
| **`error<T>(dto, status, customHeaders)`**    | `ResponseDto<T>` | Formats an error envelope with `ok: false`, status code, and tracing response headers. |

---

## Practical Implementation Example

The snippet below demonstrates how `HttpHelper` is used inside custom
controllers or middleware to render responses:

```typescript
import { HttpHelper, STATUS_CODES, GuidHelper } from '@xeno/core'

export class CustomResponseController {
  public renderUserFound(user: { id: string; name: string }) {
    // 1. Return a standardized 200 OK success response
    return HttpHelper.success(user, STATUS_CODES.OK, { executionTimeMs: 12 })
  }

  public renderNotFound(path: string, correlationId: string) {
    // 2. Return a standardized 404 Not Found error response with tracing
    return HttpHelper.error(
      {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'The requested user aggregate does not exist.',
          details: undefined,
          path,
        },
        correlationId: correlationId as any,
        requestId: GuidHelper.generate(),
        spanId: GuidHelper.generate(),
        timestamp: new Date().toISOString(),
      },
      STATUS_CODES.NOT_FOUND,
    )
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
