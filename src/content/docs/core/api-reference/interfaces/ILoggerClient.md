---
editUrl: false
next: false
prev: false
title: "ILoggerClient"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger-client.contracts.d.ts:11

## Description

Interface for a logger client that provides a method for tracking log messages with a specified log level, message, optional context, and optional error.

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

## Methods

### track()

> **track**\<`T`\>(`level`, `message`, `context`, `error`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger-client.contracts.d.ts:25

Track a log message with a specified log level, message, optional context, and optional error.

#### Type Parameters

##### T

`T`

#### Parameters

##### level

[`LogLevel`](/core/api-reference/type-aliases/loglevel/)

The log level (e.g., info, warn, error, debug) for the log message.

##### message

`string`

The message to be logged.

##### context

[`Optional`](/core/api-reference/type-aliases/optional/)\<`T`\>

An optional dictionary containing additional context for the log message.

##### error

`unknown`

An optional unknown object associated with the log message.

#### Returns

`void`

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
