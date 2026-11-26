---
title: HTTP Client and Resilience
description: Configure outbound HTTP clients in Xeno.JS with the Axios plugin or a custom core plugin, resolve named clients, and apply resilience policies.
keywords:
  - Xeno.JS
  - HTTP client
  - Axios
  - withAxiosHttp
  - withCustomHttp
  - resilience
  - retry
  - circuit breaker
  - TypeScript
tags:
  - http
  - client
  - axios
  - resilience
  - dependency-injection
faqs:
  - question: How do I add an Axios HTTP client in Xeno.JS?
    answer: Pass withAxiosHttp() to XenoAppBuilder.addHttpClient() and add a named client configuration in the setup callback.
  - question: How do I resolve a named HTTP client?
    answer: Resolve httpClientFactory from the service container or application services and call get() with the configured client name. The factory returns an IRemoteDataSource.
  - question: Can I use an HTTP client other than Axios?
    answer: Yes. Use withCustomHttp() or the addHttpClient() setup callback and provide a factory for an IHttpClient implementation.
  - question: How do I enable retry and circuit breaker policies for Axios?
    answer: Add a resilience object to the Axios client configuration. The plugin builds Cockatiel retry, circuit breaker, and bulkhead policies for that client.
  - question: Does enabling Axios resilience retry every failure?
    answer: No. Retry depends on the error classification and HTTP method. The current Axios integration does not classify HTTP 500 or typical wrapped network timeouts as transient.
  - question: Does the core HTTP plugin provide a default retry policy?
    answer: No. Without a resilience factory, the core module uses a pass-through service that checks for an already-aborted signal.
---

## Outbound HTTP clients in Xeno.JS

An HTTP client sends requests to another service, such as a backend-for-frontend (BFF) or a third-party API. Xeno.JS registers clients by name and exposes them through `httpClientFactory`. Each registered client is wrapped in a remote data source and an optional resilience service.

Use `withAxiosHttp()` when Axios is the transport. Use `withCustomHttp()` when the application supplies its own `IHttpClient` implementation. Both paths use the same factory and return an `IRemoteDataSource` to application code.

```text
Application service or handler
  → httpClientFactory.get(name)
  → IRemoteDataSource
  → resilience service
  → IHttpClient transport
  → remote API
```

Outbound clients are independent of the inbound [HTTP server](/docs/http/server). Adding a client does not register routes or start a server.

## Install the Axios integration

Install the core framework and Axios plugin:

```bash
npm install @xeno-js/core @xeno-js/axios
```

The Axios package depends on Axios and Cockatiel. Install those packages directly only if your application imports them itself.

## Register an Axios client

Pass `withAxiosHttp()` to `addHttpClient()`. Its setup callback receives an array of client definitions and the Xeno.JS configuration service. The following example uses a configuration key named `API_BASE_URL`; make that key available to the configuration service before building the application.

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { withAxiosHttp } from '@xeno-js/axios'

const builder = new XenoAppBuilder()

builder.addHttpClient(withAxiosHttp((clients, config) => {
  clients.push({
    name: 'bffClient',
    axios: {
      baseURL: config.getOrThrow('API_BASE_URL'),
      timeout: 30_000,
      withCredentials: false,
    },
  })
}))

const application = await builder.build()
```

The `axios` object accepts Axios creation options. The plugin defaults include a 10-second timeout, JSON `Content-Type` and `Accept` headers, and `http://localhost:3000` as the base URL. Set the base URL and timeout explicitly for your environment. The transport's per-request configuration sets its own status validation; do not rely on an Axios `validateStatus` default to change how HTTP errors are handled.

### Register multiple named clients

Configure all clients in one `addHttpClient()` call:

```ts
builder.addHttpClient(withAxiosHttp((clients, config) => {
  const baseURL = config.getOrThrow('API_BASE_URL')

  clients.push({
    name: 'publicApi',
    axios: { baseURL, timeout: 10_000 },
  })

  clients.push({
    name: 'sessionApi',
    axios: {
      baseURL,
      timeout: 30_000,
      withCredentials: true,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'x-xsrf-token',
    },
  })
}))
```

Names must be unique. If a name is omitted, the registration uses `default`; resolve it with `get('default')`. A second `addHttpClient()` call on the same builder is ignored, so put every client for that builder in the first call.

The XSRF example reads the named cookie from `document.cookie` and copies its value to the named header when a browser document is available. The cookie must be readable by JavaScript. `withCredentials` and this header alone do not configure server CORS or CSRF protection. Verify the server's cookie, origin and CSRF policies separately.

## Resolve and use a named client

`httpClientFactory.get(name)` returns `IRemoteDataSource`, not an Axios instance. Resolve it in an application service factory, as in the following framework-independent example:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import type { IRemoteDataSource, XenoRegistry } from '@xeno-js/core'
import { withAxiosHttp } from '@xeno-js/axios'

interface Product {
  id: string
  name: string
}

class ProductsService {
  constructor(private readonly api: IRemoteDataSource) {}

  list(signal?: AbortSignal) {
    return this.api.get<Product[]>('/products', {
      query: { page: 1 },
      signal,
    })
  }
}

