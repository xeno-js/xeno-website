---
editUrl: false
next: false
prev: false
title: "IModule"
---

Defined in: .temp/xeno-js/src/domain/contracts/modules/imodule.contracts.ts:20

## Description

Represents a module that can be registered with the service container.

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

## Type Parameters

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

### TOptions

`TOptions` = `unknown`

The type of configuration options for the module.

  * 
  *

## Methods

### configure()

> **configure**(`container`, `opts?`): `Promise`\<`void`\>

Defined in: .temp/xeno-js/src/domain/contracts/modules/imodule.contracts.ts:36

#### Parameters

##### container

[`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)\<`TRegistry`\>

The service container to register services with.

##### opts?

[`Optional`](/core/api-reference/type-aliases/optional/)\<`TOptions`\>

The configuration options for the module.

#### Returns

`Promise`\<`void`\>

#### Description

Configures the module with the provided options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
