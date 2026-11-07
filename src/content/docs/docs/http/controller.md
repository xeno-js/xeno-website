---
title: HTTP Controllers
description: Learn how to implement, register, and invoke HTTP controllers in Xeno.JS.
keywords:
- Xeno.JS
- HTTP controller
- IController
- BaseController
- ResponseDto
- mediator
- CQRS
- dependency injection
tags:
- http
- controllers
- cqrs
- dependency-injection
faqs:
- question: What does a controller do in Xeno.JS?
  answer: A controller receives route input, invokes application operations, and returns a ResponseDto for the HTTP transport.
- question: Do controllers have to extend BaseController?
  answer: No. A controller can implement IController directly; BaseController provides helpers for the mediator, responses, and request context.
- question: How do I invoke a controller from a route?
  answer: Register the controller in the service container and call ctx.handle() with its registry token and input.
- question: How do I configure the mediator used by BaseController?
  answer: Call addPipeline() on XenoAppBuilder and register the handler under the command or query intent.
- question: How do I return a failed result?
  answer: In a BaseController, pass the failed Result's AppError to fail() to create an error ResponseDto.
---

## Introduction

Routes map HTTP methods and paths to operations. Controllers provide the
presentation boundary for those operations: they receive input, call
application code, and turn the outcome into an HTTP response.

Keep the responsibilities separate:

```text
HTTP request
    ↓
Route: select the operation and prepare input
    ↓
Controller: invoke application code and select a response
    ↓
Application handler: execute the use case
    ↓
Domain and infrastructure services
```

In a layered application, domain code has no dependency on the HTTP
transport. Application handlers orchestrate use cases; infrastructure
implements external dependencies. A controller belongs at the presentation
boundary rather than in the domain.

Xeno.JS offers two ways to write a controller:

- Implement `IController<TRequest, TResponse>` when you need only the
  controller contract.
- Extend `BaseController<TRequest, TResponse>` when you want its mediator,
  response, and request-context helpers.

Use [HTTP Routes](./routes) to define paths, extract input, and dispatch
requests. Use [HTTP Server](./server) to select and start a transport.

## Create and register a controller

The following example connects a route to a `BaseController`, a query, and a
handler. The handler returns a fixed order so that the example runs without a
database. In an application, the handler would use a repository or another
application dependency.

Install the core package and the Node.js server integration:

```bash
npm install @xeno-js/core @xeno-js/node
```

```ts
import {
  AppError,
  BaseController,
  HttpRouteParamHelper,
  Query,
  Result,
  TOKENS,
  XenoAppBuilder,
} from '@xeno-js/core'
import type {
  IContextAccessor,
  IController,
  IHandler,
  IMediator,
  NativeRouteDefinition,
  RequestContext,
  ResponseDto,
  ResultType,
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

class GetOrderQuery extends Query<OrderSummary> {
  constructor(readonly id: string) {
    super('GET_ORDER_HANDLER', {
      cacheKey: `order:${id}`,
      ttl: undefined,
      bypassCache: true,
      consistentRead: false,
      isUserScoped: false,
    })
  }
}

class GetOrderHandler implements IHandler<GetOrderQuery, OrderSummary> {
  async handle(query: GetOrderQuery): Promise<ResultType<OrderSummary>> {
    return Result.ok({ id: query.id, status: 'received' })
  }
}

class GetOrderController extends BaseController<GetOrderInput, OrderSummary> {
  constructor(context: IContextAccessor<RequestContext>, mediator: IMediator) {
    super(context, mediator)
  }

  async handle(
    input: GetOrderInput,
    signal?: AbortSignal,
  ): Promise<ResponseDto<OrderSummary>> {
    if (typeof input?.id !== 'string' || input.id.trim() === '') {
      return this.fail(AppError.badRequest('GetOrderController', 'Invalid order id'))
    }

    const result = await this._query(new GetOrderQuery(input.id), signal)

    if (!result.isOk()) {
      return this.fail(result.getErrorOrThrow())
    }

    const order = result.getValueOrThrow()
    if (order === undefined) {
      return this.fail(
        AppError.internalServerError(
          'GetOrderController',
          new Error('The order handler returned no value'),
        ),
      )
    }

    return this.ok(order)
  }
}

interface OrdersRegistry extends XenoRegistry {
  GET_ORDER_CONTROLLER: IController<GetOrderInput, OrderSummary>
  GET_ORDER_HANDLER: IHandler<GetOrderQuery, OrderSummary>
}

const routes: NativeRouteDefinition<OrdersRegistry>[] = [
  {
    method: 'GET',
    path: '/api/orders/:id',
    handler: async (ctx) => {
      const input = await HttpRouteParamHelper.extractInput<GetOrderInput>(
        ctx.req,
        '/api/orders/:id',
      )
      return ctx.handle('GET_ORDER_CONTROLLER', input)
    },
  },
]

async function main() {
  const app = await new XenoAppBuilder<OrdersRegistry>()
    .addRoutes(routes)
    .addPipeline()
    .addServices((services) => {
      services.addScoped('GET_ORDER_CONTROLLER', (scope) => {
        return new GetOrderController(
          scope.resolve(TOKENS.CONTEXT_ACCESSOR),
          scope.resolve(TOKENS.MEDIATOR),
        )
      })
      services.addScoped('GET_ORDER_HANDLER', () => new GetOrderHandler())
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

`addPipeline()` registers the mediator and the default CQRS pipeline. The
query's intent, `GET_ORDER_HANDLER`, must match the handler's container token.
The controller and handler are registered separately from their registry types.
Query cache options do not activate caching; this example does not register a
query caching plugin.

For `GET /api/orders/42`, the route passes the extracted ID to the controller.
The controller sends the query through the mediator and returns a `200`
response when the handler succeeds. A failed result becomes an error response.
The input check matters because the generic argument to `extractInput()` is a
TypeScript type, not runtime validation.

This example does not configure authentication, authorization, CORS, or
rate-limiting middleware. Configure the protections required by your
application before exposing a real endpoint.

## The controller contract

`IController<TRequest, TResponse>` declares an asynchronous `handle()` method:

```ts
handle(
  request: TRequest,
  signal?: AbortSignal,
): Promise<ResponseDto<TResponse>>
```

The route calls `ctx.handle(token, input)`. The dispatcher runs configured HTTP
middleware, resolves the controller from the active scope, and calls its
`handle()` method. The method returns a `ResponseDto`; the selected transport
maps its status, headers, and body to the HTTP response.

The registry constrains the token passed to `ctx.handle()`, but the method's
generic signature does not infer the controller's input and output types from
that token. Keep the route input and controller contract aligned and validate
untrusted input at runtime. A missing registration or a resolved service
without a `handle` method fails during dispatch.

A controller may implement `IController` directly. It does not need a mediator
or request-context accessor unless the implementation uses them. See the
standalone controller example in [HTTP Routes](./routes#define-and-register-a-route).

## Use BaseController

`BaseController` implements `IController` and requires two constructor
dependencies:

| Dependency | Purpose |
| --- | --- |
| `IContextAccessor<RequestContext>` | Reads the active request context for controller code and error responses. |
| `IMediator` | Dispatches commands and queries through the CQRS pipeline. |

Implement `handle()` in the subclass. The following helpers are protected and
available to that subclass:

| Helper | Purpose |
| --- | --- |
| `this._query(query, signal)` | Sends an `IQuery<TResponse>` through the mediator. |
| `this._send(command, signal)` | Sends an `ICommand<TResponse>` through the mediator. |
| `this.ok(data, status?, meta?, headers?)` | Creates a successful `ResponseDto`. |
| `this.fail(error, details?, headers?)` | Creates an error `ResponseDto` from an `AppError`. |
| `this.getContext()` | Returns the current `RequestContext`, or `undefined` if none is available. |

`_query()` and `_send()` return a `ResultType<TResponse>`. Check `isOk()`
before reading the error or value. `getValueOrThrow()` can return `undefined`
even for a successful result, so handle that case when your response requires
a value.

To send a command instead of a query, use the same result handling pattern:

```ts
// Inside a BaseController whose response type requires a command result value.
const result = await this._send(command, signal)

