import { http, HttpResponse } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { apiClient } from './apiClient';
import { testServer } from '../test/server';

describe('apiClient', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('[UT-WEB-APICLIENT-001] attaches the bearer token when one is stored', async () => {
    localStorage.setItem('admin_access_token', 'token-123');
    let receivedAuth: string | null = null;
    testServer.use(
      http.get('*/probe', ({ request }) => {
        receivedAuth = request.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiClient.get('/probe');

    expect(receivedAuth).toBe('Bearer token-123');
  });

  it('[UT-WEB-APICLIENT-002] sends no Authorization header when no token is stored', async () => {
    let receivedAuth: string | null = 'unset';
    testServer.use(
      http.get('*/probe', ({ request }) => {
        receivedAuth = request.headers.get('Authorization');
        return HttpResponse.json({ ok: true });
      }),
    );

    await apiClient.get('/probe');

    expect(receivedAuth).toBeNull();
  });
});
