// Header values promised by spec/pod-rest.yaml.

export const CONTENT_TYPE = {
  JSON: 'application/json',
  TEXT: 'text/plain', // error bodies
} as const;

/** Cache-Control per endpoint, from each operation's description */
export const CACHE_CONTROL = {
  MARKETS: 'public, max-age=60',
  SOLUTION_TIME: 'no-store',
} as const;
