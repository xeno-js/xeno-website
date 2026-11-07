---
title: API Responses
description: Learn how Xeno.JS controllers build success and error responses with ResponseDto, ok(), and fail().
keywords:
- Xeno.JS
- API response
- ResponseDto
- BaseController
- HttpHelper
- AppError
- success response
- error response
- response headers
tags:
- http
- controllers
- responses
faqs:
- question: What does a Xeno.JS controller return?
  answer: A controller returns a Promise of ResponseDto containing the status, ok flag, headers, and success or error payload.
- question: How do I create a success response in a BaseController?
  answer: Call this.ok() with the response value and optional status, metadata, and headers.
- question: How do I create an error response in a BaseController?
  answer: Call this.fail() with an AppError and optional client-safe details and headers.
- question: Does every server integration serialize the same response body?
  answer: No. Node.js, Fastify, and Vercel serialize ResponseDto.data.
- question: Does this.fail() expose an AppError cause?
  answer: No. It uses the AppError code, message, and status; the cause is not automatically included in the response.
---

## Introduction

An application operation can succeed with a value or fail with an
application error. An HTTP controller must turn either outcome into a
response that a transport can send to the client.

The controller returns a `ResponseDto<T>` instead of writing to a
server-specific response object. In a `BaseController`, use:

- `this.ok()` to construct a success response;
- `this.fail()` to construct an error response from an `AppError`.

These are protected helpers: call them inside a `BaseController` subclass.
The [HTTP Controllers](./controller) guide shows a complete controller,
route, service registration, and server bootstrap. This page focuses on the
response contract and the values each helper sets.

## What the controller returns

An `IController<TRequest, TResponse>` returns a
`Promise<ResponseDto<TResponse>>`. The DTO has four fields:

| Field | Type | Purpose |
| --- | --- | --- |
| `status` | `number` | HTTP status selected by the controller. |
| `ok` | `boolean` | Success or failure flag in the DTO. |
| `headers` | `HttpHeaders` | Header names mapped to a string, string array, or `undefined`. |
| `data` | `ApiResponseDto<TResponse>` | Success or error payload. |

`ApiResponseDto<T>` is a union of `SuccessResponseDto<T>` and
`ErrorResponseDto`. Check `response.data.success` when narrowing the payload
in TypeScript. `TResponse` describes the successful value, not the complete
HTTP envelope or the error payload.

For example, `this.ok({ id: '42', status: 'received' })` creates this DTO:

```ts
{
  status: 200,
  ok: true,
  headers: { 'Content-Type': ['application/json'] },
  data: {
    success: true,
    data: { id: '42', status: 'received' },
    meta: {},
  },
}
```

The two `data` properties have different roles: `ResponseDto.data` holds the
API payload, and the success payload's `data` holds the returned value.
`ResponseDto.ok` is not part of that inner success payload.

## From controller to HTTP response

When a route returns `ctx.handle(token, input)`, Xeno.JS dispatches to the
registered controller and returns its DTO through the route. Configured
middleware can also modify or produce a response. The server integration
maps the resulting status, headers, and body to the transport.

The body mapping differs in the current integrations:

| Integration | Body serialized for a returned `ResponseDto` |
| --- | --- |
| Node.js | `response.data` |
| Fastify | `response.data` |
| Vercel | `response.data` |
<!-- | Hono | The entire `response`, including `status`, `ok`, `headers`, and `data` | -->

For Node.js, Fastify, and Vercel, the example above produces this JSON body
with HTTP status `200`:

```json
{
  "success": true,
  "data": { "id": "42", "status": "received" },
  "meta": {}
}
```
<!-- 
Hono currently serializes the outer DTO as well, so clients receive a
different body shape.  -->Test the actual HTTP response for the integration you
deploy, especially if clients switch transports. Transport-level failures and
unmatched routes can also use different response shapes; do not assume every
response comes from `this.ok()` or `this.fail()`.

## Return a success with `this.ok()`

Inside a `BaseController` subclass:

```ts
return this.ok(order)
```

The helper accepts these arguments:

| Argument | Meaning | Default |
| --- | --- | --- |
| `data` | Successful value to return. | Required |
| `status` | HTTP status for the DTO. | `200` |
| `meta` | Additional metadata in the success payload. | `{}` |
| `headers` | Additional headers, as a dictionary of string arrays. | `{}` |

`this.ok()` delegates to `HttpHelper.success()`. It sets `ok: true` and
wraps the value in `{ success: true, data, meta }`. It also sets
`Content-Type` to `['application/json']`.

### Set status, metadata, and headers

The following excerpt belongs inside a controller whose response type is
`OrderSummary`:

```ts
interface OrderSummary {
  id: string
  status: string
}

const order: OrderSummary = { id: '42', status: 'received' }

return this.ok(
  order,
  201,
  { source: 'checkout' },
  { Location: ['/api/orders/42'] },
)
```

The DTO has status `201`, includes the `Location` header, and carries this
success payload:

```json
{
  "success": true,
  "data": { "id": "42", "status": "received" },
  "meta": { "source": "checkout" }
}
```

Choose a status that reflects the operation; `201` is appropriate when the
request created a resource. The helper does not derive `ok` from the status
or validate that the status is a success code. Pass consistent values.

