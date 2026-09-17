---
editUrl: false
next: false
prev: false
title: "IPolicyRegistry"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/policies/ipolicy-registry.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/policies/ipolicy-registry.contracts.ts#L12)

## Description

The IPolicyRegistry interface defines the contract for a Policy registry that manages role-based access control policies. It provides methods to add policies for certain intents and to retrieve the access control policy for a given intent. Implementations of this interface can be used to enforce Policy policies across the application by associating roles and permissions with specific actions or intents.

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

## Methods

### addPolicy()

> **addPolicy**(`intent`, `policy`): `this`

Defined in: [.temp/xeno-shared/src/domain/contracts/policies/ipolicy-registry.contracts.ts:25](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/policies/ipolicy-registry.contracts.ts#L25)

#### Parameters

##### intent

`string`

The intent for which the policy is being added.

##### policy

[`AuthPolicy`](/shared/api-reference/interfaces/authpolicy/)

The policy to be added.

#### Returns

`this`

The current instance of the policy registry.

#### Description

Adds a policy for a specific intent. If a policy for the intent already exists, it will be updated with the new roles and permissions.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getPolicy()

> **getPolicy**(`intent`): [`Optional`](/shared/api-reference/type-aliases/optional/)\<[`AuthPolicy`](/shared/api-reference/interfaces/authpolicy/)\>

Defined in: [.temp/xeno-shared/src/domain/contracts/policies/ipolicy-registry.contracts.ts:38](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/policies/ipolicy-registry.contracts.ts#L38)

#### Parameters

##### intent

`string`

The intent for which the policy is being retrieved.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<[`AuthPolicy`](/shared/api-reference/interfaces/authpolicy/)\>

The policy associated with the intent, or undefined if no policy exists.

#### Description

Retrieves the policy for a specific intent.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
