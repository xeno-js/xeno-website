---
editUrl: false
next: false
prev: false
title: "InjectionToken"
---

Defined in: [.temp/xeno-shared/src/shared/types/injection-token.types.ts:23](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/injection-token.types.ts#L23)

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

Defined in: [.temp/xeno-shared/src/shared/types/injection-token.types.ts:39](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/injection-token.types.ts#L39)

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

Defined in: [.temp/xeno-shared/src/shared/types/injection-token.types.ts:31](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/injection-token.types.ts#L31)

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
