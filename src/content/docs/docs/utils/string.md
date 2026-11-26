---
title: StringHelper
description: Use Xeno.JS StringHelper for JSON conversion, string formatting, interpolation, truncation, and header values.
keywords: [Xeno.JS, StringHelper, JSON parsing, camelCase, interpolation, TypeScript]
tags: [utilities, strings, typescript]
faqs:
  - question: Does safeParse validate the shape of parsed JSON?
    answer: No. The generic type is a TypeScript assertion and does not validate the parsed value.
  - question: Is generateReferenceCode suitable for security tokens?
    answer: No. It uses Math.random and does not guarantee uniqueness.
---

## Format and parse strings

```ts
import { StringHelper } from '@xeno-js/core'

console.log(StringHelper.camelCase('order-status')) // orderStatus
console.log(StringHelper.interpolate('Hello {{name}}', { name: 'Ada' })) // Hello Ada
console.log(StringHelper.safeParse('not-json', { enabled: false })) // { enabled: false }
console.log(StringHelper.getSingleValue(['application/json', 'text/plain'])) // application/json
```

## JSON helpers

- `safeStringify(value)` uses `JSON.stringify()` and falls back to `String(value)` if serialization throws. `String()` itself can also throw for some values. Despite the declared string return type, `JSON.stringify(undefined)` returns `undefined` at runtime.
- `safeParse<T>(input, fallback?)` returns the parsed value on success. On invalid JSON it returns the non-nullish fallback, or the original input when no fallback is supplied. Validate the parsed shape before using it as `T`.
- `safeStringifyObject(obj)` applies `safeStringify()` to each defined own enumerable property, skipping `null`, `undefined`, and `NaN`.

## String and header helpers

- `camelCase(input)` splits on hyphens, underscores, and whitespace, lowercases the first segment, and capitalizes the first character of subsequent segments. It does not split existing camelCase words.
- `interpolate(template, vars)` replaces `{{key}}` tokens for defined values. Unknown tokens remain unchanged.
- `truncate(input, maxLength, suffix?)` returns the original string if short enough; otherwise it appends the suffix, which defaults to `…`. If the suffix is longer than `maxLength`, the result can exceed that limit.
- `generateReferenceCode(prefix)` produces a prefix, six random alphanumeric characters, and the local year. It uses `Math.random()` and does not guarantee uniqueness.
- `getSingleValue(value, separator?)` returns a string or the first array item. With a separator, it returns the first part; an empty array returns `undefined`.
- `getSingleValueWithSplit(value, separator)` splits and trims the first part only when the separator occurs in the value.

## Common problems

Neither interpolation nor JSON parsing escapes content for HTML, SQL, or other destinations. Apply validation and context-specific encoding. Use a cryptographic identifier generator, such as [GuidHelper](/docs/utils/guid), when a random UUID is required.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
