// Format patterns from spec/pod-rest.yaml, components/schemas.
// Names match the schema names, so each constant can be checked against the spec.

/** 32-byte value, 0x hex: orderbook ids, order ids, hashes */
export const BYTES32 = /^0x[a-fA-F0-9]{64}$/;

/** 20-byte address, 0x hex */
export const ADDRESS = /^0x[a-fA-F0-9]{40}$/;

/** Unsigned 256-bit integer as a decimal string */
export const DECIMAL_UINT256 = /^[0-9]+$/;
