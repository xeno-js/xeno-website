---
title: HTTP Helpers
description: Learn how to use Xeno.JS helpers for routes, request input, HTTP responses, and errors.
keywords:
- Xeno.JS
- HTTP helpers
- HttpRouteParamHelper
- RoutePatternHelper
- HttpHelper
- AppError
- withCors
- withCsrf
- withoutCsrf
tags:
- http
- routes
- helpers
- responses
faqs:
- question: How do I extract route and request parameters?
  answer: Use HttpRouteParamHelper.extractInput() in a route handler, or extractPathParams() and extractQueryParams() separately.
- question: Does extractInput() validate the input?
  answer: No. Its generic type does not validate or convert runtime values, and body parsing failures do not propagate from the helper.
- question: How do I configure CORS and CSRF per route?
  answer: Use withCors(), withCsrf(), or withoutCsrf() on a route definition and configure the relevant middleware separately.
- question: How do I create a success or error response?
  answer: In a BaseController use this.ok() and this.fail(); outside it use HttpHelper.success() and HttpHelper.error() with the required response payload.
- question: Does parseSafeUrl() validate a URL for security?
  answer: No. It parses an absolute or relative URL, but it does not enforce an allowlist or prevent unsafe destinations.
---

## Introduction

Routes and controllers frequently need to extract request input, apply route
policies, and build responses. Xeno.JS provides helpers for these tasks so
that application code can use the same contracts across HTTP integrations.

| Helper | Use |
| --- | --- |
| `HttpRouteParamHelper` | Extract path parameters, query parameters, and combined request input. |
| `withCors()`, `withCsrf()`, `withoutCsrf()` | Add security settings to a route definition. |
| `RoutePatternHelper` | Normalize and inspect route patterns. |
| `HttpHelper` | Build response DTOs and work with headers, cookies, URLs, and bodies. |
| `AppError` | Create application errors that a controller can map to HTTP responses. |

These APIs are available from `@xeno-js/core`. The route and HTTP utilities
and `AppError` are also exported by `@xeno-js/shared`.
Helpers prepare values; they do not replace runtime validation,
authentication, authorization, or middleware configuration.

## Use helpers in an application

This example registers a route and a controller, applies a route CORS policy,
and extracts a path parameter. It returns a fixed order so that no database
setup is needed.

```bash
npm install @xeno-js/core @xeno-js/node
```

```ts
import {
  HttpHelper,
  HttpRouteParamHelper,
  withCors,
  XenoAppBuilder,
} from '@xeno-js/core'
import type {
  IController,
  NativeRouteDefinition,
  ResponseDto,
  XenoRegistry,
} from '@xeno-js/core'
import { withNodeHttpServer } from '@xeno-js/node'

interface GetOrderInput {
  id: string
}

interface OrderSummary {
  id: string
  status: string
}

interface OrdersRegistry extends XenoRegistry {
  GET_ORDER_CONTROLLER: IController<GetOrderInput, OrderSummary>
}

class GetOrderController implements IController<GetOrderInput, OrderSummary> {
  async handle(input: GetOrderInput): Promise<ResponseDto<OrderSummary>> {
    return HttpHelper.success({ id: input.id, status: 'received' })
  }
}

const orderRoute: NativeRouteDefinition<OrdersRegistry> = {
  method: 'GET',
  path: '/api/orders/:id',
  handler: async (ctx) => {
    const input = await HttpRouteParamHelper.extractInput<GetOrderInput>(
      ctx.req,
      '/api/orders/:id',
    )
    return ctx.handle('GET_ORDER_CONTROLLER', input)
  },
}

async function main() {
  const app = await new XenoAppBuilder<OrdersRegistry>()
    .addRoutes([
      withCors(orderRoute, ['https://shop.example.com'], false),
    ])
    .addMiddlewares((options) => {
      options.cors = {
        enabled: true,
        enablePreflight: true,
        allowOrigins: ['https://shop.example.com'],
        withCredentials: false,
      }
    })
    .addServices((services) => {
      services.addScoped('GET_ORDER_CONTROLLER', () => new GetOrderController())
    })
    .addHttpServer(withNodeHttpServer<OrdersRegistry>())
    .build()

  await app.listen({ host: '127.0.0.1', port: 3000 })
}

main().catch((error: unknown) => {
  console.error('Failed to start the application', error)
  process.exitCode = 1
})
```

