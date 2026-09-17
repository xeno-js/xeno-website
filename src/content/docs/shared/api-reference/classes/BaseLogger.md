---
editUrl: false
next: false
prev: false
title: "BaseLogger"
---

Defined in: [.temp/xeno-shared/src/application/loggers/base.logger.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/loggers/base.logger.ts#L14)

## Description

Concrete implementation of the ILogger interface that serves as a central logging service within the application. This class is designed to broadcast log messages to multiple logging clients (implementations of ILoggerClient) that are injected via the constructor. The BaseLogger class provides methods for logging messages at different levels (info, warn, debug, error) and ensures that only messages that meet or exceed the specified minimum log level are forwarded to the registered logging clients. This design allows for flexibility in logging, enabling the use of various logging providers (e.g., Sentry, Pino) without coupling the application code to specific logging frameworks.

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

## Implements

- [`ILogger`](/shared/api-reference/interfaces/ilogger/)

## Constructors

### Constructor

> **new BaseLogger**(`_requestContext`, `config`, `loggers`): `BaseLogger`

Defined in: [.temp/xeno-shared/src/application/loggers/base.logger.ts:31](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/loggers/base.logger.ts#L31)

#### Parameters

##### \_requestContext

[`IContextAccessor`](/shared/api-reference/interfaces/icontextaccessor/)\<[`RequestContext`](/shared/api-reference/interfaces/requestcontext/)\>

The request context that provides contextual information for log messages, such as request-specific data or metadata.

##### config

[`LogLevel`](/shared/api-reference/type-aliases/loglevel/)

The minimum log level for this logger instance. Only messages with a log level equal to or higher than this level will be processed and forwarded to the logging clients.

##### loggers

[`ILoggerClient`](/shared/api-reference/interfaces/iloggerclient/)[]

An array of ILoggerClient instances that will receive log messages from this logger. Each ILoggerClient represents a different logging provider or destination (e.g., console, file, external service).

#### Returns

`BaseLogger`

#### Description

Constructs a new instance of the BaseLogger class, which takes an array of ILoggerClient instances and an optional minimum log level. The ILoggerClient instances represent the various logging providers that will receive log messages from this logger. The minimum log level determines the threshold for logging messages, where messages with a log level below the specified minimum will not be forwarded to the logging clients. This allows for efficient logging by filtering out less critical log messages based on the configured log level.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### debug()

> **debug**(`message`): `void`

Defined in: [.temp/xeno-shared/src/application/loggers/base.logger.ts:48](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/loggers/base.logger.ts#L48)

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

#### Implementation of

[`ILogger`](/shared/api-reference/interfaces/ilogger/).[`debug`](/shared/api-reference/interfaces/ilogger/#debug)

***

### error()

> **error**(`message`, `error`): `void`

Defined in: [.temp/xeno-shared/src/application/loggers/base.logger.ts:52](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/loggers/base.logger.ts#L52)

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

#### Implementation of

[`ILogger`](/shared/api-reference/interfaces/ilogger/).[`error`](/shared/api-reference/interfaces/ilogger/#error)

***

### info()

> **info**(`message`): `void`

Defined in: [.temp/xeno-shared/src/application/loggers/base.logger.ts:40](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/loggers/base.logger.ts#L40)

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

#### Implementation of

[`ILogger`](/shared/api-reference/interfaces/ilogger/).[`info`](/shared/api-reference/interfaces/ilogger/#info)

***

### warn()

> **warn**(`message`): `void`

Defined in: [.temp/xeno-shared/src/application/loggers/base.logger.ts:44](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/application/loggers/base.logger.ts#L44)

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

#### Implementation of

[`ILogger`](/shared/api-reference/interfaces/ilogger/).[`warn`](/shared/api-reference/interfaces/ilogger/#warn)
