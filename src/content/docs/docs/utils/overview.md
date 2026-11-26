---
title: Shared Utilities
description: Explore the Xeno.JS shared utilities for dates, collections, guards, identifiers, HTTP, math, promises, routes, sanitization, and strings.
keywords:
  - Xeno.JS
  - shared utilities
  - TypeScript helpers
  - Guards
  - HTTP
  - sanitization
tags:
  - utilities
  - shared
  - typescript
faqs:
  - question: Where do I import Xeno.JS shared utilities?
    answer: Import them from @xeno-js/shared or from @xeno-js/core, which re-exports the shared package.
  - question: Do the utilities validate application data?
    answer: Individual helpers perform specific checks or transformations. They do not replace application-specific schema validation or authorization.
---

## Shared utilities in Xeno.JS

Xeno.JS exports small utilities for common operations from `@xeno-js/shared`. The same exports are available through `@xeno-js/core`, so an application already using core can import them there:

```ts
import { DateHelper, Guards, GuidHelper } from '@xeno-js/core'

const id = GuidHelper.generate()
const expiresAt = DateHelper.addDays(new Date(), 1)

if (Guards.isDefined(id)) {
  console.log(id, expiresAt)
}
```

Each helper provides a specific operation. Check its inputs and edge cases before using it as part of validation, security, or persistence logic.

## Utility reference

- [DateHelper](/docs/utils/date): UTC formatting, date arithmetic, and comparisons.
- [Enumerable](/docs/utils/enumerable): find the first array item.
- [Guards](/docs/utils/guards): runtime predicates and assertions.
- [GuidHelper](/docs/utils/guid): generate and validate UUID v4 identifiers.
- [HttpHelper](/docs/utils/http): headers, cookies, URLs, request bodies, and response DTOs.
- [MathHelper](/docs/utils/math): numeric conversions and arithmetic.
- [PromiseHelper](/docs/utils/promise): asynchronous delays and jitter.
- [Route helpers](/docs/utils/route): route patterns and request parameter extraction.
- [SanitizeHelper](/docs/utils/sanitize): control-character removal and limited sanitization.
- [StringHelper](/docs/utils/string): JSON conversion, formatting, and header values.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
