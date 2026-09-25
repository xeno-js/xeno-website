---
title: 'GDPR Compliance & IP Masking: Secure Logging in Xeno'
description: 'Discover how Xeno automatically enforces GDPR compliance across any application by sanitizing execution contexts, removing PII, and masking client IP addresses.'
keywords: [
  'GDPR compliance',
  'IP masking',
  'log sanitization',
  'PII protection',
  'BaseLogger',
  'LoggerUtils',
  'Xeno logging',
]
author: 'Xeno'
sidebar:
 order: 4
---

## Overview of GDPR & Privacy in Xeno Logging

When building enterprise-grade applications, maintaining strict compliance with data privacy regulations such as the **GDPR** (General Data Protection Regulation) is mandatory. In server-side and distributed environments, logging sensitive user data—such as raw IP addresses, session cookies, authorization headers, or Personally Identifiable Information (PII)—poses severe compliance risks and potential security liabilities.

Xeno solves this architecturally. Regardless of whether you are building a backend service with `@xeno-js/core` or an application layout, Xeno’s unified logging subsystem (`BaseLogger`) automatically enforces privacy guardrails out of the box, ensuring that telemetry data remains completely GDPR-compliant without requiring manual sanitization in your business handlers.

---

## Automatic Client IP Masking

Under GDPR guidelines, a raw IP address is classified as Personally Identifiable Information (PII) because it can potentially be linked to identify a natural person. Storing unmasked client IPs directly in log files or third-party APM dashboards violates privacy standards.

Xeno handles this transparently at the network ingestion boundary using built-in IP masking algorithms:

* **IPv4 Masking**: The last octet of an IPv4 address is automatically replaced with an `x` (e.g., `192.168.1.150` becomes `192.168.1.x`).
* **IPv6 Masking**: The final segment of an IPv6 address is anonymized with an `x` (e.g., `2001:db8::ff00:42:8329` becomes `2001:db8::ff00:42:x`).

This transformation is executed prior to dispatching log payloads to any transport driver (Console, Pino, or Sentry).

---

## GDPR-Safe Context Cleaning (`LoggerUtils.toSafeContext`)

When application exceptions or standard logs capture request metadata, they frequently include volatile or highly sensitive objects like raw HTTP transports (`req`/`res`), security cookies, and credential tokens.

To prevent accidental data leaks, Xeno's `BaseLogger` integrates **`LoggerUtils.toSafeContext`**. This utility performs deep sanitization on any context object passed into a log call:

* **Excludes Transport Objects**: Strips out native server objects (`req`, `res`) to prevent circular JSON serialization errors and memory leaks.
* **Removes Sensitive Cookies**: Strips cookie collections and session identifiers.
* **Purges PII**: Filters out authorization headers, bearer tokens, and sensitive query parameters.

---

## How It Works Under the Hood

The sanitization and masking pipeline operates automatically whenever a log method (`info`, `warn`, `error`, `debug`) is invoked:

1. **Context Interception**: The `BaseLogger` captures the log message alongside the provided contextual object.
2. **Safe Context Resolution**: It executes `LoggerUtils.toSafeContext` to scrub cookies, transports, and PII from the metadata dictionary.
3. **IP Anonymization**: Network metadata is inspected, and any raw client IP addresses are passed through the masking utility.
4. **Multi-Driver Broadcast**: The sanitized, GDPR-compliant payload is simultaneously broadcast to all active logging clients (e.g., local console, structured Pino streams, or Sentry error tracking).

---

## Example: Writing GDPR-Safe Logs

Because context cleaning is handled globally by the framework, your application code remains clean and focused solely on business logic:

```typescript
import { TOKENS } from '@xeno-js/core'
import type { ILogger } from '@xeno-js/core'

export class OrderService {
  constructor(private readonly _logger: ILogger) {}

  public async processOrder(orderId: string, userId: string): Promise<void> {
    // The logger automatically sanitizes any sensitive context properties
    this._logger.info(`Processing payment for order: ${orderId}`)
  }
}

```

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../support-us)
