---
editUrl: false
next: false
prev: false
title: "HttpHelper"
---

> `const` **HttpHelper**: `Readonly`\<\{ `error`: \<`T`\>(`dto`, `status?`, `customHeaders?`) => [`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`T`\>; `normalizeHeaders`: (`headers`) => [`HttpHeaders`](/core/api-reference/type-aliases/httpheaders/); `success`: \<`T`\>(`data`, `status?`, `meta?`, `customHeaders?`) => [`ResponseDto`](/core/api-reference/interfaces/responsedto/)\<`T`\>; \}\>

Defined in: .temp/xeno-shared/dist/shared/utils/http.utils.d.ts:20

## Description

A helper object that provides utility functions for HTTP-related tasks. Currently, it includes a method for normalizing HTTP headers, which ensures that all header values are strings and handles cases where header values may be arrays. This helper can be extended in the future to include additional HTTP-related utilities as needed.

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
