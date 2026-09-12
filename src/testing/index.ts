/**
 * Test utilities for open-messaging.
 * Import from `open-messaging/testing` in app/unit tests.
 */

export {
  createMockMessagingProvider,
  type MockMessagingProvider,
  type MockMessagingProviderOptions,
} from './mock-provider.js';

export {
  FIXTURE_HTML,
  FIXTURE_SUBJECT,
  FIXTURE_TO,
  fixtureSendInput,
  fixtureSendSuccess,
  resendSuccessResponseBody,
} from './fixtures.js';
