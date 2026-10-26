import { test, expect } from '@playwright/test';
import { MARKET_STATUS, MARKET_TYPE } from '../../../src/constants/specEnums';

const enumValues = [
  { field: 'status', allowed: MARKET_STATUS },
  { field: 'market_type', allowed: MARKET_TYPE },
];

for (const rule of enumValues) {
  test(`List Markets: every market ${rule.field} is one of the spec's allowed values`, async ({
    request,
  }) => {
    const response = await request.get('clob/markets');

    expect(response.status()).toBe(200);

    const body = (await response.json()) as Record<string, unknown>[];

    for (const market of body) {
      expect(rule.allowed).toContain(market[rule.field]);
    }
  });
}
