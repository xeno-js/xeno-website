---
editUrl: false
next: false
prev: false
title: "IDisposable"
---

Defined in: .temp/xeno-shared/dist/domain/contracts/disposables/idisposable.contracts.d.ts:16

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

- [`IServiceContainer`](/core/api-reference/interfaces/iservicecontainer/)
- [`IServiceScope`](/core/api-reference/interfaces/iservicescope/)
- [`IReadDataSource`](/core/api-reference/interfaces/ireaddatasource/)
- [`IWriteDataSource`](/core/api-reference/interfaces/iwritedatasource/)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: .temp/xeno-shared/dist/domain/contracts/disposables/idisposable.contracts.d.ts:21

#### Returns

`Promise`\<`void`\>

A promise that resolves when the disposal process is complete.

#### Description

Disposes of the resource, releasing any held resources and performing necessary cleanup. This method should be called when the resource is no longer needed to ensure proper cleanup and avoid resource leaks.
