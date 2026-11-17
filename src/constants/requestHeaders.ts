// Headers our tests send. Not from the spec: they imitate client behaviour.

/** Stands for "some other website". example.com is reserved for examples. */
const OTHER_SITE = 'https://example.com';

/** A normal cross-site request from a browser */
export const CROSS_SITE_HEADERS = {
  Origin: OTHER_SITE,
} as const satisfies Record<string, string>;

/** A browser's CORS preflight from another website asking to use GET */
export const PREFLIGHT_HEADERS = {
  Origin: OTHER_SITE,
  'Access-Control-Request-Method': 'GET',
} as const satisfies Record<string, string>;
