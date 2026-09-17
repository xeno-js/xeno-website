---
editUrl: false
next: false
prev: false
title: "ILogger"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger.contracts.ts#L12)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger.contracts.ts:61](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger.contracts.ts#L61)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger.contracts.ts:49](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger.contracts.ts#L49)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger.contracts.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger.contracts.ts#L24)

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

Defined in: [.temp/xeno-shared/src/domain/contracts/loggers/ilogger.contracts.ts:36](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/loggers/ilogger.contracts.ts#L36)

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
