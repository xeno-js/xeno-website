---
title: 'CsrfTokenService: Cryptographic Nonce & HMAC Token Management'
description: 'Explore the technical specification of Xeno CsrfTokenService, detailing secure nonce generation, HMAC SHA-256 signing, and timing-safe token validation.'
keywords: [
  'CsrfTokenService',
  'CSRF token generation',
  'HMAC SHA-256',
  'timingSafeEqual',
  'ICryptoService',
  'Xeno security',
]
author: 'Xeno'
sidebar:
  order: 5
---

## What Is `CsrfTokenService`?

`CsrfTokenService` is the cryptographic core responsible for generating and validating Cross-Site Request Forgery (CSRF) tokens in Xeno. It implements the `ICsrfTokenService` contract, providing cryptographically robust protection against request forgery by binding tokens securely to user subjects (such as `userId`) using HMAC signatures and base64url-encoded nonces.

---

## How Token Generation Works

When generating a token for an authenticated user subject, `CsrfTokenService` performs the following cryptographic sequence:

1. **Random Nonce Creation**: It requests a 32-byte cryptographic random buffer from the injected `ICryptoService` (`crypto.randomBytes(32)`).


2. **Base64url Encoding**: The raw buffer is converted into a URL-safe string (replacing `+` with `-`, `/` with `_`, and stripping padding `=` characters) to form the token nonce.


3. **HMAC Signature Calculation**: It computes an HMAC SHA-256 signature using a shared secret key over a payload string combining the subject and the nonce (`${subject}.${nonce}`).


4. **Token Assembly**: It returns a concatenated token string structured as `${nonce}.${signature}`.



---

## How Token Validation Works

When validating an incoming CSRF token against a user subject, the service executes a secure verification check:

1. **Structure Parsing**: It locates the dot separator (`.`) to split the token into its constituent `nonce` and `signature` parts.


2. **Presence Verification**: It ensures neither the nonce nor the signature is null, empty, or undefined.


3. **Expected Signature Computation**: It recalculates the expected HMAC SHA-256 signature using the secret key and the composite message (`${subject}.${nonce}`).


4. **Timing-Safe Comparison**: It encodes both the actual and expected signatures into `Uint8Array` buffers and evaluates them using `_cryptoService.timingSafeEqual()`. This constant-time comparison prevents timing-based side-channel attacks.



---

## Code Implementation

```typescript
import { Guards } from '@xeno-js/shared'
import type { ICryptoService, ICsrfTokenService } from '@/domain'

export class CsrfTokenService implements ICsrfTokenService {
  constructor(
    private readonly _secret: string,
    private readonly _cryptoService: ICryptoService,
  ) {}

  public async generate(subject: string): Promise<string> {
    const randomBuffer = this._cryptoService.randomBytes(32)
    const nonce = btoa(String.fromCharCode(...randomBuffer))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const signature = await this._cryptoService.hmacSha256(this._secret, `${subject}.${nonce}`)
    return `${nonce}.${signature}`
  }

  public async validate(token: string, subject: string): Promise<boolean> {
    const separatorIndex = token.indexOf('.')
    if (separatorIndex <= 0) return false

    const nonce = token.slice(0, separatorIndex)
    const signature = token.slice(separatorIndex + 1)

    if (Guards.isNullOrEmpty(nonce) || Guards.isNullOrEmpty(signature)) return false

    const expected = await this._cryptoService.hmacSha256(this._secret, `${subject}.${nonce}`)

    const encoder = new TextEncoder()
    const actualBuffer = encoder.encode(signature)
    const expectedBuffer = encoder.encode(expected)

    if (actualBuffer.length !== expectedBuffer.length) return false

    return this._cryptoService.timingSafeEqual(actualBuffer, expectedBuffer)
  }
}
```

---

## Dependencies and Constraints

- **Dependency Injection**: Requires a secure `secret` string and an implementation of `ICryptoService` (such as `EdgeCryptoService` using the Web Cryptography API).
- **Subject Binding**: Every generated token is cryptographically bound to a specific user subject, ensuring tokens cannot be replayed across different user sessions.
- **Side-Channel Mitigation**: Relies strictly on byte-level timing-safe comparisons (`timingSafeEqual`) to validate signatures securely.

---

## Support Us

Xeno is an MIT-licensed open source project. It can grow thanks to the support
of these awesome people. If you'd like to join them, please read more at
[support section](../../support-us)