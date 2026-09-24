---
title: 'RateLimitMiddleware: Dynamic Key-Based Request Rate Limiting in Xeno'
description: 'Learn how Xeno RateLimitMiddleware leverages IRateLimitKeyBuilder to throttle incoming requests based on tenant, user, or IP contexts, preventing traffic abuse in distributed systems.'
keywords: [
		'RateLimitMiddleware',
		'rate limiting',
		'IRateLimitKeyBuilder',
		'request throttling',
		'MiddlewareConfig rateLimite',
		'ICache',
		'429 Too Many Requests',
		'Retry-After',
		'Xeno',
        ]
author: 'Xeno'
sidebar:
  order: 5
---

## What Is RateLimitMiddleware?

`RateLimitMiddleware` is an enterprise-grade presentation middleware in Xeno designed to control traffic flow and prevent system abuse by limiting the number of requests a client can execute within a specified time window. 

Unlike traditional rate limiters that bind strictly to raw client IP addresses, Xeno's rate limiter delegates key generation to the **`IRateLimitKeyBuilder`** interface. This allows rate-limiting policies to adapt dynamically to complex multi-tenant and user-scoped environments (e.g., partitioning limits by tenant ID, user ID, or IP address).

---

## How Does RateLimitMiddleware Work?

For every incoming HTTP request, `RateLimitMiddleware` executes a structured evaluation pipeline:

1. **Context Resolution**: It retrieves network metadata, tracing data, and active identity scopes via `IContextAccessor`.
2. **Dynamic Key Generation**: It invokes `this._keyBuilder.buildRateLimitKey(req.path)`, generating a precise, contextual cache key for the resource.
3. **Client Identification Safeguard**: If the key builder cannot resolve a valid client context, the middleware immediately halts execution and returns a `503 Service Unavailable` response (`Bad Request: Unable to identify client context for rate limiting`).
4. **Atomic Hit Counter Increment**: It queries the underlying `IAtomicCache` using the generated key, incrementing the counter atomically within the configured `windowSeconds`.
5. **Throttling Enforcement**: If the `currentHits` exceed `maxRequests`, it logs a warning via `ILogger` and returns a `429 Too Many Requests` response equipped with a `Retry-After` header.
6. **Pipeline Progression**: If requests remain within permitted thresholds, it delegates control to downstream middleware and handlers via `next()`.

---

## How Is It Configured?

`MiddlewareModule` registers `RateLimitMiddleware` automatically when either `rateLimite.maxRequests` or `rateLimite.windowSeconds` is defined inside `MiddlewareConfig`.

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

If only one property is specified, Xeno applies default values for the omitted parameter:

* **`maxRequests`**: Defaults to `30` requests.

* **`windowSeconds`**: Defaults to `30` seconds.

If neither property is defined, `RateLimitMiddleware` is omitted from the execution chain entirely.

---

## Contextual Rate Limit Keys (`IRateLimitKeyBuilder`)

The core innovation of Xeno's rate-limiting mechanism is its hierarchical key resolution strategy via `RateLimitKeyBuilder`. Depending on the active request context, keys are automatically structured to match advanced architectural patterns (such as SaaS multi-tenant isolation):

* **Tenant & User Scoped**: `ratelimit:tenant:<tenantId>:user:<userId>:<resource>` (Highest priority when both are present).

* **Tenant & IP Scoped**: `ratelimit:tenant:<tenantId>:ip:<clientIp>:<resource>`.

* **User Scoped**: `ratelimit:user:<userId>:<resource>`.

* **IP Scoped (Default Fallback)**: `ratelimit:ip:<clientIp>:<resource>`.

---

## What Happens When the Limit Is Exceeded?

When client traffic surpasses the configured threshold (`currentHits > maxRequests`), the middleware halts execution and renders a structured error response via `HttpHelper.error`:

* **HTTP Status**: `429 Too Many Requests` (`STATUS_CODES.TOO_MANY_REQUESTS`).

* **Error Code**: `ERROR_CODES.TOO_MANY_REQUESTS`.

* **Headers**: Includes `Retry-After` set to the window duration in seconds alongside standard JSON content types.

* **Audit Logging**: Emits a warning log through `ILogger` identifying the blocked key and target path.

---

## Where Does It Run in the Middleware Chain?

`RateLimitMiddleware` executes after CSRF validation and immediately prior to authentication processing:

```text
RequestContextMiddleware
	-> OptionsMiddleware (optional)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (when csrf is defined)
	-> RateLimitMiddleware (when rate-limiting options are active)
	-> AuthenticationMiddleware
	-> Controller or Handler

```

---

## Dependencies and Constraints

`RateLimitMiddleware` receives these constructor dependencies via Dependency Injection:

* `IContextAccessor<RequestContext>`: Accesses client network metadata and identity tokens.

* `IAtomicCache`: Manages atomic hit counting and expiration windows.

* `IRateLimitKeyBuilder`: Constructs the contextual rate limit key.

* `ILogger`: Records traffic violations and throttling events.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)