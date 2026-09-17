---
editUrl: false
next: false
prev: false
title: "BaseAuthorizationStrategy"
---

Defined in: .temp/xeno-js/src/application/cqrs/pipelines/pipeline\_strategies/auth/base-authorization.strategy.ts:20

## Description

Abstract base class for authorization strategies in the CQRS pipeline. This class implements the IStrategy interface and provides a common structure for performing authorization checks based on the identity of the authenticated user. It defines an abstract method performAuthorizationCheck that must be implemented by concrete authorization strategies to specify the logic for checking if the user has the necessary permissions to execute a given request. The execute method retrieves the user's identity from the request context and ensures that the user is authenticated before delegating to the performAuthorizationCheck method for further authorization validation. If the user is not authenticated, it returns a failed Result with an appropriate AppError indicating that authentication is required.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### TInput

`TInput` *extends* [`IRequest`](/core/api-reference/interfaces/irequest/)

## Implements

- [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<`TInput`\>

## Constructors

### Constructor

> **new BaseAuthorizationStrategy**\<`TInput`\>(`_requestContext`): `BaseAuthorizationStrategy`\<`TInput`\>

Defined in: .temp/xeno-js/src/application/cqrs/pipelines/pipeline\_strategies/auth/base-authorization.strategy.ts:32

#### Parameters

##### \_requestContext

[`IContextAccessor`](/core/api-reference/interfaces/icontextaccessor/)\<[`RequestContext`](/core/api-reference/interfaces/requestcontext/)\>

#### Returns

`BaseAuthorizationStrategy`\<`TInput`\>

#### Description

Constructs a new instance of the BaseAuthorizationStrategy class, which serves as an abstract base for specific authorization strategies in the CQRS pipeline. It takes an IRequestContext as a parameter, which is used to retrieve the identity of the currently authenticated user during the authorization process. This context is essential for performing the authorization checks based on the user's identity when executing requests that require specific permissions.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### execute()

> **execute**(`request`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

Defined in: .temp/xeno-js/src/application/cqrs/pipelines/pipeline\_strategies/auth/base-authorization.strategy.ts:34

#### Parameters

##### request

[`IRequest`](/core/api-reference/interfaces/irequest/)

#### Returns

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`void`\>\>

A Promise that resolves to a ResultType indicating the outcome of the strategy's execution. The ResultType should indicate success if the authorization checks pass, or contain an error if the checks fail, allowing the pipeline to handle the result accordingly.

#### Description

Executes the strategy's logic for the given context. This method is called by the authorization pipeline when a strategy is deemed applicable. The implementation of this method should perform the necessary checks to determine if the request is authorized, and return a ResultType indicating the outcome of the authorization process. The ResultType should indicate success if the authorization checks pass, or contain an error if the checks fail, allowing the pipeline to handle the result accordingly.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IStrategy`](/core/api-reference/interfaces/istrategy/).[`execute`](/core/api-reference/interfaces/istrategy/#execute)
