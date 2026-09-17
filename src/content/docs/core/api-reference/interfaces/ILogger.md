---
editUrl: false
next: false
prev: false
title: "ILogger"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger.contracts.d.ts:11

## Description

Interface for a logger that provides methods for logging messages at different levels (info, warn, error, debug) and tracking exceptions. Each logging method accepts a message and an optional context, while the error method also accepts an optional Error object.

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

### debug()

> **debug**(`message`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger.contracts.d.ts:60

Log a message at the debug level with an optional context.

#### Parameters

##### message

`string`

The message to log.

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

***

### error()

> **error**(`message`, `error`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger.contracts.d.ts:48

Log a message at the error level with an optional error object and context.

#### Parameters

##### message

`string`

The message to log.

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

***

### info()

> **info**(`message`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger.contracts.d.ts:23

Log a message at the info level with an optional context.

#### Parameters

##### message

`string`

The message to log.

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

***

### warn()

> **warn**(`message`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/loggers/ilogger.contracts.d.ts:35

Log a message at the warning level with an optional context.

#### Parameters

##### message

`string`

The message to log.

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
