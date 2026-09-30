---
title: "First Steps"
description: "Install Xeno.JS and prepare your TypeScript environment for application development."
canonical: "https://www.xeno-js.it/docs/getting_started/installation"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
author:
name: "Xeno.JS Team"
url: "https://www.xeno-js.it"
type: "documentation"
section: "getting-started"
category: "installation"
topics: "Xeno.JS Installation, TypeScript Installation, Xeno CLI, Node.js, npm"
keywords: "install Xeno.JS, Xeno.JS installation, Xeno CLI installation, TypeScript framework installation, Node.js Xeno.JS"
sidebar:
  group: "Getting Started"
  order: 1
breadcrumbs:

- name: "Docs"
  url: "https://www.xeno-js.it/docs"
- name: "Getting Started"
  url: "https://www.xeno-js.it/docs/getting_started"
- name: "Installation"
  url: "https://www.xeno-js.it/docs/getting_started/installation"
related:
  next:
  - "/docs/getting-started/create-project"
prerequisites: []
relatedTopics:
  - "/docs/getting-started/create-project"
  - "/docs/getting-started/project-structure"
faqs:
- question: "What do I need to install Xeno.JS?"
  answer: "You need Node.js and a package manager such as npm. A TypeScript project is created or scaffolded in the next step."
- question: "How do I install the Xeno.JS CLI?"
  answer: "Install @xeno-js/cli globally with npm, or use it directly with npx."
- question: "Do I need the Xeno.JS CLI?"
  answer: "No. The CLI is the recommended way to scaffold a project, but Xeno.JS packages can also be installed directly."
- question: "Can I install Xeno.JS manually?"
  answer: "Yes. The core package can be installed directly with npm using @xeno-js/core."
answerSummary: "Install Node.js, then use the Xeno.JS CLI to scaffold a project or install @xeno-js/core directly when setting up an application manually."
directAnswer:
  question: "How do I install Xeno.JS?"
  answer: "Install Node.js, then install @xeno-js/cli globally or use it through npx. For manual setup, install @xeno-js/core in your TypeScript project."
keyFacts:
- "Xeno.JS runs in a Node.js environment."
- "The official CLI package is @xeno-js/cli."
- "The core application architecture package is @xeno-js/core."
- "The CLI can be executed through npx without a global installation."

---

## Installation

Before creating a Xeno.JS project, make sure you have:

* [Node.js](https://nodejs.org/) installed;
* npm or another compatible package manager.

## Install the Xeno.JS CLI

The recommended way to start a new project is through the official CLI.

You can install it globally:

```bash
npm install -g @xeno-js/cli
```

Or use it directly with `npx`:

```bash
npx @xeno-js/cli
```

The CLI is used to create and scaffold Xeno.JS applications.

Continue with [Create Project](./create-project).

## Manual Installation

If you are setting up an existing TypeScript application instead, install the core package directly:

```bash
npm install @xeno-js/core
```

For a TypeScript Node.js application, install TypeScript and Node.js types as development dependencies when they are not already present:

```bash
npm install --save-dev typescript @types/node
```

The core package can then be configured and bootstrapped through `AppBuilder`.

## Optional Dependencies

Xeno.JS keeps several integrations optional.

For example, if you enable HTTP Core, you install its required dependencies separately:

```bash
npm install axios cockatiel
```

Other integrations may have their own dependencies. Install them only when the corresponding feature is enabled.

---

## CLI

See more on [CLI](../cli/overview)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