The builder registers the route, middleware, controller, and server before
`build()`. For a matching request, the route extracts the ID and delegates
through `ctx.handle()`; the controller returns a success DTO.
The middleware configuration and route policy are separate: `withCors()`
alone does not enable CORS middleware. With this explicit route origin list,
requests without an `Origin` header are rejected by the current origin
middleware; test with `Origin: https://shop.example.com` or choose a policy
appropriate to your clients. Configure authentication,
authorization, validation, and other protections for a real endpoint.
For controller registration and service lifetimes, see
[HTTP Controllers](./controller).

## Extract request input

### `HttpRouteParamHelper.extractInput()`

Use `extractInput<TInput>(req, routePattern)` inside a route handler to
combine values from the body, query, and path:

```ts
import { HttpRouteParamHelper } from '@xeno-js/core'

// Inside the handler for POST /api/orders/:id.
const input = await HttpRouteParamHelper.extractInput<{
  id: string
  note?: string
}>(ctx.req, '/api/orders/:id')

return ctx.handle('UPDATE_ORDER_CONTROLLER', input)
```

Here `ctx` is the route handler context and `UPDATE_ORDER_CONTROLLER` must be
declared in the application's registry and registered in the builder. Pass
the route's actual pattern to extract the intended path keys.

The helper merges values in this order, with later sources taking precedence:

1. Body fields.
2. `req.query`.
3. Named path parameters.

For example, if the body contains `id: "body"`, the query contains
`id=query`, and the path is `/api/orders/42`, the resulting `id` is `"42"`.

The helper reads a body only for `POST`, `PUT`, and `PATCH`:

| Content type | Body handling |
| --- | --- |
| Contains `application/json` | Calls `req.json()`. |
| Contains `application/x-www-form-urlencoded` | Reads text and parses form fields. |
| Other or absent | Reads text. |

Object body fields are merged into the result; a non-object body is placed
under `body`. If no body is available, the result can contain
`body: undefined`. For `GET`, `DELETE`, `HEAD`, and `OPTIONS`, this helper
does not read the body.

The helper strips control characters from decoded path values and recursively
sanitizes object body strings. It removes the keys `__proto__`,
`constructor`, and `prototype` from object bodies. It uses `req.query`
directly; the selected server integration can influence how query values
arrive.

**Validate the result.** The generic type does not check or convert data:
query parameters are not automatically numbers, required properties may be
missing, and input is still untrusted. Body read and parse errors are caught
and the helper proceeds without the parsed body. If the endpoint must reject
malformed JSON specifically, parse and handle the body separately before it
is consumed; do not rely on `extractInput()` to report that failure.

### `HttpRouteParamHelper.extractPathParams()`

Use `extractPathParams(routePattern, requestPath)` to extract named segments:

```ts
import { HttpRouteParamHelper } from '@xeno-js/core'

const params = HttpRouteParamHelper.extractPathParams(
  '/api/orders/:id/items/{itemId}',
  '/api/orders/42/items/item%20one',
)
// { id: '42', itemId: 'item one' }
```

Both `:name` and `{name}` identify a segment. Values are URI-decoded,
stripped of control characters, trimmed, and limited by the sanitization
helper. Missing or empty values can be omitted. Invalid percent encoding can
throw a `URIError`. This method extracts positional segments; it does not
verify that the entire path matches the route pattern.

### `HttpRouteParamHelper.extractQueryParams()`

Use `extractQueryParams(requestUrl)` when you need query values from a URL:

```ts
import { HttpRouteParamHelper } from '@xeno-js/core'

const query = HttpRouteParamHelper.extractQueryParams(
  '/api/orders?status=open&page=2',
)
// { status: 'open', page: '2' }
```

The helper strips control characters, trims values, and limits keys to 64 and
values to 512 characters. It skips entries that sanitize to an empty key or
value. For repeated keys, the last accepted value wins. Values remain strings;
parse and validate them before use.

## Configure route policies

The route helpers return a new definition with updated `security` fields;
they preserve other existing route settings. They do not mutate the input
route or register middleware.

### `withCors()`

```ts
import { withCors } from '@xeno-js/core'

// orderRoute is a NativeRouteDefinition registered with the builder.
const shopOrderRoute = withCors(
  orderRoute,
  ['https://shop.example.com'],
  false,
)
```

Arguments are the route, allowed origins, and optional `withCredentials`
flag, which defaults to `true`. These settings override the corresponding
global CORS settings for that route. Configure CORS in `addMiddlewares()`
and register the returned route rather than the original. For a wildcard
origin, avoid enabling credentials without a deliberate, restrictive policy.
CORS is not authentication or authorization.

