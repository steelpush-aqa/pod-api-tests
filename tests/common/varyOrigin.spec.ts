import { test } from '../_fixtures/fixtures';
import { ROUTES } from '../../src/constants/routes';
import { CROSS_SITE_HEADERS } from '../../src/constants/requestHeaders';

for (const route of Object.values(ROUTES)) {
  test(`Cross-site GET ${route}: vary includes origin`, async ({ baseApi }) => {
    const response = await baseApi.sendWithMethod(route, 'GET', CROSS_SITE_HEADERS);

    await baseApi.assertOk(response);
    await baseApi.assertVaryIncludes(response, 'origin');
  });
}
