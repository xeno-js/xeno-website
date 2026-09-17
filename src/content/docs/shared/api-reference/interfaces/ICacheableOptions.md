---
editUrl: false
next: false
prev: false
title: "ICacheableOptions"
---

Defined in: [.temp/xeno-shared/src/shared/types/cache.types.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/cache.types.ts#L12)

## Description

An interface representing cacheable options, which includes properties for cache key, TTL, and bypass flags. This allows query handlers to determine how to cache the results of the query based on the provided options.

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

### bypassCache

> `readonly` **bypassCache**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: [.temp/xeno-shared/src/shared/types/cache.types.ts:45](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/cache.types.ts#L45)

#### Description

If true, indicates that the cache should be bypassed for this request. Similar to consistentRead but less semantically explicit.
If both bypassCache and consistentRead are provided, consistentRead takes precedence.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### cacheKey

> `readonly` **cacheKey**: `string`

Defined in: [.temp/xeno-shared/src/shared/types/cache.types.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/cache.types.ts#L22)

#### Description

A unique key under which to save the result. Must include parameters (e.g., `travel-intents:tenant-123:page-1`).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### consistentRead

> `readonly` **consistentRead**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: [.temp/xeno-shared/src/shared/types/cache.types.ts:56](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/cache.types.ts#L56)

#### Description

(Optional) If true, indicates that a consistent read is required, bypassing the cache. Similar to bypassCache but more semantically explicit.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### isUserScoped

> `readonly` **isUserScoped**: `boolean`

Defined in: [.temp/xeno-shared/src/shared/types/cache.types.ts:67](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/cache.types.ts#L67)

#### Description

(Optional) If true, indicates that the cache entry is scoped to the current user. This is useful for multi-tenant applications where cached data should be isolated per user or tenant.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### ttl

> `readonly` **ttl**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/shared/types/cache.types.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/cache.types.ts#L33)

#### Description

Time to live for the cache entry in seconds. Optional; if omitted, a default TTL defined in the caching layer will be used. Must be a positive integer if provided.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
