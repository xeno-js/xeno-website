---
title:
  'Xeno CLI: Usage Guide for xeno init, Interactive Mode, and Scaffolding Flags'
description:
  'Detailed usage guide for the xeno init command, interactive setup prompts,
  and non-interactive --full and --empty flags.'
keywords:
  [
    'xeno init',
    'CLI Usage Guide',
    'Scaffolding Flags',
    '--full',
    '--empty',
    'Interactive Mode',
    '@xeno/cli',
  ]
author: 'Xeno'
---

## `xeno init`: Usage Guide & Scaffolding Modes

The core command of `@xeno/cli` is `xeno init` (or simply executing
`xeno [target-dir]`), which initializes and scaffolds a complete,
production-ready Xeno project structure.

---

## The `xeno init` Command Syntax

To start scaffolding a new project, run the command in your terminal followed by
an optional target directory name:

```bash
# Initialize a project in a custom directory
xeno my-xeno-service

# If no directory name is provided, defaults to 'my-xeno-app'
xeno

```

---

## Scaffolding Execution Modes

When running `xeno`, the CLI determines how to configure your project based on
the arguments and flags provided. There are three primary modes of operation:

### 1. Interactive Prompt Mode (Default)

If you run the CLI without passing `--full` or `--empty`, `@xeno/cli` launches
an interactive prompt interface using `prompts`. The terminal will walk you
through a series of confirmation questions to selectively enable or disable
architecture modules:

```bash
? Install Zod for validation? (Y/n)
? Install Drizzle ORM & Postgres? (Y/n)
? Install SQLite? (y/N)
? Install Axios & Cockatiel? (Y/n)
? Install Supabase? (Y/n)
? Install Pino? (Y/n)
? Install Sentry? (y/N)
? Install ioredis? (y/N)

```

> ⚠️ **Validation Rule**: The scaffolding engine prevents conflicting
> persistence setups. If you attempt to select both PostgreSQL
> (`database: true`) and SQLite (`sqlLite: true`), the CLI terminates
> immediately with a conflict error:
>
> ```text
> You cannot select both Drizzle ORM & Postgres and SQLite at the same time.
>
> ```

### 2. `--full` Mode (Preset Integration)

Passing the `--full` flag bypasses interactive prompts and automatically
provisions a fully loaded enterprise architecture containing all optional
infrastructure drivers:

- **Validation**: Zod

- **Database**: Drizzle ORM & PostgreSQL

- **HTTP Client**: Axios & Cockatiel

- **Authentication**: Supabase

- **Logging**: Pino

- **Error Tracking**: Sentry

- **Caching**: ioredis (Redis)

```bash
xeno my-enterprise-app --full

```

### 3. `--empty` Mode (Minimal Baseline)

Passing the `--empty` flag bypasses interactive prompts and scaffolds a clean,
minimal Xeno project core without pre-installing external peripheral libraries
or optional plugin modules.

```bash
xeno my-minimal-app --empty

```

---

## Automated Post-Scaffolding Lifecycle

Regardless of the mode selected (Interactive, `--full`, or `--empty`), the CLI
executes the following automated lifecycle upon completing file generation:

1. **File Generation**: Assembles `package.json`, `tsconfig.json`, `.gitignore`,
   `.env.example`, `src/registry.ts`, database configs, `src/bootstrap.ts`,
   `src/main.ts`, and documentation.

2. **Dependency Installation**: Automatically runs `npm install` inside the
   newly created target directory.

3. **Startup Instructions**: Outputs terminal readiness commands to boot your
   local development server:

```text
Next steps:
  cd <target-dir>
  npm run dev

```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
