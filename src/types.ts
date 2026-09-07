/**
 * Provider-agnostic transactional messaging types.
 */

export type MessagingProviderId = 'resend';

export type SendMessageInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  /** Optional correlation tags for provider dashboards. */
  tags?: Record<string, string>;
};

export type SendMessageResult = {
  /** True when the provider was not configured and we logged a mock send. */
  mocked: boolean;
  ok: boolean;
  /** Provider message id when available. */
  id?: string | null;
};
