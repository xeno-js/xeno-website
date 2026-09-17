---
editUrl: false
next: false
prev: false
title: "ISpecification"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/specifications/ispecification.contracts.ts:14](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/specifications/ispecification.contracts.ts#L14)

Interfaccia che definisce il contratto per una specifica di dominio.
Una specifica permette di verificare se un oggetto (candidato)
soddisfa determinati criteri di business.

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

### T

`T`

Il tipo dell'oggetto da convalidare.

  * 
  *

## Methods

### and()

> **and**(`other`): `ISpecification`\<`T`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/specifications/ispecification.contracts.ts:36](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/specifications/ispecification.contracts.ts#L36)

Combina questa specifica con un'altra tramite l'operatore logico AND.

#### Parameters

##### other

`ISpecification`\<`T`\>

#### Returns

`ISpecification`\<`T`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### isSatisfiedBy()

> **isSatisfiedBy**(`candidate`): `boolean`

Defined in: [.temp/xeno-shared/src/domain/contracts/specifications/ispecification.contracts.ts:26](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/specifications/ispecification.contracts.ts#L26)

Verifica se il candidato soddisfa i criteri della specifica.

#### Parameters

##### candidate

`T`

L'oggetto da testare.

#### Returns

`boolean`

Booleano: true se i criteri sono soddisfatti.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### not()

> **not**(): `ISpecification`\<`T`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/specifications/ispecification.contracts.ts:58](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/specifications/ispecification.contracts.ts#L58)

Inverte il risultato di questa specifica tramite l'operatore logico NOT.

#### Returns

`ISpecification`\<`T`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### or()

> **or**(`other`): `ISpecification`\<`T`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/specifications/ispecification.contracts.ts:47](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/specifications/ispecification.contracts.ts#L47)

Combina questa specifica con un'altra tramite l'operatore logico OR.

#### Parameters

##### other

`ISpecification`\<`T`\>

#### Returns

`ISpecification`\<`T`\>

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
