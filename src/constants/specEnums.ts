// Allowed values from spec/pod-rest.yaml, components/schemas.
// Named after the schema they belong to: other schemas use different lists.

/** MarketStatic.status */
export const MARKET_STATUS = ['pending', 'active', 'disabled', 'settled'];

/** MarketStatic.market_type (order rows spell perp as "perpetual": a different enum) */
export const MARKET_TYPE = ['spot', 'perp'];
