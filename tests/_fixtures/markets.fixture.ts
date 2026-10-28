import { test as base } from '@playwright/test';
import { MarketsApi } from '../../src/api/MarketsApi';
import { HTTP } from '../../src/constants/httpStatus';

type MarketsFixtures = {
  marketsApi: MarketsApi;
  markets: Record<string, unknown>[];
  solutionTime: number;
};

export const test = base.extend<MarketsFixtures>({
  marketsApi: async ({ request }, use) => {
    await use(new MarketsApi(request));
  },

  markets: async ({ marketsApi }, use) => {
    const response = await marketsApi.getMarkets();
    await marketsApi.assertStatus(response, HTTP.OK);
    await use(await marketsApi.parseMarkets(response));
  },

  solutionTime: async ({ marketsApi }, use) => {
    const response = await marketsApi.getSolutionTime();
    await marketsApi.assertStatus(response, HTTP.OK);
    const body = await marketsApi.parseSolutionTime(response);
    await use(body.solution_now);
  },
});

export { expect } from '@playwright/test';
