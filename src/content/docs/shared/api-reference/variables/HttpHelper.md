---
editUrl: false
next: false
prev: false
title: "HttpHelper"
---

> `const` **HttpHelper**: `Readonly`\<\{ `error`: [`ResponseDto`](/shared/api-reference/interfaces/responsedto/)\<`T`\>; `normalizeHeaders`: [`HttpHeaders`](/shared/api-reference/type-aliases/httpheaders/); `success`: [`ResponseDto`](/shared/api-reference/interfaces/responsedto/)\<`T`\>; \}\>

Defined in: [.temp/xeno-shared/src/shared/utils/http.utils.ts:33](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/shared/utils/http.utils.ts#L33)

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
