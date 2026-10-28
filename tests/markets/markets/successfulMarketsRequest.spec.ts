import { test } from '@playwright/test';
import { MarketsApi } from '../../../src/api/MarketsApi';
import { HTTP } from '../../../src/constants/httpStatus';
import { CONTENT_TYPE, CACHE_CONTROL } from '../../../src/constants/specHeaders';

test('List Markets: request succeeds and returns a non-empty list', async ({ request }) => {
  const marketsApi = new MarketsApi(request);
  const response = await marketsApi.getMarkets();

  await marketsApi.assertStatus(response, HTTP.OK);
  await marketsApi.assertContentType(response, CONTENT_TYPE.JSON);
  await marketsApi.assertCacheControl(response, CACHE_CONTROL.MARKETS);

  const markets = await marketsApi.parseMarkets(response);

  await marketsApi.assertIsArray(markets);
  await marketsApi.assertMarketsNotEmpty(markets);
});
