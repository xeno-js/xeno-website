---
title: 'Client Mediator: The Frontend CQRS Nervous System'
description: 'Discover how the Xeno.JS Vue ClientMediator orchestrates Command and Query pipelines, decoupling UI components from API logic and cross-cutting concerns.'
keywords: 'ClientMediator, Frontend CQRS, Vue Mediator pattern, CompositePipeline, Frontend Architecture, Xeno.JS Vue'
author: 'Xeno'
sidebar:
  order: 1
---

## Client Mediator: The Frontend CQRS Nervous System

In traditional Vue applications, components often communicate directly with API clients (like Axios) or state management stores (like Pinia). This creates a tangled web of dependencies, making the UI responsible for error handling, performance tracking, and payload validation.

Xeno.JS Vue fundamentally alters this dynamic by introducing the **`ClientMediator`**. Acting as the central nervous system of your frontend architecture, it intercepts every business operation, ensuring that cross-cutting concerns are executed predictably before any network request is made.

---

## What is the ClientMediator?

The `ClientMediator` is a lightweight, frontend-optimized implementation of the classic Mediator pattern, strictly tailored for **Command Query Responsibility Segregation (CQRS)**. 

It implements the `IClientMediator` interface, exposing two distinct communication channels:
1.  **`send(command, action)`**: Used for state-mutating operations (Commands).
2.  **`query(query, action)`**: Used for idempotent, read-only data fetching (Queries).

Both channels guarantee that operations return a deterministic, functional `ResultType<T>` monad, completely eliminating unhandled Promise rejections and nested `try/catch` blocks from your Vue components.

---

## The Architectural Shift: The `action` Delegate

If you are familiar with the backend `@xeno-js/core` Mediator, you will notice a strategic architectural adaptation in the frontend implementation. 

In the backend, invoking `mediator.send(command)` automatically resolves the corresponding handler via the Dependency Injection container. In the browser, however, the `ClientMediator` requires a second parameter: an `action` callback (`Delegate<TResult>`).

```typescript
// Signature from IClientMediator
send<TResult>(data: ICommand<TResult>, action: Delegate<TResult>): Promise<ResultType<TResult>>;

```

---

### Why this design?

This asymmetry is designed to maximize flexibility and leverage Vue's Composition API correctly. By accepting a callback closure, the `ClientMediator` allows your Vue Composable to resolve the specific Handler from the `XenoVueRegistry`, while still passing the execution into the mediator's pipeline safety net:

```typescript
// Inside a Vue Composable
const { mediator, CREATE_USER_HANDLER: handler } = ServicesUtils.useApp();
const command = new CreateUserCommand(payload);

// The mediator wraps the handler's execution in its safety pipelines
const result = await mediator.send(command, async () => {
    return await handler.handle(command);
});

```

---

## Orchestrating the Pipeline Stack

The true power of the `ClientMediator` lies in what happens *before* and *after* the `action` callback is executed.

During the `XenoAppBuilder` bootstrapping phase, the framework registers distinct `IPipeline` arrays for Commands and Queries. These arrays are wrapped into a **`CompositePipeline`**.

The `CompositePipeline` acts as a Russian doll, chaining behaviors in a specific sequence using an asynchronous recursion loop. When `mediator.send()` is invoked, the request travels through this stack:

1. **ExceptionPipeline**: Wraps the entire execution in a safe boundary, catching any unhandled runtime crashes and converting them into a standardized `AppError` failure monad.


2. **LoggingPipeline**: Emits structured telemetry (e.g., `Handling COMMAND CREATE_USER`) before execution, and logs the outcome (success or failure) afterward.


3. **PerformancePipeline**: Starts a high-resolution timer. If the entire operation takes longer than the configured threshold (e.g., 500ms), it emits a performance warning.


4. **ValidationPipeline**: Intercepts the payload and evaluates it against registered Zod schemas. If the payload is invalid, it short-circuits the pipeline—preventing useless network calls—and returns a `VALIDATION_FAILED` error immediately.


5. **QueryCachingPipeline (Queries Only)**: Checks if an identical query was recently executed. If a valid cache entry exists, it short-circuits the network layer entirely, returning the data from memory in zero milliseconds.


6. **The Action Delegate**: Finally, if all pipelines clear, the mediator invokes the actual business logic (your Handler or API call).

---

## Why Use the Client Mediator?

By channeling all UI intents through the `ClientMediator`, you achieve absolute architectural decoupling:

* **Fail-Fast Security**: Bad data never hits your API. Validation stops it at the mediator level.


* **Global Error Uniformity**: Network drops, 500 Server Errors, and validation failures are all returned as identical, predictable `Result` monads to the UI.
* **Clean Components**: Your Vue `.vue` files no longer contain logging logic, caching maps, or timer implementations. They simply dispatch intents and react to the resulting state.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
