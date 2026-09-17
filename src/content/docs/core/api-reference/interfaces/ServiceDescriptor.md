---
editUrl: false
next: false
prev: false
title: "ServiceDescriptor"
---

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-descriptor.contracts.ts:36

## Description

Describes a service registration in the container, including
the implementation constructor, its dependencies, and its lifetime.

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

## Type Parameters

### T

`T`

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

## Properties

### factory

> `readonly` **factory**: (`container`) => `T`

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-descriptor.contracts.ts:71

#### Parameters

##### container

[`IServiceProvider`](/core/api-reference/interfaces/iserviceprovider/)\<`TRegistry`\>

#### Returns

`T`

#### Description

Factory function to create the service instance.
This factory will be used instead of the constructor.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### lifetime

> `readonly` **lifetime**: [`Lifetime`](/core/api-reference/type-aliases/lifetime/)

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-descriptor.contracts.ts:60

#### Description

The lifetime of the service, determining how instances are
managed and cached by the container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### token

> `readonly` **token**: keyof `TRegistry`

Defined in: .temp/xeno-js/src/domain/contracts/container/iservice-descriptor.contracts.ts:49

#### Description

The injection token that uniquely identifies this service registration.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
