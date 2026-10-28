// HTTP status codes used by the Pod REST API (spec/pod-rest.yaml + observed)
export const HTTP = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
