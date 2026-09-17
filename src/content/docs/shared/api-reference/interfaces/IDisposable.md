---
editUrl: false
next: false
prev: false
title: "IDisposable"
---

Defined in: [.temp/xeno-shared/src/domain/contracts/disposables/idisposable.contracts.ts:17](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/disposables/idisposable.contracts.ts#L17)

## Description

IDisposable defines the contract for disposable resources. It provides a method to dispose of resources, allowing for proper cleanup when they are no longer needed. This interface ensures that any class implementing it will provide a consistent way to manage the lifecycle of disposable resources.

## Example

```ts
class MyResource implements IDisposable {
    async dispose(): Promise<void> {
        // Cleanup logic here
    }
}
```

## Extended by

- [`IReadDataSource`](/shared/api-reference/interfaces/ireaddatasource/)
- [`IWriteDataSource`](/shared/api-reference/interfaces/iwritedatasource/)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [.temp/xeno-shared/src/domain/contracts/disposables/idisposable.contracts.ts:22](https://github.com/Mattia-Carcione/xeno-shared/blob/f005f5d2a4905c83ce2c4fc6aa20f2539fd7143f/src/domain/contracts/disposables/idisposable.contracts.ts#L22)

#### Returns

`Promise`\<`void`\>

A promise that resolves when the disposal process is complete.

#### Description

Disposes of the resource, releasing any held resources and performing necessary cleanup. This method should be called when the resource is no longer needed to ensure proper cleanup and avoid resource leaks.
