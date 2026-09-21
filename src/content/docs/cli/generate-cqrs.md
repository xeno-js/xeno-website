---
title: 'CQRS Generators: Domain Automation'
description: 'Discover how the Xeno CLI generate command eliminates architectural boilerplate by creating type-safe Controllers, Handlers, Commands, Queries, and Composables.'
keywords: 'CQRS Generator, Xeno CLI, scaffolding handler, vue composable generator, code generation, Clean Architecture, Command Query Responsibility Segregation'
author: 'Xeno'
sidebar:
  order: 3
---

## CQRS Generators: Domain Automation

The rigorous implementation of **Command Query Responsibility Segregation (CQRS)** and **Clean Architecture** patterns dictates a strict separation of concerns. In a manual workflow, this translates into creating numerous files (Intent, Handler, Controller/Composable, Models, Validation Schemas) and correctly wiring them into the Inversion of Control container.

The Xeno CLI eliminates this friction ("Blank Page Syndrome") through the `GenerateCommandQuery` command, automating the scaffolding of entire operational flows in a *type-safe* manner that is deterministically compliant with the framework's standards.

---

## The `generate` Command

The command can be invoked using the extended syntax or its alias `g`:

```bash
xeno-js g <command | query> <DomainName> [--core | --vue] [-o <path>]

```

* **`<type>`**: Determines the architectural semantics of the operation (`command` for state mutations, `query` for idempotent reads).

* **`<Name>`**: The name of the domain or operation in *PascalCase* or *camelCase* format (e.g., `CreateUser`). The generator internally normalizes the name to create token prefixes (e.g., `CREATE_USER`).

* **`--core` / `--vue`**: Sets the target environment to produce specific files for the Node.js backend or the Vue.js frontend.

* **`-o <path>`**: (Optional) Specifies a custom destination folder within `src/`.

---

## Backend Scaffolding (`--core`)

When invoked with the `--core` flag (or as default), the `CqrsGenerator` dynamically analyzes the project's `package.json` file to detect the presence of optional dependencies such as `zod` and `drizzle-orm`.

Based on the requested type and detected dependencies, the engine generates an isolated package of files for the single feature:

1. **`*.command.ts` / `*.query.ts`**: The intent class. For queries, the `GenerateQueryCoreGenerator` natively injects default parameters for caching (`cacheKey`, `ttl`, `bypassCache`).

2. **`*.handler.ts`**: The pure Application Handler. It extends `BaseHandler`, sets up the constructor to receive `IFactory<void, UserContext>`, and prepares the `executeAsync` method with the `AbortSignal` parameter for cooperative cancellation.

3. **`*.controller.ts`**: The Presentation Controller. It extends `BaseController`, receives the Mediator, and automatically routes the request, mapping the `ResultType` monad to a `ResponseDto`.

4. **`*.entity.ts`** *(Command Only)*: A Domain entity draft extended from the `Entity<Props>` class.

5. **`*.schema-db.ts`** *(Conditional)*: If `drizzle-orm` is present, it scaffolds a PostgreSQL or SQLite table with inferred types for DTOs (`$inferSelect`, `$inferInsert`).

6. **`*.schema-zod.ts`** *(Conditional)*: If `zod` is present, it scaffolds the payload validation schema.

7. **`*.module.ts`**: The configuration module that registers the Controller and Handler in the IoC container using the correct lifecycles (`addScoped`) and normalized tokens (e.g., `CREATE_USER_COMMAND_HANDLER`).

---

## Frontend Scaffolding (`--vue`)

When invoked with the `--vue` flag, the `CqrsVueGenerator` scaffolds a pattern designed to decouple Vue.js reactivity from pure business logic:

1. **`*.command.ts` / `*.query.ts`**: The intent class that will be passed to the `ClientMediator`.

2. **`*.handler.ts`**: The pure Application Handler in TypeScript, agnostic to Vue, where the developer will inject Remote Data Sources.

3. **`use-*.composable.ts`**: The reactive proxy (Presentation Layer). This file automatically generates `ref`s for `loading` and `error`, manages the initialization and lifecycle of the `AbortController` (invoking `.abort()` in `onUnmounted`), and resolves the Mediator and Handler in a type-safe way via `ServicesUtils.useApp()`.

4. **`*.model.ts`**: TypeScript interfaces defining the Request and Response payload contracts.

---

## Architectural Warnings and Token Mapping

 The Xeno CLI does more than just generate dead code; it acts as an active architectural guide. Within the generated files (e.g., `*.handler.ts`, `*.module.ts`, or Composables), the CLI injects comment blocks highlighted as `⚠️ WARNING: ACTION REQUIRED ⚠️`.

These comments explicitly instruct the developer on the steps necessary to integrate the new component into the project's *XenoRegistry*, providing the exact snippets to paste into the `src/registry.ts` file and the `.addServices()` block of the `AppBuilder`. This ensures that adding new features never compromises the system's dependency graph or type-safety.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
