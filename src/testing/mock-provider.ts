/**
 * In-memory mock MessagingProvider for unit/integration tests.
 * Records calls — no ESP network I/O.
 */

import type { MessagingProvider } from '../provider.js';
import type {
  MessagingProviderId,
  SendMessageInput,
  SendMessageResult,
} from '../types.js';

export type MockMessagingProviderOptions = {
  id?: MessagingProviderId;
  /** Fixed result, or a function of the send input. */
  result?:
    | SendMessageResult
    | ((input: SendMessageInput) => SendMessageResult | Promise<SendMessageResult>);
};

export type MockMessagingProvider = MessagingProvider & {
  readonly calls: {
    send: SendMessageInput[];
  };
  reset(): void;
};

/**
 * Create a mock MessagingProvider for any supported ESP id (currently `resend`).
 * Use with `setMessagingProviderOverride()` or inject directly.
 */
export function createMockMessagingProvider(
  options: MockMessagingProviderOptions = {},
): MockMessagingProvider {
  const calls: MockMessagingProvider['calls'] = { send: [] };

  const provider: MockMessagingProvider = {
    id: options.id ?? 'resend',
    calls,
    reset() {
      calls.send.length = 0;
    },
    async send(input) {
      calls.send.push(input);
      if (typeof options.result === 'function') return options.result(input);
      return options.result ?? { mocked: true, ok: true, id: 'msg_mock_1' };
    },
  };

  return provider;
}