`HttpHelper.success()` merges custom headers first, then writes
`Content-Type`. A custom header with the exact key `Content-Type` therefore
does not replace its JSON value. Use the `string[]` header values accepted by
`BaseController.ok()`. The broader `HttpHeaders` type also permits strings;
the helper's controller signature is narrower.

### Paginated values

`SuccessResponseDto<T>` can hold a value of `T` or an
`IPaginatedResult<T>`. A paginated result contains `items`, `total`, `page`,
`pageSize`, `totalPages`, `hasNextPage`, and `hasPreviousPage`. Pass the
result as the success value; the helper does not compute or move those fields
into `meta`.

For example, a controller with response type `IPaginatedResult<OrderSummary>`
can return `this.ok(page)` after obtaining and validating `page`. The
success payload contains the page object under `data`; `meta` remains `{}`
unless you supply it separately.

### Responses without a body

`this.ok()` always constructs a success payload, even when passed status
`204` or an `undefined` value. HTTP `204` responses must not contain a body,
and serialization or transport behavior can omit values. Do not rely on
`this.ok(undefined, 204)` to deliver the success envelope. Choose the
endpoint's status and body contract deliberately and verify it against the
selected server integration.

## Return an error with `this.fail()`

Pass an `AppError` to `this.fail()`:

```ts
import { AppError } from '@xeno-js/core'

// Inside a BaseController subclass.
return this.fail(AppError.notFound('GetOrderController', 'Order does not exist'))
```

The helper accepts:

| Argument | Meaning | Default |
| --- | --- | --- |
| `error` | `AppError` containing the code, message, and status. | Required |
| `details` | Client-visible error details. | `error.message` |
| `headers` | Additional headers, as a dictionary of string arrays. | `{}` |

`this.fail()` sets `ok: false`, uses the error's status, and produces an
`ErrorResponseDto` with `success: false`. For the example above, a Node.js,
Fastify, or Vercel response has status `404` and a body shaped like:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "errors.not_found",
    "details": "errors.not_found",
    "path": "/api/orders/42"
  },
  "correlationId": "11111111-1111-4111-8111-111111111111",
  "requestId": "22222222-2222-4222-8222-222222222222",
  "spanId": "33333333-3333-4333-8333-333333333333",
  "timestamp": "2026-11-07T12:00:00.000Z"
}
```

The identifiers and timestamp above are illustrative. The helper uses the
active request context for the path and identifiers when available, and
generates missing identifiers otherwise. The path can be `undefined` and
therefore absent from serialized JSON when no context is available.
`HttpHelper.error()` assigns the output timestamp when it builds the
response.

`AppError.notFound()` sets the code, status, and standard message. Its second
argument becomes the cause's message; `this.fail()` does **not** copy that
cause into the response. To supply client-safe details explicitly:

```ts
import { AppError } from '@xeno-js/core'

// Inside a BaseController subclass.
return this.fail(
  AppError.notFound('GetOrderController', 'Order does not exist'),
  'The requested order was not found.',
  { 'X-Error-Category': ['order'] },
)
```

Here `error.message` remains `errors.not_found`, while `error.details` is
`The requested order was not found.` Only expose details appropriate for
clients. Do not return stack traces, credentials, internal service responses,
or other sensitive information.

### Error headers

`HttpHelper.error()` supplies JSON content type, correlation, request, and
span headers, plus `Cache-Control`, `Pragma`, and `Expires` headers that
discourage caching. `this.fail()` passes a context-derived content type,
then merges any headers from `AppError.header`, followed by the headers
supplied to `fail()`.

For identical dictionary keys, later values override earlier ones, including
the default error headers. HTTP header names are case-insensitive, so avoid
providing the same header under different casing. Custom headers can differ
from the identifiers in the response body if you override them; keep them
consistent for tracing.

## Map a CQRS result

The mediator returns `ResultType<T>`, not an HTTP response. A controller
checks the outcome and chooses the corresponding helper:

```ts
// Inside a BaseController whose response type matches the query result.
const result = await this._query(query, signal)

if (!result.isOk()) {
  return this.fail(result.getErrorOrThrow())
}

const value = result.getValueOrThrow()
if (value === undefined) {
  return this.fail(
    AppError.internalServerError('GetOrderController', new Error('Missing result')),
  )
}

return this.ok(value)
```

This excerpt uses an application-defined `query`, the controller's `signal`,
and `AppError` imported from `@xeno-js/core`. A successful result can still
contain `undefined`; decide whether that is valid for your operation instead
of assuming a value exists. For a `void` result, use an appropriate endpoint
response rather than treating an absent value as an error.

`this.fail()` formats an `AppError`; it does not catch arbitrary exceptions.
The default CQRS exception pipeline converts exceptions inside the mediator
pipeline to failed results. Exceptions elsewhere follow the transport's error
handling and may not have the same envelope.

## Use the helpers without BaseController

`this.ok()` and `this.fail()` are protected methods on `BaseController`.
When implementing `IController` directly, use the public `HttpHelper.success()`
and `HttpHelper.error()` functions or construct a valid `ResponseDto`.
`HttpHelper.error()` requires an `ErrorResponseDto` with its identifiers and
error fields; it does not accept an `AppError` directly or obtain the active
request context for you.

For route parameters, policies, and other HTTP utilities, see
[HTTP Helpers](./helper-http).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us).
