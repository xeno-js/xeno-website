---
editUrl: false
next: false
prev: false
title: "InjectionToken"
---

Defined in: .temp/xeno-shared/dist/shared/types/injection-token.types.d.ts:19

## Description

A typed injection token that binds a runtime `symbol` to a
compile-time type `T` via a phantom property.

Using a `unique symbol` phantom key guarantees that `InjectionToken<A>`
and `InjectionToken<B>` are always structurally distinct, regardless of
how similar `A` and `B` are. This prevents accidental cross-token resolution
such as `container.resolve<IBlogService>(userRepositoryToken)`.

Tokens must be created exclusively through createToken.

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

## Properties

### \[\_phantom\]

> `readonly` **\[\_phantom\]**: `T`

Defined in: .temp/xeno-shared/dist/shared/types/injection-token.types.d.ts:35

#### Description

Phantom property to bind the generic type `T` to this token.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### symbol

> `readonly` **symbol**: `symbol`

Defined in: .temp/xeno-shared/dist/shared/types/injection-token.types.d.ts:27

#### Description

The unique symbol that identifies this token at runtime.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
