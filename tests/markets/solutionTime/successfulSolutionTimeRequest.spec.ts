import { test } from '@playwright/test';
import { MarketsApi } from '../../../src/api/MarketsApi';
import { HTTP } from '../../../src/constants/httpStatus';
import { CONTENT_TYPE, CACHE_CONTROL } from '../../../src/constants/specHeaders';

test('Get Solution Time: request succeeds and returns an integer solution_now', async ({
  request,
}) => {
  const marketsApi = new MarketsApi(request);
  const response = await marketsApi.getSolutionTime();

  await marketsApi.assertStatus(response, HTTP.OK);

  const body = await marketsApi.parseSolutionTime(response);
  await marketsApi.assertSolutionNowIsInteger(body);

  await marketsApi.assertContentType(response, CONTENT_TYPE.JSON);
  await marketsApi.assertCacheControl(response, CACHE_CONTROL.SOLUTION_TIME);
});
