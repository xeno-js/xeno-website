---
editUrl: false
next: false
prev: false
title: "IFactory"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/factories/ifactory.contracts.d.ts:15

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

### TInput

`TInput`

The type of the input parameter for the factory method.

### TOutput

`TOutput`

The type of the output produced by the factory method.

  *
  *

## Properties

### create

> **create**: [`Factory`](/core/api-reference/type-aliases/factory/)\<`TOutput`, \[`TInput`\]\>

Defined in: .temp/xeno-shared/dist/domain/contracts/factories/ifactory.contracts.d.ts:27

Creates an instance of `Output` using the provided `input` of type `TInput`.

#### Param

**input**

The input data required to create the instance.

#### Returns

An instance of type `Output`.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
