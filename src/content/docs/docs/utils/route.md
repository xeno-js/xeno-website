---
title: Route Helpers
description: Parse Xeno.JS route patterns and extract path, query, and request input with RoutePatternHelper and HttpRouteParamHelper.
keywords: [Xeno.JS, route patterns, path parameters, query parameters, HTTP request]
tags: [utilities, routing, http, typescript]
faqs:
  - question: Does extractPathParams verify that a route matches?
    answer: No. It extracts dynamic segments by position, so verify the route match separately.
  - question: Which input wins when keys collide in extractInput?
    answer: Path parameters override query values, which override body values.
---

## Parse route patterns

`RoutePatternHelper` normalizes paths and constructs regular expressions. Dynamic segments use `:name` or `{name}`:

```ts
import { RoutePatternHelper, HttpRouteParamHelper } from '@xeno-js/core'

const route = RoutePatternHelper.parse('/users/:id')
console.log(route.isDynamic) // true
console.log(route.pattern.test('/users/42')) // true

const params = HttpRouteParamHelper.extractPathParams('/users/:id', '/users/42')
// { id: '42' }
```

- `normalizePath(path)` trims whitespace, adds a leading slash if needed, and removes trailing slashes except for the root path. Repeated internal slashes are not collapsed.
- `isDynamicPath(path)` checks for a colon or both braces anywhere in the path.
- `createRoutePattern(path)` creates a regular expression from path segments, escaping static segments and capturing dynamic ones.
- `parse(path)` returns `{ pattern, isDynamic }`. Dynamic paths use `createRoutePattern`; static paths are inserted into a regular expression without escaping metacharacters.

Use trusted route definitions. For static paths containing regex metacharacters, account for their regex meaning or construct a suitably escaped pattern yourself.

## Extract request data

- `extractPathParams(routePattern, requestPath)` extracts dynamic segments by position, decodes them, and strips control characters. It does not verify static segments or route matching. Invalid percent-encoding can throw.
- `extractQueryParams(requestUrl)` parses the URL, strips control characters, and limits keys to 64 and values to 512 characters. Later duplicate keys overwrite earlier ones.
- `extractInput<TInput>(req, routePattern)` merges the parsed body, `req.query`, and path parameters in that order. Path values take precedence. `TInput` is a compile-time type, not a runtime schema.

For `POST`, `PUT`, and `PATCH`, `extractInput()` reads JSON, URL-encoded form data, or text according to Content-Type. It catches body-reading and parsing failures and uses `undefined` as the body. Structured body values are recursively sanitized, including array elements; `req.query` is used directly. Validate the merged data before passing it to application logic.

See [HTTP routes](/docs/http/routes) for route registration.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
