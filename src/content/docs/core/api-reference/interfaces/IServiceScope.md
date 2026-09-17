---
editUrl: false
next: false
prev: false
title: "IServiceScope"
---

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-scope.contracts.ts:30

## Description

Represents a logical scope for resolving scoped services,
mimicking the .NET `IServiceScope` pattern.

A scope is created by [IServiceContainer.createScope](/core/api-reference/interfaces/iservicecontainer/#createscope) and provides
its own isolated instance cache for services registered with scoped lifetime.
Singleton and transient services are still resolved through the root container.

Call [dispose](/core/api-reference/interfaces/idisposable/#dispose) when the scope is no longer needed to release all
scoped instances and invalidate the scope.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extends

- [`IDisposable`](/core/api-reference/interfaces/idisposable/)

## Type Parameters

### Registry

`Registry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/disposables/idisposable.contracts.d.ts:21

#### Returns

`Promise`\<`void`\>

A promise that resolves when the disposal process is complete.

#### Description

Disposes of the resource, releasing any held resources and performing necessary cleanup. This method should be called when the resource is no longer needed to ensure proper cleanup and avoid resource leaks.

#### Inherited from

[`IDisposable`](/core/api-reference/interfaces/idisposable/).[`dispose`](/core/api-reference/interfaces/idisposable/#dispose)

***

### resolve()

> **resolve**\<`K`\>(`token`): `Registry`\[`K`\]

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-scope.contracts.ts:48

Resolves and returns the service registered under the given token.
Scoped services can only be resolved through a scope;
resolving them directly from the root container throws an error.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### token

`K`

The injection token identifying the service to resolve.

#### Returns

`Registry`\[`K`\]

The resolved service instance of type `T`.

#### Throws

An error if no registration is found for the given token.

#### Throws

An error if the scope has already been disposed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
