import { test, expect } from '../_fixtures/fixtures';
import { ROUTES } from '../../src/constants/routes';
import { HTTP } from '../../src/constants/httpStatus';

for (const route of Object.values(ROUTES)) {
  test(`Plain http ${route} redirects to https`, async ({ baseApi }) => {
    const response = await baseApi.getOverPlainHttp(route);

    await baseApi.assertStatus(response, HTTP.PERMANENT_REDIRECT);
    expect(response.headers()['location']).toBe(new URL(route, process.env.BASE_URL).href);
  });
}
