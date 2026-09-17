---
editUrl: false
next: false
prev: false
title: "SchemaConfig"
---

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:127

## Description

Configuration for caching, allowing the enabling of Redis integration or the use of a custom cache. If enabled, the query bus and command bus (in case of idempotency) pipelines will use the configured cache system to store and retrieve data efficiently. The configuration includes specific details for Redis integration, such as host, port, and credentials, as well as the ability to define a custom cache via injection tokens, providing flexibility in how the cache is implemented and used within the application.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### TSchema

`TSchema`

## Properties

### schemas

> **schemas**: [`Dictionary`](/core/api-reference/type-aliases/dictionary/)\<`TSchema`\>

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:135

#### Description

A record of Zod schemas, where each key represents a specific command or query type, and the corresponding value is the Zod schema used to validate that type. If provided, the validation pipeline will use these schemas to validate incoming requests, ensuring that they conform to the expected format and contain valid data before being processed further. This allows for powerful and flexible validation rules based on the structure and content of commands and queries.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
