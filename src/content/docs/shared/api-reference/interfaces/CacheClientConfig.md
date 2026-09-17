---
editUrl: false
next: false
prev: false
title: "CacheClientConfig"
---

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:38](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L38)

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

> **host**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:48](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L48)

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

> **maxRetriesPerRequest**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:92](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L92)

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

> **password**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:67](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L67)

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

> **port**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:57](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L57)

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

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:84](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L84)

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

> **username**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/config/cache.config.ts:76](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/config/cache.config.ts#L76)

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
