---
title: "What Is Xeno.JS? A Different Way to Structure TypeScript Applications"
description: "Xeno.JS is a TypeScript application framework for making use cases, dependencies, lifetimes, pipelines, and application boundaries explicit—without replacing your HTTP framework."
slug: "what-is-xeno-js"
date: "2026-09-28"
author: "Xeno"
type: "article"
category: "Architecture"
tags: "TypeScript, Node.js, Application Architecture, Dependency Injection, CQRS, Clean Architecture, Hexagonal,rchitecture, DDD, HTTP, Software Architecture"
keywords: "TypeScript application architecture, Node.js application architecture, HTTP framework architecture, TypeScript dependency injection, CQRS TypeScript, clean architecture TypeScript, transport independent application, application layer TypeScript, Fastify architecture, Express architecture, Hono architecture"
canonical: "https://www.xeno-js.it/blog/what-is-xeno-js"
og_title: "What Is Xeno.JS? A Different Way to Structure TypeScript Applications"
og_description: "Discover Xeno.JS, a TypeScript application framework designed to make application architecture, dependencies, lifetimes, and use cases explicit."
og_type: "article"
robots: "index,follow"
pubDate: 2026-09-28
---

# Your TypeScript Application Is Growing. Where Does the Logic Go?

A new TypeScript application usually starts with a simple structure:

```text
Controller
    ↓
Service
    ↓
Repository
```

It works.

The controller receives the request.

The service does the work.

The repository talks to the database.

For a small application, this can be perfectly reasonable.

Then the application grows.

And eventually you have to answer a less obvious question:

> **Where does an application use case actually live?**

---

## 1. The easy beginning

Imagine a simple user API.

You start with something like:

```typescript
class UserService {
  constructor(
    private readonly users: UserRepository,
  ) {}

  async createUser(email: string) {
    const user = User.create(email)

    await this.users.save(user)

    return user
  }
}
```

Your controller calls the service:

```typescript
app.post('/users', async (request, reply) => {
  const user = await userService.createUser(
    request.body.email,
  )

  return reply.status(201).send(user)
})
```

The structure is easy to understand.

```text
HTTP request
     ↓
Controller
     ↓
UserService
     ↓
UserRepository
     ↓
Database
```

There is very little architecture to think about.

And that's a good thing.

The problem usually doesn't appear at the beginning.

It appears when the application starts accumulating behavior.

---

## 2. What happens as the application grows

A `UserService` that initially contained one operation can gradually become responsible for everything related to users:

```typescript
class UserService {
  createUser()
  updateUser()
  deleteUser()
  inviteUser()
  activateUser()
  suspendUser()
  changePassword()
  resetPassword()
  changeEmail()
}
```

The class is still called a service.

But what does "service" actually mean?

More importantly, where is each application action defined?

Soon individual methods start accumulating different responsibilities:

```text
createUser
    ├── validation
    ├── authorization
    ├── business rules
    ├── repository access
    ├── transaction
    ├── notification
    └── audit
```

Then another method needs a slightly different combination:

```text
suspendUser
    ├── authorization
    ├── business rules
    ├── repository access
    ├── audit
    └── notification
```

And another:

```text
changeEmail
    ├── validation
    ├── authorization
    ├── repository access
    ├── external API
    └── notification
```

The problem isn't that the service has too many methods.

The deeper problem is that **the application has no explicit place for its use cases**.

---

# 3. The real problem

Consider the application conceptually:

```text
CreateUser
SuspendUser
ChangeEmail
ResetPassword
...
```

These are not HTTP concepts.

They are application actions.

But in a traditional structure they can end up hidden inside:

```text
Controller
    ↓
Generic Service
    ↓
Repository
```

The transport becomes the visible entry point to the application.

And the service becomes a generic container for everything that happens after the request arrives.

This creates an architectural ambiguity:

> Is `UserService.createUser()` a service method, or is it the application's `CreateUser` use case?