type AppRegistry = XenoRegistry<unknown, unknown, {
  productsService: ProductsService
}>

const application = await new XenoAppBuilder<AppRegistry>()
  .addHttpClient(withAxiosHttp((clients, config) => {
    clients.push({
      name: 'bffClient',
      axios: {
        baseURL: config.getOrThrow('API_BASE_URL'),
        timeout: 30_000,
      },
    })
  }))
  .addServices((services) => {
    services.addScoped('productsService', (scope) => {
      return new ProductsService(scope.resolve('httpClientFactory').get('bffClient'))
    })
  })
  .build()

await application.runInScope(async (services) => {
  const result = await services.productsService.list()
  console.log(result.getValueOrThrow())
})
```

This registration pattern also works in Vue: build the Xeno application during bootstrap, provide it to Vue, and resolve services through the integration. The client registration and factory are core APIs; they do not depend on Vue.

For code that does not need its own scoped service, resolve the singleton factory from the built application:

```ts
const api = application.getServices().httpClientFactory.get('bffClient')
const result = await api.get<Product[]>('/products', { signal: undefined })
```

Use `get`, `post`, `put`, `patch`, or `delete`. The public `IRemoteDataSource` contract requires a request-options argument, including a `signal` property, even when its value is `undefined`:

```ts
const result = await api.post<Product, { name: string }>(
  '/products',
  { name: 'Keyboard' },
  { signal: undefined, timeoutMs: 5_000 },
)
```

Options include `query`, `headers`, `timeoutMs`, `responseType`, and `signal`. Pass an `AbortSignal` from the caller when cancellation is needed. The current Axios adapter forwards headers, query, signal and timeout, but does not forward the per-request `responseType`; do not rely on that option with this adapter.

On success, the remote data source wraps the transport's response body in `Result.ok()`. It does not expose the HTTP status or headers through that result. `getValueOrThrow()` can return `undefined`, so validate the returned payload before using it. Type parameters describe the expected payload but do not validate it at runtime.

Transport and resilience errors reject the promise; the remote data source does not convert them into `Result.fail()`. Handle or propagate errors at the application boundary:

```ts
try {
  const result = await api.get<Product[]>('/products', { signal: undefined })
  const products = result.getValueOrThrow()
  if (products === undefined) throw new Error('Products response is missing')
  console.log(products)
} catch (error) {
  // Report the failure at the application boundary.
  throw error
}
```

The Axios adapter throws an `AppError` for responses with status `400` or greater. For responses below `400`, it sets `ok` according to the 2xx range; the remote data source currently returns the body without checking that flag. In particular, do not assume an unhandled 3xx response becomes a failed result.

## Configure Axios resilience

Add a `resilience` object to a client definition to enable its Cockatiel policies:

```ts
builder.addHttpClient(withAxiosHttp((clients, config) => {
  clients.push({
    name: 'catalogApi',
    axios: {
      baseURL: config.getOrThrow('CATALOG_API_URL'),
      timeout: 5_000,
    },
    resilience: {
      retry: {
        maxAttempts: 3,
        backoff: { initialDelay: 100, maxDelay: 1_000 },
      },
      circuitBreaker: {
        threshold: 5,
        halfOpenAfter: 30_000,
      },
      bulkhead: {
        limit: 10,
        queue: 10,
      },
    },
  })
}))
```

The plugin creates a separate policy for each client entry. It wraps the remote call with a bulkhead, circuit breaker and retry policy:

- The bulkhead limits concurrent operations and queues additional operations up to the configured capacity.
- The circuit breaker tracks consecutive classified transient failures. After the threshold, it opens and later allows a half-open attempt.
- Retry uses exponential backoff for classified transient errors when the original request method is eligible.

When `resilience` is present, omitted values default to `retry.maxAttempts: 3`, backoff delays of `100` and `1000` ms, a circuit breaker threshold of `5` with `halfOpenAfter: 30000` ms, and a bulkhead limit and queue of `10` each. In the bundled Cockatiel policy, `maxAttempts: 3` permits up to three retries after the initial call, for four calls total. Account for retry delays and request timeouts in your total latency budget. Without `resilience`, the core module uses a pass-through service.

Axios `timeout` limits an individual request. The resilience configuration shown above does not add a separate overall timeout for all attempts.

### Which failures are retried?

The current factory classifies status `408`, statuses greater than `500`, and certain network error codes as transient. It retries only when it can also find an eligible method in the error: `GET`, `PUT`, `DELETE`, `HEAD`, or `OPTIONS`. The remote data source exposes the first three of those methods; it does not expose `HEAD` or `OPTIONS`.

The Axios adapter wraps failures in `AppError` before the policy sees them. For HTTP responses such as `503`, the status and original Axios request configuration are available to the policy. HTTP `500` and `429` do not satisfy the current transient-status check. Network errors without a response, including typical Axios timeouts, are wrapped with status `500` and a framework error code, so their original network code alone does not make them eligible for retry or circuit-breaker counting.

`POST` and `PATCH` are not retried by this policy. Even for a method considered idempotent, verify the remote endpoint's behavior and use a stable idempotency key where needed. Test your actual failure cases against the installed package before depending on automatic recovery.

## Register a custom HTTP client with the core plugin

The core plugin is transport-agnostic. It does not create a Fetch, Axios, or Node client for you. Implement `IHttpClient` in your application, then provide a factory:

```ts
import { withCustomHttp, XenoAppBuilder } from '@xeno-js/core'
import { MyHttpClient } from './my-http-client.js'

