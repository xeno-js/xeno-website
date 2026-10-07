---
pubDate: 2026-10-07
author: "Xeno.JS"
title: "Where Should Request Validation Live in a TypeScript Application?"
description: "Where should request validation live in a TypeScript application? Explore why validation belongs at the application boundary, how pipelines separate validation from HTTP concerns, and how Xeno.JS implements this approach."
keywords: "TypeScript validation, request validation, application architecture, validation pipeline, CQRS, mediator pattern, application layer, HTTP validation, Zod, Xeno.JS"
tags:
  - TypeScript
  - Architecture
  - Validation
  - CQRS
  - Application Layer
  - Xeno.JS
faqs:
  - question: "Where should request validation live in a TypeScript application?"
    answer: "Request validation can live at the application boundary, where commands are validated before reaching their handlers. This keeps the validation logic independent from a specific transport such as HTTP."
  - question: "Should validation return HTTP 400 directly?"
    answer: "No. The application layer should not need to know about HTTP status codes. An application-level error can be interpreted by the presentation layer and mapped to HTTP 400, 422, or another appropriate response."
  - question: "Can Zod be used in an application validation pipeline?"
    answer: "Yes. Zod can be used as the validation mechanism inside an application pipeline, while the pipeline itself remains independent from the HTTP transport."
  - question: "What is the role of a validation pipeline?"
    answer: "A validation pipeline runs validation before the command handler and keeps cross-cutting application concerns separate from the business logic of the handler."
  - question: "How does Xeno.JS handle application validation?"
    answer: "Xeno.JS supports application pipelines where validation can be composed before command execution, allowing validation to remain in the application layer rather than being tied to a specific HTTP framework."
canonical: "https://www.xeno-js.it/blog/where-should-request-validation-live-in-a-typescript-application/"
---

## Where Should Validation Live in a TypeScript Application?

Validation looks simple.

A client sends a request. We validate the input. If something is wrong, we return an error.

But as an application grows, an architectural question becomes important:

> **Where should validation actually happen?**

Should validation belong to the HTTP layer?

Should controllers validate requests?

Should the application layer validate commands?

And what happens when the same application logic is executed without HTTP?

This article explores the problem first, then the architectural solution, and finally how Xeno.JS implements that solution natively.

---

## The problem

Imagine an e-commerce API with an endpoint:

```http
POST /orders
```

The request body is:

```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2
    }
  ]
}
```

At the HTTP boundary, we obviously need to validate the input.

For example:

* `productId` must be present
* `quantity` must be an integer
* `quantity` must be greater than zero
* the items collection cannot be empty

A straightforward implementation is:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Validate request
     │
     ▼
Application
```

This works.

The problem appears when the application becomes larger.

---

## Validation becomes tied to the transport

Consider the same `CreateOrder` use case.

Today it is called through HTTP:

```text
HTTP
  ↓
CreateOrder
```

Tomorrow it might also be called by:

```text
CLI
  ↓
CreateOrder
```

or:

```text
Queue
  ↓
CreateOrder
```

or:

```text
Worker
  ↓
CreateOrder
```

If validation exists only inside the HTTP controller, we now have a problem.

We could end up with:

```text
HTTP Controller
    └── HTTP validation

CLI
    └── CLI validation

Queue Consumer
    └── Queue validation

Worker
    └── Worker validation
```

The same application command now has multiple validation implementations.

That creates duplication and, more importantly, creates the possibility that different entry points validate the same operation differently.

---

## The key question

Instead of asking:

> "Is this HTTP request valid?"

we can ask:

> **"Is this application command valid?"**

This is a much more useful question.

The application does not really care where the command came from.

It only cares about the command it is about to execute.

For example:

```ts
CreateOrderCommand
```

represents an application operation.

The command could come from HTTP, a queue, a CLI, or another adapter.

The validation rules for that command should remain the same.

---

## Moving validation closer to the application

A better architecture is:

```text
HTTP
 │
 ▼
Controller
 │
 ▼
CreateOrderCommand
 │
 ▼
Application
 │
 ├── Validation
 │
 └── Handler
```

Now validation belongs to the execution of the application command rather than to one particular transport.

The same command can therefore be validated regardless of how it entered the system.

```text
HTTP ─────┐
          │
