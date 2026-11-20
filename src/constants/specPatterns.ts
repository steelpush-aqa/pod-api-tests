// Format patterns from spec/pod-rest.yaml, components/schemas.
// Names match the schema names, so each constant can be checked against the spec.

/** 32-byte value, 0x hex: orderbook ids, order ids, hashes */
export const BYTES32 = /^0x[a-fA-F0-9]{64}$/;

/** 20-byte address, 0x hex */
export const ADDRESS = /^0x[a-fA-F0-9]{40}$/;

/** Unsigned 256-bit integer as a decimal string */
export const DECIMAL_UINT256 = /^[0-9]+$/;

/** Signed integer as a decimal string. Not a named schema in the spec: from "Signed" in the field descriptions */
export const SIGNED_DECIMAL = /^-?[0-9]+$/;

/** Decimal string with exactly six decimal places. Not a named schema in the spec: from "6 decimal places" in the field descriptions */
export const DECIMAL_SIX_PLACES = /^-?\d+\.\d{6}$/;
