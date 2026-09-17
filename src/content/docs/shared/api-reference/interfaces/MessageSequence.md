---
editUrl: false
next: false
prev: false
title: "MessageSequence"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/messaging-context.types.ts:11](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/messaging-context.types.ts#L11)

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

> `readonly` **position**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/messaging-context.types.ts:27](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/messaging-context.types.ts#L27)

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

> `readonly` **sequenceId**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/messaging-context.types.ts:19](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/messaging-context.types.ts#L19)

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

> `readonly` **size**: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`number`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/context/context\_types/messaging-context.types.ts:35](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/context/context_types/messaging-context.types.ts#L35)

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
