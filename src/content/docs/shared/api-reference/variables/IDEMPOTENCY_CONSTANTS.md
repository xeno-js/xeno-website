---
editUrl: false
next: false
prev: false
title: "IDEMPOTENCY_CONSTANTS"
---

> `const` **IDEMPOTENCY\_CONSTANTS**: `Readonly`\<\{ `DEFAULT_IDEMPOTENCY_LOCK_TTL_SECONDS`: `60`; `DEFAULT_TTL_SECONDS`: `86400`; `LOCK_KEY_PREFIX`: `"idempotency_lock:"`; `LOCKED_VALUE`: `"LOCKED"`; `PROCESSED_KEY_PREFIX`: `"idempotency_processed:"`; `PROCESSED_VALUE`: `"PROCESSED"`; \}\>

Defined in: [.temp/xeno-shared/src/shared/constants/idempotency.constants.ts:10](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/constants/idempotency.constants.ts#L10)

## Description

Constants used in the idempotency store implementation, including key prefixes for locks and processed commands, default time-to-live (TTL) values, and standard values for indicating locked and processed states. These constants are defined as a frozen object to ensure immutability and provide a centralized location for managing configuration values related to idempotency handling in the application.

  * 
  *

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
