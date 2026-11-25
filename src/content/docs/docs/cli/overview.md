---
title: "Xeno.JS CLI"
description: "Create Xeno.JS Core and Vue projects and generate features, commands, queries, and HTTP routes."
canonical: "https://www.xeno-js.it/docs/cli/overview"
updatedAt: "2026-11-25"
author:
  name: "Xeno.JS Team"
  url: "https://www.xeno-js.it"
type: "documentation"
section: "cli"
category: "tooling"
topics: "Xeno.JS CLI, Project Scaffolding, Features, CQRS, HTTP Routes"
keywords: "Xeno.JS CLI, project scaffolding, command generator, query generator, HTTP route generator"
sidebar:
  group: "CLI"
  order: 1
breadcrumbs:
  - name: "Docs"
    url: "https://www.xeno-js.it/docs"
  - name: "CLI"
    url: "https://www.xeno-js.it/docs/cli"
  - name: "Overview"
    url: "https://www.xeno-js.it/docs/cli/overview"
related:
  next:
    - "/docs/cli/new-project"
prerequisites: []
relatedTopics:
  - "/docs/fundamentals/overview"
  - "/docs/fundamentals/xeno-registry"
faqs:
  - question: "What does the Xeno.JS CLI generate?"
    answer: "The CLI creates Core and Vue projects, features, commands, queries, and HTTP routes for supported Core targets."
  - question: "Does the CLI implement application behavior?"
    answer: "No. Generated handlers return NOT_IMPLEMENTED until you implement the use case."
  - question: "Can the CLI generate code in any existing project?"
    answer: "The managed generators require a project created by the current CLI with valid xeno.json metadata and intact managed sections."
answerSummary: "The Xeno.JS CLI scaffolds Core and Vue projects and registers generated application components in CLI-managed sections."
directAnswer:
  question: "What is the Xeno.JS CLI?"
  answer: "The Xeno.JS CLI is a command-line tool for creating projects and generating registered features, CQRS operations, and HTTP routes."
keyFacts:
  - "Core is the default project type; Vue is selected with --vue."
  - "Core projects can target Console, Node, Fastify, or Vercel."
  - "Commands and queries belong to a feature and are registered automatically."
  - "HTTP generation is a separate interactive step for supported Core targets."
  - "Generated handlers and payload schemas require application-specific implementation."
---

## Introduction

The Xeno.JS CLI (`@xeno-js/cli`) creates projects and generates application
components using explicit composition.

The CLI creates the starting structure. Your application defines the business
behavior, payloads, dependencies, and access rules.

---

## Installation

Node.js 20 or later is required. Install the CLI globally:

```bash
npm install -g @xeno-js/cli
```

Or run it without a global installation:

```bash
npx @xeno-js/cli new my-app --core
```

The examples below use `xeno-js` from a global installation. With `npx`, replace
`xeno-js` with `npx @xeno-js/cli`. Use a CLI release that includes the managed
generators described here.

---

## Commands

| Command | Purpose |
| --- | --- |
| `xeno-js new <name> [--core \| --vue]` | Create a Core or Vue project. |
| `xeno-js g feature <Name>` | Create and register a feature module. |
| `xeno-js g command <Name> --feature <Feature>` | Generate and register a command and handler. |
| `xeno-js g query <Name> --feature <Feature>` | Generate and register a query and handler. |
| `xeno-js g http` | Interactively expose an operation over HTTP. |
| `xeno-js --help` | Show the CLI usage guide. |

`generate` is the full command name; `g` is its alias. Run generators from the
root of a project created by the current CLI. The project type is detected from
`xeno.json`; an optional `--core` or `--vue` flag verifies that type.

---

## How Generation Fits Together

```text
Project
  └── Feature module
       ├── Command or query
       ├── Handler
       ├── Optional Zod schema
       └── Presentation
            ├── Vue composable, for Vue projects
            └── HTTP controller and route, when explicitly generated
```

The CLI updates the registry and the relevant module and composition root.
HTTP exposure is a separate step, available for Core projects targeting Node,
Fastify, or Vercel.

Generated handlers return `NOT_IMPLEMENTED` until you implement them. When Zod
is enabled, update the generated schema alongside the payload type.

---

## Where to Go Next

1. [Create a Project](./new-project)
2. [Generate Application Components](./generate-cqrs)
3. [Generate HTTP Routes](./generate-http)
4. [Xeno Registry](../fundamentals/xeno-registry)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
