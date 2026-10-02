---
title: "Contributing to Xeno.JS"
description: "Learn how to contribute to Xeno.JS through code, documentation, bug reports, feature proposals, tests, examples, and improvements to the ecosystem."
slug: "contributing-guide"
canonical: "https://www.xeno-js.it/docs/contributing-guide"
publishedAt: "2026-09-30"
updatedAt: "2026-09-30"
author:
name: "Xeno.JS Team"
url: "https://www.xeno-js.it"
type: "documentation"
section: "community"
category: "contributing"
topics: "Xeno.JS Contributing, Open Source Contribution, TypeScript Contribution, GitHub Contribution, Pull Requests, Bug Reports, Documentation Contribution"
keywords: "contribute Xeno.JS, Xeno.JS contributing guide, Xeno.JS contribution, contribute TypeScript framework, Xeno.JS GitHub contribution, Xeno.JS pull request, Xeno.JS issue, open source TypeScript contribution"
sidebar:
  group: "Community"
  order: 2
breadcrumbs:
- name: "Docs"
  url: "https://www.xeno-js.it/docs"
- name: "Contributing"
  url: "https://www.xeno-js.it/docs/contributing-guide"
related:
  next: []
prerequisites: []
relatedTopics:
  - "/docs/support-us"
faqs:
- question: "How can I contribute to Xeno.JS?"
  answer: "You can contribute code, tests, documentation, examples, bug reports, feature proposals, and improvements to the developer experience."
- question: "Do I need to contribute code?"
  answer: "No. Documentation, examples, issue reports, testing, feedback, and other improvements are also valuable contributions."
- question: "Where should I report a bug?"
  answer: "Bug reports should be opened in the GitHub repository responsible for the affected package."
- question: "Should I discuss a feature before implementing it?"
  answer: "For larger or architectural changes, opening an issue or discussing the proposed direction before implementation helps align the change with the project's architecture."
- question: "Can I contribute documentation?"
  answer: "Yes. Documentation improvements, examples, corrections, and clarifications are welcome contributions."
answerSummary: "Xeno.JS welcomes contributions to its code, documentation, tests, examples, tooling, and ecosystem. Small fixes and larger changes should follow the project's architecture and contribution workflow."
directAnswer:
  question: "How can I contribute to Xeno.JS?"
  answer: "You can contribute by reporting bugs, improving documentation, adding tests and examples, proposing features, or submitting code changes through GitHub pull requests."
keyFacts:
- "Xeno.JS is an open-source project."
- "Contributions include code, tests, documentation, examples, bug reports, and feature proposals."
- "Each contribution should preserve the architectural boundaries of the affected package."
- "Larger architectural changes should be discussed before implementation."
- "Pull requests should focus on a clear and reviewable change."
---

## Introduction

Thank you for your interest in contributing to Xeno.JS.

Xeno.JS is an open-source project, and contributions from the community help improve the framework, its documentation, tooling, and ecosystem.

There are many ways to contribute.

You can fix a bug, improve a sentence, add a test, write an example, propose a feature, or work on a larger architectural improvement.

---

## Ways to Contribute

### 🐛 Report a Bug

If you find a problem in Xeno.JS, open an issue in the GitHub repository for the affected package.

A useful bug report should include:

* package name;
* package version;
* Node.js version, when relevant;
* TypeScript version, when relevant;
* operating system, when relevant;
* minimal reproduction;
* expected behavior;
* actual behavior;
* relevant error messages or stack traces.

A small reproducible example is often more useful than a long description.

---

## 💡 Propose a Feature

Feature proposals are welcome.

Before implementing a substantial feature, especially one that affects the architecture or public APIs, open an issue and describe:

* the problem;
* the proposed solution;
* why the existing APIs are insufficient;
* possible alternatives;
* how the change fits the Xeno.JS architecture.

This gives the project an opportunity to discuss the design before implementation begins.

Small, isolated improvements may not require extensive discussion.

---

## 📝 Improve Documentation

Documentation is part of the project.

You can contribute by:

* correcting errors;
* clarifying explanations;
* adding examples;
* documenting missing behavior;
* improving navigation;
* fixing broken links;
* improving getting-started instructions;
* adding guides for common use cases.

A documentation contribution does not need to change any source code.

---

## 🧪 Add or Improve Tests

Tests are an important part of maintaining the framework.

You can contribute by:

