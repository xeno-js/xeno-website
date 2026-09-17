---
editUrl: false
next: false
prev: false
title: "Identity"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L22)

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

> `readonly` **email**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:39](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L39)

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

> `readonly` **name**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:41](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L41)

***

### permissions

> `readonly` **permissions**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:68](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L68)

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

> `readonly` **roles**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`[]\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:59](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L59)

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

> `readonly` **tenantId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:50](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L50)

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

> `readonly` **userId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`` `${string}-${string}-${string}-${string}-${string}` ``\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/identity-context.types.ts:30](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/identity-context.types.ts#L30)

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
