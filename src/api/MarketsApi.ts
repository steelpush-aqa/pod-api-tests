import { expect, type APIResponse } from '@playwright/test';
import { BaseApi } from './BaseApi';
import { ROUTES } from '../constants/routes';
import { SOLUTION_TIME_MAX_LAG_MS, SOLUTION_TIME_MAX_AHEAD_MS } from '../constants/thresholds';

export type Market = {
  id: string;
  name: string;
  base_token_symbol: string;
  quote_token_symbol: string;
};

export type SolutionTime = {
  solution_now: number;
};

export class MarketsApi extends BaseApi {
  async getMarkets(): Promise<APIResponse> {
    return this.step(`GET ${ROUTES.MARKETS}`, () => this.request.get(ROUTES.MARKETS));
  }

  async getSolutionTime(): Promise<APIResponse> {
    return this.step(`GET ${ROUTES.SOLUTION_TIME}`, () => this.request.get(ROUTES.SOLUTION_TIME));
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

  async parseSolutionTime(response: APIResponse): Promise<SolutionTime> {
    return this.step(
      'Parse solution time',
      async () => (await this.parseJson(response)) as SolutionTime,
    );
  }

  async assertSolutionNowIsInteger(body: SolutionTime): Promise<void> {
    await this.assertIsInteger(body.solution_now, 'solution_now');
  }

  async assertSolutionTimeIsRecent(solutionNow: number): Promise<void> {
    await this.step('Assert solution_now is close to the current time', () => {
      const lagMs = Date.now() - solutionNow / 1000;
      expect(lagMs).toBeGreaterThan(-SOLUTION_TIME_MAX_AHEAD_MS);
      expect(lagMs).toBeLessThan(SOLUTION_TIME_MAX_LAG_MS);
    });
  }

  async fetchSolutionNow(): Promise<number> {
    const response = await this.getSolutionTime();
    await this.assertOk(response);
    const body = await this.parseSolutionTime(response);
    return body.solution_now;
  }
}
