---
title: 'New Project Scaffolding: Architectural Initialization'
description: 'Discover how the Xeno.JS CLI NewProjectCommand performs interactive scaffolding using CoreScaffoldStrategy and VueScaffoldStrategy.'
keywords: 'NewProjectCommand, Scaffolding, CLI Architecture, CoreScaffoldStrategy, VueScaffoldStrategy, CommandRunner, Xeno.JS CLI'
author: 'Xeno'
sidebar:
  order: 2
---

## New Project Scaffolding: Architectural Initialization

Creating enterprise infrastructure usually requires days of configuration to align linters, bundlers, IoC containers, and system modules. The `NewProjectCommand` in the Xeno.JS CLI automates this process in seconds, ensuring that every new ecosystem (backend or frontend) is born already adhering to the framework's strict architectural standards.

---

## The `new` Command

The entry point for creating a project is the `new` command:

```bash
xeno-js new <project-name> [--core | --vue]

```

If the target flag is not specified, the CLI applies `--core` as the default behavior, orienting the setup toward a Node.js architecture.

---

## The Strategy Pattern for Scaffolding

Under the hood, the CLI architecture uses the Strategy pattern (`IScaffoldStrategy<T>`) to decouple prompting logic and generator selection based on the target environment. The command evaluates the flags passed by the user and instantiates the correct strategy:

### 1. `CoreScaffoldStrategy` (Backend)

Optimized for creating Node.js microservices or monoliths based on `@xeno-js/core`.
This strategy launches interactive prompts to configure critical infrastructural layers:

* **Database**: Choose between Drizzle PostgreSQL, SQLite, or None.

* **Networking & Resilience**: Installation of Axios and Cockatiel.

* **Cache & Concurrency**: Inclusion of Redis for distributed idempotency.

* **Security & Validation**: Configuration of Supabase Auth and Zod.

* **Observability**: Choice of logging drivers between Pino (structured JSON) and Sentry (APM).

### 2. `VueScaffoldStrategy` (Frontend)

Optimized for Single Page Applications based on `@xeno-js/vue`.
Includes specific prompts for the browser ecosystem:

* **State & Routing**: Integration of Pinia and Vue Router.

* **Styling**: Automatic setup of Tailwind CSS v4.

* **Resilience & Observability**: Configuration of Cockatiel, Axios, and Sentry Vue SDK.

* **Security**: Supabase Auth (for the client) and Zod for browser-side payload validation.

---

## Dynamic Generator Orchestration

Once the responses are collected through prompts, the strategy selects and queues only the necessary **Generators** (`IGenerator<T>`). This "pay-for-what-you-use" approach prevents the generation of useless files or configurations:

* If the user selects a database, the `DrizzleGenerator` (or `DrizzleSqlLiteGenerator`) is queued, which immediately scaffolds `drizzle.config.ts` and a base `schema.ts` file.

* If the target is Vue, the `ViteconfigGenerator` produces a `vite.config.ts`, automatically injecting the Tailwind CSS plugin if requested.

* Cross-cutting generators like the `EnvGenerator` (or `EnvVueGenerator`) dynamically compile the `.env` and `.env.example` files, populating them only with the keys of the selected libraries (e.g., `VITE_SENTRY_DSN` or `REDIS_HOST`).

* The `TsconfigGenerator` models the `tsconfig.json` by inserting the correct `moduleResolution` directive and ECMAScript target based on the environment.

The bootstrap engine (`Bootstrapper`) then cyclically executes the `generate()` method of each generator, physically writing the files to disk via `FileUtils`.

---

## Finalization: The Role of the `CommandRunner`

The final step of the `new` command ensures that the project is immediately operational. The CLI delegates system process execution to the `CommandRunner` service in a cross-platform manner (handling differences between Unix and Windows environments):

1. **Git Initialization**: If the user accepted in the prompt, it executes `git init` to prepare the repository for versioning.

2. **Dependency Installation**: Executes `npm install` within the new directory, resolving and downloading the packages defined by the `PackageJsonCoreGenerator` or `PackageJsonVueGenerator`.

The final result is a complete, typed architecture, wired for Dependency Injection, and ready to host the first domain Handlers.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
