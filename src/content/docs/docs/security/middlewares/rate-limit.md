---
title: Rate Limiting
description: Configure Xeno.JS HTTP rate limits and troubleshoot client IP and shared-cache issues.
keywords:
- Xeno.JS rate limiting
- RateLimitMiddleware
- addMiddlewares
- trusted proxies
- client IP
- Redis rate limit
tags:
- security
- middleware
- rate-limiting
faqs:
  - question: How do I enable or configure rate limiting?
    answer: Use addMiddlewares() and set rateLimit.enabled, rateLimit.maxRequests, and rateLimit.windowSeconds in its options callback.
  - question: What are the default rate-limit settings?
    answer: Rate limiting is enabled by default with a maximum of 100 requests per 60 seconds.
  - question: Why can clients behind a reverse proxy share one rate limit?
    answer: If the proxy address is not trusted, Xeno uses the socket IP instead of the forwarded client IP, so requests can share one cache key.
  - question: Does trustedProxies ['*'] trust every proxy?
    answer: No. Xeno currently checks for an exact match against the socket IP, so '*' is not a wildcard.
---

## Introduction

`RateLimitMiddleware` counts requests using the configured cache and returns HTTP `429 Too Many Requests` when a client exceeds its limit. The limit is configured through `XenoAppBuilder.addMiddlewares()`.

The middleware builds a cache key for each request resource. Depending on the context data available, the key is scoped to the tenant and user, tenant and client IP, user, or client IP. When no user or client IP is available, the middleware cannot build a key and returns `503 Service Unavailable`.

## Configure the Limit

`XenoAppBuilder` enables rate limiting by default, with 100 requests per 60 seconds. Configure the maximum and time window through the middleware options:

```ts
import { XenoAppBuilder } from '@xeno-js/core'

const app = new XenoAppBuilder()

app.addMiddlewares((options) => {
  options.rateLimit = {
    enabled: true,
    maxRequests: 60,
    windowSeconds: 60,
  }
})

const application = await app.build()
```

`maxRequests` is the maximum number of requests allowed for a cache key during the window. The middleware returns `429` when the request count exceeds that number. The response includes a `Retry-After` header set to `windowSeconds`.

To disable rate limiting:

```ts
app.addMiddlewares((options) => {
  options.rateLimit = {
    enabled: false,
  }
})
```

## How Xeno Builds Rate-Limit Keys

The key builder checks the current request context in this order:

1. Tenant and user ID: `ratelimit:tenant:<tenantId>:user:<userId>:<path>`
2. Tenant and client IP: `ratelimit:tenant:<tenantId>:ip:<clientIp>:<path>`
3. User ID: `ratelimit:user:<userId>:<path>`
4. Client IP: `ratelimit:ip:<clientIp>:<path>`

The resource portion is the request path. Different paths therefore have separate counters. The middleware stack runs rate limiting before authentication, so do not assume that the rate-limit key will contain an identity established by the authentication middleware for that same request. For requests without an identity available at that point, the key uses the client IP.

## Configure Client IP Behind a Reverse Proxy

When Xeno.JS runs behind a reverse proxy, `req.socket.remoteAddress` may identify the proxy rather than the originating client. If the proxy IP is not trusted, the client IP resolver uses that socket address. Many users can then share one IP-based cache key and exhaust the same rate limit.

To use a forwarded client-IP header safely, configure the header name and the exact socket IP address of the proxy that connects to the application:

```ts
app.addMiddlewares((options) => {
  options.trustedIpHeader = 'x-forwarded-for'
  options.trustedProxies = ['10.0.0.5']

  options.rateLimit = {
    enabled: true,
    maxRequests: 100,
    windowSeconds: 60,
  }
})
```

Replace `10.0.0.5` with the actual address observed as the incoming socket's remote address in your deployment. `trustedProxies` is an exact list of addresses; the current resolver does not support CIDR ranges or a wildcard. In particular, `trustedProxies: ['*']` does **not** make every proxy trusted.

Only trust a proxy that you control and that reliably removes or overwrites client-supplied forwarding headers. Otherwise a client may forge the forwarded IP and evade IP-based limits. Follow your hosting provider's proxy-header and network configuration when identifying which proxy address reaches your application.

The core extractor uses `x-forwarded-for` by default if `trustedIpHeader` is omitted, and falls back to `x-real-ip` when that header is absent. Setting `trustedIpHeader` selects the header to extract; it does not by itself make a proxy trusted.

## Common Issues

### All users behind the proxy are rate-limited together

Check that the socket IP reported by the application matches an entry in `trustedProxies`. If it does not, the resolver uses the socket IP for all requests arriving through that proxy. Also verify that the configured forwarded header is populated by the proxy and contains the expected client address.

Do not use `['*']` as a workaround: it is treated as a literal IP address, not a wildcard.

### Each application instance has a separate counter

If you do not configure a cache provider, Xeno.JS adds the default in-memory cache when rate limiting is enabled. That cache is local to the application process. In a deployment with multiple server instances, each instance can maintain its own counter, so the effective limit is not shared globally.

Configure a shared cache provider, such as Redis, when instances need to use the same counters. See [Redis Cache](../../cache/redis) for cache setup.

### A `503 Service Unavailable` response appears

The rate-limit middleware returns `503` when it cannot build a key because neither a user identity nor a client IP is available in the request context. Check the context and proxy setup, and ensure the request reaches the middleware with a resolvable client IP.

### Legitimate users receive `429 Too Many Requests`

Review the configured `maxRequests` and `windowSeconds`, and confirm that unrelated clients are not sharing the same resolved IP address. Also check whether clients behind NAT or a corporate proxy legitimately share one public IP; in that case, an IP-based key can apply a shared budget to those users.

## Related Documentation

- [Request Context Middleware](./request-context-midleware)
- [Context and Scopes](../../fundamentals/context-scopes)
- [Cache Overview](../../cache/overview)
- [Redis Cache](../../cache/redis)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
