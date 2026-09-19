---
title: 'OptionsMiddleware: HTTP OPTIONS Handling in Xeno'
description: 'Learn how Xeno OptionsMiddleware handles HTTP OPTIONS requests by returning
  a 204 No Content response before the request reaches later middleware or the
  application layer.'
keywords: [
		'OptionsMiddleware',
		'HTTP OPTIONS',
		'204 No Content',
		'CORS preflight',
		'MiddlewareConfig optionsMiddleware',
		'CompositeMiddleware',
		'Xeno',
        ]
author: 'Xeno'
sidebar:
  order: 4
---

## What Is OptionsMiddleware?

`OptionsMiddleware` is a Xeno Presentation middleware that handles HTTP
`OPTIONS` requests before they reach the remaining middleware chain or the
application controller. It returns a `204 No Content` response for an
`OPTIONS` request and does not call `next()`.

For every other HTTP method, the middleware calls `next()` and leaves request
processing to the next middleware in `CompositeMiddleware`.

## How Does OptionsMiddleware Work?

The middleware executes the following logic:

1. It converts `req.method` to uppercase.
2. It compares the result with `OPTIONS`.
3. If the method is `OPTIONS`, it returns
	 `HttpHelper.success(null as T, STATUS_CODES.NO_CONTENT)`.
4. Otherwise, it calls `next()` and returns the downstream response.

The middleware does not inspect request headers, route configuration, request
context, authentication state, or response content.

## How Is It Enabled?

`MiddlewareModule` registers `OptionsMiddleware` when
`MiddlewareConfig.optionsMiddleware` is `true`.

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder.addMiddlewares((config) => {
	config.optionsMiddleware = true
})

const container = await builder.build()
```

When `optionsMiddleware` is `false`, `MiddlewareModule` does not register the
middleware and `OPTIONS` requests continue through the middleware stack handled
by the configured transport integration.

## What Response Does It Return?

For an `OPTIONS` request, the middleware returns a successful response with:

- `STATUS_CODES.NO_CONTENT` as the HTTP status;
- `null` as the response data;
- no call to the next middleware or application controller.

The middleware does not add CORS headers or configure allowed origins. CORS and
origin configuration are separate concerns handled by the HTTP infrastructure.

## Where Does It Run in the Middleware Chain?

When enabled, `MiddlewareModule` appends `OptionsMiddleware` immediately after
`RequestContextMiddleware` and before `MethodCheckMiddleware`,
`CsrfMiddleware`, `RateLimitMiddleware`, and `AuthenticationMiddleware`.

The effective order is:

```text
RequestContextMiddleware
	-> OptionsMiddleware (when optionsMiddleware is true)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (when csrf is defined)
	-> RateLimitMiddleware (when a rate-limit option is defined)
	-> AuthenticationMiddleware
	-> Controller or Handler
```

Because `OptionsMiddleware` can return before calling `next()`, an enabled
`OPTIONS` request does not reach method validation, CSRF validation, rate
limiting, authentication, or application execution.

## Dependencies and Constraints

`OptionsMiddleware` has no constructor dependencies. Its `execute` method
receives the request, headers, and downstream callback required by the
`IMiddleware<HttpHeaders>` contract.

The current implementation has these constraints:

- method matching is case-insensitive because the incoming method is converted
	to uppercase;
- only the HTTP method is inspected;
- an `OPTIONS` request always receives `204 No Content` when the middleware is
	enabled;
- the middleware does not emit CORS headers;
- the middleware does not authenticate or authorize requests;
- non-`OPTIONS` requests are always forwarded with `next()`.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)