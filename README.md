# open-messaging

Provider-agnostic **transactional messaging** port (email-first).

There is no useful open standard for SaaS transactional send across ESPs.
This package owns a small hexagonal `MessagingProvider` port and ships adapters.

## Install

```bash
npm install open-messaging
```

## Quick start

```ts
import { getMessagingProvider } from 'open-messaging';

const messaging = getMessagingProvider(); // EMAIL_PROVIDER / MESSAGING_PROVIDER, default resend

await messaging.send({
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<p>Hello</p>',
  tags: { category: 'welcome' },
});
```

## Env

```bash
MESSAGING_PROVIDER=resend   # alias: EMAIL_PROVIDER
EMAIL_FROM=App <noreply@example.com>
RESEND_API_KEY=
```

When `RESEND_API_KEY` is unset, sends are **mocked** (`{ mocked: true, ok: true }`).

## Supported providers (v0.1)

| Id | Adapter |
|---|---|
| `resend` | `adapters/resend` |

Additional ESPs (Postmark, SES, SendGrid, …) can register on the same port later.

## License

MIT
