---
title: "Xeno CLI Project Structure for Core and Vue"
description: "See the files the Xeno CLI generates for Core and Vue projects, including entry points, registries, database integrations, managed features, and configuration."
canonical: "https://www.xeno-js.it/docs/getting_started/project-structure"
publishedAt: "2026-09-30"
updatedAt: "2026-11-25"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "getting-started"
category: "project-structure"
topics: "Xeno CLI, Core project structure, Vue project structure, TypeScript scaffolding"
keywords: "Xeno CLI, project structure, Core scaffold, Vue scaffold, TypeScript generator, xeno.json"
sidebar:
  group: "Getting Started"
  order: 3
breadcrumbs:

- name: "Docs"
  url: "https://www.xeno-js.it/docs"
- name: "Getting Started"
  url: "https://www.xeno-js.it/docs/getting_started"
- name: "Project Structure"
  url: "https://www.xeno-js.it/docs/getting_started/project-structure"
related:
  next:

  - "CLI"
prerequisites:
  - "Create a Project"
relatedTopics:
  - "Architecture Overview"
faqs:
- question: "What does the Xeno CLI generate for a Core project?"
  answer: "A Core scaffold includes src/bootstrap.ts, src/registry.ts, a target-specific entry point, root configuration, and xeno.json. Selected integrations add files such as Drizzle configuration and schema."
- question: "What does the Xeno CLI generate for a Vue project?"
  answer: "A Vue scaffold includes src/App.vue, src/main.ts, src/registry.ts, Vite configuration, root configuration, and xeno.json. Router and Tailwind files appear when selected."
- question: "Does the CLI create feature folders by default?"
  answer: "No. A new project starts with application composition and configuration. Run xeno-js g feature <Name> to add a feature module, then generate commands or queries inside it."
answerSummary: "The Xeno CLI creates Core and Vue projects from selected options. It generates composition files first; feature folders are added with managed generators."
directAnswer:
  question: "What does the Xeno CLI generate for a new project?"
  answer: "A Core project includes src/bootstrap.ts, src/registry.ts, a target-specific entry point, and root configuration. A Vue project includes src/App.vue, src/main.ts, and src/registry.ts. Selected integrations add their files, and xeno.json records scaffold metadata."
keyFacts:
- "Core projects include src/bootstrap.ts and src/registry.ts, plus an entry point for the selected target."
- "Vue projects include src/App.vue, src/main.ts, and src/registry.ts."
- "The CLI writes xeno.json to track scaffold metadata and managed sections."
- "Database selection adds drizzle.config.ts and src/schema.ts."
- "The CLI creates .env and .env.example."
- "The CLI runs npm install after generation."

---

## Introduction

The Xeno CLI creates a Core backend or Vue frontend project from the options you select. It writes the application entry points, registry, configuration, and `xeno.json` scaffold metadata. Optional integrations add their own dependencies and files.

Create a Core project:

```bash
npx @xeno-js/cli new my-app --core
```

Create a Vue project:

```bash
npx @xeno-js/cli new my-app --vue
```

The CLI asks which target and integrations to use, generates the matching files, then optionally initializes Git and runs `npm install`.

## A new Core project

With the Console target and no database selected, the generated project contains:

```text
my-app/
├── src/
│   ├── bootstrap.ts
│   ├── main.ts
│   └── registry.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── readme
├── tsconfig.json
└── xeno.json
```

The Node.js and Fastify targets also generate `src/routes.ts` and an HTTP entry point in `src/main.ts`. The Vercel target adds `src/routes.ts`, `api/index.ts`, `public/index.html`, and `vercel.json`; it uses `api/index.ts` as its serverless entry point.

Selecting a database adds `drizzle.config.ts` and `src/schema.ts`. The CLI supports PostgreSQL and SQLite through Drizzle.

The Core scaffold does not create feature or domain folders by default. Generate them when the application needs its first feature.

## `src/bootstrap.ts`

`bootstrap.ts` is the Core project's composition root. The CLI generates an `XenoAppBuilder`, configures the selected integrations, and exports `XenoApp` for the application entry point.

The builder starts with request context, cache, logging, pipeline, and service registration. The selected options add database, authentication, HTTP server, routes, HTTP client, validation, and observability configuration.

Generated sections use `xeno` markers. Later CLI generators update those sections and `xeno.json`; keep generated sections intact so managed generation can verify and update them.