### `withCsrf()` and `withoutCsrf()`

```ts
import { withCsrf, withoutCsrf } from '@xeno-js/core'

// Both routes are application-defined NativeRouteDefinition values.
const protectedOrderRoute = withCsrf(orderRoute)
const webhookWithoutCsrf = withoutCsrf(webhookRoute)
```

`withCsrf()` sets `security.withCsrf` to `true`; `withoutCsrf()` sets it to
`false`. Configure CSRF middleware and its secret separately. In the current
implementation, CSRF validation applies to `POST`, `PUT`, `PATCH`, and
`DELETE` by default when configured; `withCsrf()` does not extend validation
to `GET` or other methods. Only disable CSRF when another appropriate
security boundary protects the route, such as verified webhook signatures.

For route policies and preflight behavior, see [HTTP Routes](./routes).

## Inspect route patterns

`RoutePatternHelper` supports route-pattern processing. Most applications
can register routes without calling it directly.

```ts
import { RoutePatternHelper } from '@xeno-js/core'

const normalized = RoutePatternHelper.normalizePath(' orders/:id/ ')
// '/orders/:id'

const dynamic = RoutePatternHelper.isDynamicPath(normalized)
// true

const pattern = RoutePatternHelper.createRoutePattern(normalized)
const matches = pattern.test('/orders/42')
// true

const parsed = RoutePatternHelper.parse('/orders/{id}/')
// { pattern: RegExp, isDynamic: true }
```

| Method | Behavior |
| --- | --- |
| `normalizePath(path)` | Trims surrounding whitespace, adds a leading slash when missing, and removes trailing slashes except for `/`. |
| `isDynamicPath(path)` | Detects `:` or a pair of braces in the path. |
| `createRoutePattern(path)` | Builds a regular expression; named segments match a single non-empty path segment. |
| `parse(path)` | Normalizes a path and returns `{ pattern, isDynamic }`. |

`normalizePath()` does not collapse repeated internal slashes.
`createRoutePattern()` escapes static segments, while `parse()` uses a
different regular-expression construction for a fully static path. Do not
treat these functions as general-purpose security validation or assume that
arbitrary static metacharacters are literal in every `parse()` result.
See [HTTP Routes](./routes) for matching order and route registration.

## Build response DTOs

### `HttpHelper.success()`

Use `HttpHelper.success(data, status?, meta?, customHeaders?)` outside
`BaseController` to create a success `ResponseDto`:

```ts
import { HttpHelper } from '@xeno-js/core'

const response = HttpHelper.success(
  { id: '42', status: 'received' },
  201,
  { source: 'checkout' },
  { Location: '/api/orders/42' },
)
```

The default status is `200`. The result has `ok: true` and a `data` payload
of `{ success: true, data, meta }`. The helper sets `Content-Type` to
`application/json` after merging custom headers, so an exact
`Content-Type` key in `customHeaders` does not override it.

### `HttpHelper.error()`

`HttpHelper.error(dto, status?, customHeaders?)` accepts an
`ErrorResponseDto`, not an `AppError`. Supply the error fields and tracing
identifiers explicitly:

```ts
import { GuidHelper, HttpHelper, STATUS_CODES } from '@xeno-js/core'
import type { ErrorResponseDto } from '@xeno-js/core'

const error: ErrorResponseDto = {
  success: false,
  error: {
    code: 'ORDER_NOT_FOUND',
    message: 'Order not found',
    details: undefined,
    path: '/api/orders/42',
  },
  correlationId: GuidHelper.generate(),
  requestId: GuidHelper.generate(),
  spanId: GuidHelper.generate(),
  timestamp: new Date().toISOString(),
}

const response = HttpHelper.error(
  error,
  STATUS_CODES.NOT_FOUND,
  { 'X-Error-Category': 'order' },
)
```

The helper returns `ok: false`, uses status `500` when omitted, adds
tracing and no-cache headers, and creates a timestamp when constructing
the output payload. Custom headers override defaults with the same exact
key. When an active request context exists, use its tracing identifiers
instead of generating unrelated ones so logs and responses can be correlated.

In a `BaseController`, prefer `this.ok()` and `this.fail()`:
`this.fail()` accepts `AppError` and retrieves context data for you. See
[API Responses](./api-response) for the full DTO, header precedence,
transport-specific body mapping, and error response examples.

## Create and map application errors

`AppError` carries an error code, HTTP status, message, and cause.
`AppError` is an application error contract; creating one does not itself
send a response.

