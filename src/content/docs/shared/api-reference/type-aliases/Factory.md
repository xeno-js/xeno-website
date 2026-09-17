---
editUrl: false
next: false
prev: false
title: "Factory"
---

> **Factory**\<`T`, `TArgs`\> = (...`args`) => `T`

Defined in: [.temp/xeno-shared/src/shared/types/common.types.ts:151](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/types/common.types.ts#L151)

## Type Parameters

### T

`T`

The type of the value produced.

### TArgs

`TArgs` *extends* `unknown`[] = \[\]

Tuple of constructor/factory argument types.

## Parameters

### args

...`TArgs`

## Returns

`T`

## Description

Generic factory function that produces a value of type `T`.

`TArgs` defaults to an empty tuple for zero-argument factories, enabling
usage both as a plain provider (`Factory<T>`) and as a parameterised
creator (`Factory<T, [config: MyConfig]>`).

## Example

```ts
// Zero-argument factory
const makeLogger: Factory<ILoggerService> = () => new ConsoleLogger();

// Parameterised factory
const makeRepo: Factory<IRepository<Entity>, [tx: Transaction]> =
  (tx) => new DrizzleRepository(tx);

  * 
  *
```

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