For example, the default Console scaffold builds this chain:

```typescript
const builder = new XenoAppBuilder<MyRegistry>()
  .addContext()
  .addCache(undefined)
  .addLogger([withConsoleLogger(() => {})])
  .addPipeline()
  .addServices((services) => {
    // xeno:services:start
    // xeno:services:end
  });
```

## `src/registry.ts`

`registry.ts` defines the application's Xeno registry type. The Core registry extends `XenoRegistry`; database options add the database context and transaction types.

Add application tokens in the registry as the project grows. The CLI inserts generated handler and controller types into managed registry sections.

```ts
export interface MyRegistry extends XenoRegistry {
  // xeno:registry:start
  // xeno:registry:end
}
```

## `src/main.ts`

The generated entry point depends on the selected Core target:

- Console loads `dotenv`, builds the Xeno application, and passes command-line arguments to `main`.
- Node.js and Fastify start the HTTP server and read the port from configuration.
- Vercel uses `api/index.ts` to pass requests to the Xeno Vercel adapter.

Application-specific behavior belongs in the features and handlers you add to the scaffold.

## Database files

Selecting a database during project creation adds Drizzle configuration and a starting schema.

### PostgreSQL

The PostgreSQL option generates:

```text
drizzle.config.ts
src/schema.ts
```

It adds the PostgreSQL adapter and reads the connection string from `DATABASE_URL`.

### SQLite

The SQLite option also generates:

```text
drizzle.config.ts
src/schema.ts
```

It uses the SQLite Drizzle primitives and reads the database URL from `SQLITE_DATABASE_URL`.

Both generated schemas are starting points. Replace or extend them with the tables required by the application.

## Environment files

The CLI creates `.env` and `.env.example`. Their variables depend on the selected integrations.

For example, PostgreSQL uses `DATABASE_URL`, SQLite uses `SQLITE_DATABASE_URL`, Redis adds its connection settings, and Supabase adds authentication settings. The generated `.gitignore` excludes `.env`; keep secrets there and use `.env.example` to document required variables.

## `package.json`

The Core `package.json` includes `@xeno-js/core`, `@xeno-js/shared`, `dotenv`, TypeScript, and `tsx`. The CLI adds packages for selected features, such as a Drizzle adapter, Axios, Cockatiel, Pino, Sentry, Redis, Supabase, or Zod.

The generated scripts include `start` and `build`. Database options add Drizzle generation, push, and migration scripts. The Vercel target uses `vercel dev` for local startup.

## What happens after generation

The CLI creates the selected files, writes `xeno.json` to record scaffold metadata, and then optionally initializes a Git repository. It runs `npm install` after generation and prints the project path and next steps.

## Adding application code

Start by generating a feature, then generate commands or queries inside it:

```bash
xeno-js g feature Users
xeno-js g command CreateUser --feature Users
xeno-js g query FindUser --feature Users
```

Run these commands from the project root. The CLI reads `xeno.json` to detect the project type. Use `--core` or `--vue` only to verify that target.

The feature generator creates `src/features/users/users.module.ts`. A command or query adds its request and handler under that feature's `application` folder, then registers them in the module and `src/registry.ts`. When Zod is enabled, the generator also creates a payload schema. Vue projects receive a composable for each operation.

Generated handlers return `NOT_IMPLEMENTED` until you add the application behavior. If you enabled Zod, update the generated payload schema when you change the payload type.

For Node.js, Fastify, or Vercel Core projects, run `xeno-js g http` to expose an existing operation as a route. Routes are protected by default. Creating a public route requires explicit confirmation.

## A Vue project

The Vue scaffold includes Vue, Vite, the Xeno Vue integration, a Pinia-backed request context, and its own registry. A basic project starts with:

```text
my-app/
├── src/
│   ├── App.vue
│   ├── main.ts
│   └── registry.ts
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── xeno.json
```

Selecting Vue Router adds `src/router/index.ts` and `src/views/HomeView.vue`. Selecting Tailwind adds `src/assets/style.css` and the Vite integration. Axios, Cockatiel, Supabase, Sentry, and Zod are optional.

The Vue entry point configures the selected integrations, provides the Xeno service container to the app, and mounts `App.vue`. Use the same feature and operation commands from the project root to add application code.

## CLI documentation

For CLI commands, project options, and generators, see:

[CLI Overview](../cli/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
