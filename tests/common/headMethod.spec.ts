import { test, expect } from '@playwright/test';
import { BaseApi } from '../../src/api/BaseApi';
import { ROUTES } from '../../src/constants/routes';

for (const route of Object.values(ROUTES)) {
  test(`HEAD ${route} returns the GET headers without a body`, async ({ request }) => {
    const api = new BaseApi(request);
    const get = await api.sendWithMethod(route, 'GET');
    const head = await api.sendWithMethod(route, 'HEAD');

    await api.assertOk(head);
    expect(head.headers()['content-type']).toBe(get.headers()['content-type']);
    expect(head.headers()['cache-control']).toBe(get.headers()['cache-control']);
    await api.assertEmptyBody(head);
  });
}
