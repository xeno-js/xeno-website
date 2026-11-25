---
title: "Create a Project"
description: "Create a Xeno.JS Core or Vue project with the interactive CLI."
canonical: "https://www.xeno-js.it/docs/cli/new-project"
updatedAt: "2026-11-25"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "cli"
category: "project-scaffolding"
topics: "Xeno.JS CLI, Core Scaffolding, Vue Scaffolding, Project Targets"
keywords: "Xeno.JS CLI, new project, Core, Vue, Console, Node, Fastify, Vercel"
sidebar:
  group: "CLI"
  order: 2
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "CLI"
    url: "https://www.xeno-js.it/docs/cli"
  - name: "Create a Project"
    url: "https://www.xeno-js.it/docs/cli/new-project"
related:
  next:
    - "/docs/cli/generate-cqrs"
prerequisites:
  - "/docs/cli/overview"
relatedTopics:
  - "/docs/fundamentals/app-builder"
faqs:
  - question: "What project type is selected by default?"
    answer: "The new command creates a Core project by default. Use --vue to create a Vue project."
  - question: "How do I select a Console project?"
    answer: "Select Console in the interactive Core target prompt. The CLI does not use a --console flag."
  - question: "Is Pinia optional in the Vue scaffold?"
    answer: "Pinia is included in the Vue scaffold for the generated request context."
answerSummary: "The new command creates a Core or Vue project through interactive prompts and installs its dependencies."
directAnswer:
  question: "How do I create a Xeno.JS project?"
  answer: "Run xeno-js new with a project name and optionally --core or --vue, then select the project options in the prompts."
keyFacts:
  - "The default project type is Core."
  - "Core supports Console, Node, Fastify, and Vercel targets."
  - "Vue includes Pinia for request context."
  - "The CLI installs dependencies and optionally initializes Git."
---

## Introduction

The `new` command creates a project, writes its composition and configuration
files, and installs the selected dependencies.

```bash
xeno-js new <project-name> [--core | --vue]
```

Core is the default. Use `--vue` for a Vue project:

```bash
xeno-js new my-api --core
xeno-js new my-web --vue
```

The CLI asks which integrations to configure and whether to initialize Git.
It then runs `npm install` in the project directory.

---

## Core Projects

During Core setup, select one target:

| Target | Generated entry point |
| --- | --- |
| Console | `src/main.ts`, passing command-line arguments to `main(...args)` |
| Node | `src/main.ts` and the Node HTTP adapter |
| Fastify | `src/main.ts` and the Fastify HTTP adapter |
| Vercel | `api/index.ts`, `vercel.json`, and `public/index.html` |

Select Console in the prompt rather than passing `--console`. HTTP route
generation is available only for Node, Fastify, and Vercel.

Core options include PostgreSQL, SQLite or no database, Axios, Cockatiel,
Supabase Auth, Redis, Pino, Sentry, and Zod. Configure the environment variables
for the integrations you select before starting the application.

For Vercel, the generated configuration rewrites `/api/*` to the serverless
entry point and other paths to the static index page.

Start a Console, Node, or Fastify project with:

```bash
cd my-api
npm run start
```

For a Vercel project, `npm run start` runs `vercel dev`.

---

## Vue Projects

The Vue scaffold includes Pinia for request context. Its optional integrations
include Vue Router, Tailwind CSS, Axios, Cockatiel, Supabase Auth, Sentry, and
Zod.

```bash
cd my-web
npm run dev
```

The scaffold currently declares `@xeno-js/core` with a `^5.1.0` version range.
The published `5.1.0` package imports Node's `async_hooks`, which Vite cannot
bundle for browsers. A Vue production build therefore requires a compatible
Core release; check the resolved version when diagnosing the build.

---

## Generated Project Metadata

The scaffold creates `xeno.json` alongside the application files. The CLI uses
it to detect the project type, selected integrations, and managed sections
when generating features and operations.

Keep this file and the managed section markers intact. The generator is
designed for projects created by the current CLI, not arbitrary existing
projects.

---

## Where to Go Next

See [Generate Application Components](./generate-cqrs) to add your first feature,
command, or query.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
