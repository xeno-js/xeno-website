---
title: 'SSR & Platform Adapters: Server-Side Cookie Handling in Xeno'
description: 'Learn how Xeno.JS implements framework-agnostic SSR cookie handling using ISsrCookieHandler and platform-specific adapters like VercelSsrCookieHandler for Supabase SSR.'
keywords: [
  'SSR adapters',
  'ISsrCookieHandler',
  'VercelSsrCookieHandler',
  'Supabase SSR',
  'Vercel cookies',
  'Transport decoupling',
  'Xeno.JS security',
]
author: 'Xeno'
sidebar:
  order: 6
---

## Overview of Server-Side Rendering (SSR) & Cookie Management

In traditional single-page applications (SPAs), authentication tokens and session states are managed entirely on the client side via browser storage or local cookies. However, in modern Server-Side Rendering (SSR) and serverless architectures (such as Vercel, AWS Lambda, or Cloudflare Workers), authentication must cross the network boundary securely before rendering page content or executing Backend-For-Frontend (BFF) routes.

When integrating advanced identity providers like **Supabase SSR** (`@supabase/ssr`), static header extractors are insufficient. The framework requires an active, bidirectional mechanism to read, decode, refresh, and write encrypted session cookies dynamically during the request lifecycle.

---

## Why Transport (`req`/`res`) is Necessary for SSR

Xeno's core engine is intentionally runtime-agnostic and completely decoupled from specific HTTP frameworks or deployment platforms. Nevertheless, advanced SSR workflows require access to the underlying platform's transport layer (`req` and `res`) for two fundamental reasons:

1. **Incoming Session Read (`getAll`)**: Supabase SSR needs to read all incoming session cookies from the browser request headers (`req.headers.cookie`) to re-establish the user's authenticated session state on the server side.


2. **Outbound Cookie Persistence (`setAll`)**: During token refreshes, PKCE code exchanges, or login callbacks, Supabase must issue or update multiple encrypted session cookies. These must be written directly into the response header collection (`res.setHeader('Set-Cookie', ...)`).



To bridge platform-specific transport mechanics without polluting the core domain logic, Xeno.JS introduces the **`ISsrCookieHandler`** contract and platform adapter pattern.

---

## The `ISsrCookieHandler` Contract

Xeno.JS defines a standardized, framework-agnostic interface called `ISsrCookieHandler` under domain configurations. Any platform adapter must implement this contract to be fully compatible with Supabase SSR integration factories:

```typescript
export interface ISsrCookie {
  name: string
  value: string
}

export interface ISsrCookieToSet extends ISsrCookie {
  options?: CookieOptions
}

export interface ISsrCookieHandler {
  getAll(): ISsrCookie[]
  setAll(cookies: ISsrCookieToSet[]): void
}
```

---

## Implementing a Platform Adapter: `VercelSsrCookieHandler`

When deploying on platforms like Vercel, developers implement a concrete adapter that extracts the native `VercelRequest` and `VercelResponse` objects from the request's network context accessor.

Below is how the concrete `VercelSsrCookieHandler` maps transport headers to the agnostic `ISsrCookieHandler` contract:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { ISsrCookie, ISsrCookieToSet, ISsrCookieHandler, INetworkContextAccessor } from '@xeno-js/core'
import { Guards } from '@xeno-js/core'

export class VercelSsrCookieHandler implements ISsrCookieHandler {
  constructor(private readonly contextAccessor: INetworkContextAccessor) {}

  public getAll(): ISsrCookie[] {
    const network = this.contextAccessor.getNetworkContext()
    const req = network?.transport?.req as VercelRequest
    
    if (!Guards.isDefined(req) || Guards.isNullOrEmpty(req.headers.cookie)) {
      return []
    }

    return req.headers.cookie.split(';').map(cookie => {
      const [name, ...rest] = cookie.split('=')
      return { name: name.trim(), value: rest.join('=') }
    }) ?? []
  }

  public setAll(cookies: ISsrCookieToSet[]): void {
    const network = this.contextAccessor.getNetworkContext()
    const res = network?.transport?.res as VercelResponse
    
    if (!res) return

    const serializedCookies = cookies.map(c => this.serialize(c))
    const existingSetCookie = res.getHeader('Set-Cookie')
    
    let currentCookies: string[] = []
    if (Guards.isArray(existingSetCookie)) {
      currentCookies = existingSetCookie as string[]
    } else if (Guards.isString(existingSetCookie)) {
      currentCookies = [existingSetCookie as string]
    }

    res.setHeader('Set-Cookie', [...currentCookies, ...serializedCookies])
  }

  private serialize(cookie: ISsrCookieToSet): string {
    const safeName = encodeURIComponent(cookie.name)
    const safeValue = encodeURIComponent(cookie.value)
    let str = `${safeName}=${safeValue}`
    
    const isProd = process.env.NODE_ENV === 'production'
    const defaultOptions = {
      path: '/',
      httpOnly: true,
      secure: isProd,
      sameSite: 'Lax',
    }
    
    const opts = { ...defaultOptions, ...(cookie.options || {}) }
    
    str += `; Path=${opts.path}`
    if (Guards.isDefined(opts.maxAge)) str += `; Max-Age=${opts.maxAge}`
    if (Guards.isDefined(opts.domain)) str += `; Domain=${opts.domain}`
    if (Guards.isDefined(opts.sameSite)) str += `; SameSite=${opts.sameSite}`
    if (opts.secure) str += `; Secure`
    if (opts.httpOnly) str += `; HttpOnly`
    
    return str
  }
}
```

---

## Configuring SSR Adapters via AppBuilder (`addAuth`)

To wire your platform adapter into the dependency injection container, you configure the `ssrOpts` property inside the `.addAuth()` setup action during the application bootstrapping phase. 

This tells the `SupabaseServerAuthFactory` how to instantiate the server client using the platform-specific cookie handler:

```typescript
// src/bootstrap.ts
import { AppBuilder, TOKENS } from '@xeno-js/core'
import { VercelSsrCookieHandler } from './auth/infrastructure/cookies/vercel.cookies'
import type { MyRegistry } from './registry'

const builder = new AppBuilder<MyRegistry>()
  .addAuth((opts, config) => {
    opts.url = config.getOrThrow('SUPABASE_URL')
    opts.key = config.getOrThrow('SUPABASE_KEY')
    opts.redirectTo = `${config.get('BASE_URL')}/v1/auth/callback`
    
    // Bind the platform-specific SSR cookie handler using the container's network accessor
    opts.ssrOpts = (container) => 
      new VercelSsrCookieHandler(container.resolve(TOKENS.NETWORK_CONTEXT_ACCESSOR))
  })

export async function bootstrap() {
  return await builder.build()
}
```

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)