CLI ──────┤
          │
Queue ────┼──► CreateOrderCommand
          │          │
Worker ───┘          ▼
                Validation
                     │
                     ▼
                  Handler
```

This gives us one validation path instead of one validation implementation per transport.

---

## But what about HTTP 400?

This is where another architectural distinction becomes important.

Validation can determine that a command is invalid.

But validation does not necessarily need to know what an HTTP `400 Bad Request` is.

These are two different concerns.

The application can produce a semantic application error:

```text
Invalid command
```

while the HTTP adapter decides how to represent that error:

```text
Invalid command
      ↓
HTTP adapter
      ↓
400 Bad Request
```

This means the application does not need to depend on HTTP.

---

## Application errors vs HTTP errors

Consider an application error such as:

```ts
AppError.badRequest(...)
```

The name describes the semantic category of the error.

It does not have to mean:

```http
400 Bad Request
```

inside the application itself.

The HTTP layer can interpret it as:

```text
AppError.badRequest
        ↓
HTTP 400
```

But another transport could interpret the same application result differently.

For example:

```text
Application
     │
     ▼
AppError.badRequest
     │
     ├── HTTP      → 400
     │
     ├── GraphQL   → GraphQL error
     │
     ├── CLI       → process error
     │
     └── Queue     → message handling result
```

The important architectural principle is:

> **The application describes what happened. The transport decides how to represent it.**

---

## Validation is not the same as business logic

There is another important distinction.

Validation answers questions such as:

```text
Is quantity an integer?
Is quantity greater than zero?
Is productId present?
```

These are input validation rules.

The domain may then answer different questions:

```text
Can this order be cancelled?
Is this product available?
Can this state transition happen?
```

Those are business rules.

A useful flow is therefore:

```text
Command
   │
   ▼
Validation
   │
   ▼
Authorization
   │
   ▼
Handler
   │
   ▼
Domain
   │
   ▼
Infrastructure
```

Validation checks whether the input can enter the application.

The domain determines whether the requested operation is valid according to the business.

Keeping these concerns separate prevents validation from becoming a second domain layer.

---

## A reusable pipeline

Once validation is treated as application behavior, it becomes possible to compose it with other application-level behaviors.

For example:

```text
Command
   │
   ▼
Validation
   │
   ▼
Authorization
   │
   ▼
Idempotency
   │
   ▼
Logging
   │
   ▼
Handler
```

This becomes especially useful for commands such as:

```text
CreateOrder
CancelOrder
UpdateProduct
ChangeOrderStatus
```

Each command can pass through the same application execution model.

The transport no longer needs to orchestrate every cross-cutting concern.

---

## The solution

The general solution is therefore:

1. Represent the operation as an application command.
2. Validate the command inside the application execution pipeline.
3. Return an application-level error when validation fails.
4. Keep HTTP-specific status codes outside the application.
5. Let each transport map application errors to its own representation.

Conceptually:

```text
             PRESENTATION
                  │
                  ▼
              HTTP Request
                  │
                  ▼
               Controller
                  │
                  ▼
          CreateOrderCommand
                  │
                  ▼
             APPLICATION
                  │
                  ▼
             Validation
                  │
          ┌───────┴───────┐
          │               │
        valid           invalid
          │               │
          ▼               ▼
       Handler       AppError.badRequest
          │
          ▼
        Domain
```

And on the way back:

```text
AppError
   │
   ▼
HTTP Adapter
   │
   ▼
HTTP Response
```

This is the architectural boundary we want.

---

## How Xeno.JS solves this

This is where Xeno.JS comes in.

Xeno.JS already provides an application execution model based around a mediator and pipelines.

Instead of building the validation infrastructure yourself, validation can be implemented as a pipeline behavior.

The conceptual flow becomes:

```text
HTTP
 │
 ▼
Controller
 │
 ▼
Command
 │
 ▼
Xeno Mediator
 │
 ▼
Validation Pipeline
 │
 ▼
Handler
```

The validation pipeline can use Zod or a custom validation implementation.

For example:

```ts
const result = schema.safeParse(command);

