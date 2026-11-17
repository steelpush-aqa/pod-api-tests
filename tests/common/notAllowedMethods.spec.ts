import { test } from '../_fixtures/fixtures';
import { ROUTES } from '../../src/constants/routes';
import { NOT_ALLOWED_METHODS } from '../../src/constants/httpMethods';
import { ALLOW } from '../../src/constants/specHeaders';

for (const route of Object.values(ROUTES)) {
  for (const method of NOT_ALLOWED_METHODS) {
    test(`${method} ${route} is rejected with 405`, async ({ baseApi }) => {
      const response = await baseApi.sendWithMethod(route, method);

      await baseApi.assertMethodNotAllowed(response);
      await baseApi.assertAllowedMethodsInResponse(response, String(ALLOW.READ_ONLY));
    });
  }
}
