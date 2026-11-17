import { test } from '../_fixtures/fixtures';
import { ROUTES } from '../../src/constants/routes';
import { PREFLIGHT_HEADERS } from '../../src/constants/requestHeaders';

for (const route of Object.values(ROUTES)) {
  test(`CORS preflight from another website: ${route} allows GET`, async ({ baseApi }) => {
    const response = await baseApi.sendWithMethod(route, 'OPTIONS', PREFLIGHT_HEADERS);

    await baseApi.assertOk(response);
    await baseApi.assertCorsAllowsGetFromAnyOrigin(response);
  });
}
