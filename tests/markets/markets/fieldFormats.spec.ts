import { test, expect } from '../../_fixtures/fixtures';
import { BYTES32, ADDRESS, DECIMAL_UINT256 } from '../../../src/constants/specPatterns';

const formatRules = [
  { field: 'id', pattern: BYTES32 },
  { field: 'base_token_address', pattern: ADDRESS },
  { field: 'quote_token_address', pattern: ADDRESS },
  { field: 'tick_precision', pattern: DECIMAL_UINT256 },
  { field: 'lot_size', pattern: DECIMAL_UINT256 },
];

for (const rule of formatRules) {
  test(`List Markets: every market ${rule.field} matches the spec pattern`, ({ markets }) => {
    for (const market of markets) {
      expect(market[rule.field]).toMatch(rule.pattern);
    }
  });
}
