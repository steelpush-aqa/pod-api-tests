import { z } from 'zod';
import { BYTES32, DECIMAL_UINT256, SIGNED_DECIMAL } from '../constants/specPatterns';

// MarketStats from spec/pod-rest.yaml: required [orderbook_id, volume_24h];
// "optional fields are omitted until the data exists". Amounts are 1e18-scaled decimal strings.
export const MarketStatsEntrySchema = z.object({
  orderbook_id: z.string().regex(BYTES32),
  volume_24h: z.string().regex(DECIMAL_UINT256),

  last_clearing_price: z.string().regex(DECIMAL_UINT256).optional(),
  high_24h: z.string().regex(DECIMAL_UINT256).optional(),
  low_24h: z.string().regex(DECIMAL_UINT256).optional(),
  price_change_24h: z.number().int().optional(), // basis points, can be negative

  // Perp only
  oracle_price: z.string().regex(DECIMAL_UINT256).optional(),
  internal: z.boolean().optional(),
  mark_price: z.string().regex(DECIMAL_UINT256).optional(),
  funding_rate: z.string().regex(SIGNED_DECIMAL).optional(),
  funding_index: z.string().regex(SIGNED_DECIMAL).optional(),
  funding_settling_index: z.string().regex(SIGNED_DECIMAL).optional(),
  funding_last_updated_us: z.number().int().optional(),
  open_interest: z.string().regex(DECIMAL_UINT256).optional(),
});

// Response: required [solution_now, markets]
export const MarketStatsResponseSchema = z.object({
  solution_now: z.number().int(),
  markets: z.array(MarketStatsEntrySchema),
});

export type MarketStatsResponse = z.infer<typeof MarketStatsResponseSchema>;
