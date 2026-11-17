// Header values promised by spec/pod-rest.yaml.

export const CONTENT_TYPE = {
  JSON: 'application/json',
  TEXT: 'text/plain', // error bodies
} as const satisfies Record<string, string>;

/** Cache-Control per endpoint, from each operation's description */
export const CACHE_CONTROL = {
  MARKETS: 'public, max-age=60',
  SOLUTION_TIME: 'no-store',
} as const satisfies Record<string, string>;

/** Allow header on 405 responses. Observed (Schemathesis run), not in the spec. */
export const ALLOW = {
  READ_ONLY: 'GET,HEAD',
} as const satisfies Record<string, string>;

/** CORS answer to OPTIONS. Spec: "All routes are GET and allow any origin (CORS)." */
export const CORS = {
  ALLOW_ORIGIN: '*',
  ALLOW_METHODS: 'GET',
} as const satisfies Record<string, string>;
