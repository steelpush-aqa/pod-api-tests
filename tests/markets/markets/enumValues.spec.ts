import { test, expect } from '../../_fixtures/fixtures';
import { MARKET_STATUS, MARKET_TYPE } from '../../../src/constants/specEnums';

const enumValues = [
  { field: 'status', allowed: MARKET_STATUS },
  { field: 'market_type', allowed: MARKET_TYPE },
];

for (const rule of enumValues) {
  test(`List Markets: every market ${rule.field} is one of the spec's allowed values`, ({
    markets,
  }) => {
    for (const market of markets) {
      expect(rule.allowed).toContain(market[rule.field]);
    }
  });
}
