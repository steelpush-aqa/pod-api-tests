import { test } from '@playwright/test';
import { BaseApi } from '../../src/api/BaseApi';
import { ROUTES } from '../../src/constants/routes';
import { NOT_ALLOWED_METHODS } from '../../src/constants/httpMethods';
import { ALLOW } from '../../src/constants/specHeaders';

for (const route of Object.values(ROUTES)) {
  for (const method of NOT_ALLOWED_METHODS) {
    test(`${method} ${route} is rejected with 405`, async ({ request }) => {
      const api = new BaseApi(request);
      const response = await api.sendWithMethod(route, method);

      await api.assertMethodNotAllowed(response);
      await api.assertAllowedMethodsInResponse(response, String(ALLOW.READ_ONLY));
    });
  }
}
