---
title: GuidHelper
description: Generate and validate UUID v4 identifiers with the Xeno.JS GuidHelper.
keywords: [Xeno.JS, GuidHelper, UUID v4, GUID, TypeScript]
tags: [utilities, identifiers, uuid, typescript]
faqs:
  - question: Which UUID version does GuidHelper validate?
    answer: GuidHelper.isValid accepts the UUID v4 format, including its version and variant bits.
  - question: Does GuidHelper.parse throw for an invalid string?
    answer: No. It returns undefined when the string is absent, empty, or not a valid UUID v4.
---

## Generate and validate identifiers

`GuidHelper.generate()` calls `crypto.randomUUID()` to generate a UUID v4. The runtime must provide the global Web Crypto API.

```ts
import { GuidHelper } from '@xeno-js/core'

const id = GuidHelper.generate()
console.log(GuidHelper.isValid(id)) // true

const parsed = GuidHelper.parse('550e8400-e29b-41d4-a716-446655440000')
if (parsed === undefined) throw new Error('Invalid identifier')
```

## Methods

- `generate()` returns a random UUID v4.
- `isValid(value)` checks the UUID v4 string format, case-insensitively.
- `parse(value)` returns the original valid string or `undefined`; it does not normalize case.
- `isValidGuid(value)` checks a `Guid` value by converting it to a string and checking validity and emptiness.
- `isEmpty(value)` checks for the exact all-zero GUID string. Other invalid strings are not considered empty.

## Common problems

A valid UUID of another version does not pass `isValid()`. Validate external strings before treating them as identifiers. The UUID format check does not establish that an identifier exists or that the caller may access the associated resource.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
