---
editUrl: false
next: false
prev: false
title: "ISpecification"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/specifications/ispecification.contracts.d.ts:14

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

Defined in: .temp/xeno-shared/dist/domain/contracts/specifications/ispecification.contracts.d.ts:36

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

Defined in: .temp/xeno-shared/dist/domain/contracts/specifications/ispecification.contracts.d.ts:26

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

Defined in: .temp/xeno-shared/dist/domain/contracts/specifications/ispecification.contracts.d.ts:56

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

Defined in: .temp/xeno-shared/dist/domain/contracts/specifications/ispecification.contracts.d.ts:46

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
