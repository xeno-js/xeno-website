---
title: "Generate Application Components"
description: "Generate and register features, commands, queries, handlers, schemas, and Vue composables with the Xeno.JS CLI."
canonical: "https://www.xeno-js.it/docs/cli/generate-cqrs"
updatedAt: "2026-11-25"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "cli"
category: "application-generation"
topics: "Xeno.JS CLI, Features, CQRS, Commands, Queries, Handlers, Vue Composables"
keywords: "Xeno.JS CLI, feature generator, command generator, query generator, handler, registry"
sidebar:
  group: "CLI"
  order: 3
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "CLI"
    url: "https://www.xeno-js.it/docs/cli"
  - name: "Generate Application Components"
    url: "https://www.xeno-js.it/docs/cli/generate-cqrs"
related:
  next:
    - "/docs/cli/generate-http"
prerequisites:
  - "/docs/cli/new-project"
relatedTopics:
  - "/docs/fundamentals/xeno-registry"
  - "/docs/fundamentals/dependency-injection"
faqs:
  - question: "Do commands and queries require a feature?"
    answer: "Yes. Pass --feature with the feature name. The CLI offers to create the feature if it does not exist."
  - question: "Does generating a command create an HTTP controller?"
    answer: "No. Use the separate interactive HTTP generator in a Core project with an HTTP target."
  - question: "What does a generated handler return?"
    answer: "It returns a NOT_IMPLEMENTED failure with status 501 until you implement the handler."
  - question: "Can I change CLI-managed sections?"
    answer: "The CLI checks managed sections before updating them and stops when a section is missing or modified."
answerSummary: "Generate a feature, then generate commands or queries within it. The CLI registers the generated application components."
directAnswer:
  question: "How do I generate a command or query?"
  answer: "From a CLI-created project root, run xeno-js g command or query with a name and --feature followed by the feature name."
keyFacts:
  - "Feature modules and handlers are registered automatically."
  - "Commands and queries require --feature."
  - "Generated handlers return NOT_IMPLEMENTED until implemented."
  - "Zod schemas are generated only when Zod was selected during scaffolding."
  - "Vue operations include a composable."
  - "HTTP controllers and routes are generated separately."
---

## Introduction

The CLI organizes generated commands and queries inside feature modules. It
creates the application files and updates the project's registry and service
registrations.

Run these commands from the root of a project created by the current CLI.

---

## Create a Feature

```bash
xeno-js g feature Products
```

The CLI creates `src/features/products/products.module.ts`, then registers the
module in the Core composition root (`src/bootstrap.ts`) or the Vue composition
root (`src/main.ts`).

---

## Generate a Command or Query

```bash
xeno-js g command CreateProduct --feature Products
xeno-js g query GetProducts --feature Products
```

The full command name, `generate`, also works in place of `g`. If the feature
does not exist, the CLI asks whether to create it. Declining stops generation.

`--feature` is required. Names must start with a letter and may contain
letters, digits, hyphens, and underscores. The CLI normalizes names for files,
classes, and service tokens. Handler tokens must be unique across the project.

The project type is detected from `xeno.json`. You can pass `--core` or `--vue`
to check that the project matches the intended target. A mismatch stops
generation. Custom output paths, including `--output` and `-o`, are not
supported.

---

## Generated Application Files

For the examples above, a Core project contains:

```text
src/
├── bootstrap.ts
├── registry.ts
└── features/
    └── products/
        ├── products.module.ts
        ├── application/
        │   ├── commands/
        │   │   └── create-product.command.ts
        │   ├── queries/
        │   │   └── get-products.query.ts
        │   └── handlers/
        │       ├── create-product.handler.ts
        │       └── get-products.handler.ts
        └── infrastructure/
            └── schemas/                  # When Zod is enabled
                ├── create-product.schema.ts
                └── get-products.schema.ts
```

The CLI registers each handler as scoped in the feature module and adds its
typed entry to `src/registry.ts`. When Zod is enabled, it also registers the
generated schema in the composition root.

An operation does **not** generate an entity, database table, HTTP controller,
or route. See [Generate HTTP Routes](./generate-http) to expose a Core
operation.

---

## Complete the Use Case

Generated commands and queries contain an empty payload interface and use
`void` as the result type. Handlers return a `NOT_IMPLEMENTED` failure with
status `501`.

To implement an operation:

1. Define the payload and result types required by the use case.
2. Implement the handler and register its application-specific dependencies.
3. If Zod was enabled, update the schema to match the payload. The generated
   schema initially accepts an empty, strict object.
4. Update affected registry, controller, or composable types when changing the
   result type. Editing types inside managed sections will prevent subsequent
   CLI updates to those sections.
5. Test the behavior and any authorization or validation rules.

Generated queries bypass caching by default. Configure their query options
deliberately if the application needs caching.

---

## Vue Composables

Vue projects generate the same application request and handler structure, plus
`presentation/composables/use-<operation>.ts`. The composable exposes
`loading`, `error`, and `execute`, and resolves the mediator through
`ServicesUtils.useApp()`.

`execute` accepts an optional abort signal. The generated composable does not
create or cancel an `AbortController` for you.

---

## Managed Sections

The CLI tracks generated features, operations, and hashes of managed sections
in `xeno.json`. Managed sections are marked with comments such as
`// xeno:module-services:start` and `// xeno:module-services:end`.

Do not edit the contents or remove the markers of a managed section. The CLI
stops if a section it needs is missing or changed. You can edit application
code outside those sections.

The generator also rejects existing generated files and duplicate handler
tokens. A project lock prevents concurrent CLI generation. If a stale
`.xeno-cli.lock` remains after an interrupted run, remove it only after
confirming that no generator is running.

---

## Where to Go Next

See [Generate HTTP Routes](./generate-http) to add a controller and route for
an existing Core command or query.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
