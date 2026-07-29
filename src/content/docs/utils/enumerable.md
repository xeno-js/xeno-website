---
title: 'Enumerable Utility Specification: LINQ-Inspired Array Operations'
description:
  'Technical specification for the Enumerable utility module in Xeno, detailing
  type-safe array operations, predicate filtering, strict element finding, and
  safe fallback handling.'
keywords:
  [
    'Enumerable',
    'Xeno Utilities',
    'Array Helpers',
    'LINQ JavaScript',
    'firstOrDefault',
    'Predicate Filtering',
    'Shared Utils',
    'Xeno',
  ]
author: 'Xeno'
---

## LINQ-Inspired Array Operations with `Enumerable`

The `Enumerable` utility namespace provides type-safe, LINQ-inspired array
navigation and search primitives. Frozen at initialization (`Object.freeze`), it
offers predictable element resolution with both strict (throwing) and safe
(optional) fallback mechanics based on predicate functions.

---

## Technical Overview & Design Characteristics

Located under `shared/utils/enumerable.utils.ts`, `Enumerable` encapsulates
common collection traversal patterns to eliminate repetitive array searches and
manual null/undefined checks across domain services and repositories.

### Key Features

- **Predicate-Based Searching**: Dynamically evaluates elements using custom
  boolean callbacks.

- **Strict vs. Safe Retrieval**: Provides two distinct execution strategies: a
  strict throw-on-empty method (`first`) and a safe fallback method
  (`firstOrDefault`).

- **Guarded Predicates**: Integrates with Xeno's internal `Guards.isDefined`
  utility to safely handle optional search callbacks.

---

## API Reference Specification

### 1. Strict Element Resolution

#### `Enumerable.first<T>(array: T[], predicate?: (item: T) => boolean): T`

Retrieves the first element in `array` that satisfies the provided predicate. If
no predicate is supplied, it returns the very first element of the array.

- **Behavior**: Uses `array.find(predicate)` if `predicate` is defined,
  otherwise targets `array[0]`.

- **Throws**: An `Error('Sequence contains no elements.')` if the array is empty
  or if no elements satisfy the predicate condition.

- **Returns**: The matching element of type `T`.

- **Example**:

```typescript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

// Find by predicate
const alice = Enumerable.first(users, (u) => u.name === 'Alice')

// Find first element
const firstUser = Enumerable.first(users)
```

---

### 2. Safe Element Resolution

#### `Enumerable.firstOrDefault<T>(array: T[], predicate?: (item: T) => boolean): Optional<T>`

Safely attempts to retrieve the first element in `array` that satisfies the
provided predicate.

- **Behavior**: Evaluates the collection. If an element matches, it returns the
  item. If the array is empty or no match is found, it returns `undefined`
  without throwing an exception.

- **Returns**: The matching element `T` or `undefined` (`Optional<T>`).

- **Example**:

```typescript
const orders = [{ id: 'ord_1', status: 'COMPLETED' }]

const pendingOrder = Enumerable.firstOrDefault(
  orders,
  (o) => o.status === 'PENDING',
)
// Output: undefined (no exception thrown)
```

---

## Quick Method Summary Table

| Method                                     | Return Type   | Throws on Empty / No Match?  | Description                                                                                    |
| ------------------------------------------ | ------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| **`first<T>(array, predicate?)`**          | `T`           | **Yes** (`Error`)            | Returns the first matching element; throws an error if sequence is empty or no match is found. |
| **`firstOrDefault<T>(array, predicate?)`** | `Optional<T>` | **No** (Returns `undefined`) | Returns the first matching element or `undefined` if no match exists.                          |

---

## Practical Implementation Example

The snippet below demonstrates using `Enumerable` inside a domain handler to
process domain events or entity arrays safely:

```typescript
import { Enumerable } from '@xeno/core'

interface OrderLineItem {
  sku: string
  quantity: number
  isPrimary: boolean
}

export class OrderAggregate {
  public getPrimaryItem(items: OrderLineItem[]): OrderLineItem {
    // 1. Safely attempt to find a flagged primary item
    const primary = Enumerable.firstOrDefault(items, (item) => item.isPrimary)

    if (primary) {
      return primary
    }

    // 2. Strict fallback: Get the absolute first line item or throw if array is completely empty
    return Enumerable.first(items)
  }
}
```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
