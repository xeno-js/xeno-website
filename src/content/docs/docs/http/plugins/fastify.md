---
title: Fastify HTTP Server
description: Learn how to configure and run the Fastify HTTP server integration for Xeno.JS.
keywords:
- Xeno.JS
- Fastify
- xeno-js/fastify
- withFastify
- XenoAppBuilder
- HTTP transport
- trustProxy
tags:
- http
- server
- fastify
- plugins
faqs:
- question: What does @xeno-js/fastify provide?
  answer: It provides withFastify(), a Xeno.JS server plugin that uses Fastify as the HTTP transport.
- question: How do I configure Fastify?
  answer: Pass a setup callback to withFastify() to configure FastifyServerOptions, and use application.listen() for the host and port.
- question: What are the plugin's Fastify defaults?
  answer: The plugin starts with logger set to false and trustProxy set to true; the setup callback can change them.
- question: Does the plugin configure Xeno.JS authentication and CORS?
  answer: No. Configure the required Xeno.JS middleware and authentication separately.
- question: How do I stop the Fastify server?
  answer: After startup, call await app.getServices().httpServer.dispose() to close the registered HTTP server.
---

## Introduction

`@xeno-js/fastify` connects a Xeno.JS application to
[Fastify](https://fastify.dev/) as its HTTP transport. Use it when your
application runs as a Node.js process and you want to configure Fastify's
server options while keeping routes and application services in Xeno.JS.

The plugin selects and configures the transport. Your application still
defines routes, registers controllers and services, and configures the
middleware and security it needs.

The setup is:

1. Install the plugin and its core peer dependency.
2. Register routes, services, and `withFastify()` in `XenoAppBuilder`.
3. Build the application and start the listener.

## Installation

```bash
npm install @xeno-js/core @xeno-js/fastify
```

The package declares Node.js `>=20` and `@xeno-js/core` as a peer
dependency. Fastify is a dependency of `@xeno-js/fastify`; install it
directly as well if your application imports Fastify APIs. Select compatible
package versions for your application.

## Start a server

This example registers a controller and a route, then listens on the local
interface. The controller returns a fixed order; replace it with application
services for a real endpoint.

```ts
import { HttpHelper, XenoAppBuilder } from '@xeno-js/core'
import type {
  IController,
  NativeRouteDefinition,
  ResponseDto,
  XenoRegistry,
} from '@xeno-js/core'
import { withFastify } from '@xeno-js/fastify'

interface OrderSummary {
  id: string
  status: string
}

interface OrdersRegistry extends XenoRegistry {
  ORDER_STATUS_CONTROLLER: IController<void, OrderSummary>
}

class OrderStatusController implements IController<void, OrderSummary> {
  async handle(): Promise<ResponseDto<OrderSummary>> {
    return HttpHelper.success({ id: '42', status: 'received' })
  }
}

const routes: NativeRouteDefinition<OrdersRegistry>[] = [
  {
    method: 'GET',
    path: '/api/orders/current',
    handler: async (ctx) => ctx.handle('ORDER_STATUS_CONTROLLER'),
  },
]

async function main() {
  const app = await new XenoAppBuilder<OrdersRegistry>()
    .addRoutes(routes)
    .addServices((services) => {
      services.addScoped(
        'ORDER_STATUS_CONTROLLER',
        () => new OrderStatusController(),
      )
    })
    .addHttpServer(
      withFastify<OrdersRegistry>((options) => {
        options.trustProxy = false
      }),
    )
    .build()

  await app.listen({
    host: '127.0.0.1',
    port: 3000,
    onListening: ({ host, port }) => {
      console.info(`Server listening on ${host}:${port}`)
    },
  })
}

main().catch((error: unknown) => {
  console.error('Application startup failed', error)
  process.exitCode = 1
})
```

After startup, request the endpoint:

```bash
curl http://127.0.0.1:3000/api/orders/current
```

The server returns status `200` and the controller's success payload:

```json
{
  "success": true,
  "data": { "id": "42", "status": "received" },
  "meta": {}
}
```

`build()` initializes the queued modules. `listen()` creates and starts the
Fastify server; `onListening` runs after Fastify starts listening. The
example uses `ctx.handle()`, so controller dispatch uses a request scope.
It does not configure the full HTTP middleware or authentication; configure
these before exposing endpoints that require them.

Await `listen()` to handle a rejected Fastify startup, such as a failure to
bind the requested address. The entry point reports rejected build or
startup operations.

## Configure Fastify

`withFastify()` accepts an optional setup callback. Its first argument is
Fastify's `FastifyServerOptions`; its second is the Xeno.JS configuration
service:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withFastify } from '@xeno-js/fastify'

const builder = new XenoAppBuilder()
  .addRoutes([])
  .addHttpServer(
    withFastify((options, config) => {
      options.logger = false
      options.trustProxy = false
      options.bodyLimit = config.getNumber('HTTP_BODY_LIMIT', 1048576)
    }),
  )

