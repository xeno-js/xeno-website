---
editUrl: false
next: false
prev: false
title: "RESILIENCE_DEFAULTS"
---

> `const` **RESILIENCE\_DEFAULTS**: `Readonly`\<\{ `BULKHEAD`: `Readonly`\<\{ `MAX_CONCURRENT`: `10`; \}\>; `CIRCUIT_BREAKER`: `Readonly`\<\{ `CONSECUTIVE_FAILURES`: `5`; `HALF_OPEN_TIMEOUT_MS`: `30000`; \}\>; `RETRY`: `Readonly`\<\{ `ATTEMPTS`: `3`; `BASE_DELAY_MS`: `100`; `MAX_DELAY_MS`: `1000`; \}\>; \}\>

Defined in: .temp/xeno-shared/dist/shared/constants/resilience.constants.d.ts:12

## Description

Canonical default values for resilience policy configuration.
Used by the resilience factory as the baseline for retry, circuit breaker,
and bulkhead settings.

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
