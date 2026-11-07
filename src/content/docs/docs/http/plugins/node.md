---
title: Node.js HTTP Server
description: Learn how to configure and run the native Node.js HTTP server integration for Xeno.JS.
keywords:
- Xeno.JS
- Node.js HTTP server
- xeno-js/node
- withNodeHttpServer
- XenoAppBuilder
- HTTP transport
tags:
- http
- server
- node
- plugins
faqs:
- question: What does @xeno-js/node provide?
  answer: It provides withNodeHttpServer(), a Xeno.JS plugin that uses the native Node.js HTTP server.
- question: How do I configure the Node.js server?
  answer: Register withNodeHttpServer() through addHttpServer(), register routes, build the application, and pass host and port to listen() or use HOST and PORT.
- question: Does withNodeHttpServer() accept server options?
  answer: No. The plugin takes no configuration arguments; host, port, and onListening are configured through application.listen().
- question: Does the plugin configure authentication and CORS?
  answer: No. Configure the required Xeno.JS middleware and authentication separately.
- question: Does await app.listen() catch all Node.js listening errors?
  answer: No. The current Node server implementation does not attach an error listener that rejects its listen promise.
---

## Introduction

`@xeno-js/node` connects a Xeno.JS application to Node.js's built-in HTTP
server. Use it when you want to run the application as a Node.js process
without selecting a separate web server framework.

The plugin configures the transport. Your application still defines routes,
registers controllers and services, and configures any required middleware.
This keeps the application boundary separate from the choice of server.

The setup is:

1. Install the plugin and its core peer dependency.
2. Register routes, services, and `withNodeHttpServer()` in `XenoAppBuilder`.
3. Build the application and start the listener.

## Installation

```bash
npm install @xeno-js/core @xeno-js/node
```

The package declares Node.js `>=20` and `@xeno-js/core` as a peer
dependency. Select compatible package versions for your application.

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
import { withNodeHttpServer } from '@xeno-js/node'

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
    .addHttpServer(withNodeHttpServer<OrdersRegistry>())
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

`build()` initializes the queued modules. `listen()` resolves and starts the
Node server; `onListening` runs after the listener starts. The example uses
`ctx.handle()`, so controller dispatch uses a request scope. It does not
configure the full HTTP middleware or authentication; configure these before
exposing endpoints that require them.

The `catch` above reports rejected bootstrap and startup operations, but the
current Node server implementation does **not** attach a listener that rejects
the promise on Node's asynchronous server `error` event. For example, an
occupied port can emit an unhandled error instead of reaching that `catch`.
Do not treat `await app.listen()` as complete coverage of listener errors in
this integration; account for this limitation in deployment monitoring and
testing.

## Configure the listener

`withNodeHttpServer()` takes no arguments. Configure the listener with
`app.listen()`:

| Option | Type | Use |
| --- | --- | --- |
| `host` | `string` | Network interface or host on which to listen. |
| `port` | `number` | TCP port on which to listen. |
| `onListening` | `({ host, port }) => void` | Callback invoked when the listener starts. |

You can omit `host`, `port`, or the whole options object:

```ts
// After registering routes and the Node server and building the application.
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
not the operating system's selected port. The public plugin does not expose
the native `http.Server` instance through `app.listen()`.

The plugin uses `node:http`, not a TLS listener. If clients require HTTPS,
terminate TLS through a properly configured reverse proxy or hosting platform.
The plugin does not expose native server construction options through
`withNodeHttpServer()`.

## Register routes and middleware

Use `addRoutes()` before `build()`. The route module provides the dispatch
services needed by the Node integration. To start a listener without
endpoints, register an empty array with `addRoutes([])`; requests then
receive `404`. Registering the server plugin alone does not provide all the
dispatcher dependencies needed for `listen()`.

For application routes, register the controller token and its implementation
as in the example above. See [HTTP Routes](../routes) for route definitions,
parameters, matching, and policies.

Use `addMiddlewares()` to configure HTTP middleware such as CORS, rate
limiting, and CSRF. Authentication and authorization need their own
configuration. Route handlers that return a response directly do not run the
`ctx.handle()` middleware dispatch path. If your application is behind a
reverse proxy, configure forwarded headers and trusted proxies only for
proxies you control. See [HTTP Server](../server) for a middleware example.

## Requests and responses

The Node integration maps native requests to Xeno.JS request objects and
passes matching requests to the registered route. For controller responses,
it writes the `ResponseDto` status and headers and serializes
`ResponseDto.data` as the body. See [API Responses](../api-response) for
success and error payloads.

Some transport-specific behavior matters when configuring an application:

- The Node integration buffers the body of a matching request in memory
  before dispatch. It does not expose a request-body size limit through this
  plugin; enforce an appropriate limit at a trusted proxy or another boundary.
- `GET`, `HEAD`, and `OPTIONS` bodies are not read by the Node mapper.
  `HttpRouteParamHelper.extractInput()` also does not read `DELETE` bodies;
  consult [HTTP Helpers](../helper-http) before designing body handling.
- The adapter does not forward the incoming transport signal into the
  `Request` used for controller dispatch. Do not rely on client disconnects
  to cancel controller work.
- An unmatched route returns status `404` and a body such as
  `{ "error": "Route GET /missing not found" }`. This is not the standard
  controller error envelope.
- When a route or dispatch throws outside the controller's formatted
  response path, the Node integration returns `500` with the thrown error's
  message in an `error` field. Avoid exposing sensitive exception messages;
  handle expected failures explicitly and protect the deployment boundary.

## Stop the server

After startup, the registered HTTP server exposes `dispose()`:

```ts
// app is the application returned by build().
await app.getServices().httpServer.dispose()
```

The Node integration closes its listener and clears its server reference.
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
