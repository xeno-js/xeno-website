---
title: 'Supabase Auth: Agnostic Identity Management'
description: 'Learn how Xeno Vue integrates Supabase authentication using an Anti-Corruption Layer, lazy loading, and the agnostic IExtendendAuthService contract.'
keywords: 'Supabase Vue, Authentication, Anti-Corruption Layer, Identity Management, IExtendendAuthService, Code-Splitting, Xeno Vue'
author: 'Xeno'
sidebar:
  order: 1
---

## Supabase Auth: Agnostic Identity Management

In many Vue projects, developers import the `@supabase/supabase-js` client directly into their components, stores, or router guards. While convenient for rapid prototyping, this creates severe **vendor lock-in**. If the business later decides to migrate from Supabase to Auth0, Firebase, or a custom OAuth2 provider, the engineering team must rewrite authentication logic scattered across the entire presentation layer.

Xeno Vue prevents this architectural drift by enforcing an **Anti-Corruption Layer (ACL)**. Your Vue application never interacts with Supabase directly; instead, it relies entirely on the framework-agnostic `IExtendendAuthService` contract exposed by the `XenoVueRegistry`.

---

## Configuring Supabase via XenoAppBuilder

Supabase authentication is provisioned during the application bootstrap phase using the `.addAuth()` method on the `XenoAppBuilder`. 

This method accepts a `SetupAction` callback, allowing you to securely bind your project credentials utilizing the fail-fast `ViteConfigurationService`:

```typescript
// src/bootstrap.ts
import { XenoAppBuilder } from '@xeno-js/vue';
import type { MyRegistry } from './registry';

const builder = XenoAppBuilder.create<MyRegistry>()
  .addAuth((opts, config) => {
    // Fails fast and throws a [Configuration Error] if keys are missing
    opts.url = config.getOrThrow('VITE_SUPABASE_URL');
    opts.key = config.getOrThrow('VITE_SUPABASE_KEY');
    
    // Optional: Configure underlying session storage mechanics
    opts.storageOpts = {
      type: 'localStorage', // or 'cookie', 'memory'
    };
  });

export async function bootstrap() {
  return await builder.build();
}

```

If the required URL or Key are missing from your environment, the `AuthModule` immediately halts execution and throws a precise `[Auth Error]` before the application mounts.

---

## The Performance Advantage: Lazy Initialization

The `@supabase/supabase-js` SDK is a robust but heavy library. Bundling it into your initial `main.ts` file severely degrades your initial page load metrics (Core Web Vitals).

Xeno Vue manages Supabase as an **optional peer dependency**. When you configure `.addAuth()`, the `XenoAppBuilder` does not load the SDK immediately. Instead, it queues an asynchronous task that utilizes dynamic imports (`await import('../modules/auth.module')`) to load the authentication module and its Supabase dependencies *only* when `.build()` is executed.

This guarantees that Vite automatically code-splits the authentication engine, keeping your initial application bundle aggressively optimized.

---

## The Anti-Corruption Layer: Mappers and Factories

To completely isolate your application from Supabase's proprietary data structures, Xeno utilizes a dedicated `SupabaseAuthFactory`.

When the factory initializes the `SupabaseClient` (integrating the customized `StorageHelper` for session persistence), it wraps the SDK alongside two critical mapping classes:

1. **`SupabaseClaimsMapper`**: Translates the raw JWT payload from Supabase into Xeno's standardized `AuthClaims` domain model.
2. **`SupabaseSessionMapper`**: Translates proprietary session objects into a generic `Identity` context.

The factory ultimately returns a `SupabaseAuthService` instance, which strictly implements the agnostic `IExtendendAuthService` interface.

### Consuming Authentication in Vue Composables

Because the `XenoVueRegistry` securely types the `authService` as an `IExtendendAuthService`, your Vue Composables interact with a pure, vendor-agnostic API:

```typescript
// src/features/auth/use-login.ts
import { ref } from 'vue';
import { ServicesUtils } from '@/use-app';

export function useLogin() {
    const loading = ref(false);

    const execute = async (email: string, password: string) => {
        loading.value = true;
        
        try {
            // Resolve the agnostic IExtendendAuthService from the IoC container
            const { authService } = ServicesUtils.useApp();
            
            // Execute the sign-in without knowing it relies on Supabase
            const result = await authService.signInWithProvider('credentials', { email, password });
            
            return result;
        } finally {
            loading.value = false;
        }
    };

    return { loading, execute };
}

```

This strict architectural boundary guarantees that your UI components, CQRS Handlers, and internal security policies remain fundamentally unaware of Supabase, allowing your engineering team to scale or swap identity providers in the future with zero friction.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
