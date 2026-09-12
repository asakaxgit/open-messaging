/**
 * Messaging fixtures for ESP adapter tests.
 */

import type { SendMessageInput, SendMessageResult } from '../types.js';

export const FIXTURE_TO = 'user@example.com';
export const FIXTURE_SUBJECT = 'Welcome to the app';
export const FIXTURE_HTML = '<p>Hello</p>';

export const fixtureSendInput: SendMessageInput = {
  to: FIXTURE_TO,
  subject: FIXTURE_SUBJECT,
  html: FIXTURE_HTML,
  tags: { category: 'welcome' },
};

export const fixtureSendSuccess: SendMessageResult = {
  mocked: false,
  ok: true,
  id: 'msg_resend_test_1',
};

/** Successful Resend API JSON body. */
export const resendSuccessResponseBody = {
  id: 'msg_resend_test_1',
};
