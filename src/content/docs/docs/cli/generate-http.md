---
title: "Generate HTTP Routes"
description: "Expose a generated Core command or query through an HTTP controller and route."
canonical: "https://www.xeno-js.it/docs/cli/generate-http"
updatedAt: "2026-11-25"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "cli"
category: "http-generation"
topics: "Xeno.JS CLI, HTTP Routes, Controllers, Authorization"
keywords: "Xeno.JS CLI, HTTP generator, controller, route, authorization"
sidebar:
  group: "CLI"
  order: 4
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "CLI"
    url: "https://www.xeno-js.it/docs/cli"
  - name: "Generate HTTP Routes"
    url: "https://www.xeno-js.it/docs/cli/generate-http"
related:
  next:
    - "/docs/fundamentals/overview"
prerequisites:
  - "/docs/cli/generate-cqrs"
relatedTopics:
  - "/docs/fundamentals/context-scopes"
faqs:
  - question: "Which projects support HTTP generation?"
    answer: "Core projects created by the current CLI with the Node, Fastify, or Vercel target support HTTP generation."
  - question: "Are generated HTTP routes protected?"
    answer: "The interactive prompt defaults to protected. Creating a public route requires a separate confirmation."
  - question: "Can I generate a protected route without authentication?"
    answer: "No. The scaffold must have Supabase authentication configured to generate a protected route."
answerSummary: "Use the interactive HTTP generator to add a controller and route for an existing Core operation."
directAnswer:
  question: "How do I expose a generated command or query over HTTP?"
  answer: "Run xeno-js g http in a supported Core project and select the operation, method, path, and access policy."
keyFacts:
  - "HTTP generation is separate from application generation."
  - "Node, Fastify, and Vercel Core targets support HTTP generation."
  - "Protected routes require authentication configured in the scaffold."
  - "The generated authorization policy also applies to internal calls to the handler."
  - "Public routes require explicit confirmation."
---

## Introduction

HTTP generation adds a presentation layer to an existing command or query.
It is available in projects created by the current CLI with a Core Node,
Fastify, or Vercel target. Console and Vue projects do not support this command.

---

## Generate a Route

First generate the application operation:

```bash
xeno-js g feature Products
xeno-js g query GetProducts --feature Products
```

From the project root, start the interactive HTTP generator:

```bash
xeno-js g http
```

The prompts ask you to:

1. Select an operation that does not already have an HTTP controller.
2. Select `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`.
3. Enter a route path, for example `/api/products`.
4. Choose whether the route requires authentication.

The CLI rejects duplicate method and path pairs. Each generated operation can
have one generated HTTP controller.

---

## Generated Files and Registrations

For `GetProducts`, the CLI creates
`src/features/products/presentation/controllers/get-products.controller.ts`.
It also:

- registers the controller as transient in the feature module;
- adds the controller type to `src/registry.ts`;
- adds the route to `src/routes.ts`;
- adds an authorization policy when the route is protected.

The route extracts the request payload and calls the controller, which
dispatches the operation through the mediator. Implement the handler and
complete the payload and schema before relying on the endpoint. Until then,
the handler returns `NOT_IMPLEMENTED` with status `501`.

---

## Authentication and Public Routes

The authentication prompt defaults to **protected**. A protected route
requires Supabase authentication to have been selected during project
scaffolding; configure its environment variables before starting the project.

The generated policy requires a user ID on the handler intent. It also applies
when the same handler is called internally, not only through HTTP. Review and
extend the policy for the application's authorization requirements.

To create a public route, answer no to the authentication prompt and explicitly
confirm that the route is public. Do not expose an operation publicly unless
its behavior and data are intended for unauthenticated callers.

---

## Vercel Paths

For Vercel projects, the generated `vercel.json` sends `/api/*` requests to
`api/index.ts` and other paths to `public/index.html`. Choose an `/api` path
for generated endpoints that should reach the serverless handler.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
