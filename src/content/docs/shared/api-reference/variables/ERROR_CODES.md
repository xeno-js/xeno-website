---
editUrl: false
next: false
prev: false
title: "ERROR_CODES"
---

> `const` **ERROR\_CODES**: `Readonly`\<\{ `ABORTED`: `"ABORTED"`; `AUTHENTICATION_FAILED`: `"AUTHENTICATION_FAILED"`; `BAD_REQUEST`: `"BAD_REQUEST"`; `CONFLICT`: `"CONFLICT"`; `EXTERNAL_SERVICE_ERROR`: `"EXTERNAL_SERVICE_ERROR"`; `FORBIDDEN`: `"FORBIDDEN"`; `HANDLER_NOT_FOUND`: `"HANDLER_NOT_FOUND"`; `NOT_ALLOWED`: `"METHOD_NOT_ALLOWED"`; `NOT_FOUND`: `"NOT_FOUND"`; `NOT_IMPLEMENTED`: `"NOT_IMPLEMENTED"`; `PIPELINE_NOT_AVAILABLE`: `"PIPELINE_NOT_AVAILABLE"`; `SCOPE_NOT_AVAILABLE`: `"SCOPE_NOT_AVAILABLE"`; `SYSTEM_ERROR`: `"SYSTEM_ERROR"`; `TOO_MANY_REQUESTS`: `"TOO_MANY_REQUESTS"`; `UNAUTHORIZED`: `"UNAUTHORIZED"`; `VALIDATION_FAILED`: `"VALIDATION_FAILED"`; \}\>

Defined in: [.temp/xeno-shared/src/shared/constants/error.constants.ts:12](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/constants/error.constants.ts#L12)

## Description

Machine-readable, kebab-case error codes for all cross-cutting failures.
Used by AppError and Result to communicate failure semantics across layer boundaries
without relying on human-readable strings.

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
