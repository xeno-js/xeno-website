---
editUrl: false
next: false
prev: false
title: "XenoRegistry"
---

> **XenoRegistry**\<`TSchema`, `TExtensions`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<[`DbContext`](/core/api-reference/type-aliases/dbcontext/)\<`TSchema`\>, [`DbTransaction`](/core/api-reference/type-aliases/dbtransaction/)\> & `Readonly`\<`Omit`\<`TExtensions`, keyof [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<[`DbContext`](/core/api-reference/type-aliases/dbcontext/), [`DbTransaction`](/core/api-reference/type-aliases/dbtransaction/)\>\>\>

Defined in: .temp/xeno-js/src/infrastructure/xeno-registry/xeno-registry.types.ts:14

## Type Parameters

### TSchema

`TSchema` *extends* [`Dictionary`](/core/api-reference/type-aliases/dictionary/) = [`Dictionary`](/core/api-reference/type-aliases/dictionary/)

### TExtensions

`TExtensions` = `object`

## Description

The XenoRegistry type is an alias for the ApplicationRegistry specialized with DbContext. It represents the registry of application services and dependencies, specifically tailored for applications that utilize a database context. This type is used throughout the application to ensure consistent typing and to facilitate dependency injection and service resolution.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js
