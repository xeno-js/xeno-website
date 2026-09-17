---
editUrl: false
next: false
prev: false
title: "SanitizeHelper"
---

> `const` **SanitizeHelper**: `Readonly`\<\{ `sanitizePath`: (`path`, `maxLength?`) => [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>; `sanitizeStringArray`: (`items`, `maxItemLength?`, `maxItems?`) => [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`[]\>; `stripControlChars`: (`value`, `maxLength?`) => [`Optional`](/core/api-reference/type-aliases/optional/)\<`string`\>; \}\>

Defined in: .temp/xeno-shared/dist/shared/utils/sanitize.utils.d.ts:12

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
