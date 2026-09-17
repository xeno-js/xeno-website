---
editUrl: false
next: false
prev: false
title: "IServiceProvider"
---

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-container.contracts.ts:14

## Fileoverview

Defines the IServiceContainer interface for a dependency injection container.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Extended by

- [`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)

## Type Parameters

### Registry

`Registry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

## Methods

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
