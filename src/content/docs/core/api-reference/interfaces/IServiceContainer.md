---
editUrl: false
next: false
prev: false
title: "IServiceContainer"
---

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:48

## Description

Agnostic contract for a dependency injection container that mimics
the .NET ServiceCollection builder pattern.

Each registration method returns `this` to enable a fluent builder chain.
Dependencies are expressed as an ordered array of injection tokens
that the container will resolve and inject into the constructor.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extends

- [`IServiceProvider`](/core/api-reference/interfaces/iserviceprovider/)\<`Registry`\>.[`IDisposable`](/core/api-reference/interfaces/idisposable/)

## Type Parameters

### Registry

`Registry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

## Methods

### addScoped()

> **addScoped**\<`K`\>(`token`, `factory`): `this`

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:104

Registers an implementation under the given token with **scoped** lifetime.
One instance is created per logical scope (e.g. per HTTP request).
Scoped services must be resolved through an [IServiceScope](/core/api-reference/interfaces/iservicescope/) obtained
via [createScope](/core/api-reference/interfaces/iservicecontainer/#createscope); resolving them directly from the root container throws.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### token

`K`

The unique injection token that identifies this service binding.

##### factory

[`Factory`](/core/api-reference/type-aliases/factory/)\<`Registry`\[`K`\], \[[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`Registry`\>\]\>

Factory function that creates the service instance, receiving the scope as an argument.

#### Returns

`this`

The container instance to allow method chaining.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addSingleton()

> **addSingleton**\<`K`\>(`token`, `factory`): `this`

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:66

Registers an implementation under the given token with **singleton** lifetime.
A single instance is created on first resolution and reused for every
subsequent call within the container's lifetime.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### token

`K`

The unique injection token that identifies this service binding.

##### factory

[`Factory`](/core/api-reference/type-aliases/factory/)\<`Registry`\[`K`\], \[[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`Registry`\>\]\>

Factory function that creates the service instance, receiving the scope as an argument.

#### Returns

`this`

The container instance to allow method chaining.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addTransient()

> **addTransient**\<`K`\>(`token`, `factory`): `this`

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:84

Registers an implementation under the given token with **transient** lifetime.
A new instance is created on every call to [resolve](/core/api-reference/interfaces/iservicecontainer/#resolve).

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### token

`K`

The unique injection token that identifies this service binding.

##### factory

[`Factory`](/core/api-reference/type-aliases/factory/)\<`Registry`\[`K`\], \[[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`Registry`\>\]\>

Factory function that creates the service instance, receiving the scope as an argument.

#### Returns

`this`

The container instance to allow method chaining.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### createScope()

> **createScope**(): [`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`Registry`\>

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:123

Creates a new [IServiceScope](/core/api-reference/interfaces/iservicescope/).

The returned scope shares singleton instances with the root container
and maintains its own isolated cache for scoped services.
Call [IServiceScope.dispose](/core/api-reference/interfaces/idisposable/#dispose) when the scope is no longer needed.

#### Returns

[`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`Registry`\>

A new scope instance.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

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

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:32

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

#### Inherited from

[`IServiceProvider`](/core/api-reference/interfaces/iserviceprovider/).[`resolve`](/core/api-reference/interfaces/iserviceprovider/#resolve)
