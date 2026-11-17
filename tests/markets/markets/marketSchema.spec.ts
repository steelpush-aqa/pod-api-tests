import { test, expect } from '../../_fixtures/fixtures';
import { MarketSchema } from '../../../src/schemas/market.schema';

test('List Markets: every market matches the MarketStatic schema', ({ markets }) => {
  for (const market of markets) {
    const result = MarketSchema.safeParse(market);
    expect.soft(result.error?.issues ?? [], `market ${String(market.id)}`).toEqual([]);
  }
});
