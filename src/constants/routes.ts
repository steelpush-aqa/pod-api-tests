export const ROUTES = {
  MARKETS: 'clob/markets',
  SOLUTION_TIME: 'clob/status',
  MARKET_STATS: 'clob/markets/stats',
} as const satisfies Record<string, string>;
