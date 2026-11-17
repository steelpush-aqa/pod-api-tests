import { test, expect } from '../_fixtures/fixtures';
import { ROUTES } from '../../src/constants/routes';

for (const route of Object.values(ROUTES)) {
  test(`HEAD ${route} returns the GET headers without a body`, async ({ baseApi }) => {
    const get = await baseApi.sendWithMethod(route, 'GET');
    const head = await baseApi.sendWithMethod(route, 'HEAD');

    await baseApi.assertOk(head);
    expect(head.headers()['content-type']).toBe(get.headers()['content-type']);
    expect(head.headers()['cache-control']).toBe(get.headers()['cache-control']);
    await baseApi.assertEmptyBody(head);
  });
}
