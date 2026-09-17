---
editUrl: false
next: false
prev: false
title: "CacheConfig"
---

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:10](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L10)

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

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:18](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L18)

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

> **redis**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`CacheClientConfig`](/shared/api-reference/interfaces/cacheclientconfig/)\>

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:26](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L26)

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
