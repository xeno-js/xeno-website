---
editUrl: false
next: false
prev: false
title: "PipelineConfig"
---

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:15

## Description

PipelineConfig defines the configuration options for the CQRS pipelines in the application. It includes settings for performance monitoring, authorization, validation, command bus, and query bus. Each section allows for enabling or disabling specific features and providing additional configuration details as needed. This configuration is used by the CqrsModule to set up the appropriate middleware and services in the dependency injection container based on the specified options.

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

`TRegistry` *extends* [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\> = [`ApplicationRegistry`](/core/api-reference/interfaces/applicationregistry/)\<`unknown`\>

### TSchema

`TSchema` = `unknown`

## Properties

### authorization

> **authorization**: `object`

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:43

#### customAuthorizationStrategy?

> `optional` **customAuthorizationStrategy?**: [`Optional`](/core/api-reference/type-aliases/optional/)\<(`container`) => [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>\>\>[]

##### Description

An optional array of custom authorization strategies defined via injection tokens. If provided, these strategies will be included in the authorization pipeline and evaluated for each command or query, allowing for custom logic to determine if a user is authorized to perform a specific action. This provides flexibility in implementing application-specific access rules that may not fit into standard tenant-based or policy-based checks. Each strategy should implement the IStrategy interface and return a boolean indicating whether the command or query is authorized.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### policies

> **policies**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`Dictionary`](/core/api-reference/type-aliases/dictionary/)\<[`AuthPolicy`](/core/api-reference/interfaces/authpolicy/)\>\>

##### Description

Configuration for policy-based authorization, allowing the definition of a policy registry and the option to enable role-based or permission-based checks. If policy-based authorization is enabled, the authorization pipeline will include a strategy that evaluates the defined policies for each command or query, ensuring that users meet the necessary criteria based on their roles and permissions. The policy registry allows for central management of authorization policies, making it easier to maintain and update access rules across the application.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

Configuration for authorization, allowing the enabling of authorization strategies based on tenant, policy, roles, and permissions. If enabled, the authorization pipeline will evaluate the specified strategies for each command or query, ensuring that only authorized users can perform certain actions. The configuration also includes the ability to define custom authorization strategies via injection tokens, providing flexibility in implementing application-specific access rules.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### commandBus

> **commandBus**: `object`

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:97

#### concurrency

> **concurrency**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`ConcurrencyConfig`\>

#### idempotency

> **idempotency**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`IdempotencyConfig`\>

#### Description

Configuration for the command bus, allowing the enabling of features such as idempotency and concurrency management. If enabled, the command bus pipeline will include specific behaviors to handle these features, such as acquiring locks to ensure idempotency or managing retries in case of concurrency conflicts. The configuration includes specific details for each feature, such as TTLs for idempotency locks or delay strategies for concurrency retries, providing granular control over how commands are processed and managed within the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### performance

> **performance**: `object`

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:26

#### thresholdMs

> **thresholdMs**: [`Optional`](/core/api-reference/type-aliases/optional/)\<`number`\>

##### Description

Optional threshold in milliseconds for logging slow operations. If defined, the PerformancePipeline will log a warning whenever the execution of a command or query exceeds this duration, allowing for performance monitoring and optimization. If not defined, all operations will be monitored without duration-based filtering.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

Configuration for performance monitoring, including the ability to set a threshold in milliseconds for logging slow operations. If enabled, the PerformancePipeline will log a warning whenever the execution of a command or query exceeds the specified threshold, helping to identify potential performance bottlenecks in the application. If the threshold is not defined, all operations will be monitored without duration-based filtering.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### queryBus

> **queryBus**: `object`

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:108

#### isEnabled

> **isEnabled**: `boolean`

##### Description

Flag to enable or disable query bus features. If set to true, the query bus pipeline will include additional behaviors based on the specified configuration, such as result caching. If set to false or not defined, the query bus will operate without these additional features, allowing queries to be processed in a standard manner without caching or other enhancements.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

Configuration for the query bus, allowing the enabling of features such as result caching. If enabled, the query bus pipeline will include specific behaviors to handle caching, such as storing query results in a cache system and retrieving results from the cache when available. The configuration includes specific details for caching, such as settings for Redis integration or the ability to use a custom cache via injection tokens, providing flexibility in how query results are stored and retrieved within the application.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### validation

> **validation**: `object`

Defined in: .temp/xeno-js/src/domain/config/pipeline.config.ts:70

#### customValidationStrategy?

> `optional` **customValidationStrategy?**: [`Optional`](/core/api-reference/type-aliases/optional/)\<(`container`) => [`IStrategy`](/core/api-reference/interfaces/istrategy/)\<[`IRequest`](/core/api-reference/interfaces/irequest/)\<`unknown`\>, `boolean`\>\>[]

##### Description

An optional array of custom validation strategies defined via injection tokens. If provided, these strategies will be included in the validation pipeline and evaluated for each command or query, allowing for custom logic to determine if the input data is valid. This provides flexibility in implementing application-specific validation rules that may not fit into standard schema-based validation. Each strategy should implement the IStrategy interface and return a boolean indicating whether the command or query is valid.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### zod

> **zod**: [`Optional`](/core/api-reference/type-aliases/optional/)\<[`SchemaConfig`](/core/api-reference/interfaces/schemaconfig/)\<`TSchema`\>\>

##### Description

An optional configuration for Zod-based validation, allowing the definition of schemas for validating the structure and content of commands and queries. If provided, the validation pipeline will use these schemas to validate incoming requests, ensuring that they conform to the expected format and contain valid data before being processed further. This provides a powerful and flexible way to enforce data integrity and prevent invalid input from causing issues in the application.

##### Author

Xeno

##### Version

1.0.0

##### Since

2025-09-30

##### Link

https://github.com/Mattia-Carcione/xeno-js

#### Description

Configuration for validation, allowing the enabling of validation based on Zod schemas or custom validation strategies. If enabled, the validation pipeline will validate commands and queries based on the specified criteria, ensuring that input data meets expectations before further processing. The configuration includes the ability to define Zod schemas for structural validation or to use custom strategies via injection tokens, providing flexibility in implementing application-specific validation rules.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
