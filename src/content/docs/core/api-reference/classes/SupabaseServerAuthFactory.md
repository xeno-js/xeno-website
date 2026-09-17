---
editUrl: false
next: false
prev: false
title: "SupabaseServerAuthFactory"
---

Defined in: .temp/xeno-js/src/infrastructure/factories/supabase.factory.ts:20

## Description

Generic factory type for creating instances of a given type `T`.
The factory can be used in two ways: as a simple provider that takes no arguments, or as a parameterized creator that accepts a single input of type `TInput`.

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

`TRegistry` *extends* [`XenoRegistry`](/core/api-reference/type-aliases/xenoregistry/) = [`XenoRegistry`](/core/api-reference/type-aliases/xenoregistry/)

The type of the input parameter for the factory method.

## Implements

- [`IFactory`](/core/api-reference/interfaces/ifactory/)\<`SupabaseServerAuthFactoryInput`\<`TRegistry`\>, [`IExtendendService`](/core/api-reference/interfaces/iextendendservice/)\>

## Constructors

### Constructor

> **new SupabaseServerAuthFactory**\<`TRegistry`\>(): `SupabaseServerAuthFactory`\<`TRegistry`\>

#### Returns

`SupabaseServerAuthFactory`\<`TRegistry`\>

## Methods

### create()

> **create**(`input`): [`IExtendendService`](/core/api-reference/interfaces/iextendendservice/)

Defined in: .temp/xeno-js/src/infrastructure/factories/supabase.factory.ts:23

Creates an instance of `Output` using the provided `input` of type `TInput`.

#### Parameters

##### input

`SupabaseServerAuthFactoryInput`\<`TRegistry`\>

The input data required to create the instance.

#### Returns

[`IExtendendService`](/core/api-reference/interfaces/iextendendservice/)

An instance of type `Output`.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

`IFactory.create`
