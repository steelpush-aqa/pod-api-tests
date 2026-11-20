import { z } from 'zod';
import { BYTES32, ADDRESS, DECIMAL_UINT256, DECIMAL_SIX_PLACES } from '../constants/specPatterns';
import { MARKET_STATUS, MARKET_TYPE } from '../constants/specEnums';

// MarketStatic from spec/pod-rest.yaml.
// The spec declares no "required" fields (finding F-02). Our reading: fields documented
// as "Omitted when…" are optional; all other fields are required.
export const MarketSchema = z.object({
  status: z.enum(MARKET_STATUS),
  id: z.string().regex(BYTES32),
  name: z.string(),

  // Not in the spec (F-08): observed on every market since Nov 2026.
  owner: z.string().regex(ADDRESS).optional(),
  base_token_address: z.string().regex(ADDRESS),
  quote_token_address: z.string().regex(ADDRESS),
  base_token_symbol: z.string(),
  quote_token_symbol: z.string(),
  base_token_name: z.string(),
  quote_token_name: z.string(),
  market_type: z.enum(MARKET_TYPE),
  auction_interval_us: z.number().int(),
  maker_fee: z.string().regex(DECIMAL_SIX_PLACES),
  taker_fee: z.string().regex(DECIMAL_SIX_PLACES),
  tick_precision: z.string().regex(DECIMAL_UINT256),
  lot_size: z.string().regex(DECIMAL_UINT256),
  min_notional: z.string().regex(DECIMAL_UINT256),
  max_leverage: z.number().int(),
  initial_margin: z.string().regex(DECIMAL_UINT256),
  funding_window_us: z.number().int(),

  // Documented as omitted in some states
  live_at_us: z.number().int().optional(),
  disable_at_us: z.number().int().optional(),
  settlement_price: z.string().regex(DECIMAL_UINT256).optional(),
});
