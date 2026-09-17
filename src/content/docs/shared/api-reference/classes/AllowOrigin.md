---
editUrl: false
next: false
prev: false
title: "AllowOrigin"
---

Defined in: [.temp/xeno-shared/src/infrastructure/http/allow-origin.http.ts:4](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/http/allow-origin.http.ts#L4)

## Implements

- [`IAllowOrigin`](/shared/api-reference/interfaces/ialloworigin/)

## Constructors

### Constructor

> **new AllowOrigin**(`_list`): `AllowOrigin`

Defined in: [.temp/xeno-shared/src/infrastructure/http/allow-origin.http.ts:5](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/http/allow-origin.http.ts#L5)

#### Parameters

##### \_list

`string`[]

#### Returns

`AllowOrigin`

## Methods

### isAllowed()

> **isAllowed**(`origin`): `boolean`

Defined in: [.temp/xeno-shared/src/infrastructure/http/allow-origin.http.ts:7](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/infrastructure/http/allow-origin.http.ts#L7)

#### Parameters

##### origin

[`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

#### Returns

`boolean`

#### Implementation of

[`IAllowOrigin`](/shared/api-reference/interfaces/ialloworigin/).[`isAllowed`](/shared/api-reference/interfaces/ialloworigin/#isallowed)
