---
editUrl: false
next: false
prev: false
title: "AppBuilder"
---

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:47

## Description

The AppBuilder class provides a fluent, .NET-style API for configuring and bootstrapping the application.
It orchestrates the registration of various modules (CQRS, HTTP, Database, Logging, Auth) into the ServiceContainer.

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

`TRegistry` *extends* [`XenoRegistry`](/core/api-reference/type-aliases/xenoregistry/) = [`XenoRegistry`](/core/api-reference/type-aliases/xenoregistry/)

## Constructors

### Constructor

> **new AppBuilder**\<`TRegistry`\>(`container?`): `AppBuilder`\<`TRegistry`\>

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:51

#### Parameters

##### container?

[`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)\<`TRegistry`\>

#### Returns

`AppBuilder`\<`TRegistry`\>

## Methods

### addAllowOrigin()

> **addAllowOrigin**(`setupAction`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:365

#### Parameters

##### setupAction

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<`string`[], [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

***

### addAuth()

> **addAuth**(`setupAction`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:232

#### Parameters

##### setupAction

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`AuthSsrConfig`](/core/api-reference/interfaces/authssrconfig/)\<`SupabaseClientOptions`\<`"public"`\>, [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`, `unknown`\>\>, [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives an AuthClientConfig object to configure the authentication client settings.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Configures the authentication client for the application. This method allows you to set up authentication options such as the authentication server URL, API key, and additional options.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addCache()

> **addCache**(`setupAction?`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:205

#### Parameters

##### setupAction?

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`CacheConfig`](/core/api-reference/interfaces/cacheconfig/), [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives a CacheConfig object to configure the caching settings.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Configures the caching settings for the application. This method allows you to set up caching options such as Redis configuration or in-memory caching.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addConcurrencyService()

> **addConcurrencyService**(): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:295

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Enables the use of the service for concurrency control in the application. This method allows you to limit the number of concurrent asynchronous tasks being executed, which is useful for managing system resources and preventing event loop blocking during massive batch operations.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addContext()

> **addContext**(): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:152

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Enables the use of context in the application. Context can be used to store and manage request-specific data, such as user information, correlation IDs, and other metadata that needs to be accessible throughout the request lifecycle.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addDb()

> **addDb**(`setupAction`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:268

#### Parameters

##### setupAction

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`DbConfig`](/core/api-reference/interfaces/dbconfig/), [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives a DbConfig object to configure the database settings.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Configures the database settings for the application. This method allows you to set up database options such as enabling/disabling the database, connection string, and table definitions.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addHttpCore()

> **addHttpCore**(`setupAction`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:349

#### Parameters

##### setupAction

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`HttpCoreConfig`](/core/api-reference/interfaces/httpcoreconfig/)\<`TRegistry`\>, [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives an HttpCoreConfig object to configure the HTTP core settings.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Configures the HTTP core settings for the application. This method allows you to set up HTTP core options such as data source token, HTTP client configuration, and resilience settings.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addLogger()

> **addLogger**(`setupAction?`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:168

#### Parameters

##### setupAction?

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`LoggerConfig`](/core/api-reference/interfaces/loggerconfig/)\<`TRegistry`\>, [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives a LoggerConfig object to configure the logger settings.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Configures the logger for the application. This method allows you to set up logging options such as log level, console logging, and integration with external logging services like Sentry or Pino.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addMiddlewares()

> **addMiddlewares**(`setupAction`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:136

#### Parameters

##### setupAction

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`MiddlewareConfig`](/core/api-reference/interfaces/middlewareconfig/), [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Enables the use of middlewares in the application. Middlewares can be used for cross-cutting concerns such as logging, authentication, and request/response manipulation.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addModule()

> **addModule**\<`T`\>(`name`, `factory`, `opts?`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:419

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

##### factory

() => `Promise`\<[`IModule`](/core/api-reference/interfaces/imodule/)\<`TRegistry`, `T`\>\>

A factory function that creates the module instance.

##### opts?

`T`

Optional configuration options for the module.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Registers a module in the application. A module is a self-contained unit of functionality that can configure services and dependencies in the service container. This method allows you to add custom modules to the application, enabling modular and organized configuration of services.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addPipeline()

> **addPipeline**(`setupAction?`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:324

#### Parameters

##### setupAction?

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`PipelineConfig`](/core/api-reference/interfaces/pipelineconfig/)\<`TRegistry`, `unknown`\>, [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives a PipelineConfig object to configure the CQRS pipeline settings.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Configures the CQRS pipeline settings for the application. This method allows you to set up various aspects of the CQRS pipeline, including performance monitoring, authorization, validation, command bus settings, and query bus settings.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### addServices()

> **addServices**(`setupAction`): `this`

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:394

#### Parameters

##### setupAction

[`SetupAction`](/core/api-reference/type-aliases/setupaction/)\<[`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)\<`TRegistry`\>, [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)\>

A callback function that receives the IServiceContainer to register services.

#### Returns

`this`

The current instance of AppBuilder for method chaining.

#### Description

Registers services in the application. This method allows you to add custom services to the dependency injection container, enabling modular and organized configuration of services.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### build()

> **build**(): `Promise`\<[`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)\<`TRegistry`\>\>

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:460

#### Returns

`Promise`\<[`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)\<`TRegistry`\>\>

The fully configured ServiceContainer.

#### Description

Finalizes the configuration and initializes all registered modules in the container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### resolve()

> **resolve**\<`K`\>(`token`): `TRegistry`\[`K`\]

Defined in: .temp/xeno-js/src/infrastructure/builder/app.builder.ts:442

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### token

`K`

The injection token used to identify the service.

#### Returns

`TRegistry`\[`K`\]

The resolved service instance.

#### Description

Resolves a service from the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
