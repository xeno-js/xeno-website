---
editUrl: false
next: false
prev: false
title: "ICacheKeyBuilder"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/cache/ikey-builder.contracts.ts:10](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cache/ikey-builder.contracts.ts#L10)

ICacheKeyBuilder

## Description

Interface for building cache keys with contextual information.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### buildContextualKey()

> **buildContextualKey**(`key`): `string`

Defined in: [.temp/xeno-shared/src/domain/contracts/cache/ikey-builder.contracts.ts:21](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cache/ikey-builder.contracts.ts#L21)

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

***

### buildUserScopedKey()

> **buildUserScopedKey**(`key`): `string`

Defined in: [.temp/xeno-shared/src/domain/contracts/cache/ikey-builder.contracts.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/cache/ikey-builder.contracts.ts#L33)

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
