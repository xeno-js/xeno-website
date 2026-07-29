---
title: 'Xeno Getting Started Guide'
description: 'Hot to install manually @xeno/core and how to bootstrap.'
keywords:
  [
    'Xeno',
    'Dependency Injection',
    'Inversion of Control',
    'Domain-Driven Design',
    'CQRS',
    'Clean Architecture',
    'Node.js framework',
    'TypeScript framework',
  ]
author: 'Xeno'
---

## How to Manually Install and Bootstrap Xeno?

Manual installation of Xeno requires configuring the core npm package along with
key peer dependencies like TypeScript. Developers initialize the application
lifecycle using the fluent AppBuilder API, which programmatically registers
modules and establishes the asynchronous local storage boundary for scoped
dependency resolution.

Follow these steps to configure your environment and bootstrap a Xeno
application programmatically.

### 1. Package Installation

Install the core package along with its mandatory runtime and development peer
dependencies using your preferred package manager:

```bash
npm install @xeno/core
npm install
npm install --save-dev typescript @types/node

```

### 2. TypeScript Configuration

Xeno leverages modern TypeScript capabilities. Ensure your `tsconfig.json` is
configured to support ECMAScript 2023 target, modern module resolution, and
decorator metadata if you intend to utilize explicit decorators:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts"]
}
```

### 3. Implementing the Strongly-Typed Registry

Every Xeno application requires a custom registry definition that maps injection
tokens to concrete typings. This ensures strict compile-time type safety across
your dependency injection hierarchy:

```typescript
// src/infrastructure/registry.ts
import type { XenoRegistry } from '@xeno/core'

export interface MyCustomService {
  executeTask(): Promise<void>
}

export interface AppRegistry extends XenoRegistry {
  MY_CUSTOM_SERVICE: MyCustomService
}
```

### 4. Bootstrapping with AppBuilder

The programmatic bootstrap sequence utilizes the fluent `AppBuilder` class. This
pattern defines the order of module evaluation, executes setup actions with
system configurations, and builds the finalized `ServiceContainer`:

```typescript
// src/main.ts
import { AppBuilder, LOG_LEVEL, TOKENS } from '@xeno/core';
import type { AppRegistry, MyCustomService } from './infrastructure/registry';

class CustomService implements MyCustomService {
  constructor(private readonly _logger: ILogger)
  public async executeTask(): Promise<void> {
    this._logger.info('Task executed successfully inside a strongly-typed DI container.');
  }
}

async function bootstrap() {
  // 1. Initialize the AppBuilder using your custom application registry
  const builder = new AppBuilder<AppRegistry>();

  // 2. Queue framework modules and inject custom client-side services
  builder
    .addContext() // Enables asynchronous context tracking via AsyncLocalStorage
    .addLogger((config) => {
      config.level = LOG_LEVEL.INFO
      config.console = true; // Programmatically registers stdout logging
    })
    .addServices((container) => {
      // Programmatically register your custom services into the container
      container.addSingleton('MY_CUSTOM_SERVICE', (c) => new CustomService(c.resolve(TOKENS.LOGGER)));
    });

  // 3. Finalize and evaluate registered modules
  const container = await builder.build();

  // 4. Resolve and execute services safely with full type-safety
  const service = container.resolve('MY_CUSTOM_SERVICE');
  await service.executeTask();
}

bootstrap().catch((error) => {
  console.error('Fatal bootstrap execution error:', error);
  process.exit(1);
});

```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](./support-us)