const application = await new XenoAppBuilder()
  .addHttpClient(withCustomHttp({
    clients: [
      {
        name: 'inventoryApi',
        client: () => new MyHttpClient('https://api.example.com'),
      },
    ],
  }))
  .build()

const inventory = application.getServices().httpClientFactory.get('inventoryApi')
```

`MyHttpClient` is an application-defined class implementing `IHttpClient`. Implement `get`, `post`, `put`, `patch`, and `delete`; each returns a promise of `HttpResponse<T>`, containing `status`, `ok`, normalized `headers`, and `data`. Honor the request options supported by your adapter, including the abort signal. Decide how non-success HTTP responses become errors: the remote data source forwards the body without inspecting `ok`, and resilience policies observe thrown errors, not an `ok: false` response.

`clients` may be a single entry or an array. A client factory receives the service container, allowing it to resolve registered dependencies. The module invokes client and resilience factories while configuring the singleton HTTP factory; avoid capturing request-scoped services in these long-lived objects.

### Add custom resilience

Provide a factory returning an application implementation of `IServiceResilience`:

```ts
import { withCustomHttp, XenoAppBuilder } from '@xeno-js/core'
import { MyHttpClient } from './my-http-client.js'
import { MyResilienceService } from './my-resilience-service.js'

const application = await new XenoAppBuilder()
  .addHttpClient(withCustomHttp({
    clients: {
      name: 'inventoryApi',
      client: () => new MyHttpClient('https://api.example.com'),
      resilience: () => new MyResilienceService(),
    },
  }))
  .build()
```

`MyResilienceService` must implement `execute<T>(operation: () => Promise<T>, signal: AbortSignal | undefined): Promise<T>`. It owns its retry, timeout and cancellation behavior. Propagate the final error rather than returning a success-shaped fallback. A policy applies to the operation supplied by the remote data source, so design retries with the endpoint's idempotency and error shapes in mind.

Omit `resilience` for the core pass-through implementation. It checks for an already-aborted signal before calling the operation but adds no retry, circuit breaker, bulkhead, or timeout.

### Use the core setup callback

`addHttpClient()` also accepts a setup callback instead of an explicit `withCustomHttp()` plugin:

```ts
import { XenoAppBuilder } from '@xeno-js/core'
import { MyHttpClient } from './my-http-client.js'

const application = await new XenoAppBuilder()
  .addHttpClient((options, config) => {
    const baseURL = config.getOrThrow('INVENTORY_API_URL')
    options.clients = {
      name: 'inventoryApi',
      client: () => new MyHttpClient(baseURL),
    }
  })
  .build()
```

This callback delegates to the same core plugin. Choose it or `withCustomHttp()` for the builder's single HTTP-client registration.

## Context and interceptors

The Axios plugin attempts to read the current request context. When values are available, its request interceptor adds tracing and request headers such as `x-correlation-id`, `x-span-id`, and `x-request-id`. It can also add `x-forwarded-for` and messaging headers from that context. These headers are not guaranteed when no context is available; review which context information may be sent to each destination.

Axios request and response interceptors can be configured through `axios.interceptors`. They run alongside the plugin's context and XSRF interceptor. Avoid logging credentials or sensitive response bodies.

## Common problems

### The named client cannot be resolved

Check that `addHttpClient()` ran before `build()`, and that the name passed to `get()` matches the registered name. An unknown name throws an error. When no name is configured, use `get('default')`.

### A second client is missing

The builder only processes the first `addHttpClient()` call. Register all entries in its client array instead of chaining multiple calls. Duplicate names in the same factory cause registration to fail.

### A failed request did not return `Result.fail()`

The remote data source wraps successful response data in a result, but rejected transport and resilience operations propagate as exceptions. Catch them at an appropriate boundary or let the caller handle them.

### A timeout or HTTP 500 was not retried

The Axios adapter and policy classify errors as described above. A timeout without an HTTP response is normally wrapped as an `AppError` with status `500`, which the current retry predicate does not classify as transient. HTTP `500` and `429` are also excluded. Use a tested custom transport and resilience implementation when your application requires a different policy.

### A browser request is missing a CSRF header

Check the cookie and header names, whether the cookie is readable by JavaScript, and whether the request runs in a browser. Configure the server's CORS and CSRF rules independently.

### Request-scoped context is missing

The Axios interceptor adds context headers only when the context accessor returns values. Run the operation within an appropriate application or request context when tracing is required.

## Related documentation

- [App Builder](/docs/fundamentals/app-builder)
- [Context Scopes](/docs/fundamentals/context-scopes)
- [Service Resolution](/docs/dependency-injection/resolution)
- [HTTP Server](/docs/http/server)
- [Data Sources](/docs/data/datasources/datasource)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
