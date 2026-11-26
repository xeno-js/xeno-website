---
title: Enumerable
description: Find the first item in a TypeScript array with Xeno.JS Enumerable.first and firstOrDefault.
keywords: [Xeno.JS, Enumerable, first, firstOrDefault, arrays]
tags: [utilities, arrays, typescript]
faqs:
  - question: What happens when Enumerable.first finds no item?
    answer: 'It throws an Error with the message "Sequence contains no elements."'
  - question: What does firstOrDefault return for a missing item?
    answer: It returns undefined when no defined item is found.
---

## Find the first array item

`Enumerable` provides two ways to retrieve the first item of a mutable array, optionally using a predicate:

```ts
import { Enumerable } from '@xeno-js/core'

const products = [
  { name: 'Keyboard', available: false },
  { name: 'Mouse', available: true },
]

const firstAvailable = Enumerable.first(products, (product) => product.available)
const missing = Enumerable.firstOrDefault(products, (product) => product.name === 'Monitor')

console.log(firstAvailable.name) // Mouse
console.log(missing) // undefined
```

`first(array, predicate?)` throws `Error('Sequence contains no elements.')` if the selected item is not defined. `firstOrDefault(array, predicate?)` returns `undefined` instead. Without a predicate, each method checks the first element only; neither searches past an undefined first element.

## Common problems

Both methods treat `null`, `undefined`, and `NaN` as missing because they use `Guards.isDefined()`. A predicate that matches such a value does not make it a valid result. Use `firstOrDefault()` when absence is expected, and handle its `undefined` return value.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
