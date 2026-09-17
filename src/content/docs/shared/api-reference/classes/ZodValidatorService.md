---
editUrl: false
next: false
prev: false
title: "ZodValidatorService"
---

Defined in: [.temp/xeno-shared/src/infrastructure/validators/zod.validator.ts:16](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/validators/zod.validator.ts#L16)

## Description

Implementation of the IValidatorService interface using Zod schemas for validation. This service maintains a registry of Zod schemas identified by unique keys and provides methods to check for the existence of a schema and to validate data against a specified schema. The validate method returns a ResultType indicating success or failure, with detailed error information in case of validation failure, including formatted error messages from Zod.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Implements

- [`IValidatorService`](/shared/api-reference/interfaces/ivalidatorservice/)

## Constructors

### Constructor

> **new ZodValidatorService**(`_cache?`, `_logger`): `ZodValidatorService`

Defined in: [.temp/xeno-shared/src/infrastructure/validators/zod.validator.ts:28](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/validators/zod.validator.ts#L28)

#### Parameters

##### \_cache?

`Map`\<`string`, `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\> = `...`

An instance of ICache used to store and retrieve Zod schemas. This cache is essential for the operation of the validator service, as it allows it to look up and apply the correct schema for validating incoming data.

##### \_logger

[`ILogger`](/shared/api-reference/interfaces/ilogger/)

An instance of ILogger used to log warning when schema was not found.

#### Returns

`ZodValidatorService`

#### Description

Constructs a new instance of the ZodValidatorService class, which takes an ICache instance as a parameter. This cache is used to store and manage the validation schemas that will be applied to incoming data. The constructor initializes the service with the provided cache, allowing it to perform validation checks based on the cached schemas when the validate method is called.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### addSchema()

> **addSchema**(`key`, `schema`): `void`

Defined in: [.temp/xeno-shared/src/infrastructure/validators/zod.validator.ts:39](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/validators/zod.validator.ts#L39)

#### Parameters

##### key

`string`

The key representing the type of data or request for which the validation schema is being added. This key is used to identify the schema when performing validation checks.

##### schema

`ZodType`

The validation schema to be added, which defines the rules and structure that incoming data must conform to in order to pass validation. The specific type of the schema will depend on the validation library being used (e.g., ZodType for Zod schemas).

#### Returns

`void`

#### Description

Adds a new validation schema to the service's registry, associating it with the specified key. This method allows for dynamically registering validation schemas that can be used later for validating incoming data. The schema must conform to the expected structure defined by the validation library being used (e.g., Zod schemas). By adding schemas to the service, it enables the application to perform validation checks against those schemas when processing requests or data that require validation.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IValidatorService`](/shared/api-reference/interfaces/ivalidatorservice/).[`addSchema`](/shared/api-reference/interfaces/ivalidatorservice/#addschema)

***

### validate()

> **validate**\<`T`\>(`key`, `data`): `Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`boolean`\>\>

Defined in: [.temp/xeno-shared/src/infrastructure/validators/zod.validator.ts:43](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/validators/zod.validator.ts#L43)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

The key representing the type of data or request for which the validation is being performed. This key is used to identify the appropriate validation schema to apply to the data.

##### data

`T`

The data to be validated against the schema. This can be any type of data that needs to be checked for conformity with the validation rules defined in the schema.

#### Returns

`Promise`\<[`ResultType`](/shared/api-reference/type-aliases/resulttype/)\<`boolean`\>\>

A ResultType indicating the outcome of the validation. If the validation is successful, it returns a ResultType with a value of true; if the validation fails, it returns a ResultType with a value of false and includes error information.

#### Description

Validates the provided data against the validation schema associated with the specified key. This method performs the actual validation logic, checking if the data conforms to the rules defined in the corresponding schema. It returns a ResultType indicating whether the validation was successful or if it failed, along with any relevant error information if the validation did not pass.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

#### Implementation of

[`IValidatorService`](/shared/api-reference/interfaces/ivalidatorservice/).[`validate`](/shared/api-reference/interfaces/ivalidatorservice/#validate)
