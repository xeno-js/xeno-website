---
editUrl: false
next: false
prev: false
title: "IRequestContext"
---

Defined in: .temp/xeno-js/src/domain/contracts/context/irequest.context.ts:23

An interface for managing user identity context within the application. This interface provides methods for executing asynchronous functions with the current user's identity context and retrieving the current user's identity information. It allows for seamless integration of identity management into various parts of the application, ensuring that identity-related data is properly propagated and accessible when needed.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extends

- [`IBaseAccessor`](/core/api-reference/interfaces/ibaseaccessor/)\<`TCtx`\>.[`IServiceScopeAccessor`](/core/api-reference/interfaces/iservicescopeaccessor/)\<`TRegistry`\>

## Type Parameters

### TCtx

`TCtx`

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/) = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)

## Methods

### getContext()

> **getContext**(): [`Optional`](/core/api-reference/type-aliases/optional/)\<`TCtx`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:45

Retrieves the current context, which can include information about the identity of the user or system executing the request, as well as network and tracing contexts for observability. This method allows for synchronous access to context-related data when needed.

#### Returns

[`Optional`](/core/api-reference/type-aliases/optional/)\<`TCtx`\>

An object representing the current context, containing properties such as identity, network, and tracing contexts. This information can be used for managing execution context and ensuring that context-related data is accessible when needed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Inherited from

[`IBaseAccessor`](/core/api-reference/interfaces/ibaseaccessor/).[`getContext`](/core/api-reference/interfaces/ibaseaccessor/#getcontext)

***

### getIdentity()

> **getIdentity**(): [`Optional`](/core/api-reference/type-aliases/optional/)\<[`Identity`](/core/api-reference/interfaces/identity/)\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:24

Retrieves the current user's identity information, including user ID, roles, and correlation ID. This method can be used to access identity data outside of the context of an asynchronous function, allowing for synchronous access to identity information when needed.

#### Returns

[`Optional`](/core/api-reference/type-aliases/optional/)\<[`Identity`](/core/api-reference/interfaces/identity/)\>

An object representing the current user's identity, containing properties such as user ID, roles, and correlation ID. This information can be used for authentication and authorization purposes throughout the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Inherited from

[`IBaseAccessor`](/core/api-reference/interfaces/ibaseaccessor/).[`getIdentity`](/core/api-reference/interfaces/ibaseaccessor/#getidentity)

***

### getNetworkContext()

> **getNetworkContext**(): [`Optional`](/core/api-reference/type-aliases/optional/)\<[`NetworkContext`](/core/api-reference/interfaces/networkcontext/)\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/irequest-context.contracts.d.ts:66

Retrieves the current network context, which can include information about the request ID, correlation ID, and other network-related data. This method allows for synchronous access to network context-related data when needed.

#### Returns

[`Optional`](/core/api-reference/type-aliases/optional/)\<[`NetworkContext`](/core/api-reference/interfaces/networkcontext/)\>

An object representing the current network context, containing properties such as request ID, correlation ID, and other network-related data. This information can be used for managing execution context and ensuring that network context-related data is accessible when needed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Inherited from

[`IBaseAccessor`](/core/api-reference/interfaces/ibaseaccessor/).[`getNetworkContext`](/core/api-reference/interfaces/ibaseaccessor/#getnetworkcontext)

***

### getScope()

> **getScope**(): [`Optional`](/core/api-reference/type-aliases/optional/)\<[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`TRegistry`\>\>

Defined in: .temp/xeno-js/src/domain/contracts/context/irequest.context.ts:62

Retrieves the current service scope, which allows for managing dependencies during the execution of a request. This method enables access to the service scope, ensuring that services are properly scoped and disposed of after the request is processed.

#### Returns

[`Optional`](/core/api-reference/type-aliases/optional/)\<[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`TRegistry`\>\>

An object representing the current service scope, allowing for resolution of dependencies and management of services during the execution of a request.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Inherited from

[`IServiceScopeAccessor`](/core/api-reference/interfaces/iservicescopeaccessor/).[`getScope`](/core/api-reference/interfaces/iservicescopeaccessor/#getscope)

***

### runAsync()

> **runAsync**\<`T`\>(`ctx`, `fn`): `Promise`\<`T`\>

Defined in: .temp/xeno-js/src/domain/contracts/context/irequest.context.ts:36

Executes the provided asynchronous function with the current user's identity context. This allows the function to access identity information such as user ID, roles, and correlation ID while performing its operations. The function will be executed within the scope of the current request's identity, ensuring that any identity-related data is properly propagated throughout the execution flow.

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### ctx

`TCtx`

The current user's identity context.

##### fn

() => `Promise`\<`T`\>

An asynchronous function that takes the current user's identity as an argument and returns a promise of type T. This function will be executed with the identity context of the current request.

#### Returns

`Promise`\<`T`\>

A promise that resolves to the result of the provided function, allowing the caller to handle the outcome of the operation performed within the identity context.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### updateIdentity()

> **updateIdentity**(`identity`): `void`

Defined in: .temp/xeno-js/src/domain/contracts/context/irequest.context.ts:38

#### Parameters

##### identity

[`Identity`](/core/api-reference/interfaces/identity/)

#### Returns

`void`
