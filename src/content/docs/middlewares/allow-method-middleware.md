---
title: 'MethodCheckMiddleware: HTTP Method Authorization in Xeno'
description: 'Learn how Xeno MethodCheckMiddleware validates request paths and HTTP methods through routeRegistry before forwarding requests to the next middleware.'
keywords: [
		'MethodCheckMiddleware',
		'Allow Method Middleware',
		'HTTP method validation',
		'routeRegistry',
		'MiddlewareConfig',
		'CompositeMiddleware',
		'405 Method Not Allowed',
		'Xeno', 
        ]
author: 'Xeno'
sidebar:
  order: 1
---

## What Is MethodCheckMiddleware?

`MethodCheckMiddleware` is a Xeno Presentation middleware that checks whether a
request path accepts the incoming HTTP method. It reads the route registry
configured through `MiddlewareConfig` and either forwards the request or returns
a `405 Method Not Allowed` response.

The middleware is registered by `MiddlewareModule` when `routeRegistry` is
defined. It is then executed by `CompositeMiddleware` in the order in which the
middleware was registered.

## How Does MethodCheckMiddleware Work?

For each request, `MethodCheckMiddleware` calls the injected `IAllowMethod`
service with the request path and method:

1. `AllowMethodRegistry` looks up the configured methods for the request path.
2. The middleware evaluates the result of `check(req.path, req.method)`.
3. If the method is allowed, the middleware calls `next()`.
4. If the method is not allowed, the middleware returns an error response and
	 stops the middleware chain.

The middleware does not authenticate the request, validate its body, or invoke
the controller directly. Those responsibilities belong to other middleware or
to the application layer.

## How Is the Route Registry Configured?

The route registry is a `Dictionary<HttpMethod[]>` assigned to
`config.routeRegistry` in the `addMiddlewares` `SetupAction` callback. Each key
identifies a request path and its value lists the HTTP methods accepted for that
path.

```typescript
import { AppBuilder } from '@xeno-js/core'
import type { AppRegistry } from './registry'

const builder = new AppBuilder<AppRegistry>()

builder.addMiddlewares((config) => {
	config.routeRegistry = {
		'/api/users': ['GET', 'POST'],
		'/api/users/:id': ['GET', 'PATCH', 'DELETE'],
		'/api/health': ['GET'],
		'/api/orders/{id}': ['GET', 'PATCH', 'DELETE'],
		'/api/users/:id/orders/:id': ['GET']
	}
})

const container = await builder.build()
```

When `routeRegistry` is `undefined`, `MiddlewareModule` does not register
`MethodCheckMiddleware` or its `AllowMethodRegistry` dependency.

## What Happens When a Method Is Not Allowed?

When the registry rejects a request, the middleware returns an error generated
by `HttpHelper.error`. The response contains:

- `ERROR_CODES.NOT_ALLOWED` as the error code;
- the corresponding standard error message;
- the request path;
- the detail `Operation blocked by allow method middleware`;
- the current correlation, request, and span identifiers when available;
- the `STATUS_CODES.NOT_ALLOWED` HTTP status.

Because the middleware returns without calling `next()`, the controller and all
later middleware in the composite chain are not executed for that request.

## Where Does It Run in the Middleware Chain?

`MiddlewareModule` appends `MethodCheckMiddleware` after the optional
`OptionsMiddleware` and before the optional `CsrfMiddleware`, rate limiter, and
the always-registered `AuthenticationMiddleware`.

The resulting order is determined by the enabled configuration:

```text
RequestContextMiddleware
	-> OptionsMiddleware (optional)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (when csrf is defined)
	-> RateLimitMiddleware (when a rate-limit option is defined)
	-> AuthenticationMiddleware
	-> Controller or Handler
```

`OptionsMiddleware` can therefore complete an `OPTIONS` request before method
validation. For other methods, `MethodCheckMiddleware` can stop the request
before CSRF, rate-limit, authentication, and application execution.

## Dependencies and Constraints

`MethodCheckMiddleware` receives these dependencies through its constructor:

- `IRequestContext`, used to obtain tracing and request identifiers for an
	error response;
- `IAllowMethod`, implemented by `AllowMethodRegistry`, used to check the
	configured path and method.

The current implementation exposes the following constraints:

- the middleware checks the request path and method supplied by the transport
	adapter;
- route configuration is enabled only when `routeRegistry` is defined;
- rejected requests return `STATUS_CODES.NOT_ALLOWED` and do not call `next()`;
- the middleware does not provide public-route bypass rules;
- authentication and authorization are handled by separate Xeno components.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)