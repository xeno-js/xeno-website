---
title: 'Xeno.JS CLI: Enterprise Scaffolding Toolkit'
description: 'Official overview of @xeno-js/cli, the command-line tool for automating the architectural scaffolding of Xeno.JS projects.'
keywords: 'Xeno.JS CLI, scaffolding, DDD, CQRS, code generator, @xeno-js/cli, architectural automation'
author: 'Xeno'
sidebar:
  order: 1
---

## Xeno.JS CLI: Enterprise Scaffolding Toolkit

**Xeno.JS CLI** (`@xeno-js/cli`) is the official command-line interface designed to initialize, configure, and manage projects based on the Xeno.JS framework. Its primary goal is to automate infrastructural scaffolding to natively enforce **Domain-Driven Design (DDD)** and **Command Query Responsibility Segregation (CQRS)** patterns, eliminating boilerplate for both Node.js backend environments (`@xeno-js/core`) and frontend applications (`@xeno-js/vue`).

Through the CLI, the development team eliminates human error in Dependency Injection wiring and ensures that every new component respects the framework's strict architectural conventions.

---

## Installation

The CLI can be installed globally for quick access to generators in existing workspaces, or executed on-demand via `npx` to bootstrap new ecosystems:

```bash
# Global installation
npm install -g @xeno-js/cli

# On-demand execution to initialize a new project
npx xeno-js new my-xeno-app

```

---

## Main Commands Overview

The CLI acts as an executive "guardrail," channeling development through specific commands that manage the creation and extension of the architecture in a predictable manner.

* **`new <project-name> [--core | --vue]`**: Performs the interactive bootstrap of an entire architecture (backend or frontend), pre-configuring the environment (Git, variables, configuration files) and installing only the selected dependencies.

* **`generate <type> <Name> [--core | --vue]`** (Alias: `g`): Dynamically generates all files necessary for a CQRS operation (Command or Query). It instantly creates and wires Handlers, Models, Controllers (in the backend), reactive Composables (in the frontend), and schemas, updating the relevant IoC registries.

* **`--help` / `-h` / `--h`**: Shows the interactive quick start guide and the list of supported aliases directly in the terminal.

---

## Strategic and Architectural Advantages

Adopting `@xeno-js/cli` is not just a convenience (Developer Experience), but a true architectural governance choice that significantly reduces the *Time-to-First-Feature*:

* **Interactive Configuration (Pay-for-what-you-use):** Starts project creation through guided prompts that install and configure only the essential dependencies selected by the team (e.g., Zod, Supabase, Drizzle ORM, Pino, Sentry, Pinia, and Tailwind CSS), preventing bundle and `package.json` bloat.

* **CQRS Architectural Scaffolding:** With a single command, the CLI scaffolds the entire lifecycle of a business intent. In the backend, it generates Controllers, Handlers, Commands/Queries, and DB/Zod schemas; in the frontend, it generates files for the Presentation Layer (Composables) and the Application Layer (Handlers and Models).

* **Target Agnosticism:** Natively manages project structures for Backend (pure TypeScript) and Frontend (Vue.js), automatically setting up critical files (`tsconfig.json`, `vite.config.ts`, `.env`) and configuring infrastructure bootstrappers.

* **CI/CD & Git Ready:** Instantly initializes Git repositories and triggers NPM installations automatically, delivering a "ready-to-code" ecosystem to the team from the very first run.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
