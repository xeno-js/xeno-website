---
editUrl: false
next: false
prev: false
title: "LoggerConfig"
---

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:15

## Description

Interface defining the structure of a logger configuration object. This includes properties such as the minimum log level that should be captured by the logger. The log level determines the severity of log messages that will be processed and forwarded to the logging clients, allowing developers to control the verbosity of logs based on the needs of the application and its operational context.

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

### TRegistry

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/) = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)

## Properties

### console

> **console**: `boolean`

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:34

#### Description

Flag to enable or disable console logging. If set to true, log messages will be output to the console. If set to false or not defined, console logging will be disabled, and log messages will not be output to the console.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### customLoggers

> **customLoggers**: [`Optional`](/core/api-reference/type-aliases/optional/)\<(`container`) => [`ILoggerClient`](/core/api-reference/interfaces/iloggerclient/)\>[]

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:76

#### Description

Optional array of custom logger clients to be used in addition to the built-in console, Sentry, and Pino loggers. If provided, these custom loggers will be registered and used for capturing and managing log messages based on their respective configurations. If not defined or empty, only the enabled built-in loggers will be used.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### level

> **level**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`LogLevel`](/core/api-reference/type-aliases/loglevel/)\>

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:26

#### Description

The level property specifies the minimum log level that should be captured by the logger. Log levels typically include DEBUG, INFO, WARN, and ERROR, with each level representing a different severity of log messages. By setting the log level, developers can control the verbosity of the logs and ensure that only relevant information is captured based on the needs of the application and its operational context.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### pino

> **pino**: `object`

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:59

#### config

> **config**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`PinoLoggerConfig`](/core/api-reference/interfaces/pinologgerconfig/)\>

##### Description

Optional configuration for Pino logger integration, including details such as the destination for log output. If provided, this configuration will be used to initialize the Pino logger client for capturing and managing log messages. If not defined, default Pino configuration settings will be used.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

Optional configuration for Pino logger integration. If provided and enabled, the application will use Pino as a logging client to capture and manage log messages. The configuration includes specific details for Pino integration, such as the destination for log output, allowing for flexible and modular logging configuration in the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### sentry

> **sentry**: `object`

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:42

#### config

> **config**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`SentryLoggerConfig`](/core/api-reference/interfaces/sentryloggerconfig/)\>

##### Description

Optional configuration for Sentry logger integration, including details such as the Data Source Name (DSN) and environment. If provided, this configuration will be used to initialize the Sentry logger client for capturing and reporting log messages to the Sentry service. If not defined, default Sentry configuration settings will be used.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

Optional configuration for Sentry logger integration. If provided and enabled, the application will use Sentry as a logging client to capture and report log messages to the Sentry service. The configuration includes specific details for Sentry integration, such as the Data Source Name (DSN) and environment, allowing for flexible and modular logging configuration in the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
