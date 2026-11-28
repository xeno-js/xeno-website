---
title: "Xeno.JS Benchmarks on Node.js 24: Comparing with NestJS and node:http"
published: true
description: "Real Xeno.JS benchmark results on Node.js 24 against NestJS and node:http, covering explicit DI, CQRS and Zod. Measured numbers, not marketing claims."
tags: [typescript, nodejs, benchmarks, architecture]
pubDate: 2026-11-28
keywords: xeno.js, node.js, nestjs, benchmarks, typescript
canonical: "https://www.xeno-js.it/blog/xeno-js-benchmarks"
---

When you introduce a new TypeScript framework with explicit Dependency Injection, per-request scopes, and CQRS pipelines, developers always ask the same first question: how much does this architecture cost in performance?

To answer with real data, I ran a benchmark suite on **Xeno.JS** (developed by Mattia Carcione) using Node.js `v24.22.1`. The tests cover two levels: internal core micro-benchmarks with `tinybench` and end-to-end HTTP load tests with `autocannon` (`100` concurrent connections for `10s`, after a `2s` warmup, on `GET /api/users/:id`).

## HTTP comparison: Xeno.JS vs NestJS vs node:http

On an in-memory `GET /api/users/:id` endpoint, bare `node:http` reaches `40,256 req/s` because it runs no application layers. Among the structured setups tested, Xeno.JS with `@xeno-js/node` achieves the highest throughput (`14,052.8 req/s`), the lowest latency (`p50: 6 ms`, `p99: 9 ms`), and the fastest startup time (`2.68 ms`), outperforming both Xeno.JS with `@xeno-js/fastify` and NestJS with `FastifyAdapter` and a `Scope.REQUEST` repository.

| Target | Bootstrap (ms) | Req/sec (avg) | Latency p50 (ms) | Latency p99 (ms) | RSS Memory (MB) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline `node:http` (no arch) | 4.01 | 40256 | 2 | 3 | 151.49 |
| Xeno.JS + `@xeno-js/node` (CQRS+DI) | 2.68 | 14052.8 | 6 | 9 | 226.67 |
| Xeno.JS + `@xeno-js/fastify` (CQRS+DI) | 1577.14 | 11564.4 | 7 | 30 | 237.26 |
| NestJS + `FastifyAdapter` (`Scope.REQUEST`) | 75.12 | 6494.6 | 14 | 36 | 354.17 |

In short, each target stands out in a specific area:

- For raw speed without architecture, `node:http` stays ahead (`40,256 req/s`, `p99: 3 ms`).
- Among the structured stacks tested here, Xeno.JS + `@xeno-js/node` handles more than twice the requests per second compared to NestJS (`14,052.8 req/s` vs `6,494.6 req/s`), starting in `2.68 ms` vs `75.12 ms`.
- Xeno.JS + `@xeno-js/fastify` maintains solid throughput (`11,564.4 req/s`), but shows a high bootstrap time (`1,577.14 ms`) and a `p99` of `30 ms` compared to the `9 ms` of the native `@xeno-js/node` adapter.
- On RSS memory, NestJS uses `354.17 MB` in a dedicated process, while the three targets in `http.bench.ts` range between `151.49 MB` and `237.26 MB`.

## How much does the Xeno.JS core cost (DI, scope, and CQRS)

To understand whether the gap against `node:http` came from the core or the HTTP layer, I measured the individual operations of `@xeno-js/core` separately with `tinybench`. Bootstrapping `XenoAppBuilder.build()` takes `5.650 ms`.

| Operation | Latency avg (ns) | Throughput avg (ops/s) |
| --- | ---: | ---: |
| DI: Resolve Singleton (root) | 127.65 | 8921733 |
| Scope: runInScope() lifecycle (`AsyncLocalStorage` + Scope) | 1128.5 | 952452 |
| DI: Resolve Scoped graph (3 levels) in scope | 1727.0 | 634958 |
| CQRS: Mediator.query() end-to-end | 5420.2 | 192807 |
| CQRS: Mediator.send() (Command + DI graph) | 6198.9 | 172023 |
| CQRS: Mediator.send() + Zod Validation | 7138.7 | 172131 |

A `Singleton` resolution takes about `127.65 ns` (`8.9 million ops/s`), opening a scope with `AsyncLocalStorage` takes `1.13 µs`, and the full `Mediator.send()` pipeline with a DI graph and Zod validation takes `7.14 µs` (`172,131 ops/s`). The cost of the internal architecture stays within a few microseconds per operation, while most of the time in the web tests comes from the HTTP layer and request lifecycle.

## Methodology and test limitations

All numbers were collected on the same machine running Node.js `v24.22.1` using a synthetic in-memory endpoint, with no real database queries or external network calls.

Two details should be kept in mind when reading these results:

1. In the NestJS test, the repository is registered with `Scope.REQUEST` to mirror a per-request scoped dependency as in Xeno.JS. In practice, many NestJS projects use `Scope.DEFAULT` (singleton), which has a different cost profile.
2. The three HTTP targets in `http.bench.ts` (`node:http`, `@xeno-js/node`, and `@xeno-js/fastify`) ran sequentially inside the same Node.js process, so their RSS figures are not isolated in separate processes like the NestJS run. Direct comparisons with standalone Fastify, Hono, or Express are not included yet.

## Building Xeno.JS applications with AI via skill.md

Alongside the framework, I created a dedicated `skill.md`: a specialized Xeno.JS agent designed to build applications with AI quickly, keeping public contracts, layer separation, Dependency Injection lifetimes, and CQRS pipelines consistent without the model inventing non-existent APIs.

## Xeno.JS is already in production

The framework is not just a local experiment. It is already running in production on two real projects built entirely with Xeno.JS and Vue.js:

- [www.annascolta.it](https://www.annascolta.it), a website built with Xeno.JS and Vue.js that integrates subscribe and contact flows with Brevo.
- [mv-tech-two.vercel.app](https://mv-tech-two.vercel.app/), also built with Xeno.JS and Vue.js, featuring an integrated chatbot available at [mv-tech-two.vercel.app/chat/](https://mv-tech-two.vercel.app/chat/).

## How to reproduce the benchmarks

### Installation

```bash
git clone https://github.com/xeno-js/benchmarks.git
cd benchmarks
npm install
```

### Running the benchmarks

To run the same suite locally:

```bash
npm run bench:core
npm run bench:http
npm run bench:nestjs
```
