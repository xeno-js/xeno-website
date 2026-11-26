---
title: SanitizeHelper
description: Remove control characters and apply limited path, array, and object sanitization with Xeno.JS SanitizeHelper.
keywords: [Xeno.JS, SanitizeHelper, control characters, input sanitization, TypeScript]
tags: [utilities, sanitization, security, typescript]
faqs:
  - question: Does sanitizePath validate safe redirect destinations?
    answer: No. It removes control characters and rejects three protocol prefixes, but it does not enforce an allowlist or validate redirect destinations.
  - question: Does sanitizeObject sanitize values inside arrays?
    answer: No. It leaves arrays unchanged, including objects and strings inside them.
---

## Remove control characters

`SanitizeHelper` provides limited string and object transformations. Validate the input type and apply rules for the destination where the data will be used.

```ts
import { SanitizeHelper } from '@xeno-js/core'

const name = SanitizeHelper.stripControlChars('  Ada\nLovelace  ')
// AdaLovelace

const path = SanitizeHelper.sanitizePath('javascript:alert(1)')
// /

const roles = SanitizeHelper.sanitizeStringArray([' admin\n', ' ', 'reader'])
// ['admin', 'reader']
```

## Methods

- `stripControlChars(value, maxLength?)` removes ASCII control characters, trims whitespace, and truncates to 256 characters by default. It returns `undefined` for an absent or empty result.
- `sanitizePath(path, maxLength?)` removes controls and trims, then limits the result to 512 characters by default. Initially empty input returns `undefined`; control-only input and `javascript:`, `data:`, or `vbscript:` prefixes return `/`.
- `sanitizeStringArray(items, maxItemLength?, maxItems?)` considers the first 50 items by default, strips controls from each with a default length of 64, and removes empty results. An absent or initially empty array returns `undefined`; a non-empty array can produce `[]`.
- `sanitizeObject(obj)` walks object properties recursively, sanitizes string values, and omits `__proto__`, `constructor`, and `prototype` keys. Nested arrays are kept without sanitizing their contents. Non-object input returns `{}`.

## Security limitations

These helpers are not HTML escaping, SQL parameterization, schema validation, or a redirect allowlist. `sanitizePath()` can still return absolute URLs and other untrusted destinations. `sanitizeObject()` does not handle cyclic objects and does not sanitize array elements. Apply context-specific validation and encoding at the boundary.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
