---
title: Entity
description: Model domain objects with stable identity and replaceable state.
keywords:
  - Xeno.JS
  - Entity
  - domain-driven design
  - identity
  - domain model
tags:
  - data
  - entities
  - entity
faqs:
  - question: What distinguishes an entity from a value object?
    answer: An entity has a stable identity that distinguishes it from other instances, while a value object's equality depends on its properties.
  - question: Does an entity's ID change when its properties change?
    answer: No. Entity.id is readonly and remains the same throughout the entity's lifecycle.
  - question: How does Entity protect its properties?
    answer: The base class freezes a shallow copy when properties are set, and getProps() returns a structured clone.
  - question: How do I restore an entity with an existing ID?
    answer: Pass a valid UUID string as the second constructor argument of your concrete entity. An invalid non-empty ID causes the constructor to throw.
---

## Introduction

Use an entity to model a domain object whose identity remains stable while its state changes. Two orders can have the same properties and still be different orders because they have different identifiers.

## The Problem

Comparing domain objects only by their current properties does not capture their lifecycle. For example, an order's status or total can change without turning it into a different order.

## The Principle

An entity has a stable identity and encapsulates changeable state. Use its identifier to refer to the same domain object over time; use its behavior to change state while preserving domain rules.

Entities belong in the domain layer. Application services coordinate domain operations, while infrastructure handles persistence and other external concerns.

## The Mechanism

`Entity<T, TId>` is an abstract implementation of `IEntity<T, TId>`. It provides:

- a readonly `id` of type `UniqueId<TId>`;
- `getId()`, which returns the entity's identifier;
- `getProps()`, which returns a structured clone of the current properties;
- `setProps()`, which replaces the properties with a frozen shallow copy.

The constructor is protected, so create concrete entity classes by extending `Entity`. It accepts initial properties and an optional UUID string. If the ID is omitted or empty, the base class generates one. If a non-empty ID is invalid, construction throws an error. The base class does not define domain validation or entity-specific behavior; the concrete class owns those rules.

## Implement an Entity

This order keeps the same identity while changing its status through a domain operation:

```ts
import { Entity } from '@xeno-js/shared'

interface OrderProps {
  status: 'draft' | 'confirmed'
  total: number
}

export class Order extends Entity<OrderProps, 'Order'> {
  public constructor(props: OrderProps, id?: string) {
    super(props, id)
  }

  public confirm(): void {
    const props = this.getProps()

    if (props.status !== 'draft') {
      throw new Error('Only draft orders can be confirmed.')
    }

    this.setProps({ ...props, status: 'confirmed' })
  }
}

const order = new Order({ status: 'draft', total: 125 })
const originalId = order.id

order.confirm()

console.log(order.getProps().status) // 'confirmed'
console.log(order.id === originalId) // true
```

The type marker `'Order'` keeps this entity's identifier distinct from other `UniqueId` kinds at compile time. Keep it aligned with the concrete class name: the base class uses `this.constructor.name` when creating an ID.

## Identity and Existing IDs

The entity's `id` is readonly, and the base class does not provide an operation to replace it. Pass a valid UUID when reconstructing an entity from persisted data:

```ts
const restoredOrder = new Order(
  { status: 'confirmed', total: 125 },
  'c0a80123-4567-489a-8abc-1234567890ab',
)

console.log(restoredOrder.id.toString())
```

An omitted or empty ID causes a new UUID to be generated. A non-empty invalid UUID throws during construction rather than silently creating a different identity. Validate external input separately when the calling workflow needs a more specific error.

## State and Copies

`setProps()` replaces the entity's entire property set. The base class freezes a shallow copy of the supplied object, but it does not recursively freeze nested values. `getProps()` returns a `structuredClone` of the stored properties, so changes to the returned clone do not update the entity:

```ts
const order = new Order({ status: 'draft', total: 125 })
const props = order.getProps()

props.total = 200

console.log(order.getProps().total) // 125
```

These methods do not add domain validation. Keep state changes behind methods on the concrete entity so those methods can enforce its invariants. For nested properties, use immutable values or manage their copying and mutation rules in the concrete type.

## Entities and Aggregate Roots

Use `Entity` as the base for domain entities. When the entity is the root of an aggregate and needs aggregate versioning and uncommitted domain-event handling, extend `AggregateRoot`, which builds on `Entity`.

## Related Documentation

- [Aggregate Roots](./aggregate-root)
- [Unique ID](./unique-id)
- [Value Objects](./value-object)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support of these awesome people. If you'd like to join them, please read more at [support section](../../../support-us).
