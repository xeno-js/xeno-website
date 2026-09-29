---
title: 'Remote Data Sources: Typed API Communication in Vue'
description: 'Learn how to extend RemoteDataSource in Xeno.JS Vue to encapsulate external API calls, manage AbortSignals, and return type-safe Result monads.'
keywords: 'RemoteDataSource, Vue API client, Axios encapsulation, Frontend DDD, Result monad, AbortSignal, Xeno.JS Vue'
author: 'Xeno'
sidebar:
  order: 2
---

## Remote Data Sources: Typed API Communication

In standard frontend development, UI components or state managers often interact directly with endpoints using hardcoded `axios.get('/api/data')` calls. This creates tight coupling, makes refactoring API versions incredibly tedious, and scatters network cancellation logic throughout the presentation layer.

Xeno.JS Vue enforces strict Data Access boundaries through the **`RemoteDataSource`** abstract primitive. By isolating all network interactions behind domain-specific data sources, your application Handlers communicate through semantic, strongly-typed methods (e.g., `getUserProfile`) rather than raw HTTP verbs.

---

## What is the RemoteDataSource?

The `RemoteDataSource` is an abstract base class that encapsulates the injected `IHttpClient` (typically the `AxiosHttpClient` configured in your HTTP Core). 

It exposes standardized, type-safe methods (`get`, `post`, `put`, `patch`, `delete`) that automatically map network responses into deterministic `ResultType<T>` monads. This ensures that network execution paths are strictly typed and that exceptions are formatted predictably before reaching your business Handlers.

---

## Extending RemoteDataSource

To interact with an external API, you create a concrete class extending `RemoteDataSource`. This class maps raw API endpoints to descriptive methods, abstracting URLs and HTTP protocols away from your application layer.

### Strict Encapsulation (`private _httpClient`)

In Xeno.JS Vue, the underlying `IHttpClient` is deliberately injected into the base class as `private readonly _httpClient`. 

This is a strict architectural safeguard. By making the client `private`, Xeno.JS prevents subclasses from bypassing the standard monadic wrappers (`this.get()`, `this.post()`) to access the raw Axios instance. This enforces the **Dependency Inversion Principle**: the `RemoteDataSource` remains an agnostic conduit that knows nothing about the underlying Axios library.

### Handling Advanced Scenarios (e.g., Binary Downloads or FormData)

Because the client is private, you cannot pass raw Axios configuration objects. Instead, Xeno.JS provides a clean, agnostic interface called `HttpBaseRequest`.

If your Handler needs to upload a `FormData` object or download a binary stream (e.g., a PDF `Blob`), you pass the payload and agnostic options directly into the standard base class methods. The underlying adapter will translate these agnostic properties (like `responseType`) into the appropriate Axios configurations automatically.

#### Implementation Example

```typescript
// src/infrastructure/datasources/bff.datasource.ts
import { RemoteDataSource } from '@xeno-js/vue';
import type { IHttpClient, ResultType } from '@xeno-js/vue';
import type { UserProfileDto } from './dtos';

export class BffRemoteDataSource extends RemoteDataSource {
  constructor(httpClient: IHttpClient) {
    // Propagates the HTTP client to the abstract base class
    super(httpClient);
  }

  /**
   * Standard execution using the base class helper methods.
   * Automatically wraps the JSON response in a Result monad.
   */
  public async getUserProfile(userId: string, signal?: AbortSignal): Promise<ResultType<UserProfileDto>> {
    return await this.get<UserProfileDto>(`/v1/users/${userId}`, { signal });
  }

  /**
   * Advanced execution utilizing native browser primitives (FormData).
   * The underlying transport automatically infers 'multipart/form-data'.
   */
  public async uploadDocument(file: File, signal?: AbortSignal): Promise<ResultType<void>> {
    const formData = new FormData();
    formData.append('document', file);

    return await this.post<void, FormData>('/v1/documents/upload', formData, { signal });
  }

  /**
   * Binary download utilizing the agnostic responseType property.
   * Prevents Axios from corrupting the binary data with default JSON parsing.
   */
  public async downloadInvoice(invoiceId: string, signal?: AbortSignal): Promise<ResultType<Blob>> {
    return await this.get<Blob>(`/v1/invoices/${invoiceId}/download`, {
      signal,
      responseType: 'blob' // Agnostic flag translated to the underlying adapter
    });
  }
}

```

---

## Propagating Cooperative Cancellation (`AbortSignal`)

A critical feature of frontend network management is cooperative cancellation. When a user navigates away from a view, any pending HTTP requests should be aborted to preserve bandwidth and prevent memory leaks.

The `RemoteDataSource` natively accepts an optional `AbortSignal` in its request parameters.

### The End-to-End Cancellation Flow

1. **Presentation Layer**: The Vue Composable instantiates an `AbortController` and binds `abort()` to the component's `onUnmounted` lifecycle hook.
2. **Application Layer**: The Composable passes the `AbortSignal` to the CQRS Handler.
3. **Infrastructure Layer**: The Handler forwards the signal to the `RemoteDataSource`.
4. **Transport Layer**: The `RemoteDataSource` binds the signal to the underlying `Axios` request. If the signal is aborted, Axios immediately terminates the TCP socket connection and throws a cancellation error, which is caught by the `ExceptionPipeline` and returned to the UI as a clean failure monad.

```typescript
// src/features/users/get-user.handler.ts
import type { ResultType } from '@xeno-js/vue';
import type { BffRemoteDataSource } from '@/infrastructure/datasources/bff.datasource';

export class GetUserHandler {
    constructor(private readonly _bffDataSource: BffRemoteDataSource) {}

    public async handle(query: GetUserQuery, signal?: AbortSignal): Promise<ResultType<UserResponse>> {
        // The signal is passed down, connecting the UI lifecycle directly to the HTTP socket
        return await this._bffDataSource.getUserProfile(query.payload.id, signal);
    }
}

```

By confining endpoint URLs, HTTP verbs, and custom payload formatting strictly within the `RemoteDataSource`, your Handlers remain pure, orchestrating business logic and domain mapping without any knowledge of the underlying REST API structure.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)
