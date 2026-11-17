import { test } from '@playwright/test';
import { BaseApi } from '../../src/api/BaseApi';
import { ROUTES } from '../../src/constants/routes';

const PREFLIGHT_HEADERS = {
  Origin: 'https://example.com',
  'Access-Control-Request-Method': 'GET',
};

for (const route of Object.values(ROUTES)) {
  test(`CORS preflight from another website: ${route} allows GET`, async ({ request }) => {
    const api = new BaseApi(request);
    const response = await api.sendWithMethod(route, 'OPTIONS', PREFLIGHT_HEADERS);

    await api.assertOk(response);
    await api.assertCorsAllowsGetFromAnyOrigin(response);
  });
}
