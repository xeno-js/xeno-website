---
editUrl: false
next: false
prev: false
title: "IConfigurationService"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/configuration/iconfiguration.contracts.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/configuration/iconfiguration.contracts.ts#L12)

## Description

This interface defines the contract for a configuration service that provides methods to retrieve configuration values.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Methods

### get()

> **get**(`key`, `defaultValue?`): [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/configuration/iconfiguration.contracts.ts:24](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/configuration/iconfiguration.contracts.ts#L24)

Retrieves a configuration value as a string. Returns the default value if the key is not present.

#### Parameters

##### key

`string`

The configuration key to retrieve.

##### defaultValue?

`string`

The default value to return if the key is not present.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

The configuration value as a string, or the default value if the key is not present.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getBoolean()

> **getBoolean**(`key`, `defaultValue?`): [`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/configuration/iconfiguration.contracts.ts:50](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/configuration/iconfiguration.contracts.ts#L50)

Retrieves a configuration value as a boolean. Returns the default value if the key is not present.

#### Parameters

##### key

`string`

The configuration key to retrieve.

##### defaultValue?

`boolean`

The default value to return if the key is not present.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`boolean`\>

The configuration value as a boolean, or the default value if the key is not present.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getNumber()

> **getNumber**(`key`, `defaultValue?`): [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/configuration/iconfiguration.contracts.ts:37](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/configuration/iconfiguration.contracts.ts#L37)

Retrieves a configuration value as a number. Returns the default value if the key is not present.

#### Parameters

##### key

`string`

The configuration key to retrieve.

##### defaultValue?

`number`

The default value to return if the key is not present.

#### Returns

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

The configuration value as a number, or the default value if the key is not present.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### getOrThrow()

> **getOrThrow**(`key`): `string`

Defined in: [.temp/xeno-shared/src/domain/contracts/configuration/iconfiguration.contracts.ts:63](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/configuration/iconfiguration.contracts.ts#L63)

Retrieves a configuration value as a string. Throws an error if the key is not present.

#### Parameters

##### key

`string`

The configuration key to retrieve.

#### Returns

`string`

The configuration value as a string.

#### Throws

An error if the key is not present in the configuration.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
