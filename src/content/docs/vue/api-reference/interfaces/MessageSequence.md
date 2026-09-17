---
editUrl: false
next: false
prev: false
title: "MessageSequence"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:10

## Description

MessagingContext defines the structure for messaging-related information used in message handling and processing. It includes properties such as return address, expiration time, and message sequence information, which can be used for managing message delivery, expiration, and sequencing in distributed systems.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js

## Properties

### position

> `readonly` **position**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:26

#### Description

The position of the message within the sequence, which can be used to determine the order of messages in a sequence.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### sequenceId

> `readonly` **sequenceId**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:18

#### Description

The unique identifier for the message sequence, which can be used to track and manage the order of messages in a sequence.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### size

> `readonly` **size**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:34

#### Description

The total number of messages in the sequence, which can be used to determine the size of the sequence.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
