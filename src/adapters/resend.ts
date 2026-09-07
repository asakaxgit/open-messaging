import type { MessagingProvider } from '../provider.js';
import type { SendMessageInput, SendMessageResult } from '../types.js';

function defaultFrom(): string {
  return process.env.EMAIL_FROM ?? process.env.MESSAGING_FROM ?? 'noreply@example.com';
}

function toList(to: string | string[]): string[] {
  return Array.isArray(to) ? to : [to];
}

/**
 * Resend HTTP adapter. Mocks when `RESEND_API_KEY` is unset.
 */
export class ResendMessagingProvider implements MessagingProvider {
  readonly id = 'resend' as const;

  async send(input: SendMessageInput): Promise<SendMessageResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const recipients = toList(input.to);

    if (!apiKey) {
      console.info('[open-messaging:resend] RESEND_API_KEY missing — mock send', {
        to: recipients,
        subject: input.subject,
        tags: input.tags,
      });
      return { mocked: true, ok: true, id: null };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: input.from ?? defaultFrom(),
          to: recipients,
          subject: input.subject,
          html: input.html,
          ...(input.text ? { text: input.text } : {}),
          ...(input.tags
            ? {
                tags: Object.entries(input.tags).map(([name, value]) => ({
                  name,
                  value,
                })),
              }
            : {}),
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error('[open-messaging:resend] send failed', { status: res.status, body });
        return { mocked: false, ok: false, id: null };
      }

      const json = (await res.json().catch(() => null)) as { id?: string } | null;
      return { mocked: false, ok: true, id: json?.id ?? null };
    } catch (err) {
      console.error('[open-messaging:resend] send error', err);
      return { mocked: false, ok: false, id: null };
    }
  }
}

export function createResendMessagingProvider(): MessagingProvider {
  return new ResendMessagingProvider();
}
