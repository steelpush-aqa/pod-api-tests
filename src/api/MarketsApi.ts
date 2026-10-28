import { expect, type APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';

export type Market = {
  id: string;
  name: string;
  base_token_symbol: string;
  quote_token_symbol: string;
};

export class MarketsApi extends BaseApi {
  async getMarkets(): Promise<APIResponse> {
    return this.step('GET clob/markets', () => this.request.get('clob/markets'));
  }

  async parseMarkets(response: APIResponse): Promise<Record<string, unknown>[]> {
    return (await this.parseJson(response)) as Record<string, unknown>[];
  }

  async assertMarketsNotEmpty(markets: unknown[]): Promise<void> {
    await this.step('Assert at least one market is listed', () => {
      expect(markets.length).toBeGreaterThan(0);
    });
  }

  async assertMarketNameIsBaseQuote(market: Market): Promise<void> {
    await this.step(`Assert name of ${market.name} is base/quote`, () => {
      expect(typeof market.base_token_symbol).toBe('string');
      expect(typeof market.quote_token_symbol).toBe('string');
      expect.soft(market.name).toBe(`${market.base_token_symbol}/${market.quote_token_symbol}`);
    });
  }

  async assertMarketIdsUnique(markets: Market[]): Promise<void> {
    await this.step('Assert market ids are unique', () => {
      const ids = markets.map((market) => market.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      expect(duplicates).toEqual([]);
    });
  }
}
