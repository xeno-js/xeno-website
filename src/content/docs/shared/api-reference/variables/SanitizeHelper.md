---
editUrl: false
next: false
prev: false
title: "SanitizeHelper"
---

> `const` **SanitizeHelper**: `Readonly`\<\{ `sanitizePath`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>; `sanitizeStringArray`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`[]\>; `stripControlChars`: [`Optional`](/shared/api-reference/type-aliases/optional/)\<`string`\>; \}\>

Defined in: [.temp/xeno-shared/src/shared/utils/sanitize.utils.ts:23](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/utils/sanitize.utils.ts#L23)

## Description

Centralized security utility for data and context sanitization.
Enforces OWASP guidelines preventing Log Injection (CWE-117), CRLF injection,
and URI protocol manipulation across all application layers.

## Author

Xeno

## Version

1.0.0

## Since

2025-09-30

## Link

https://github.com/Mattia-Carcione/xeno-js
