import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, ApiRequestError } from './api';

afterEach(() => vi.unstubAllGlobals());
describe('API transport', () => {
  it('uses the API prefix and returns typed JSON', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ status: 'ok' })));
    vi.stubGlobal('fetch', fetchMock);
    expect(await apiRequest('health')).toEqual({ status: 'ok' });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'http://localhost:3000/api/v1/health',
    );
  });
  it('exposes the common error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 503,
            message: 'Database connection unavailable',
            code: 'SERVICE_UNAVAILABLE',
          }),
          { status: 503 },
        ),
      ),
    );
    await expect(apiRequest('/health/db')).rejects.toMatchObject({
      status: 503,
      message: 'Database connection unavailable',
    });
  });
  it('handles non-JSON failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Bad gateway', { status: 502 })),
    );
    await expect(apiRequest('health')).rejects.toBeInstanceOf(ApiRequestError);
  });
});