const app = await builder.build()
await app.listen({ host: '127.0.0.1', port: 3000 })
```

The callback sets options on the Fastify instance; `HTTP_BODY_LIMIT` is an
application-chosen configuration key, not a built-in Xeno.JS environment
variable. `bodyLimit` uses bytes. Choose a limit for the requests your
application accepts and account for any proxy limits. With the default Node
configuration service, an invalid numeric value raises a configuration error.
See the [Fastify server options documentation](https://fastify.dev/docs/latest/Reference/Server/)
for supported upstream settings.

The plugin initializes these Fastify options before invoking the callback:

| Option | Plugin default | Consideration |
| --- | --- | --- |
| `logger` | `false` | Fastify's logger is separate from the Xeno.JS logger. |
| `trustProxy` | `true` | Review this default; set `false` when the deployment should not trust proxy headers. |

Set `trustProxy` to an appropriate value for the actual proxy topology.
Fastify's `trustProxy` and Xeno.JS middleware's `trustedProxies` and
`trustedIpHeader` are separate settings. Configuring one does not configure
the other; trust only proxies you control.

`withFastify()` configures Fastify construction options, not Xeno.JS
middleware, routes, or controller registrations. Those remain builder
configuration.

## Configure the listener

Pass listener options to `app.listen()`:

| Option | Type | Use |
| --- | --- | --- |
| `host` | `string` | Network interface or host on which to listen. |
| `port` | `number` | TCP port on which to listen. |
| `onListening` | `({ host, port }) => void` | Callback invoked after Fastify starts listening. |

You can omit `host`, `port`, or the whole options object:

```ts
// After registering routes and Fastify and building the application.
await app.listen()
```

Xeno.JS selects each value in this order:

1. The value passed to `listen()`.
2. `HOST` or `PORT` from the configuration service.
3. `0.0.0.0` for the host and `3000` for the port.

The default Node configuration service reads environment variables; it does
not load a `.env` file by itself. `0.0.0.0` listens on all IPv4 interfaces.
Use `127.0.0.1` for local-only access, or set the host required by the
deployment. The options factory reads `PORT` even if an explicit port is
provided, so a non-numeric `PORT` causes a configuration error.

`onListening` receives the configured host and port, not the resolved server
address. In particular, if you specify port `0`, its `port` is still `0`,
not the operating system's selected port.

The current Fastify implementation returns its Fastify instance from
`listen()`, but the public `XenoApplication.listen()` contract returns
`Promise<unknown>`. Do not assume the public API provides a typed Fastify
instance or a pre-listen plugin-registration hook.

## Register routes and middleware

Use `addRoutes()` before `build()`. The route module provides the dispatch
services needed by the Fastify integration. To start a listener without
endpoints, register an empty array with `addRoutes([])`; requests then
receive `404`. Registering the server plugin alone does not provide all the
dispatcher dependencies needed for `listen()`.

For application routes, register the controller token and its implementation
as in the example above. See [HTTP Routes](../routes) for route definitions,
parameters, matching, and policies.

Use `addMiddlewares()` to configure HTTP middleware such as CORS, rate
limiting, and CSRF. Authentication and authorization need their own
configuration. Route handlers that return a response directly do not run the
`ctx.handle()` middleware dispatch path. See [HTTP Server](../server) for a
middleware example.

## Requests and responses

The integration registers a Fastify wildcard route for `GET`, `POST`, `PUT`,
`PATCH`, `DELETE`, `OPTIONS`, and `HEAD`. It maps matching requests to
Xeno.JS routes and writes the returned `ResponseDto` status, headers, and
`data` payload. See [API Responses](../api-response) for success and error
payloads.

Some transport-specific behavior matters when configuring an application:

- Fastify parses request bodies before the Xeno.JS route handler receives
  them. Parser errors, content-type handling, and body-size limits can
  produce Fastify responses before controller dispatch; consult Fastify's
  documentation and test the content types your application accepts.
- Query data comes from Fastify's parsed query object. Validate query and
  body values before using them; `HttpRouteParamHelper.extractInput()`
  does not validate its generic type and does not read `DELETE` bodies.
- The mapper creates a signal for an aborted Fastify request, but the
  current Xeno.JS adapter does not forward the incoming signal into the
  `Request` used for controller dispatch. Do not rely on client disconnects
  to cancel controller work.
- If Xeno.JS cannot match a route, the adapter returns status `404` and a
  body such as `{ "error": "Route GET /missing not found" }`. This is not
  the standard controller error envelope.
- When a route or dispatch throws outside the controller's formatted
  response path, the adapter returns `500` with the thrown error's message
  in an `error` field. Avoid exposing sensitive exception messages; handle
  expected failures explicitly and protect the deployment boundary.
- The mapper removes the exact lowercase `content-length` key from response
  headers before handing them to Fastify. Do not depend on manually setting
  content length through the controller response.

## Stop the server

After startup, the registered HTTP server exposes `dispose()`:

```ts
// app is the application returned by build().
await app.getServices().httpServer.dispose()
```

The integration calls Fastify's `close()` and clears its server reference.
This call closes the HTTP server only; it is not an application-wide
shutdown API and does not by itself dispose all other registered services.
Coordinate shutdown of the rest of the application and external resources
according to your deployment's lifecycle. Avoid calling `listen()` repeatedly
on the same server instance without closing it.

## Next steps

- Configure host, middleware, and other transports in [HTTP Server](../server).
- Define endpoints in [HTTP Routes](../routes).
- Implement controller responses in [HTTP Controllers](../controller) and
  [API Responses](../api-response).
- Review [Context and Scopes](../../fundamentals/context-scopes) for request
  context and scoped services.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us).
