---
title: 'AuthenticationMiddleware: Request Authentication in Xeno'
description: 'Learn how Xeno.JS AuthenticationMiddleware extracts bearer tokens, delegates
  authentication to IGateKeeper, updates the request identity, and returns
  structured authentication errors.'
keywords: [
    'AuthenticationMiddleware',
    'authentication middleware',
    'IGateKeeper',
    'IServiceExtractor',
    'bearer token',
    'request identity',
    '401 Unauthorized',
    'Xeno', 
        ]
author: 'Xeno'
sidebar:
  order: 2
---

## What Is AuthenticationMiddleware?

`AuthenticationMiddleware` is a Xeno.JS Presentation middleware that authenticates
each request before it reaches the controller or Handler. It extracts an
optional token from the request headers, delegates authentication to an
`IGateKeeper`, and stores the resulting identity in the request context.

When authentication fails, the middleware logs the failure and returns a
structured error response. When authentication succeeds, it calls `next()` so
the request can continue through the CompositeMiddleware chain.

## How Does AuthenticationMiddleware Work?

For each request, the middleware executes the following sequence:

1. It calls `IServiceExtractor.extract(headers)` to obtain an optional token.
2. It passes the token to `IGateKeeper.authenticate(token)`.
3. If the authentication result is successful, it updates the request identity
	 through `IRequestContext.updateIdentity(...)`.
4. It calls `next()` and returns the downstream response.
5. If authentication fails, it logs the failure and returns an HTTP error
	 response without calling `next()`.

The middleware does not validate the request body, authorize Command or Query
operations, or resolve user data directly. Token interpretation and identity
creation are delegated to the configured `IGateKeeper` and token extractor.

## Which Dependencies Does It Use?

`AuthenticationMiddleware` receives its dependencies through constructor
injection:

- `IRequestContext<RequestContext, ApplicationRegistry<unknown>>` stores and
	updates request-scoped identity and provides request metadata;
- `IServiceExtractor<HttpHeaders, Optional<string>>` extracts the token from
	HTTP headers;
- `IGateKeeper` authenticates the token and returns a Result containing either
	an identity or an application error;
- `ILogger` records failed authentication attempts.

This design keeps transport-level token extraction separate from authentication
and identity decisions.

## How Is the Token Extracted?

The middleware does not parse headers itself. It delegates extraction to the
configured `IServiceExtractor` implementation.

`MiddlewareModule` selects the extractor according to `MiddlewareConfig.isSSR`:

- when `isSSR` is `false`, it registers `BearerTokenExtractor`;
- when `isSSR` is `true`, it registers `SupabaseSsrTokenExtractor`.

The selected extractor returns an optional token. The middleware passes that
value to the `IGateKeeper`, including when no token is present.

## How Are Authentication Failures Returned?

When `IGateKeeper.authenticate()` returns a failed Result, the middleware
creates an error response with `HttpHelper.error`. The response includes:

- the error code and message returned by the `IGateKeeper`;
- details identifying the request path and authentication failure;
- the request path;
- the current correlation ID, request ID, and span ID when available;
- the request format from the current context, defaulting to
	`application/json`;
- the status returned by the error, or `STATUS_CODES.UNAUTHORIZED` when no
	status is defined.

The middleware also writes a warning through `ILogger` containing the request
path and error code. Because it returns immediately, the controller and later
middleware are not executed for the failed request.

## How Is the Identity Stored?

After successful authentication, the middleware obtains the identity from the
successful Result and calls `IRequestContext.updateIdentity()`. Downstream
middleware, Handlers, and application services can then access the identity
through the request context.

The middleware does not create a new request context. `RequestContextMiddleware`
must establish the context before `AuthenticationMiddleware` executes.

## Where Does It Run in the Middleware Chain?

`MiddlewareModule` always appends `AuthenticationMiddleware` after the optional
`OptionsMiddleware`, `MethodCheckMiddleware`, `CsrfMiddleware`, and
`RateLimitMiddleware` instances.

The effective chain is configured according to the enabled options:

```text
RequestContextMiddleware
	-> OptionsMiddleware (optional)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (when csrf is defined)
	-> RateLimitMiddleware (when a rate-limit option is defined)
	-> AuthenticationMiddleware
	-> Controller or Handler
```

When `AppBuilder.addAuth()` is not used, `MiddlewareModule` registers
`NoAuthGateKeeper` as the gatekeeper. The authentication middleware remains in
the chain, but authentication behavior is provided by that gatekeeper.

## Example: Registering Authentication Middleware

Authentication middleware is registered as part of `addMiddlewares()`. The
authentication provider is configured separately through `addAuth()` when an
external authentication integration is required.

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder
	.addContext()
	.addAuth((config, env) => {
		config.url = env.getOrThrow('AUTH_URL')
		config.key = env.getOrThrow('AUTH_KEY')
	})
	.addMiddlewares((config) => {
		config.isSSR = false
	})

const container = await builder.build()
```

## Constraints and Limitations

- `AuthenticationMiddleware` authenticates the request but does not implement
	Command or Query authorization policies.
- The middleware delegates token extraction to `IServiceExtractor` and token
	verification to `IGateKeeper`.
- A failed authentication Result stops the middleware chain.
- A successful authentication Result must contain an identity that can be
	passed to `IRequestContext.updateIdentity()`.
- The request context must be initialized before this middleware executes.
- The default status for an authentication error is `401 Unauthorized`, unless
	the returned application error provides another status.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