The code may work either way.

But the distinction becomes important as the application grows.

---

# 4. Give use cases a home

Instead of organizing application behavior primarily around technical services, you can organize it around application actions.

For example:

```text
Application
├── CreateUser
├── SuspendUser
├── ChangeEmail
└── ResetPassword
```

Now the application has an explicit boundary.

Conceptually:

```text
Presentation
    ↓
Application
    ↓
Domain
    ↓
Infrastructure
```

The controller is no longer where the application logic lives.

It translates an external request into an application operation.

The application operation owns the use case.

The domain owns business rules.

Infrastructure provides technical capabilities.

The distinction is small in code.

It becomes significant in a larger system.

---

# 5. How Xeno approaches it

This is one of the problems Xeno.JS is designed around.

Xeno models application execution around requests, handlers, and an explicit composition root.

For example, the current Xeno Core API exposes `BaseHandler` as an application handler abstraction:

```typescript
export abstract class BaseHandler<
  TRequest extends IRequest<TResponse>,
  TResponse,
> implements IHandler<TRequest, TResponse> {
  public async handle(
    request: TRequest,
    signal: AbortSignal,
  ): Promise<ResultType<TResponse>> {
    AppError.throwIfAborted(
      signal,
      this.constructor.name,
    )

    return await this.executeAsync(request)
  }

  protected abstract executeAsync(
    request: TRequest,
    signal?: AbortSignal,
  ): Promise<ResultType<TResponse>>
}
```

The important part here is not the base class itself.

It is the boundary.

An application operation can have its own handler rather than being just another method on a large technical service.

The composition root then makes the application's dependencies explicit.

For example, the Xeno README currently shows registrations such as:

```typescript
const app = new AppBuilder()
  .addServices((services) => {
    services.addScoped(
      'USER_REPOSITORY',
      (container) => {
        return new UserRepository(
          container.resolve('USER_DATA_SOURCE'),
        )
      },
    )

    services.addScoped(
      'FIND_USER_HANDLER',
      (container) => {
        return new FindUserHandler(
          container.resolve('USER_REPOSITORY'),
        )
      },
    )
  })

await app.build()
```

The important change is what this code makes visible.

The application now has an explicit composition:

```text
FindUserHandler
       ↓
UserRepository
       ↓
UserDataSource
```

Instead of discovering that dependency chain indirectly by following a large service class, the composition root describes it directly.

---

# 6. Why this matters

Once application actions have an explicit boundary, the transport no longer has to define where the application lives.

For example:

```text
HTTP
  ↓
Application
  ↓
FindUser
```

The same application operation can conceptually be entered through another transport:

```text
CLI
  ↓
Application
  ↓
FindUser
```

Or:

```text
Worker
  ↓
Application
  ↓
FindUser
```

The point isn't that every application needs multiple transports.

The point is that the use case is no longer inherently an HTTP concept.

This is why Xeno describes its application architecture as transport-independent. The current Core README explicitly places HTTP, CLI, workers, and Lambda-style entry points above the application layer rather than inside it.

That gives the application a boundary of its own:

```text
        Transport
            ↓
      Application
            ↓
         Domain
            ↓
     Infrastructure
```

And that boundary is the actual problem Xeno is trying to make explicit.

---

# 7. Try it

If your TypeScript application is still small, you may not need this distinction yet.

But if your services are becoming collections of unrelated application actions, it may be worth asking:

> **Do my use cases have a place of their own?**

That's the problem Xeno.JS is built to address.

Xeno Core provides the application composition and execution building blocks.

You can explore the implementation and the current API in the repository:

**Xeno.JS Core**

https://github.com/xeno-js/xeno-js

And start from the documentation:

**Xeno.JS**

https://www.xeno-js.it/

The goal isn't to add another layer because architecture is fashionable.

It's to make an existing concept visible:

> **Your application has use cases. Give them a boundary.**
