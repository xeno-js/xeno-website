---
title: 'Contributing to Xeno: Developer Workflow & Contribution Guidelines'
description:
  'Comprehensive guide for open-source contributors to Xeno-JS. Details local
  setup, Git branching strategies, Conventional Commit specifications, and
  validation scripts.'
keywords:
  [
    'Contributing to Xeno',
    'Xeno Developer Guide',
    'Git Flow',
    'Conventional Commits',
    'Vitest',
    'TypeScript Scaffolding',
    'Open Source Node.js',
  ]
author: 'Xeno'
---

## Contributing to Xeno

Thank you for your interest in contributing to **Xeno**! As an open-source,
enterprise-grade framework for Node.js, Xeno relies on clean architectural
principles, strict type safety, and robust community contributions.

To maintain code quality and structural integrity across `@xeno/core` and
`@xeno/cli`, all contributors must adhere to the development workflows,
branching models, and testing protocols outlined below.

---

## 1. Branching Strategy & Git Flow

Direct pushes to the `main` and `develop` branches are **strictly prohibited**.
Xeno employs a modified Git Flow strategy:

```text
[ Feature Branch ]  ──>  (Pull Request)  ──>  [ develop ]  ──>  (Release)  ──>  [ main ]

```

- **`main`**: Represents the current stable, production-ready release.

- **`develop`**: The primary integration branch for ongoing development and beta
  features.

- **`feat/*` or `fix/***`: Isolated branches created by developers for new
  features or bug fixes.

### Step-by-Step Workflow

1. **Fork & Clone**: Fork the Xeno repository and clone it to your local
   environment.

2. **Branch off from `develop**`: Always target `develop` as your base branch:

```bash
git checkout develop
git pull origin develop
git checkout -b feat/my-awesome-feature

```

3. **Develop & Validate Locally**: Implement your changes and verify that all
   local checks pass:

```bash
npm run check

```

4. **Submit a Pull Request**: Push your feature branch to GitHub and open a Pull
   Request (PR) targeting the **`develop`** branch.

---

## 2. Commit Message Standards (Conventional Commits)

Xeno strictly enforces
[Conventional Commits](https://www.conventionalcommits.org/). Commit messages
are validated automatically via Husky hooks prior to acceptance.

### Commit Syntax Format

```text
<type>(<scope>): <short description>

```

### Supported Commit Types

- **`feat`**: A new feature added to core, CLI, or infrastructure modules (e.g.,
  `feat(cqrs): add event outbox pipeline`).

- **`fix`**: A bug fix in existing framework code (e.g.,
  `fix(http-core): handle null timeout values`).

- **`docs`**: Documentation updates or API specification changes (e.g.,
  `docs(readme): update setup guidelines`).

- **`refactor`**: Code restructuring without API changes or feature additions.

- **`test`**: Adding or updating unit/integration test suites.

- **`chore`**: Maintenance tasks, build system updates, or dependency upgrades.

---

## 3. Local Development Scripts Reference

The root `package.json` provides scripts for building, testing, and verifying
code quality:

| Command                     | Description                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| **`npm run build`**         | Compiles TypeScript source files into the target `dist/` directory.                        |
| **`npm run typecheck`**     | Executes `tsc` to verify type safety across all project modules without emitting JS files. |
| **`npm run lint`**          | Analyzes source files using ESLint to enforce coding standards.                            |
| **`npm run format`**        | Automatically formats codebase files using Prettier.                                       |
| **`npm run test`**          | Executes unit tests using the Vitest runner.                                               |
| **`npm run test:coverage`** | Executes the test suite and outputs a code coverage report.                                |

---

## 4. Automated Code Quality Guards (Husky & Git Hooks)

To ensure code safety before changes leave your machine, Xeno executes
pre-configured Git hooks managed by Husky:

- **`pre-commit`**: Runs `lint-staged` to format and lint staged files
  automatically via ESLint and Prettier.

- **`commit-msg`**: Evaluates commit messages against `commitlint` rules to
  enforce Conventional Commit compliance.

- **`pre-push`**: Executes full type-checking, linting, and unit test suites
  before allowing a push to remote repositories.

---

## 5. Areas Requiring Community Contributions

If you are looking for places to start contributing, check out our active
development tracks:

- **CLI Generators (`@xeno/cli`)**: Expanding scaffolding options for new
  command, query, and handler boilerplates.

- **Outbox & Distributed Messaging**: Implementing pattern-based message
  dispatchers for Kafka or RabbitMQ.

- **Documentation & Examples**: Creating walkthrough tutorials or expanding
  architectural guides inside `./docs`.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](./support-us)
