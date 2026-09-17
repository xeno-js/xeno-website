---
editUrl: false
next: false
prev: false
title: "DEFAULT_CONCURRENCY"
---

> `const` **DEFAULT\_CONCURRENCY**: `Readonly`\<\{ `BASE_DELAY`: `20`; `MAX_JITTER`: `30`; `MAX_RETRIES`: `3`; \}\>

Defined in: [.temp/xeno-shared/src/shared/constants/concurrency.constants.ts:10](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/constants/concurrency.constants.ts#L10)

## Description

This module defines constants related to concurrency handling in the application, specifically for the ConcurrencyRetryPipeline. These constants include the maximum number of retry attempts, the base delay for retries, and the maximum jitter to be added to the delay. The constants are exported as a frozen object to prevent modification at runtime, ensuring consistent behavior across the application when handling concurrency conflicts.

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