if (!result.success) {
  return AppError.badRequest(
    "Invalid order",
    result.error.issues
  );
}
```

The important part is not Zod itself.

The important part is that the validation happens **inside the application execution pipeline**.

---

## Xeno does not need to know about HTTP

The validation pipeline does not need to return:

```text
HTTP 400
```

It returns an application-level result:

```ts
AppError.badRequest(...)
```

The HTTP adapter can then decide:

```text
AppError.badRequest
       ↓
400 Bad Request
```

This keeps the application independent from the HTTP transport.

The same command can therefore be executed from another entry point without moving the validation logic.

---

## The resulting architecture

With Xeno, the architecture can look like this:

```text
                         HTTP
                          │
                          ▼
                     Controller
                          │
                          ▼
                  CreateOrderCommand
                          │
                          ▼
                  ┌───────────────┐
                  │ Xeno Mediator │
                  └───────┬───────┘
                          │
                          ▼
                 Validation Pipeline
                          │
                    ┌─────┴─────┐
                    │           │
                  valid       invalid
                    │           │
                    ▼           ▼
              Authorization   AppError
                    │
                    ▼
                Idempotency
                    │
                    ▼
                  Handler
                    │
                    ▼
                  Domain
                    │
                    ▼
              Infrastructure
                    │
                    ▼
                PostgreSQL
```

The important boundary is:

```text
Application
    │
    │ semantic result
    ▼
Presentation
    │
    │ transport representation
    ▼
HTTP
```

---

## Why this becomes more powerful as the application grows

At first, this distinction might seem unnecessary.

If an application only has:

```text
HTTP → Controller → Service
```

then validating inside the controller is simple.

But as the application grows:

```text
HTTP
CLI
Workers
Queues
Cron jobs
WebSockets
```

the value of a transport-independent application layer increases.

All of these entry points can converge on the same application commands:

```text
HTTP ─────┐
CLI ──────┤
Queue ────┼──► Application Command
Worker ───┤           │
Cron ─────┘           ▼
                  Xeno Pipeline
                       │
                  Validation
                       │
                  Authorization
                       │
                    Handler
```

The application behavior remains consistent.

The adapters remain responsible for their own transport semantics.

---

## The bigger architectural idea

The interesting part is not really validation.

Validation is simply a concrete example of a larger principle:

> **Application behavior should not depend on the transport that triggered it.**

The same principle can be applied to:

* authorization
* idempotency
* logging
* request context
* caching
* retries
* transaction handling
* other cross-cutting behaviors

The application pipeline becomes the place where these behaviors can be composed around the execution of a use case.

The transport remains responsible for translating external protocols into application commands and translating application results back into protocol-specific responses.

---

## The takeaway

The question is not:

> "Should I return HTTP 400 from my validation?"

The better question is:

> **"Where should the decision that a command is invalid live?"**

If that decision belongs to the application, validation can live in the application pipeline.

Then:

```text
Application:
"This command is invalid."

Transport:
"I will represent that as HTTP 400."
```

Xeno.JS provides this application-level pipeline model natively, allowing validation to be composed into command execution without coupling the application layer to HTTP.

That is the real benefit.

**You are not moving HTTP validation somewhere else.**

You are moving the **application's validation responsibility to the application**, while leaving HTTP representation where it belongs: at the HTTP boundary.
## Learn more

If you want to go deeper into how Xeno.JS handles application pipelines and validation, you can find the relevant documentation here:

[Application Docs](https://www.xeno-js.it/docs/application/overview)

The documentation covers how pipelines fit into the application layer and how validation can be composed with the rest of the application flow.

## Want to try Xeno.JS?

Xeno.JS is currently in the adoption phase, and I'm looking for developers who are willing to try it in real projects.

It doesn't have to be a production system or a large application.

A side project, a personal API, an internal experiment, or a small application is more than enough.

If you're interested in trying Xeno.JS, I'd be happy to help you along the way — **support is completely free**.

The goal at this stage isn't just to get more users. It's to learn from people actually using Xeno.JS:

* what feels useful;
* what feels confusing;
* where the documentation is missing something;
* what integrations are needed;
* and what should be improved before adopting it in larger projects.

So if you're looking for a TypeScript architecture that keeps the application layer independent from the transport framework, give [Xeno.JS](https://www.xeno-js.it) a try.

And if something doesn't work the way you expect, let me know.

**I'd rather have a few developers actually trying Xeno.JS and giving me honest feedback.**
