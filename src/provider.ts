import type { MessagingProviderId, SendMessageInput, SendMessageResult } from './types.js';

/**
 * Transactional messaging provider port.
 * App code depends on this — never on a concrete ESP SDK/HTTP API.
 */
export interface MessagingProvider {
  readonly id: MessagingProviderId;

  /**
   * Send a transactional message. Implementations should not throw for routine
   * delivery failures — return `{ ok: false }` instead. Missing credentials
   * should mock-send and return `{ mocked: true, ok: true }`.
   */
  send(input: SendMessageInput): Promise<SendMessageResult>;
}

export type MessagingProviderErrorCode = 'NOT_CONFIGURED' | 'SEND_FAILED' | 'UNKNOWN';

export class MessagingProviderError extends Error {
  readonly code: MessagingProviderErrorCode;

  constructor(message: string, code: MessagingProviderErrorCode = 'UNKNOWN') {
    super(message);
    this.name = 'MessagingProviderError';
    this.code = code;
  }
}
