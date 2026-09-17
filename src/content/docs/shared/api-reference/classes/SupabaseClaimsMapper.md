---
editUrl: false
next: false
prev: false
title: "SupabaseClaimsMapper"
---

Defined in: [.temp/xeno-shared/src/infrastructure/mappers/supabase-claims.mapper.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/mappers/supabase-claims.mapper.ts#L14)

## Description

SupabaseClaimsMapper is responsible for mapping authentication claims (AuthClaims) to an Identity object. This mapper takes the claims extracted from a token (such as a JWT) and transforms them into a structured Identity that can be used throughout the application for authentication and authorization purposes. The mapping includes parsing the user ID and tenant ID from the claims, as well as extracting roles and permissions.

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

- [`IBaseMapper`](/shared/api-reference/interfaces/ibasemapper/)\<`User`, [`AuthClaims`](/shared/api-reference/interfaces/authclaims/)\>

## Constructors

### Constructor

> **new SupabaseClaimsMapper**(): `SupabaseClaimsMapper`

#### Returns

`SupabaseClaimsMapper`

## Methods

### map()

> **map**(`user`): [`AuthClaims`](/shared/api-reference/interfaces/authclaims/)

Defined in: [.temp/xeno-shared/src/infrastructure/mappers/supabase-claims.mapper.ts:15](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/mappers/supabase-claims.mapper.ts#L15)

#### Parameters

##### user

`User`

#### Returns

[`AuthClaims`](/shared/api-reference/interfaces/authclaims/)

An object of type TDestination that is the result of mapping the source object. The returned object should be a new instance that represents the transformed data according to the mapping logic defined in the implementation of this method.

#### Description

Maps an object of type TSource to an object of type TDestination. The implementation of this method should contain the logic for transforming the source object into the desired destination format, which may involve copying properties, converting data types, or applying any necessary transformations to ensure that the resulting object is correctly structured for its intended use.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IBaseMapper`](/shared/api-reference/interfaces/ibasemapper/).[`map`](/shared/api-reference/interfaces/ibasemapper/#map)
