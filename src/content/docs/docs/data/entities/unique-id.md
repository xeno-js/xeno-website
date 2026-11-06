---
title: Unique ID
description: Learn how to create, type, read, and compare unique identifiers with UniqueId.
keywords:
  - Xeno.JS
  - UniqueId
  - unique identifier
  - UUID v4
  - domain entity identity
tags:
  - data
  - entities
  - unique-id
faqs:
  - question: How do I create a UniqueId?
    answer: Call UniqueId.create() with a string that identifies the kind of entity. The factory uses a valid supplied UUID or generates a UUID v4.
  - question: What happens if I pass an invalid identifier?
    answer: UniqueId.create() generates a new UUID v4 when the optional identifier is empty or invalid.
  - question: How do I get the string value of a UniqueId?
    answer: Call toString() for its string representation, or getValue() for its underlying Guid.
  - question: How do I compare two UniqueId instances?
    answer: Call equals() on one identifier with another identifier of the same kind.
  - question: Does the kind passed to UniqueId.create() affect the runtime identifier?
    answer: No. The kind is a TypeScript type marker; it distinguishes identifier kinds at compile time.
---

## Introduction

Entities need identifiers that remain stable while their other data changes. A plain string carries no indication of which kind of entity it identifies, so code can accidentally mix identifiers for different domain concepts.

`UniqueId<TKind>` wraps a UUID value and uses `TKind` as a compile-time marker. Create identifiers through its static factory; the class has a private constructor and freezes each instance.

## Create an Identifier

Call `UniqueId.create()` with a kind name. The factory generates a UUID v4 when no usable identifier is provided:

```ts
import { UniqueId } from '@xeno-js/shared'

const orderId = UniqueId.create('Order')

console.log(orderId.toString())
```

The generated value is available as a string through `toString()`, or as the underlying `Guid` through `getValue()`.

## Use Typed Identifiers

Use a different kind for each domain identifier. TypeScript then prevents passing one kind where another is expected:

```ts
import { UniqueId } from '@xeno-js/shared'

type OrderId = UniqueId<'Order'>
type CustomerId = UniqueId<'Customer'>

function loadOrder(id: OrderId): void {
  console.log(`Loading order ${id.toString()}`)
}

const orderId: OrderId = UniqueId.create('Order')
const customerId: CustomerId = UniqueId.create('Customer')

loadOrder(orderId)
// loadOrder(customerId) // Type error: a Customer ID is not an Order ID.
```

The kind argument exists for typing; it does not change the UUID or add a runtime prefix. Keep the kind string consistent wherever the same identifier type is used.

## Supply an Existing Identifier

Pass an existing UUID string as the optional second argument when rebuilding an identifier, for example when mapping a value read from storage:

```ts
import { UniqueId } from '@xeno-js/shared'

const storedOrderId = 'c0a80123-4567-489a-8abc-1234567890ab'
const orderId = UniqueId.create('Order', storedOrderId)

console.log(orderId.toString())
```

`UniqueId.create()` keeps the supplied string only when it is non-empty and a valid GUID. If it is empty or invalid, the factory generates a new UUID instead. Validate external input separately if silently replacing an invalid value is not appropriate for the calling workflow.

## Compare Identifiers

Use `equals()` to compare identifiers of the same kind:

```ts
import { UniqueId } from '@xeno-js/shared'

const originalId = UniqueId.create('Order', 'c0a80123-4567-489a-8abc-1234567890ab')
const rehydratedId = UniqueId.create('Order', 'c0a80123-4567-489a-8abc-1234567890ab')
const anotherOrderId = UniqueId.create('Order')

console.log(originalId.equals(rehydratedId)) // true
console.log(originalId.equals(anotherOrderId)) // false
```

Equality compares the underlying GUID values. `equals()` also returns `false` when the other value is not a `UniqueId` instance.

## Behavior

- `create(kind)` generates a UUID v4.
- `create(kind, id)` uses `id` only when it is non-empty and a valid GUID; otherwise, it generates a UUID v4.
- `toString()` returns the identifier's string representation, and `getValue()` returns its underlying `Guid`.
- `equals()` compares the underlying values.
- Instances are frozen after construction.
- The generic kind distinguishes identifier types at compile time; it does not alter their runtime representation.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../../support-us)
