// Methods the Pod REST API does not support on its GET-only routes.
// Expected answer: 405 Method Not Allowed (observed via Schemathesis, Oct 28 2026).
export const NOT_ALLOWED_METHODS = ['PUT', 'POST', 'PATCH', 'DELETE', 'TRACE', 'QUERY'] as const;
