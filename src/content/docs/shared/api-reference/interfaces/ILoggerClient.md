---
editUrl: false
next: false
prev: false
title: "ILoggerClient"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger-client.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger-client.contracts.ts#L12)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger-client.contracts.ts:26](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger-client.contracts.ts#L26)

Track a log message with a specified log level, message, optional context, and optional error.

#### Type Parameters

##### T

`T`

#### Parameters

##### level

[`LogLevel`](/shared/api-reference/type-aliases/loglevel/)

The log level (e.g., info, warn, error, debug) for the log message.

##### message

`string`

The message to be logged.

##### context

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`T`\>

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