```ts
import { AppError } from '@xeno-js/core'

// Inside a BaseController subclass.
return this.fail(
  AppError.notFound('GetOrderController', 'Order does not exist'),
  'The requested order was not found.',
)
```

Common factories include `badRequest()`, `validationError()`, `unauthorized()`,
`authFailed()`, `forbidden()`, `notFound()`, `conflict()`,
`notSupported()`, `internalServerError()`, and `aborted()`.
Use `AppError.create()` when you need an explicit code, status, message,
name, and cause; `AppError.throw()` constructs and throws an error.
`AppError.throwIfAborted(signal, name)` throws an aborted error when the
provided signal is already aborted.

For the message-based factories, the supplied message is stored in the
cause; the exposed `error.message` is the framework's standard message key.
`this.fail()` does not automatically expose the cause. Its optional second
argument sets client-visible details: never put sensitive internal errors,
credentials, or stack traces there.

## Work with headers, cookies, URLs, and bodies

The remaining `HttpHelper` methods are useful at transport or integration
boundaries. They do not authenticate callers or validate all untrusted data.

### `normalizeHeaders()`

```ts
import { HttpHelper } from '@xeno-js/core'

const headers = HttpHelper.normalizeHeaders({
  accept: ['application/json', 'text/plain'],
  'x-retry': 2,
  unused: undefined,
})
// { accept: 'application/json,text/plain', 'x-retry': '2' }
```

The helper converts values to strings, joins arrays with commas, and skips
`null` and `undefined`. It preserves input key casing; it does not normalize
header names or validate their safety. Invalid non-object input yields `{}`.
Use it with plain header objects, not as a substitute for iterating a
`Headers` instance.

### `parseCookies()`

```ts
import { HttpHelper } from '@xeno-js/core'

const cookies = HttpHelper.parseCookies('theme=dark; language=en%2DGB')
// { theme: 'dark', language: 'en-GB' }
```

The helper splits a `Cookie` header into a dictionary, decodes values, and
uses the last value for duplicate names. A value with invalid percent encoding
remains undecoded; a name without `=` gets an empty value. This parses
cookies but does not verify signatures, decrypt values, or authenticate them.

### `parseSafeUrl()` and `sanitizeOriginUrl()`

```ts
import { HttpHelper } from '@xeno-js/core'

const url = HttpHelper.parseSafeUrl('/api/orders?page=2', 'https://api.example.com')
// URL for https://api.example.com/api/orders?page=2

const origin = HttpHelper.sanitizeOriginUrl('https://shop.example.com/cart')
// 'https://shop.example.com'
```

`parseSafeUrl()` first tries the input as an absolute URL, then resolves it
against the supplied base, which defaults to `http://localhost`. Invalid
input or base can still throw. Despite its name, it does not enforce an
allowed scheme, hostname, or destination and is not an SSRF defense.

`sanitizeOriginUrl()` returns the parsed URL's `origin`, or `undefined` if
parsing fails. Some URL schemes have the string origin `'null'`; the helper
does not reject that value or check an allowlist. Validate schemes and origins
against the deployment's policy before trusting them.

### `parseBody()`

```ts
import { HttpHelper } from '@xeno-js/core'

const body = HttpHelper.parseBody('POST', { orderId: '42' })
// JSON string: '{"orderId":"42"}'
```

`parseBody(method, rawBody)` prepares a `BodyInit` for `POST`, `PUT`,
`PATCH`, or `DELETE`; it returns `undefined` for other methods or a missing
body. It passes supported body values such as strings, `Blob`, `FormData`,
and `URLSearchParams` through, stringifies objects, and converts other
values to strings. If object JSON serialization fails, the stringification
helper falls back to `String(rawBody)`. It does not choose a content type or validate a request
payload. This transport-level method is distinct from
`HttpRouteParamHelper.extractInput()`, which does not read `DELETE` bodies.

### `maskIp()`

```ts
import { HttpHelper } from '@xeno-js/core'

const masked = HttpHelper.maskIp('192.0.2.14')
// '192.0.2.x'
```

For a dotted four-part value, the helper replaces the last part with `x`; for
a value containing `:`, it replaces the last colon-separated part. It returns
other values unchanged and `undefined` for an absent input. It does not
validate addresses and is not a guarantee of anonymization; choose a
logging policy appropriate to the data and deployment.

## Next steps

- Define and register endpoints in [HTTP Routes](./routes).
- Implement controller dispatch in [HTTP Controllers](./controller).
- Review response payloads and transport differences in [API Responses](./api-response).
- Configure a server in [HTTP Server](./server).

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us).