* adding tests for new behavior;
* reproducing reported bugs with tests;
* improving existing test coverage;
* testing edge cases;
* improving test readability.

When fixing a bug, adding a regression test is especially useful when practical.

---

## 📚 Add Examples

Examples help developers understand how Xeno.JS should be used in real applications.

Useful examples can demonstrate:

* application composition;
* commands and queries;
* dependency injection;
* scopes;
* pipelines;
* repositories;
* domain modeling;
* Vue integration;
* CLI usage;
* integration with external infrastructure.

Examples should prefer realistic application structure over artificially small snippets when the concept requires architectural context.

---

## Repository Structure

The Xeno.JS ecosystem is divided into multiple repositories, each with a specific responsibility.

| Repository    | Responsibility                                     |
| ------------- | -------------------------------------------------- |
| `xeno-js`     | Core Node.js application architecture              |
| `xeno-shared` | Shared domain primitives and application contracts |
| `xeno-fe`     | Vue application architecture                       |
| `xeno-cli`    | CLI and scaffolding                                |

Choose the repository that owns the behavior you want to change.

---

## Before You Start

Before making a substantial change:

1. Read the relevant documentation.
2. Understand the affected package.
3. Search existing issues and pull requests.
4. Check whether the behavior already exists elsewhere.
5. For architectural changes, discuss the proposed direction before implementing it.

This is particularly important for changes to public APIs or core architectural mechanisms.

---

## Development Workflow

A typical contribution follows this process:

```text
Identify a problem
       │
       ▼
Understand the existing architecture
       │
       ▼
Open an issue / discuss the change
       │
       ▼
Fork or clone the repository
       │
       ▼
Create a focused branch
       │
       ▼
Implement the change
       │
       ▼
Add or update tests
       │
       ▼
Update documentation when needed
       │
       ▼
Run checks locally
       │
       ▼
Open a Pull Request
       │
       ▼
Review
```

The exact commands and checks may differ between repositories.

Follow the repository-specific instructions when they are available.

---

## Keep Changes Focused

A good pull request should solve a clearly defined problem.

Prefer:

```text
One problem
    ↓
One coherent change
    ↓
Clear tests
    ↓
Clear review
```

Avoid combining unrelated changes into the same pull request.

For example, a pull request that fixes a dependency-resolution bug should not also introduce unrelated formatting changes, rename unrelated APIs, and restructure documentation.

Focused changes are easier to review, test, and maintain.

---

## Respect the Architecture

Xeno.JS is an application architecture framework.

Contributions should therefore consider architectural boundaries, not only whether the code works.

Before introducing a new dependency or abstraction, ask:

* Which layer owns this responsibility?
* Does this introduce unnecessary coupling?
* Should this be a domain, application, or infrastructure concern?
* Does this belong in `@xeno-js/shared`, `@xeno-js/core`, or another package?
* Can the behavior remain independent from a specific framework or transport?
* Does the change preserve explicit composition?

A contribution that solves a local problem by introducing architectural coupling may create a larger problem later.

---

## Pull Requests

When opening a pull request, explain:

* what changed;
* why it changed;
* which problem it solves;
* how it was tested;
* whether the public API changed;
* whether documentation needs to be updated.

Keep the pull request description focused on the actual change.

For larger changes, include any relevant architectural decisions or trade-offs.

---

## Review Process

Pull requests may be reviewed for:

* correctness;
* API design;
* architecture;
* maintainability;
* tests;
* documentation;
* developer experience;
* compatibility with the existing ecosystem.

Review feedback is part of the contribution process.

A change may require iteration before it is merged.

---

## Documentation and Code Should Agree

When a contribution changes public behavior, the documentation should reflect that behavior.

For example, if a new public API is introduced, consider whether the change also requires:

* API documentation;
* a guide;
* an example;
* a migration note;
* updated FAQ content.

The goal is to keep the documentation and implementation aligned.

---

## Contributions Beyond Code

Not every contribution requires programming.

You can also contribute by:

* reporting confusing documentation;
* suggesting better examples;
* testing a release;
* reproducing a difficult bug;
* reviewing a pull request;
* sharing real-world use cases;
* improving developer experience;
* helping clarify an architectural problem.

These contributions can be just as useful as a code change.

---

## Questions

If you are unsure whether a change belongs in Xeno.JS, start by describing the problem and the desired outcome.

For larger changes, discussing the design before writing the implementation can save time for both contributors and maintainers.

Thank you for contributing to Xeno.JS.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](./support-us)
