---
editUrl: false
next: false
prev: false
title: "STATUS_CODES"
---

> `const` **STATUS\_CODES**: `Readonly`\<\{ `ABORTED`: `499`; `BAD_REQUEST`: `400`; `CONFLICT`: `409`; `CREATED`: `201`; `FORBIDDEN`: `403`; `INTERNAL_SERVER_ERROR`: `500`; `NO_CONTENT`: `204`; `NOT_ALLOWED`: `405`; `NOT_FOUND`: `404`; `OK`: `200`; `SERVICE_UNAVAILABLE`: `503`; `TOO_MANY_REQUESTS`: `429`; `UNAUTHORIZED`: `401`; `UNPROCESSABLE_ENTITY`: `422`; \}\>

Defined in: .temp/xeno-shared/dist/shared/constants/error.constants.d.ts:147

## Description

Canonical HTTP status codes used across Presentation and Infrastructure layers.
Centralising these values prevents magic-number sprawl and ensures
consistent semantics between the AppError, Result and ApiResponse contracts.

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
