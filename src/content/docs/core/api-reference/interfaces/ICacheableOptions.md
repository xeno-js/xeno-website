---
editUrl: false
next: false
prev: false
title: "ICacheableOptions"
---

Defined in: .temp/xeno-shared/dist/shared/types/cache.types.d.ts:11

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

> `readonly` **bypassCache**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: .temp/xeno-shared/dist/shared/types/cache.types.d.ts:42

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

Defined in: .temp/xeno-shared/dist/shared/types/cache.types.d.ts:21

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

> `readonly` **consistentRead**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: .temp/xeno-shared/dist/shared/types/cache.types.d.ts:52

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

Defined in: .temp/xeno-shared/dist/shared/types/cache.types.d.ts:62

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

> `readonly` **ttl**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/shared/types/cache.types.d.ts:31

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
