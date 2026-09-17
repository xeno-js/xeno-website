---
editUrl: false
next: false
prev: false
title: "AuthClaims"
---

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:21

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

> `readonly` **email**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:40

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

> `readonly` **name**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:41

***

### permissions

> `readonly` **permissions**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:71

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

> `readonly` **roles**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:61

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

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:31

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

> `readonly` **tenantId**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/shared/types/auth.types.d.ts:51

The tenant ID associated with the user, if applicable. This is useful in multi-tenant applications to identify which tenant the user belongs to.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
