---
title: Value Objects
description: Model domain concepts whose equality depends on their values rather than identity.
keywords:
  - Xeno.JS
  - ValueObject
  - domain-driven design
  - immutability
  - equality
tags:
  - data
  - entities
  - value-object
faqs:
  - question: What is a value object in Xeno.JS?
    answer: A value object is a domain type whose equality is based on its properties rather than its identity.
  - question: How do I create a value object?
    answer: Extend the abstract ValueObject class and pass its properties to the protected constructor.
  - question: Can I change a value object after construction?
    answer: The ValueObject base class freezes its property copy and the instance. Use getValue() to obtain a shallow copy of the properties.
  - question: How does ValueObject.equals() compare instances?
    answer: It compares the serialized properties returned by getValue(), not object identity.
---

## Introduction

Use a value object to represent a domain concept whose meaning comes from its values rather than from a unique identity.

For example, two email addresses with the same value represent the same address even if the application created them as separate instances.

## The Problem

Object identity does not express value equality:

```ts
const first = { value: 'orders@example.com' }
const second = { value: 'orders@example.com' }

console.log(first === second) // false
```

In domain code, comparing instances by identity can therefore treat equivalent values as different.

## The Principle

A value object encapsulates the properties that define a domain value. It has no separate identity, and its equality is based on those properties.

Keep the value object's responsibilities in the domain layer. It can enforce domain-specific rules in its own constructor or factory, while application services coordinate its use and infrastructure provides external implementations.

## The Mechanism

`ValueObject<T>` is an abstract implementation of `IValueObject<T>`. It provides:

- a protected constructor that stores a frozen copy of the supplied properties and freezes the instance;
- `getValue()`, which returns a shallow copy of the stored properties;
- `equals()`, which compares the serialized properties of two value objects;
- `toString()`, which serializes the stored properties.

The base class does not define domain validation. A concrete value object must add any rules its domain requires.

## Implement a Value Object

For example, an email address can expose its value while delegating storage and equality to `ValueObject`:

```ts
import { ValueObject } from '@xeno-js/shared'

interface EmailAddressProps {
  value: string
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  public constructor(value: string) {
    super({ value })
  }

  public get value(): string {
    return this.getValue().value
  }
}
```

This example stores the supplied string but does not validate its format. Add domain validation in `EmailAddress` if the application requires it.

## Compare Values

Use `equals()` when the domain needs to compare value objects:

```ts
const primaryEmail = new EmailAddress('orders@example.com')
const secondaryEmail = new EmailAddress('orders@example.com')
const supportEmail = new EmailAddress('support@example.com')

console.log(primaryEmail.equals(secondaryEmail)) // true
console.log(primaryEmail.equals(supportEmail)) // false
```

`equals()` compares serialized property values; it does not compare the instances by reference.

## Immutability and Copies

The constructor freezes a shallow copy of the properties and then freezes the value object instance. `getValue()` returns a new, shallow copy, so updating a top-level property on the returned object does not change the stored properties:

```ts
const email = new EmailAddress('orders@example.com')
const properties = email.getValue()

properties.value = 'changed@example.com'

console.log(email.value) // 'orders@example.com'
```

These are shallow operations. If a property contains a nested object, the base class does not recursively clone or freeze that nested value. Prefer immutable property values or handle nested data explicitly in the concrete type.

## String Representation

`toString()` returns a serialized representation of the stored properties:

```ts
const email = new EmailAddress('orders@example.com')

console.log(email.toString())
```

The exact serialization format is provided by `StringHelper.safeStringify`; use `toString()` as a representation, not as a substitute for a domain-specific display format.

## The Key Idea

Use `ValueObject` when the domain identifies a concept by its values rather than by a persistent identity. The base class supplies immutable top-level state and value-based equality; the concrete type supplies the domain meaning and any required validation.

## Related Documentation

- [Entities](./unique-id)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support of these awesome people. If you'd like to join them, please read more at [support section](../../support-us).
