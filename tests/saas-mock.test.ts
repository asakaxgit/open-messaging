import { afterEach, describe, expect, it, vi } from 'vitest';
import { createResendMessagingProvider } from '../src/adapters/resend.js';
import { getMessagingProvider, setMessagingProviderOverride } from '../src/index.js';
import {
  createMockMessagingProvider,
  fixtureSendInput,
  fixtureSendSuccess,
  resendSuccessResponseBody,
} from '../src/testing/index.js';

describe('createMockMessagingProvider', () => {
  afterEach(() => {
    setMessagingProviderOverride(null);
  });

  it('records sends and returns canned result for resend', async () => {
    const mock = createMockMessagingProvider({
      id: 'resend',
      result: fixtureSendSuccess,
    });
    setMessagingProviderOverride(mock);

    const provider = getMessagingProvider();
    expect(provider.id).toBe('resend');

    const result = await provider.send(fixtureSendInput);
    expect(result).toEqual(fixtureSendSuccess);
    expect(mock.calls.send).toEqual([fixtureSendInput]);

    mock.reset();
    expect(mock.calls.send).toHaveLength(0);
  });
});

describe('ResendMessagingProvider (mocked HTTP)', () => {
  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('mock-sends when RESEND_API_KEY is unset', async () => {
    const provider = createResendMessagingProvider();
    await expect(provider.send(fixtureSendInput)).resolves.toEqual({
      mocked: true,
      ok: true,
      id: null,
    });
  });

  it('posts to Resend API when key is set', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify(resendSuccessResponseBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = createResendMessagingProvider();
    const result = await provider.send(fixtureSendInput);

    expect(result).toEqual({
      mocked: false,
      ok: true,
      id: resendSuccessResponseBody.id,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.resend.com/emails');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: 'Bearer re_test_key',
    });
    const body = JSON.parse(String((init as RequestInit).body));
    expect(body.to).toEqual([fixtureSendInput.to]);
    expect(body.subject).toBe(fixtureSendInput.subject);
    expect(body.html).toBe(fixtureSendInput.html);
  });
});
