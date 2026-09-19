---
title: 'RateLimitMiddleware: Request Rate Limiting in Xeno'
description: 'Learn how Xeno RateLimitMiddleware counts requests by client IP, stores
  counters in the configured cache, and returns 429 Too Many Requests when the
  configured limit is exceeded.'
keywords: [
		'RateLimitMiddleware',
		'rate limiting',
		'request throttling',
		'MiddlewareConfig rateLimite',
		'ICache',
		'client IP rate limit',
		'429 Too Many Requests',
		'Retry-After',
		'Xeno',
        ]
author: 'Xeno'
sidebar:
  order: 5
---

## What Is RateLimitMiddleware?

`RateLimitMiddleware` is a Xeno Presentation middleware that limits the number
of requests accepted from a client during a configured time window. It obtains
the client IP from the current `RequestContext`, stores the request counter in
an `ICache`, and either forwards the request or returns `429 Too Many Requests`.

The limit is applied using the cache key `rate_limit:<clientIp>`. The middleware
does not identify users or authorize application operations; it limits traffic
before the request reaches later middleware and the application layer.

## How Does RateLimitMiddleware Work?

For each request, the middleware performs these steps:

1. It reads `network.clientIp` and tracing metadata from the current context
	 through `IContextAccessor`.
2. It creates the cache key `rate_limit:<clientIp>`.
3. It reads the current hit count from `ICache`.
4. If the count is greater than or equal to `maxRequests`, it logs a warning and
	 returns a `429` response.
5. Otherwise, it stores the incremented count with the configured expiration
	 window and calls `next()`.

The counter is updated before the downstream middleware and Handler execute.
The current implementation does not decrement the counter when downstream
processing fails.

## How Is It Configured?

`MiddlewareModule` registers `RateLimitMiddleware` when either
`rateLimite.maxRequests` or `rateLimite.windowSeconds` is defined in
`MiddlewareConfig`.

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder.addMiddlewares((config) => {
	config.rateLimite.maxRequests = 100
	config.rateLimite.windowSeconds = 60
})

const container = await builder.build()
```

If only one value is configured, `MiddlewareModule` applies the default for the
other value:

- `maxRequests`: `30` requests;
- `windowSeconds`: `30` seconds.

When neither value is defined, `RateLimitMiddleware` is not registered.

## Which Cache Does It Use?

The middleware receives an `ICache` instance through Dependency Injection. If
rate limiting is enabled and no cache module has already been registered,
`MiddlewareModule` creates an in-memory cache for the rate-limit counters.

When an application cache is already configured, the middleware uses the
resolved cache service. The cache must support numeric reads and writes with a
time-to-live in seconds.

## What Happens When the Limit Is Exceeded?

When the current count is greater than or equal to `maxRequests`, the
middleware:

- logs a warning containing the client IP and request path;
- returns an error with `ERROR_CODES.TOO_MANY_REQUESTS`;
- returns status `429`;
- includes the message `Rate limit exceeded.`;
- includes the throttled IP and request path in the error details;
- includes correlation, request, and span identifiers;
- sets `Retry-After` to the configured window in seconds;
- does not call `next()`.

The configured response format is taken from the request context and defaults to
`application/json` when no format indicator is available.

## Which Requests Share a Counter?

All requests with the same `network.clientIp` share the same cache key:

```text
rate_limit:<clientIp>
```

The current implementation does not include the request path, HTTP method,
authenticated identity, tenant, or API key in the cache key. Consequently,
requests from the same client IP share one counter across routes and methods.

If `clientIp` is unavailable, the cache key is generated with the undefined
value as returned by the current context. Applications should configure request
metadata extraction correctly when IP-based limiting is required.

## Where Does It Run in the Middleware Chain?

`MiddlewareModule` appends `RateLimitMiddleware` after the optional
`CsrfMiddleware` and before the always-registered
`AuthenticationMiddleware`.

The effective order depends on the enabled configuration:

```text
RequestContextMiddleware
	-> OptionsMiddleware (when optionsMiddleware is true)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (when csrf is defined)
	-> RateLimitMiddleware (when a rate-limit option is defined)
	-> AuthenticationMiddleware
	-> Controller or Handler
```

An enabled `OptionsMiddleware` can complete an `OPTIONS` request before rate
limiting. A request that reaches `RateLimitMiddleware` consumes one cache count
when it is under the limit.

## Dependencies and Constraints

`RateLimitMiddleware` receives these constructor dependencies:

- `IContextAccessor<RequestContext>`, used to read the client IP and tracing
	metadata;
- `ICache`, used to read and write the request counter;
- `ILogger`, used to record blocked requests;
- a configuration object containing `maxRequests` and `windowSeconds`.

The current implementation has these constraints:

- the limit is keyed only by `network.clientIp`;
- counters use the cache time-to-live in seconds;
- `maxRequests` and `windowSeconds` are validated by `MiddlewareModule` before
	registration;
- the middleware does not provide distributed atomic increment semantics itself;
- the middleware does not add rate-limit headers to successful responses;
- the middleware does not authenticate users or enforce authorization policies.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)