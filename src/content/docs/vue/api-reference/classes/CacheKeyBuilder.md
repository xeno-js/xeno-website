---
editUrl: false
next: false
prev: false
title: "CacheKeyBuilder"
---

Defined in: .temp/xeno-shared/dist/infrastructure/cache/key-builder.cache.d.ts:10

## Description

The CacheKeyBuilder class implements the ICacheKeyBuilder interface, providing a method to build contextual cache keys based on the user's identity. This class utilizes an instance of IIdentityAccessor to retrieve the current user's identity, allowing for the creation of tenant-specific cache keys in multi-tenant applications. If a tenant ID is present in the identity, the cache key is prefixed with the tenant ID; otherwise, it defaults to a public cache key. This approach ensures that cached data is appropriately scoped to the user's context, preventing data leakage between tenants.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Implements

- [`ICacheKeyBuilder`](/vue/api-reference/interfaces/icachekeybuilder/)

## Constructors

### Constructor

> **new CacheKeyBuilder**(`_identityAccessor`): `CacheKeyBuilder`

Defined in: .temp/xeno-shared/dist/infrastructure/cache/key-builder.cache.d.ts:21

#### Parameters

##### \_identityAccessor

[`IIdentityAccessor`](/vue/api-reference/interfaces/iidentityaccessor/)

An instance of IIdentityAccessor used to retrieve the current user's identity, allowing for the construction of tenant-specific cache keys.

#### Returns

`CacheKeyBuilder`

#### Description

Constructs a new instance of the CacheKeyBuilder class, which requires an IIdentityAccessor to access the current user's identity. The constructor initializes the dependency needed for building contextual cache keys based on the user's identity, enabling tenant-specific caching behavior in multi-tenant applications.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### buildContextualKey()

> **buildContextualKey**(`key`): `string`

Defined in: .temp/xeno-shared/dist/infrastructure/cache/key-builder.cache.d.ts:22

#### Parameters

##### key

`string`

The base key to be used for building the contextual cache key.

#### Returns

`string`

The contextual cache key.

#### Description

Builds a contextual cache key based on the provided key and the current user's identity. If a tenant ID is present in the identity, the cache key is prefixed with the tenant ID; otherwise, it defaults to a public cache key. This method ensures that cached data is appropriately scoped to the user's context, preventing data leakage between tenants.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICacheKeyBuilder`](/vue/api-reference/interfaces/icachekeybuilder/).[`buildContextualKey`](/vue/api-reference/interfaces/icachekeybuilder/#buildcontextualkey)

***

### buildUserScopedKey()

> **buildUserScopedKey**(`key`): `string`

Defined in: .temp/xeno-shared/dist/infrastructure/cache/key-builder.cache.d.ts:23

#### Parameters

##### key

`string`

The base key to be used for building the user-scoped cache key.

#### Returns

`string`

The user-scoped cache key.

#### Description

Builds a user-scoped cache key based on the provided key and the current user's identity. If a user ID is present in the identity, the cache key is prefixed with the user ID; otherwise, it defaults to a public cache key. This method ensures that cached data is appropriately scoped to the user's context, preventing data leakage between users.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`ICacheKeyBuilder`](/vue/api-reference/interfaces/icachekeybuilder/).[`buildUserScopedKey`](/vue/api-reference/interfaces/icachekeybuilder/#builduserscopedkey)
