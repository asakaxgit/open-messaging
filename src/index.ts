import { createResendMessagingProvider } from './adapters/resend.js';
import { MessagingProviderError, type MessagingProvider } from './provider.js';
import type { MessagingProviderId } from './types.js';

export type { MessagingProvider } from './provider.js';
export { MessagingProviderError } from './provider.js';
export type {
  MessagingProviderId,
  SendMessageInput,
  SendMessageResult,
} from './types.js';
export { createResendMessagingProvider, ResendMessagingProvider } from './adapters/resend.js';

/** Currently only Resend — registry is ready for additional adapters later. */
export const SUPPORTED_MESSAGING_PROVIDERS = [
  'resend',
] as const satisfies readonly MessagingProviderId[];

export function isMessagingProviderId(value: string): value is MessagingProviderId {
  return (SUPPORTED_MESSAGING_PROVIDERS as readonly string[]).includes(value);
}

let providerOverride: MessagingProvider | null = null;

/** Test helper — inject a fake provider. */
export function setMessagingProviderOverride(provider: MessagingProvider | null): void {
  providerOverride = provider;
}

function resolveProviderId(explicit?: MessagingProviderId): MessagingProviderId {
  if (explicit) {
    if (!isMessagingProviderId(explicit)) {
      throw new MessagingProviderError(
        `Unsupported messaging provider "${explicit}"`,
        'NOT_CONFIGURED',
      );
    }
    return explicit;
  }
  const fromEnv = (
    process.env.MESSAGING_PROVIDER ??
    process.env.EMAIL_PROVIDER ??
    'resend'
  ).toLowerCase();
  if (!isMessagingProviderId(fromEnv)) {
    throw new MessagingProviderError(
      `Unsupported MESSAGING_PROVIDER="${fromEnv}". Supported: ${SUPPORTED_MESSAGING_PROVIDERS.join(', ')}`,
      'NOT_CONFIGURED',
    );
  }
  return fromEnv;
}

function createProvider(id: MessagingProviderId): MessagingProvider {
  switch (id) {
    case 'resend':
      return createResendMessagingProvider();
    default: {
      const _exhaustive: never = id;
      throw new MessagingProviderError(
        `Unknown messaging provider: ${String(_exhaustive)}`,
        'NOT_CONFIGURED',
      );
    }
  }
}

/**
 * Resolve the active messaging provider.
 * Set `MESSAGING_PROVIDER` (or `EMAIL_PROVIDER`); default `resend`.
 */
export function getMessagingProvider(id?: MessagingProviderId): MessagingProvider {
  if (providerOverride) return providerOverride;
  return createProvider(resolveProviderId(id));
}

export function listMessagingProviders(): readonly MessagingProviderId[] {
  return SUPPORTED_MESSAGING_PROVIDERS;
}

/** @deprecated Alias — prefer getMessagingProvider */
export const getEmailProvider = getMessagingProvider;
