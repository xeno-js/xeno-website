---
editUrl: false
next: false
prev: false
title: "AuthClaims"
---

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:23](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L23)

## Description

An interface representing the claims associated with an authenticated user. This typically includes standard claims such as 'sub' (subject) and 'email', as well as any additional claims that may be relevant to the application's authorization logic.

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

### email

> `readonly` **email**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:43](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L43)

The user's email

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### name

> `readonly` **name**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:45](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L45)

***

### permissions

> `readonly` **permissions**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:76](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L76)

An array of permissions assigned to the user. This can be used for permission-based access control to determine what specific operations the user is authorized to perform.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### roles

> `readonly` **roles**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:66](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L66)

An array of roles assigned to the user. This can be used for role-based access control (RBAC) to determine what actions the user is authorized to perform.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### sub

> `readonly` **sub**: `string`

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L33)

The unique identifier for the user (subject).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### tenantId

> `readonly` **tenantId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/shared/types/auth.types.ts:56](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/auth.types.ts#L56)

The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
