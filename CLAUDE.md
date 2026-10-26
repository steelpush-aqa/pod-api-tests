# pod-api-tests

API test framework for Pod Network's testnet REST API.
Playwright Test + TypeScript. Built from the OpenAPI spec in `spec/pod-rest.yaml`.

## Commands

- `npm run test:testnet` — run tests against testnet
- `npm run test:testnet-ui` — Playwright UI mode
- `npm run typecheck` — tsc --noEmit (Playwright only transpiles, it does not type-check)
- `npm run lint` / `npm run lint:fix` — ESLint (type-aware + Playwright rules)
- `npm run format` / `npm run format:check` — Prettier
- `npm run allure:generate` then `npm run allure:open` — Allure 3 report

Pre-commit hook (Husky) runs typecheck, lint, format:check. Tests are NOT in the hook.

## How the environment works

`ENV_TYPE` (set by npm scripts) → `env/.env.<ENV_TYPE>` → `BASE_URL` → `use.baseURL`.
Config fails fast if ENV_TYPE, the env file, or BASE_URL is missing.

## API facts that affect tests

- Base URL ends with `/v1/` (trailing slash). Routes have NO leading slash:
  `request.get('clob/markets')`. A leading slash drops `/v1`.
- All routes are GET, no auth.
- Errors are plain text, not JSON. Never call `response.json()` before checking status.
- Some numbers exceed JS safe integers (e.g. order `end` 18446744073709551615).
  `JSON.parse` silently rounds them — compare such values as strings.
- Market amounts/prices are decimal strings.
- Data is live testnet data and changes; assert structure and invariants, not fixed values.
- Docs page and OpenAPI spec disagree in places (e.g. 422 on getActivity). Report mismatches,
  do not "fix" tests to match whichever source is convenient.

## Rules

- Never edit `spec/pod-rest.yaml` — it is the vendor's contract, kept byte-for-byte.
- TypeScript is pinned to 6.x on purpose: typescript-eslint does not support TS 7 yet.
- `overrides.dompurify` in package.json patches a vulnerable transitive dependency of Allure.
  Remove only when Allure ships a fixed version itself.
- Every async call is awaited. Assertions must be able to fail (verify by breaking them once).
- No abstractions ahead of need: extract an API class or fixture only when code repeats.

## Working with me

Explain changes in plain language, one step at a time.
Do not run ahead to later steps or rewrite files I did not ask about.
Show what you will change before changing it.
