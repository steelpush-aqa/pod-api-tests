# pod-api-tests

API test automation for [Pod Network](https://pod.network)'s public testnet REST API,
built with Playwright Test and TypeScript from the vendor's OpenAPI spec.

> Status: framework setup complete, first tests in progress.

## What this project covers

- Read-only REST API under `https://rpc.podtestnet.dev/v1/` (markets, accounts, explorer, bridge)
- Contract source: `spec/pod-rest.yaml` (OpenAPI 3.0, kept unmodified)
- Live testnet data: tests assert structure and invariants, not fixed values

## Stack

| Area        | Tool                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| Test runner | Playwright Test (API only, no browsers)                                    |
| Language    | TypeScript 6 (pinned: typescript-eslint does not support TS 7 yet)         |
| Linting     | ESLint with type-aware rules (`no-floating-promises`) and Playwright rules |
| Formatting  | Prettier                                                                   |
| Git hooks   | Husky: typecheck, lint, format check before every commit                   |
| Reporting   | Allure Report 3                                                            |

## Setup

Requires Node.js 20+.

```bash
npm ci
```

No browser install is needed.

## Running

```bash
npm run test:testnet          # run all tests against testnet
npm run test:testnet-ui       # Playwright UI mode
npm run allure:generate       # build the Allure report from the last run
npm run allure:open           # open it
```

The environment is selected by `ENV_TYPE` (set by the npm scripts), which loads
`env/.env.<ENV_TYPE>`. The config stops with a clear error if the variable, the file,
or `BASE_URL` is missing.

## Quality gates

```bash
npm run typecheck      # tsc --noEmit: Playwright transpiles TypeScript but does not type-check it
npm run lint
npm run format:check
```

All three run automatically in the pre-commit hook.

## API behaviors this framework accounts for

- Errors are plain text, not JSON
- Some numeric fields exceed JavaScript's safe integer range and are compared as strings
- The base URL contains a path (`/v1/`), so routes are written without a leading slash
- Where the documentation page and the OpenAPI spec disagree, the difference is recorded
  as a finding rather than silently picking one

## Working with an AI assistant

This project includes Claude Code as a pair-programming and learning tool.

- `CLAUDE.md`: project context and working rules the assistant reads every session
- `.claude/settings.json`: enforced guardrails. The assistant cannot push to the remote,
  edit the vendor spec, or run `rm -rf`; every edit is auto-formatted by a hook

## Roadmap

- [x] Project setup, environments, linting, formatting, git hooks, reporting
- [ ] Smoke tests for markets endpoints
- [ ] Account, explorer and bridge endpoints, including error responses
- [ ] Schema validation of responses against the OpenAPI spec
- [ ] Property-based testing of the same spec with Schemathesis
