---
editUrl: false
next: false
prev: false
title: "AuthPolicy"
---

Defined in: [.temp/xeno-shared/src/shared/types/auth-policy.types.ts:10](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth-policy.types.ts#L10)

## Description

The AuthPolicy interface defines the structure of an authorization policy, which includes a list of roles and permissions. This interface is used to represent the access control policies associated with different intents or actions within the application. Implementations of this interface can be used to enforce role-based and permission-based access control by specifying which roles and permissions are required for specific operations.

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

### permissions?

> `readonly` `optional` **permissions?**: `string`[]

Defined in: [.temp/xeno-shared/src/shared/types/auth-policy.types.ts:48](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth-policy.types.ts#L48)

An array of permissions that are associated with the authorization policy. These permissions define the specific actions or operations that a user is allowed to perform within the application. The permissions can be used to enforce fine-grained access control by specifying which operations require certain permissions.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### roles?

> `readonly` `optional` **roles?**: `string`[]

Defined in: [.temp/xeno-shared/src/shared/types/auth-policy.types.ts:38](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth-policy.types.ts#L38)

An array of roles that are associated with the authorization policy. These roles define the access level and permissions granted to users who possess them. The roles can be used to determine whether a user is authorized to perform certain actions or access specific resources within the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### tenantId?

> `readonly` `optional` **tenantId?**: `boolean`

Defined in: [.temp/xeno-shared/src/shared/types/auth-policy.types.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth-policy.types.ts#L27)

An optional boolean flag indicating whether the authorization policy requires a tenant ID for authentication. If set to true, the policy enforces that a valid tenant ID must be present in the request context for authorization to succeed. This flag can be used to differentiate between policies that require tenant-level authentication and those that do not.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### userId?

> `readonly` `optional` **userId?**: `boolean`

Defined in: [.temp/xeno-shared/src/shared/types/auth-policy.types.ts:18](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth-policy.types.ts#L18)

An optional boolean flag indicating whether the authorization policy requires a user ID for authentication. If set to true, the policy enforces that a valid user ID must be present in the request context for authorization to succeed. This flag can be used to differentiate between policies that require user-level authentication and those that do not.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
