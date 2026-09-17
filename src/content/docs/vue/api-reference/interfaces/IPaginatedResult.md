---
editUrl: false
next: false
prev: false
title: "IPaginatedResult"
---

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:15

## Description

Standardised paginated response envelope returned by query handlers.

Wraps the items array with cursor metadata so callers can navigate pages
without re-computing totals on every request.

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

## Type Parameters

### T

`T`

The type of each item in the page.

  *
  *

## Properties

### hasNextPage

> `readonly` **hasNextPage**: `boolean`

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:76

#### Description

`true` when a next page exists (i.e. `page < totalPages`).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### hasPreviousPage

> `readonly` **hasPreviousPage**: `boolean`

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:86

#### Description

`true` when a previous page exists (i.e. `page > 1`).

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### items

> `readonly` **items**: readonly `T`[]

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:25

#### Description

Immutable slice of items for the requested page.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### page

> `readonly` **page**: `number`

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:45

#### Description

Current 1-based page index.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### pageSize

> `readonly` **pageSize**: `number`

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:55

#### Description

Number of items per page used for this result.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### total

> `readonly` **total**: `number`

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:35

#### Description

Total number of items matching the query across all pages.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js

***

### totalPages

> `readonly` **totalPages**: `number`

Defined in: .temp/xeno-shared/dist/shared/types/pagination.types.d.ts:66

#### Description

Total number of pages given `total` and `pageSize`.
Computed as `Math.ceil(total / pageSize)`.

#### Author

Xeno

#### Version

1.0.0

#### Since

2025-09-30

#### Link

https://github.com/Mattia-Carcione/xeno-js
