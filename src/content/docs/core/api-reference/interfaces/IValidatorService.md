---
editUrl: false
next: false
prev: false
title: "IValidatorService"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/services/validators/ivalidator-service.contracts.d.ts:11

## Description

Interface for a validation service that provides methods to check for the existence of validation schemas and to validate data against those schemas. The IValidatorService interface defines two methods: hasSchema, which checks if a validation schema exists for a given key, and validate, which validates data against a specified schema key and returns a ResultType indicating the success or failure of the validation process. This interface can be implemented by various validation services that utilize different schema validation libraries or custom validation logic to ensure that incoming data meets the required criteria before being processed further in the application.

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

### addSchema()

> **addSchema**(`key`, `schema`): `void`

Defined in: .temp/xeno-shared/dist/domain/contracts/services/validators/ivalidator-service.contracts.d.ts:36

#### Parameters

##### key

`string`

The key representing the type of data or request for which the validation schema is being added. This key is used to identify the schema when performing validation checks.

##### schema

`unknown`

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

***

### validate()

> **validate**\<`T`\>(`key`, `data`): `Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`boolean`\>\>

Defined in: .temp/xeno-shared/dist/domain/contracts/services/validators/ivalidator-service.contracts.d.ts:24

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

`Promise`\<[`ResultType`](/core/api-reference/type-aliases/resulttype/)\<`boolean`\>\>

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