if (!result.isOk()) {
  return this.fail(result.getErrorOrThrow())
}

const value = result.getValueOrThrow()
if (value === undefined) {
  return this.fail(
    AppError.internalServerError('OrderController', new Error('Missing command result')),
  )
}

return this.ok(value)
```

Here `command` is an application-defined `ICommand` whose response type
matches the controller's response type. Register its handler using the
command's intent, just as for the query example. A command that intentionally
returns `void` needs a response appropriate to that contract instead of this
missing-value check.

## Build responses

`this.ok()` defaults to status `200` and wraps the value as:

```json
{
  "success": true,
  "data": { "id": "42", "status": "received" },
  "meta": {}
}
```

Pass a different status, metadata, or headers when the endpoint needs them.
For example, `this.ok(order, 201, {}, { Location: ['/api/orders/42'] })`
returns a success response with status `201` and a `Location` header. The
helper sets the response content type to JSON.

`this.fail()` uses the `AppError` code, message, and status. It also includes
the request path, correlation ID, request ID, span ID, and timestamp when
available. Without an active context, it generates missing identifiers. The
optional `details` argument overrides the default error message used for
details; headers passed to `fail()` are added after any headers on the error.
Only include details and headers that are safe to expose to clients.

For the complete response contract, helper options, and transport-specific
body mapping, see [API Responses](./api-response).

Neither helper automatically converts every exception thrown by controller
code. Handle expected failures explicitly. The default CQRS exception
pipeline converts exceptions thrown within the mediator pipeline to failed
results; exceptions outside that pipeline follow the selected transport's
error-handling behavior.

## Lifetimes and request context

Register controllers and their dependencies with lifetimes suited to their
state:

- **Scoped:** one instance within a service scope; useful when dependencies
  are request-scoped.
- **Transient:** a new instance on each resolution.
- **Singleton:** one shared instance for the container.

Do not inject scoped dependencies into a singleton: the container rejects
this captive dependency. `ctx.handle()` resolves controllers within the active
request scope. With the default Node context, Xeno.JS uses `AsyncLocalStorage`
to make `RequestContext` available during that execution.

Within a `BaseController`, `this.getContext()` can provide identity, network,
and tracing data when a context is active. Without configured HTTP middleware,
route dispatch uses a minimal synthetic guest context; do not treat it as an
authenticated identity. Configure authentication and authorization explicitly
and check the relevant policy before exposing protected operations. See
[Context and Scopes](../fundamentals/context-scopes) for context access.

The dispatcher passes the adapted request's `AbortSignal` to the controller.
Forward it to `_query()` or `_send()` and to application dependencies that
support cancellation. The current HTTP adapter creates a new `Request` without
forwarding the incoming transport signal, so do not assume client
disconnection will cancel controller work across server integrations.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us).
