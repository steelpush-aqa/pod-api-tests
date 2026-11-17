import { test as base } from '@playwright/test';
import { BaseApi } from '../../src/api/BaseApi';

type CommonFixtures = {
  baseApi: BaseApi;
};

export const test = base.extend<CommonFixtures>({
  baseApi: async ({ request }, use) => {
    await use(new BaseApi(request));
  },
});
