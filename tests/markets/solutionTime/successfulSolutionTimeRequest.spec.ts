import { test } from '@playwright/test';
import { MarketsApi } from '../../../src/api/MarketsApi';
import { CONTENT_TYPE, CACHE_CONTROL } from '../../../src/constants/specHeaders';

test('Get Solution Time: request succeeds and returns a valid solution_now', async ({
  request,
}) => {
  const marketsApi = new MarketsApi(request);
  const response = await marketsApi.getSolutionTime();

  await marketsApi.assertOk(response);
  await marketsApi.assertContentType(response, CONTENT_TYPE.JSON);
  await marketsApi.assertCacheControl(response, CACHE_CONTROL.SOLUTION_TIME);

  // Validates the body against SolutionTimeSchema: fails if solution_now is missing or not an integer
  await marketsApi.parseSolutionTime(response);
});
