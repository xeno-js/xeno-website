---
editUrl: false
next: false
prev: false
title: "CacheConfig"
---

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:9

## Description

Configuration for Redis integration, including details such as host, port, and credentials. If enabled, the query bus and command bus (in case of idempotency) pipelines will use Redis as the cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, providing flexibility in how the cache is implemented and used within the application.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### inMemory

> **inMemory**: `boolean`

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:17

#### Description

Optional configuration for in-memory cache integration. If enabled, the query bus and command bus (in case of idempotency) pipelines will use an in-memory cache system to store and retrieve data efficiently. The configuration includes specific details for in-memory cache integration, providing flexibility in how the cache is implemented and used within the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### redis

> **redis**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`CacheClientConfig`](/core/api-reference/interfaces/cacheclientconfig/)\>

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:25

#### Description

Optional configuration for Redis integration, including details such as host, port, and credentials. If provided and enabled, the application will use Redis as the cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, providing flexibility in how the cache is implemented and used within the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
