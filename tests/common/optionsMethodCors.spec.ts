import { test } from '@playwright/test';
import { BaseApi } from '../../src/api/BaseApi';
import { ROUTES } from '../../src/constants/routes';

for (const route of Object.values(ROUTES)) {
  test(`OPTIONS ${route} allows GET from any origin`, async ({ request }) => {
    const api = new BaseApi(request);
    const response = await api.sendWithMethod(route, 'OPTIONS');

    await api.assertOk(response);
    await api.assertCorsAllowsGetFromAnyOrigin(response);
  });
}
