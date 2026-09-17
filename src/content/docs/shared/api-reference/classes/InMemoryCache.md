---
editUrl: false
next: false
prev: false
title: "InMemoryCache"
---

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:13](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L13)

## Description

The InMemoryCache class provides an implementation of the ICache interface using an in-memory Map to store cached values. This class allows for storing, retrieving, and managing cached values in memory, supporting features such as time-to-live (TTL) for cache entries and atomic operations for setting values only if they do not already exist. The InMemoryCache class is a simple and efficient caching solution for scenarios where a lightweight, in-memory cache is sufficient, such as during development or for caching non-critical data that does not require persistence across application restarts.

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

## Implements

- [`ICache`](/shared/api-reference/interfaces/icache/)

## Constructors

### Constructor

> **new InMemoryCache**(`_cache?`): `InMemoryCache`

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L24)

#### Parameters

##### \_cache?

`Map`\<`string`, \{ `expiresAt`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>; `value`: `string`; \}\> = `...`

An optional Map instance to use as the underlying storage for the cache. If not provided, a new Map will be created to store cached values.

#### Returns

`InMemoryCache`

#### Description

Constructs a new instance of the InMemoryCache class, which initializes an internal Map to store cached values. The Map is used to associate cache keys with their corresponding values and expiration times, allowing for efficient retrieval and management of cached data. The constructor does not take any parameters, as the in-memory cache is self-contained and does not require external dependencies or configuration.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:69](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L69)

Clears all entries from the cache, effectively removing all stored values. This method can be used when there is a need to invalidate the entire cache, such as when significant changes occur in the underlying data or when the cache needs to be reset for any reason. After calling this method, subsequent calls to the get method will return undefined until new values are stored in the cache using the set method.

#### Returns

`Promise`\<`void`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICache`](/shared/api-reference/interfaces/icache/).[`clear`](/shared/api-reference/interfaces/icache/#clear)

***

### get()

> **get**\<`T`\>(`key`): `Promise`\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`T`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:28](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L28)

Retrieves a value from the cache based on the specified key. If the key exists in the cache and has not expired, the corresponding value will be returned. If the key does not exist or has expired, this method will return undefined, indicating that there is no valid cached value available for the given key.

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

The unique identifier for the cached value. This key is used to store and retrieve values from the cache.

#### Returns

`Promise`\<[`Optional`](/shared/api-reference/type-aliases/optional/)\<`T`\>\>

The value associated with the specified key if it exists and has not expired; otherwise, returns undefined.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICache`](/shared/api-reference/interfaces/icache/).[`get`](/shared/api-reference/interfaces/icache/#get)

***

### has()

> **has**(`key`): `Promise`\<`boolean`\>

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:57](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L57)

Checks if a specific key exists in the cache and has not expired. This method returns true if the key is present in the cache and its associated value is still valid; otherwise, it returns false. This can be useful for determining whether a cached value can be retrieved without actually fetching it, allowing for more efficient cache management and decision-making based on the presence of valid cached data.

#### Parameters

##### key

`string`

The unique identifier for the cached value to check for existence. This key is used to determine if a valid entry exists in the cache.

#### Returns

`Promise`\<`boolean`\>

True if the key exists in the cache and has not expired; otherwise, returns false.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICache`](/shared/api-reference/interfaces/icache/).[`has`](/shared/api-reference/interfaces/icache/#has)

***

### remove()

> **remove**(`key`): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:53](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L53)

Removes a specific entry from the cache based on the provided key. This method allows for targeted invalidation of cached values when they are no longer valid or needed. After calling this method with a specific key, subsequent calls to the get method with that key will return undefined until a new value is stored in the cache using the set method.

#### Parameters

##### key

`string`

The unique identifier for the cached value to be removed. This key is used to identify which entry in the cache should be invalidated.

#### Returns

`Promise`\<`void`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICache`](/shared/api-reference/interfaces/icache/).[`remove`](/shared/api-reference/interfaces/icache/#remove)

***

### set()

> **set**\<`T`\>(`key`, `value`, `ttl`): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:40](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L40)

Stores a value in the cache with the specified key and an optional time-to-live (TTL) parameter. The TTL parameter specifies how long the value should remain in the cache before it expires. If the TTL is not provided, the value will be stored indefinitely until it is explicitly removed or cleared from the cache. This method allows for efficient caching of values that may have a limited lifespan, ensuring that stale data is not returned when retrieving values from the cache.

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

The unique identifier for the cached value. This key is used to store and retrieve values from the cache.

##### value

`T`

The value to be stored in the cache associated with the specified key.

##### ttl

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Optional time-to-live (TTL) in milliseconds, indicating how long the value should remain in the cache before it expires. If not provided, the value will be stored indefinitely.

#### Returns

`Promise`\<`void`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICache`](/shared/api-reference/interfaces/icache/).[`set`](/shared/api-reference/interfaces/icache/#set)

***

### setIfAbsent()

> **setIfAbsent**\<`T`\>(`key`, `value`, `ttl`): `Promise`\<`boolean`\>

Defined in: [.temp/xeno-shared/src/infrastructure/cache/in-memory.cache.ts:45](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/cache/in-memory.cache.ts#L45)

Stores a value in the cache only if the specified key does not already exist. This method is useful for ensuring that a value is only set in the cache if it has not been previously stored, preventing overwriting of existing values. The TTL parameter specifies how long the value should remain in the cache before it expires, similar to the set method. If the key already exists in the cache, this method will return false, indicating that the value was not set; otherwise, it will store the value and return true.

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

The unique identifier for the cached value. This key is used to store and retrieve values from the cache.

##### value

`T`

The value to be stored in the cache associated with the specified key.

##### ttl

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Optional time-to-live (TTL) in milliseconds, indicating how long the value should remain in the cache before it expires. If not provided, the value will be stored indefinitely.

#### Returns

`Promise`\<`boolean`\>

True if the value was successfully stored in the cache because the key did not already exist; otherwise, returns false if the key already exists in the cache and the value was not set.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICache`](/shared/api-reference/interfaces/icache/).[`setIfAbsent`](/shared/api-reference/interfaces/icache/#setifabsent)
