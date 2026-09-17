---
editUrl: false
next: false
prev: false
title: "Resolver"
---

> **Resolver**\<`T`\> = (`token`) => `T`

Defined in: .temp/xeno-shared/dist/shared/types/common.types.d.ts:177

## Type Parameters

### T

`T` = `unknown`

Narrows the return type at each call site.

## Parameters

### token

`symbol`

## Returns

`T`

## Description

Delegate used by application-layer services to perform lazy,
symbol-keyed dependency resolution without coupling to the concrete container.

This is the **only** sanctioned way to resolve dependencies at runtime outside
of constructor injection. Never inject the raw IoC container into services.

## Example

```ts
class NexusMediator {
  constructor(private readonly resolve: Resolver) {}

  send<TResult>(command: ICommand): Promise<TResult> {
    const handler = this.resolve<ICommandHandler<typeof command, TResult>>(
      command.resolverToken,
    );
    return handler.execute(command);
  }
}

  *
  *
```

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
