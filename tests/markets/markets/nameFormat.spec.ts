import { test } from '../../_fixtures/fixtures';
import { type Market } from '../../../src/api/MarketsApi';

test('List Markets: every market name is base_token_symbol/quote_token_symbol', async ({
  markets,
  marketsApi,
}) => {
  for (const market of markets as Market[]) {
    await marketsApi.assertMarketNameIsBaseQuote(market);
  }
});
