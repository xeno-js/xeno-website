---
title: HttpHelper
description: Use Xeno.JS HttpHelper to normalize headers, parse cookies and URLs, prepare request bodies, and create response DTOs.
keywords: [Xeno.JS, HttpHelper, HTTP headers, cookies, URL, response DTO]
tags: [utilities, http, typescript]
faqs:
  - question: Does parseSafeUrl prevent requests to private hosts?
    answer: No. It parses absolute or relative URLs but does not apply an SSRF policy or host allowlist.
  - question: Does normalizeHeaders lowercase header names?
    answer: No. It preserves the input key casing and converts values to strings.
---

## Work with HTTP data

`HttpHelper` provides transformations used by Xeno.JS HTTP components. For the response contract and related examples, see [HTTP helpers](/docs/http/helper-http) and [API response DTOs](/docs/http/api-response).

```ts
import { HttpHelper } from '@xeno-js/core'

const headers = HttpHelper.normalizeHeaders({
  'X-Request-Id': 42,
  Accept: ['application/json', 'text/plain'],
})
// { 'X-Request-Id': '42', Accept: 'application/json,text/plain' }

const cookies = HttpHelper.parseCookies('theme=dark; name=Ada%20Lovelace')
// { theme: 'dark', name: 'Ada Lovelace' }

const response = HttpHelper.success({ id: 42 }, 201)
```

## Headers, cookies, and URLs

- `normalizeHeaders(headers)` converts defined object values to strings and joins arrays with commas. It preserves key casing and omits `null`, `undefined`, and `NaN`; a non-object input produces `{}`.
- `parseCookies(header)` splits a cookie header on semicolons and decodes each value. The last duplicate name wins; malformed percent-encoding is kept as-is.
- `sanitizeOriginUrl(url)` returns the `URL.origin` of a parseable absolute URL, or `undefined` if parsing fails. Some opaque origins produce the string `"null"`.
- `parseSafeUrl(url, fallbackHost?)` tries an absolute URL, then resolves against the fallback, which defaults to `http://localhost`. Invalid input or an invalid fallback can still throw.
- `maskIp(ip)` replaces the last dot-separated segment of a four-part address or the last colon-separated segment. Other inputs can be returned unchanged.

## Bodies and response DTOs

- `parseBody(method, rawBody)` handles `POST`, `PUT`, `PATCH`, and `DELETE`, case-insensitively. It passes through supported body types, serializes objects, and converts other defined values to strings. Other methods or missing inputs return `undefined`.
- `success(data, status?, meta?, customHeaders?)` returns a `ResponseDto` with `ok: true` and a `{ success: true, data, meta }` payload. The status defaults to `200`. The JSON `Content-Type` overrides the same-cased custom header.
- `error(dto, status?, customHeaders?)` builds an error DTO with `ok: false`, identifiers, a new timestamp, and no-cache headers. The status defaults to `500`; custom headers can override default headers.
- `resolveFormatIndicator(accept, contentType)` checks the first Accept candidate, then Content-Type, then falls back to `application/json`. It does not negotiate quality values or inspect later Accept candidates.
- `normalizeMediaType(value, fromAccept)` normalizes the first candidate and removes parameters. `isValidMediaType(mediaType)` checks the media-type syntax used by the helper.

## Security limitations

URL parsing does not apply an origin or host allowlist and does not prevent SSRF or open redirects. Validate the scheme and destination for your use case. `maskIp()` is a simple string transformation, not reliable anonymization. Header conversion does not validate header names or values for your transport.

---

## Support Us

Xeno.JS is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](/support-us)
