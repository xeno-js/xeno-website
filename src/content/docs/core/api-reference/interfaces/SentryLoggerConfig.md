---
editUrl: false
next: false
prev: false
title: "SentryLoggerConfig"
---

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:88

## Description

Interface defining the structure of the configuration object required to initialize a logger. This includes properties such as the Data Source Name (DSN) for connecting to the logging service, the environment in which the application is running (e.g., development, production), and the minimum log level that should be captured by the logger.

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

## Properties

### dsn

> **dsn**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:99

#### Description

The Data Source Name (DSN) is a string that provides the necessary information for the logger to connect to the logging service. It typically includes the protocol, public key, secret key, host, and project ID. The DSN is essential for authenticating and routing log data to the correct destination in the logging infrastructure.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### environment

> **environment**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-js/src/domain/config/logger.config.ts:110

#### Description

The environment property indicates the context in which the application is running, such as 'development', 'staging', or 'production'. This information can be used by the logging service to categorize and filter logs based on the environment, allowing for better organization and analysis of log data.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
