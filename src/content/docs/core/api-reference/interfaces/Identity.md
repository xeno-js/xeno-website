---
editUrl: false
next: false
prev: false
title: "Identity"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:20

An interface representing the authenticated user's identity in the system. This interface includes properties such as the user's unique identifier, email address, and assigned roles, which can be used for authentication and authorization purposes throughout the application.

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

> `readonly` **email**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:36

#### Description

The email address of the user.

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

> `readonly` **name**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:37

***

### permissions

> `readonly` **permissions**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:61

#### Description

The permissions assigned to the user, which can be used for fine-grained authorization checks.

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

> `readonly` **roles**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:53

#### Description

The roles assigned to the user, which can be used for authorization purposes.

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

> `readonly` **tenantId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:45

#### Description

The tenant ID associated with the user.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### userId

> `readonly` **userId**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/identity-context.types.d.ts:28

#### Description

The unique identifier of the user.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
