---
title: 'IoC & Vue Inject: The Frontend Service Registry'
description: 'Learn how Xeno implements strict Inversion of Control in Vue using XenoVueRegistry, Provider/Inject boundaries, and type-safe Composable utilities.'
keywords: 'XenoVueRegistry, Inversion of Control, Dependency Injection Vue, Provide Inject, ServicesUtils, Frontend Architecture, Xeno'
author: 'Xeno'
sidebar:
  order: 2
---

## IoC & Vue Inject: The Frontend Service Registry

In many Vue applications, dependencies like API clients, loggers, or state stores are either imported directly as global singletons or injected via untyped Vue plugins. This approach creates tight coupling, makes unit testing difficult, and obscures the application's dependency graph.

Xeno Vue enforces **Inversion of Control (IoC)** natively in the browser. By combining a strictly-typed registry (`XenoVueRegistry`) with Vue's native `Provide/Inject` API and a centralized resolution utility, the framework guarantees that your Vue components remain decoupled from concrete infrastructure implementations.

---

## The `XenoVueRegistry` Base Contract

At the heart of the frontend DI system is the `XenoVueRegistry` type. Unlike string-based registries that can lead to runtime lookup failures, Xeno relies on a static TypeScript contract.

The base registry automatically enforces the presence of the framework's core infrastructural services:

```typescript
export type XenoVueRegistry<TExtensions object> = {
  envService: IConfigurationService
  contextAccessor: IContextAccessor<RequestContext>
  identityAccessor: IIdentityAccessor
  logger: ILogger
  mediator: IClientMediator
  cache: ICache
  cacheKeyBuilder: ICacheKeyBuilder
  authService: IExtendendAuthService
} & TExtensions

```

When the `XenoAppBuilder` completes its bootstrapping phase, it resolves these core modules and freezes the resulting container object.

---

## Extending the Registry (`MyRegistry`)

To register your application's custom Data Sources and CQRS Handlers, you extend the base `XenoVueRegistry` by declaring a custom `MyRegistry` interface. This is typically scaffolded by the Xeno CLI into `src/registry.ts`.

By supplying your custom types to the registry extension, you instruct the TypeScript compiler to validate all dependency injections across your frontend codebase.

```typescript
// src/registry.ts
import type { XenoVueRegistry } from '@xeno-js/vue';
import type { RemoteDataSource } from '@xeno-js/vue';
import type { CreateUserHandler } from './features/users/create-user.handler';

export interface MyRegistry extends XenoVueRegistry {
  BFF_REMOTE_DS: RemoteDataSource;
  CREATE_USER_HANDLER: CreateUserHandler;
}

```

This interface is then passed as a generic parameter to the `XenoAppBuilder` (`XenoAppBuilder.create<MyRegistry>()`), ensuring that the builder cannot compile successfully unless every token declared in `MyRegistry` is properly initialized via `.addServices()` or `.addHttpCore()`.

---

## Providing the Container to the Vue App

Once the builder generates the frozen IoC container, it must be distributed to the Vue component tree. Xeno utilizes Vue's native dependency injection mechanism (`app.provide`) alongside the unique symbol `XENO_SERVICES_KEY`.

In your application's entry point (`src/main.ts`), the container is provided at the root level, making it accessible to any nested component or composable:

```typescript
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { bootstrap } from './bootstrap';
import { XENO_SERVICES_KEY, ServicesUtils } from '@xeno-js/vue';

async function mountApp() {
  const app = createApp(App);
  
  // 1. Build the strongly-typed container
  const container = await bootstrap();
  
  // 2. Provide the container globally using the strict framework key
  app.provide(XENO_SERVICES_KEY, container);
  
  // 3. Sync the container with the global static accessor
  ServicesUtils.setGlobalServices(container);
  
  app.mount('#app');
}

mountApp();

```

---

## Resolving Dependencies with `ServicesUtils`

Vue's `inject()` function is designed to be used synchronously within the `setup()` function of a component. However, CQRS flows often require accessing the container asynchronously or from within standalone Composable files.

To solve this and ensure flawless type inference, Xeno generates a `ServicesUtils` helper (`src/use-app.ts`). This utility encapsulates the resolution logic, providing a fail-fast mechanism if the container is missing.

```typescript
// src/use-app.ts
import type { Nullable } from "@xeno-js/vue";
import { Guards, XENO_SERVICES_KEY } from "@xeno-js/vue";
import { inject } from "vue";
import type { MyRegistry } from "./registry";

let globalServices: Nullable<MyRegistry> = null;

export const ServicesUtils = Object.freeze({
    setGlobalServices(services: MyRegistry) {
        globalServices = services;
    },
    useApp(): MyRegistry {
        // Fallback to static global services for usage outside of Vue components
        if (Guards.isDefined(globalServices)) return globalServices;
        
        // Attempt native Vue injection if inside setup()
        const services = inject<MyRegistry>(XENO_SERVICES_KEY);
        if (!services) {
            throw new Error(
                '[Xeno Error]: XenoServices not found. Did you provide them using app.provide(XENO_SERVICES_KEY, services)?',
            );
        }
        return services;
    }
} as const);

```

---

### Usage Inside Composables

By calling `ServicesUtils.useApp()`, developers instantly access the `mediator`, `logger`, and custom `handlers` with full IDE autocomplete and type safety.

```typescript
// src/features/users/use-create-user.composable.ts
import { ServicesUtils } from '@/use-app';
import { CreateUserCommand } from './create-user.command';

export function useCreateUser() {
    const execute = async (payload) => {
        const singal = new AbortController().signal;

        // Safe, strongly-typed resolution of the Mediator and the specific Handler
        const { mediator, CREATE_USER_HANDLER: handler } = ServicesUtils.useApp();

        const command = new CreateUserCommand(payload);

        return await mediator.send(command, async () => {
            return await handler.handle(command, singal);
        });
    };

    return { execute };
}

```

This architectural boundary guarantees that UI components never directly construct API classes or business handlers, achieving strict separation of concerns and protecting the browser runtime from structural tightly-coupled code.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
