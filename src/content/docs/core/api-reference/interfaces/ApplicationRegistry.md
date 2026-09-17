---
editUrl: false
next: false
prev: false
title: "ApplicationRegistry"
---

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:61

## Description

This file defines the injection tokens used for dependency injection in the application.
Injection tokens are unique identifiers that are used to register and resolve dependencies in the container.
They can be symbols, strings, or classes, but using symbols is a common practice to avoid naming collisions.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Type Parameters

### T

`T` = `unknown`

### Ttx

`Ttx` = `unknown`

## Properties

### ALLOW\_METHOD

> `readonly` **ALLOW\_METHOD**: [`IAllowMethod`](/core/api-reference/interfaces/iallowmethod/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:63

***

### ALLOW\_ORIGIN

> `readonly` **ALLOW\_ORIGIN**: [`IAllowOrigin`](/core/api-reference/interfaces/ialloworigin/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:62

***

### AUTH\_MIDDLEWARE

> `readonly` **AUTH\_MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:254

***

### AUTH\_SERVICE

> `readonly` **AUTH\_SERVICE**: [`IExtendendService`](/core/api-reference/interfaces/iextendendservice/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:80

#### Description

Token used to register and resolve the AuthService instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### AUTHORIZATION\_PIPELINE

> `readonly` **AUTHORIZATION\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:71

#### Description

Token used to register and resolve the AuthorizationPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### BASE\_AUTH\_SERVICE

> `readonly` **BASE\_AUTH\_SERVICE**: [`IBaseAuthService`](/core/api-reference/interfaces/ibaseauthservice/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:82

***

### BEARER\_TOKEN\_EXTRACTOR

> `readonly` **BEARER\_TOKEN\_EXTRACTOR**: [`IServiceExtractor`](/core/api-reference/interfaces/iserviceextractor/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/), [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:91

#### Description

Token used to register and resolve the BearerTokenExtractor instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CACHE

> `readonly` **CACHE**: [`ICache`](/core/api-reference/interfaces/icache/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:100

#### Description

Token used to register and resolve the InMemoryCache instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CACHE\_KEY\_BUILDER

> `readonly` **CACHE\_KEY\_BUILDER**: [`ICacheKeyBuilder`](/core/api-reference/interfaces/icachekeybuilder/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:109

#### Description

Token used to register and resolve the CacheKeyBuilder instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CLAIMS\_IDENTITY\_MAPPER

> `readonly` **CLAIMS\_IDENTITY\_MAPPER**: [`IBaseMapper`](/core/api-reference/interfaces/ibasemapper/)\<[`AuthClaims`](/core/api-reference/interfaces/authclaims/), [`Identity`](/core/api-reference/interfaces/identity/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:118

#### Description

Token used to register and resolve the ClaimsIdentityMapper instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### COMMAND\_PIPELINES\_BEHAVIOR

> `readonly` **COMMAND\_PIPELINES\_BEHAVIOR**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`ICommand`](/core/api-reference/interfaces/icommand/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:127

#### Description

Token used to register and resolve the CommandPipeline behaviors in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### COMPOSITE\_PIPELINE

> `readonly` **COMPOSITE\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IQuery`](/core/api-reference/interfaces/iquery/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:136

#### Description

Token used to register and resolve the CompositePipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CONCURRENCY\_RETRY\_PIPELINE

> `readonly` **CONCURRENCY\_RETRY\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`ICommand`](/core/api-reference/interfaces/icommand/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:145

#### Description

Token used to register and resolve the ConcurrencyRetryPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CONCURRENCY\_SERVICE

> `readonly` **CONCURRENCY\_SERVICE**: [`IConcurrencyService`](/core/api-reference/interfaces/iconcurrencyservice/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:154

#### Description

Token used to register and resolve the ConcurrencyService instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CONFIGURATION\_SERVICE

> `readonly` **CONFIGURATION\_SERVICE**: [`IConfigurationService`](/core/api-reference/interfaces/iconfigurationservice/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:163

#### Description

Token used to register and resolve the ConfigurationService instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CONSOLE\_LOGGER

> `readonly` **CONSOLE\_LOGGER**: [`ILoggerClient`](/core/api-reference/interfaces/iloggerclient/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:172

#### Description

Token used to register and resolve the ConsoleLogger instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CONTEXT\_ACCESSOR

> `readonly` **CONTEXT\_ACCESSOR**: [`IContextAccessor`](/core/api-reference/interfaces/icontextaccessor/)\<[`RequestContext`](/core/api-reference/interfaces/requestcontext/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:477

#### Description

Token used to register and resolve the IContextAccessor instance in the dependency injection container to fetch execution context properties.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### CSRF\_MIDDLEWARE

> `readonly` **CSRF\_MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:255

***

### DB\_CONTEXT

> `readonly` **DB\_CONTEXT**: `T`

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:181

#### Description

Token used to register and resolve the DbContext instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### EXCEPTION\_PIPELINE

> `readonly` **EXCEPTION\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:190

#### Description

Token used to register and resolve the ExceptionPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### GATE\_KEEPER

> `readonly` **GATE\_KEEPER**: [`IGateKeeper`](/core/api-reference/interfaces/igatekeeper/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:199

#### Description

Token used to register and resolve the GateKeeper instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### IDEMPOTENCY\_PIPELINE

> `readonly` **IDEMPOTENCY\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`ICommand`](/core/api-reference/interfaces/icommand/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:208

#### Description

Token used to register and resolve the IdempotencyPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### IDEMPOTENCY\_STORE

> `readonly` **IDEMPOTENCY\_STORE**: [`IIdempotencyStore`](/core/api-reference/interfaces/iidempotencystore/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:217

#### Description

Token used to register and resolve the IdempotencyStore instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### IDENTITY\_ACCESSOR

> `readonly` **IDENTITY\_ACCESSOR**: [`IIdentityAccessor`](/core/api-reference/interfaces/iidentityaccessor/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:459

#### Description

Token used to register and resolve the IIdentityAccessor in the dependency injection container, allowing access only to current user identity information.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### LOGGER

> `readonly` **LOGGER**: [`ILogger`](/core/api-reference/interfaces/ilogger/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:226

#### Description

Token used to register and resolve the Logger instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### LOGGING\_PIPELINE

> `readonly` **LOGGING\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:235

#### Description

Token used to register and resolve the LoggingPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### MEDIATOR

> `readonly` **MEDIATOR**: [`IMediator`](/core/api-reference/interfaces/imediator/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:244

#### Description

Token used to register and resolve the Mediator instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### METHOD\_CHECK\_MIDDLEWARE

> `readonly` **METHOD\_CHECK\_MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:256

***

### MIDDLEWARE

> `readonly` **MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:253

#### Description

Token used to register and resolve the RequestContextMiddleware in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### NETWORK\_CONTEXT\_ACCESSOR

> `readonly` **NETWORK\_CONTEXT\_ACCESSOR**: [`INetworkContextAccessor`](/core/api-reference/interfaces/inetworkcontextaccessor/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:486

#### Description

Token used to register and resolve the INetworkContextAccessor instance in the dependency injection container to fetch networking/observability context data.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### OPTIONS\_MIDDLEWARE

> `readonly` **OPTIONS\_MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:257

***

### PERFORMANCE\_PIPELINE

> `readonly` **PERFORMANCE\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:268

#### Description

Token used to register and resolve the PerformancePipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### PERMISSION\_AUTHORIZATION\_PIPELINE

> `readonly` **PERMISSION\_AUTHORIZATION\_PIPELINE**: [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:277

#### Description

Token used to register and resolve the PermissionAuthorizationPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### PINO\_LOGGER

> `readonly` **PINO\_LOGGER**: [`ILoggerClient`](/core/api-reference/interfaces/iloggerclient/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:286

#### Description

Token used to register and resolve the PinoLogger instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### POLICY\_REGISTRY

> `readonly` **POLICY\_REGISTRY**: [`IPolicyRegistry`](/core/api-reference/interfaces/ipolicyregistry/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:295

#### Description

Token used to register and resolve the PolicyRegistry instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### QUERY\_CACHING\_PIPELINE

> `readonly` **QUERY\_CACHING\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IQuery`](/core/api-reference/interfaces/iquery/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:304

#### Description

Token used to register and resolve the QueryCachingPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### QUERY\_PIPELINES\_BEHAVIOR

> `readonly` **QUERY\_PIPELINES\_BEHAVIOR**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IQuery`](/core/api-reference/interfaces/iquery/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:313

#### Description

Token used to register and resolve the QueryPipeline behaviors in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### RATE\_LIMITER\_MIDDLEWARE

> `readonly` **RATE\_LIMITER\_MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:259

***

### REGISTRY\_ROUTES

> `readonly` **REGISTRY\_ROUTES**: `Record`\<`` `/${string}` ``, `Record`\<[`HttpMethod`](/core/api-reference/type-aliases/httpmethod/), `"isPublic"`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:322

#### Description

Token used to register and resolve the RoutesRegistry instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### REQUEST\_CONTEXT

> `readonly` **REQUEST\_CONTEXT**: [`IRequestContext`](/core/api-reference/interfaces/irequestcontext/)\<[`RequestContext`](/core/api-reference/interfaces/requestcontext/), `ApplicationRegistry`\<`T`, `unknown`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:331

#### Description

Token used to register and resolve the RequestContext instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### REQUEST\_CONTEXT\_MIDDLEWARE

> `readonly` **REQUEST\_CONTEXT\_MIDDLEWARE**: [`IMiddleware`](/core/api-reference/interfaces/imiddleware/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:258

***

### RESILIENCE\_CLIENT

> `readonly` **RESILIENCE\_CLIENT**: [`IServiceResilience`](/core/api-reference/interfaces/iserviceresilience/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:340

#### Description

Token used to register and resolve the IServiceResilience instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### ROLE\_AUTHORIZATION\_PIPELINE

> `readonly` **ROLE\_AUTHORIZATION\_PIPELINE**: [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:349

#### Description

Token used to register and resolve the RoleAuthorizationPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### SCHEMA\_VALIDATION\_STRATEGY

> `readonly` **SCHEMA\_VALIDATION\_STRATEGY**: [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `boolean`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:358

#### Description

Token used to register and resolve the SchemaValidationStrategy instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### SENTRY\_LOGGER

> `readonly` **SENTRY\_LOGGER**: [`ILoggerClient`](/core/api-reference/interfaces/iloggerclient/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:367

#### Description

Token used to register and resolve the SentryLogger instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### SERVICE\_CONTAINER

> `readonly` **SERVICE\_CONTAINER**: [`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:376

#### Description

Token used to register and resolve the ServiceContainer instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### SERVICE\_EXTRACTOR

> `readonly` **SERVICE\_EXTRACTOR**: [`IServiceExtractor`](/core/api-reference/interfaces/iserviceextractor/)\<[`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/), [`Metadata`](/core/api-reference/interfaces/metadata/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:385

#### Description

Token used to register and resolve the ServiceExtractor instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### SERVICE\_SCOPE\_ACCESSOR

> `readonly` **SERVICE\_SCOPE\_ACCESSOR**: [`IServiceScopeAccessor`](/core/api-reference/interfaces/iservicescopeaccessor/)\<`ApplicationRegistry`\<`T`, `unknown`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:468

#### Description

Token used to register and resolve the IServiceScopeAccessor in the dependency injection container, granting controlled access to the current request scope.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### SERVICE\_SCOPE\_FACTORY

> `readonly` **SERVICE\_SCOPE\_FACTORY**: [`IFactory`](/core/api-reference/interfaces/ifactory/)\<`void`, [`IServiceScope`](/core/api-reference/interfaces/iservicescope/)\<`ApplicationRegistry`\<`unknown`, `unknown`\>\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:394

#### Description

Token used to register and resolve the ServiceScopeFactory instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### TENANT\_AUTHORIZATION\_PIPELINE

> `readonly` **TENANT\_AUTHORIZATION\_PIPELINE**: [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:403

#### Description

Token used to register and resolve the TenantAuthorizationPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### TRANSACTION\_STATE

> `readonly` **TRANSACTION\_STATE**: [`ITransactionState`](/core/api-reference/interfaces/itransactionstate/)\<`Ttx`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:412

#### Description

Token used to register and resolve the TransactionState instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### UNIT\_OF\_WORK

> `readonly` **UNIT\_OF\_WORK**: [`IUnitOfWork`](/core/api-reference/interfaces/iunitofwork/) & [`IDisposable`](/core/api-reference/interfaces/idisposable/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:421

#### Description

Token used to register and resolve the UnitOfWork instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### USER\_AUTHORIZATION\_PIPELINE

> `readonly` **USER\_AUTHORIZATION\_PIPELINE**: [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:430

#### Description

Token used to register and resolve the UserAuthorizationPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### USER\_CONTEXT\_FACTORY

> `readonly` **USER\_CONTEXT\_FACTORY**: [`IFactory`](/core/api-reference/interfaces/ifactory/)\<`void`, [`UserContext`](/core/api-reference/interfaces/usercontext/)\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:495

#### Description

Token used to register and resolve the UserContext factory in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### VALIDATION\_PIPELINE

> `readonly` **VALIDATION\_PIPELINE**: [`IPipelineBehavior`](/core/api-reference/interfaces/ipipelinebehavior/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `unknown`\>

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:439

#### Description

Token used to register and resolve the ValidationPipeline instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### ZOD\_VALIDATOR

> `readonly` **ZOD\_VALIDATOR**: [`IValidatorService`](/core/api-reference/interfaces/ivalidatorservice/)

Defined in: .temp/xeno-js/src/domain/registries/application-registry.types.ts:448

#### Description

Token used to register and resolve the ZodValidator instance in the dependency injection container.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
