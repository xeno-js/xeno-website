---
editUrl: false
next: false
prev: false
title: "CacheClientConfig"
---

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:36

## Description

An interface representing a cache client, which provides methods for getting and setting values in a cache storage. This interface abstracts the underlying cache implementation, allowing for flexibility in choosing different caching solutions (e.g., in-memory, Redis) without affecting the rest of the application.

  *
  *

## Author

Xeno
  *

## Version

1.0.0
  *

## Since

2025-09-30
  *

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### host

> **host**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:46

#### Description

The host address of the cache server (e.g., Redis). Optional for in-memory cache implementations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### maxRetriesPerRequest

> **maxRetriesPerRequest**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:90

#### Description

The maximum number of reconnection attempts before declaring failure. Optional for in-memory cache implementations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### password

> **password**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:65

#### Description

The password for authenticating with the cache server (e.g., Redis). Optional for in-memory cache implementations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### port

> **port**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:55

#### Description

The port number of the cache server (e.g., Redis). Optional for in-memory cache implementations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### tls

> **tls**: `boolean`

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:82

#### Description

A boolean flag indicating whether to use TLS/SSL for the connection to the cache server (e.g., Redis). Optional for in-memory cache implementations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### username

> **username**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/config/cache.config.d.ts:74

#### Description

The username for authenticating with the cache server (e.g., Redis). Optional for in-memory cache implementations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
