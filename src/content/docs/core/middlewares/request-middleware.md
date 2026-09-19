---
title: 'RequestContextMiddleware: Request Context Management in Xeno'
description: 'Learn how Xeno RequestContextMiddleware extracts request metadata, creates
  an asynchronous request context, assigns tracing identifiers, and handles
  unexpected request errors.'
keywords: [
		'RequestContextMiddleware',
		'request context',
		'AsyncLocalStorage',
		'IRequestContext',
		'IServiceExtractor',
		'correlation ID',
		'request ID',
		'500 Internal Server Error',
		'Xeno',
        ]
author: 'Xeno'
sidebar: 
  order: 6
---

## What Is RequestContextMiddleware?

`RequestContextMiddleware` is the first middleware registered by Xeno's
`MiddlewareModule`. It extracts metadata from the incoming HTTP headers, maps
that metadata and the request transport data into a `RequestContext`, and runs
the remaining middleware chain inside `IRequestContext.runAsync()`.

The context gives downstream middleware, Controllers, Handlers, and application
services access to request-scoped information such as identity, network data,
correlation IDs, request IDs, and tracing data.

## How Does RequestContextMiddleware Work?

For each request, the middleware performs the following steps:

1. It generates fallback values for `correlationId`, `requestId`, and `spanId`.
2. It extracts metadata from the HTTP headers through
	 `IServiceExtractor.extract(headers)`.
3. It merges the extracted metadata with the fallback identifiers.
4. It maps the metadata, request path, transport object, and initial `GUEST`
	 identity into a temporary request context through `ContextMapper.map()`.
5. It executes `next()` inside `IRequestContext.runAsync()`.
6. It logs unsuccessful response data when the downstream response reports a
	 failed result.
7. It returns the downstream response to the transport adapter.

The middleware creates the execution boundary for the request. It does not
authenticate the caller itself. Authentication is handled later by
`AuthenticationMiddleware`.

## Which Metadata Does It Extract?

The injected `IServiceExtractor` returns `Metadata` from the request headers.
The metadata can provide request information used by the Xeno context, such as
correlation, request, span, network, and format data.

The middleware applies these fallback rules:

- `correlationId`: extracted value or a newly generated identifier;
- `requestId`: extracted value or a newly generated identifier;
- `spanId`: extracted value or the generated correlation identifier;
- `formatIndicator`: the extracted value supplied in `meta.formatIndicator`.

The current implementation initializes `formatIndicator` to
`application/json` for unexpected-error responses. It does not explicitly
replace a missing `meta.formatIndicator` in the mapped context with that local
fallback value.

## How Is the Initial Identity Set?

Before authentication runs, `RequestContextMiddleware` maps the initial identity
as `GUEST`. This establishes an unauthenticated identity for downstream request
processing.

`AuthenticationMiddleware` can later replace this identity by calling
`IRequestContext.updateIdentity()` after successful authentication.

## How Is the Request Context Created?

The middleware uses `ContextMapper.map()` to build the context from:

- extracted and generated metadata;
- the incoming request path;
- the request transport object;
- the initial `GUEST` identity.

It then passes the mapped context to `IRequestContext.runAsync()`. The callback
provided to `runAsync()` invokes `next()`, so every middleware and Handler after
`RequestContextMiddleware` executes inside the request context.

## How Are Downstream Failures Logged?

After `runAsync()` resolves, the middleware checks the returned `ResponseDto`.
When `result.ok` is false and `result.data.success` is also false, it logs the
error message and response data through `ILogger.error()`.

The middleware does not replace the downstream error response. It returns the
original result after logging it.

## How Are Unexpected Exceptions Handled?

If metadata extraction, context mapping, context execution, or downstream
processing throws an exception, the middleware catches it and logs:

```text
RequestContextMiddleware encountered an error
```

It then returns a system-error response with:

- `ERROR_CODES.SYSTEM_ERROR` as the error code;
- the standard system-error message;
- the request path and fatal system-error details;
- generated correlation, request, and span identifiers;
- `STATUS_CODES.INTERNAL_SERVER_ERROR` as the HTTP status;
- `application/json` as the `Content-Type` value.

The current implementation does not expose the caught exception or stack trace
in the returned response and does not branch on `NODE_ENV`.

## Which Dependencies Does It Use?

`RequestContextMiddleware` receives these dependencies through constructor
injection:

- `IRequestContext<RequestContext, ApplicationRegistry<unknown>>`, used to
	create the asynchronous context and provide the request-context boundary;
- `IServiceExtractor<HttpHeaders, Metadata>`, used to extract metadata from
	request headers;
- `ILogger`, used to record downstream failures and unexpected exceptions.

## Where Does It Run in the Middleware Chain?

`MiddlewareModule` adds `RequestContextMiddleware` first and then registers the
remaining enabled middleware with `CompositeMiddleware`:

```text
RequestContextMiddleware
	-> OptionsMiddleware (when optionsMiddleware is true)
	-> MethodCheckMiddleware (when routeRegistry is defined)
	-> CsrfMiddleware (when csrf is defined)
	-> RateLimitMiddleware (when a rate-limit option is defined)
	-> AuthenticationMiddleware
	-> Controller or Handler
```

Because it establishes the request context around `next()`, it must execute
before middleware that reads context values, including authentication, CSRF,
rate limiting, and method-check error handling.

## Constraints and Limitations

- `RequestContextMiddleware` initializes the context but does not authenticate
	the request.
- The initial identity is always `GUEST` until another middleware updates it.
- Fallback identifiers are generated per request when metadata does not provide
	them.
- Unexpected exceptions are converted into a `500 Internal Server Error`
	response.
- Downstream error responses are logged but returned unchanged.
- The middleware depends on a correctly configured `IServiceExtractor` to
	provide request metadata.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)