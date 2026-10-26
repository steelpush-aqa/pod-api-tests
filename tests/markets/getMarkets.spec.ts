import { test, expect } from '@playwright/test';

test('List Markets: request succeeds and returns a non-empty list', async ({ request }) => {
  const response = await request.get('clob/markets');

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  expect(response.headers()['cache-control']).toBe('public, max-age=60');

  const body = (await response.json()) as unknown[];

  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
});
