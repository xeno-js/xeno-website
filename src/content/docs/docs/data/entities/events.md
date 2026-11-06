---
title: Domain Events
description: Describe domain changes with typed event data and aggregate metadata.
keywords:
  - Xeno.JS
  - IDomainEvent
  - domain event
  - event payload
  - domain-driven design
tags:
  - data
  - entities
  - events
faqs:
  - question: What does IDomainEvent represent?
    answer: It is a TypeScript interface for a domain event's aggregate metadata, event type, version, occurrence time, and payload.
  - question: Does IDomainEvent create or publish events?
    answer: No. It defines the event shape only. AggregateRoot creates events when its protected raise() method runs, while persistence and delivery belong to other workflows.
  - question: What does the TId generic represent?
    answer: TId types the aggregateId as UniqueId<TId>, distinguishing aggregate identifier kinds at compile time.
  - question: Is destination required?
    answer: No. destination is optional and its routing or delivery meaning depends on the consuming workflow.
---

## Introduction

A domain event records a meaningful change in a domain, such as an order being confirmed. Xeno.JS describes its structure with `IDomainEvent<TPayload, TId>`, a typed contract for the event data and the aggregate metadata associated with it.

## The Problem

Passing only an event name or an untyped payload makes it difficult for consumers to know which aggregate produced the event, which revision it represents, and what data it carries. A shared event shape makes those parts explicit while allowing each event payload to remain specific to its domain.

## The Principle

Describe an event as a fact that has occurred, and include only the data its consumers need to understand that fact. Keep the payload type aligned with the event's meaning.

Events belong to the domain model. The event interface does not define persistence, dispatch, or delivery guarantees. Aggregate behavior creates domain events; application and infrastructure workflows decide how to store or deliver them.

## The Mechanism

`IDomainEvent<TPayload, TId>` is an interface with readonly fields:

- `aggregateId: UniqueId<TId>` identifies the aggregate associated with the event;
- `aggregateType: string` identifies the aggregate type;
- `eventType: string` names the event;
- `version: number` identifies the event's position in the aggregate's version sequence;
- `occurredAt: Date` records when the event occurred;
- `payload: TPayload` contains event-specific data;
- `destination?: string` optionally identifies a destination for a consuming workflow.

`TPayload` defaults to `unknown`. Specify a payload type to retain type safety when reading event data. `TId` defaults to `string` and types the aggregate identifier; use a literal kind such as `'Order'` to distinguish aggregate ID types in TypeScript.

The `readonly` modifiers prevent assigning to these properties through the interface in TypeScript. They do not freeze event objects at runtime.

## Type and Consume an Event

Define the payload for an event and specialize `IDomainEvent` with the aggregate kind. Consumers can then use the event's metadata and payload without treating the payload as `unknown`:

```ts
import type { IDomainEvent } from '@xeno-js/shared'

interface OrderConfirmedPayload {
  orderNumber: string
  customerId: string
}

type OrderConfirmedEvent = IDomainEvent<OrderConfirmedPayload, 'Order'>

function describeOrderConfirmation(event: OrderConfirmedEvent): string {
  return `${event.payload.orderNumber} was confirmed at ${event.occurredAt.toISOString()}`
}
```

In normal aggregate workflows, the aggregate root creates the complete event. Its `raise()` method supplies `aggregateId`, increments and assigns `version`, sets `occurredAt`, applies the event to the aggregate, and records it as uncommitted. The aggregate's `apply()` implementation handles the state transition. See [Aggregate Roots](./aggregate-root) for a complete example.

## Event Data and Delivery

An event describes a domain fact; it does not itself publish that fact. `IDomainEvent` has no methods and does not specify a transport, persistence format, retry policy, or delivery guarantee. The application and infrastructure layers handle those concerns through their own workflows.

`destination` is optional metadata in the event contract. The interface does not define its format or enforce how a consumer uses it. Treat it according to the conventions of the workflow that reads it.

## Behavior

- The interface provides a typed shape; it does not create an event or perform runtime validation.
- `payload` is generic and defaults to `unknown`.
- `aggregateId` is a `UniqueId<TId>`, with `TId` serving as a compile-time kind marker.
- `version` and `occurredAt` are part of the event contract; `AggregateRoot.raise()` assigns them when it creates a new event.
- `destination` is optional.
- The interface does not define publishing, persistence, or delivery behavior.

## Related Documentation

- [Aggregate Roots](./aggregate-root)
- [Entities](./entity)
- [Unique ID](./unique-id)

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support of these awesome people. If you'd like to join them, please read more at [support section](../../../support-us).
