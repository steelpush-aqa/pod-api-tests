import { test } from '../../_fixtures/fixtures';
import { type Market } from '../../../src/api/MarketsApi';

test('List Markets: every market id is unique', async ({ markets, marketsApi }) => {
  await marketsApi.assertMarketIdsUnique(markets as Market[]);
});
