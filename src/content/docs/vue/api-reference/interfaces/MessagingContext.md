---
editUrl: false
next: false
prev: false
title: "MessagingContext"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:44

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

### expiration

> `readonly` **expiration**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`number`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:60

#### Description

The expiration time for the message, which can be used to determine when the message should be considered expired and no longer processed.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### returnAddress

> `readonly` **returnAddress**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<`string`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:52

#### Description

The return address for asynchronous responses, which can be used to specify where to send responses for asynchronous message processing.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### sequence

> `readonly` **sequence**: [`Optional`](/vue/api-reference/type-aliases/optional/)\<[`MessageSequence`](/vue/api-reference/interfaces/messagesequence/)\>

Defined in: .temp/xeno-shared/dist/domain/contracts/context/context\_types/messaging-context.types.d.ts:68

#### Description

The sequence information for the message, which can be used to manage the order and grouping of messages in a sequence.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
