import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  SUPPORTED_MESSAGING_PROVIDERS,
  getMessagingProvider,
  isMessagingProviderId,
  listMessagingProviders,
  setMessagingProviderOverride,
  type MessagingProvider,
} from '../src/index.js';

describe('open-messaging registry', () => {
  afterEach(() => {
    setMessagingProviderOverride(null);
    delete process.env.MESSAGING_PROVIDER;
    delete process.env.EMAIL_PROVIDER;
    delete process.env.RESEND_API_KEY;
  });

  it('lists resend', () => {
    expect(listMessagingProviders()).toEqual(['resend']);
    expect(SUPPORTED_MESSAGING_PROVIDERS).toEqual(['resend']);
    expect(isMessagingProviderId('resend')).toBe(true);
    expect(isMessagingProviderId('postmark')).toBe(false);
  });

  it('defaults to resend', () => {
    expect(getMessagingProvider().id).toBe('resend');
  });

  it('rejects unknown provider', () => {
    process.env.MESSAGING_PROVIDER = 'postmark';
    expect(() => getMessagingProvider()).toThrow(/Unsupported MESSAGING_PROVIDER/);
  });

  it('accepts overrides', () => {
    const fake: MessagingProvider = {
      id: 'resend',
      send: vi.fn(async () => ({ mocked: false, ok: true, id: 'msg_1' })),
    };
    setMessagingProviderOverride(fake);
    expect(getMessagingProvider()).toBe(fake);
  });

  it('mock-sends without RESEND_API_KEY', async () => {
    const result = await getMessagingProvider().send({
      to: 'a@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });
    expect(result).toEqual({ mocked: true, ok: true, id: null });
  });
});
