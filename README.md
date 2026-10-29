# Pod API Quality Tests

**API test automation for [Pod Network](https://pod.network)'s public testnet REST API**, built with Playwright Test and TypeScript.

This project tests more than whether endpoints return a successful status code. It checks response contracts, data invariants, HTTP-method behavior, response headers, and time-sensitive indexer health signals against a live testnet.

> **Project status:** Initial framework and automated coverage for market listing, solution time, and common HTTP behavior are implemented. Additional endpoint coverage and contract-driven testing are planned.

## What this project demonstrates

- **API-focused automation** with Playwright's `APIRequestContext` — no browser installation required.
- **Invariant-based assertions** against live data, avoiding brittle expectations about values that legitimately change.
- **Time-dependent checks** that verify the indexer's solution timestamp is recent and advances over time.
- **HTTP behavior checks** for `HEAD`, unsupported methods, and `OPTIONS` / CORS responses.
- **Reusable test architecture** using typed API clients, fixtures, shared constants, and named test steps.
- **Quality gates** using TypeScript, ESLint, Prettier, and Husky pre-commit hooks.
- **Specification-aware testing** using the vendor OpenAPI contract while recording discrepancies rather than silently changing the contract.

## Coverage at a glance

| Area | What is checked |
| --- | --- |
| Markets — successful response | HTTP status, JSON content type, cache-control header, array response, and non-empty result |
| Market data invariants | Unique market IDs; allowed market status and type values; formats of IDs, token addresses, and numeric strings; market name consistency |
| Solution time | Successful response, integer timestamp, expected cache-control header, closeness to current time, and advancement over time |
| HTTP methods | `HEAD` returns expected headers without a response body; unsupported methods return `405` and the expected `Allow` header |
| CORS | `OPTIONS` responses advertise the expected origin and allowed methods |
| Test discovery / analysis | Notes on boundary cases, plain-text error responses, large numeric values, and discrepancies between API documentation and the OpenAPI contract |

The automated coverage currently targets the markets and solution-time endpoints plus common HTTP behavior. Account, explorer, bridge, broader negative-case coverage, and automated contract validation remain future work.

## Why the time checks matter

A response can be structurally valid while the underlying system is not making progress. The `/clob/status` endpoint returns `solution_now`, a timestamp expressed in microseconds.

The suite checks two separate properties:

1. **Freshness:** the timestamp is within a configured tolerance of the test machine's current clock.
2. **Progress:** polling the endpoint observes a later timestamp within a bounded timeout.

These checks complement schema and status-code assertions. They help detect a stale or stalled indexer that a simple `200 OK` assertion could miss. Because the freshness assertion compares the API value with the local clock, the test machine should have its clock synchronized.

## Design decisions

### Test live data through invariants

The testnet is dynamic, so tests avoid hard-coding a particular market list or live value. Instead, they assert properties that should remain true as data changes, such as uniqueness, allowed enum values, and field formats.

### Separate API operations from test cases

API calls and common response assertions live in `src/api/`. Playwright fixtures in `tests/_fixtures/` expose shared API objects and prepared market / solution-time data to test cases. Constants for routes, HTTP statuses, headers, patterns, enums, and thresholds are centralized under `src/constants/`.

### Treat protocol details as part of API quality

The suite verifies relevant response headers and method semantics in addition to response bodies. It checks `HEAD` behavior, unsupported methods, and CORS preflight responses rather than treating the endpoint payload as the whole contract.

### Preserve the source contract and document discrepancies

The vendor's OpenAPI contract is kept in `spec/pod-rest.yaml`. Exploratory observations and potential differences between the server, API documentation, and contract are tracked in [docs/test-notes.md](docs/test-notes.md). This keeps assumptions visible and makes gaps in coverage explicit.

### Handle API-specific data carefully

The API can return plain-text error bodies, so tests should check the response status before assuming the body is JSON. Some blockchain-related values can exceed JavaScript's safe integer range, and decimal amounts can be represented as strings. Test assertions must respect those representations to avoid false confidence caused by lossy numeric conversion.

## Tech stack

| Area | Tools |
| --- | --- |
| Language | TypeScript |
| API automation / test runner | Playwright Test |
| API client layer | Playwright `APIRequestContext` |
| Contract reference | OpenAPI 3.0 YAML |
| Linting | ESLint with TypeScript-aware and Playwright rules |
| Formatting | Prettier |
| Local commit checks | Husky |
| Test diagnostics | Playwright HTML reporter and trace-on-failure configuration |
| Additional reporting dependency | Allure |

## Getting started

### Prerequisites

- Node.js 20 or later
- npm
- Network access to the Pod testnet endpoint

No browser binaries are required; the suite uses Playwright for HTTP API requests.

### Install dependencies

```bash
git clone https://github.com/steelpush-aqa/pod-api-tests.git
cd pod-api-tests
npm ci
```

The testnet environment is configured in `env/.env.testnet`, with the base URL set to the Pod testnet REST API.

### Run the tests

```bash
npm run test:testnet
```

Open Playwright's interactive test runner:

```bash
npm run test:testnet-ui
```

### Run the quality checks

```bash
npm run typecheck
npm run lint
npm run format:check
```

These three checks also run from the Husky pre-commit hook. The hook is a local development safeguard; it is not a substitute for a remote CI workflow.

### Reports and diagnostics

The Playwright configuration enables the HTML reporter and retains traces on failure. After running the tests, open the Playwright HTML report with:

```bash
npx playwright show-report
```

Allure dependencies are present in the project, but dedicated `allure:generate` and `allure:open` npm scripts are not currently defined in `package.json`.

## Repository structure

```text
.
├── docs/
│   └── test-notes.md           # Exploratory observations and coverage gaps
├── env/
│   └── .env.testnet            # Testnet base URL
├── spec/
│   └── pod-rest.yaml           # Vendor OpenAPI contract
├── src/
│   ├── api/
│   │   ├── BaseApi.ts          # Shared HTTP operations and assertions
│   │   └── MarketsApi.ts       # Market and solution-time operations
│   ├── constants/              # Routes, statuses, headers, patterns, thresholds
│   └── helpers/
│       └── loadEnvFile.ts      # Environment selection and loading
├── tests/
│   ├── _fixtures/              # Reusable Playwright fixtures
│   ├── common/                 # HTTP method and CORS behavior
│   └── markets/
│       ├── markets/            # Market payload and invariant checks
│       └── solutionTime/       # Freshness and progress checks
├── playwright.config.ts
├── package.json
└── README.md
```

## Current scope and next steps

- [x] Playwright API test framework and environment loading
- [x] Typed API client and reusable market fixtures
- [x] Market response and data-invariant checks
- [x] Solution-time freshness and advancement checks
- [x] Common HTTP method and CORS checks
- [x] Type-checking, linting, formatting, and pre-commit safeguards
- [ ] Expand account, explorer, and bridge endpoint coverage
- [ ] Add negative and boundary tests for invalid parameters and error responses
- [ ] Validate responses against the OpenAPI contract automatically
- [ ] Add spec-driven / property-based exploration with Schemathesis
- [ ] Add a remote CI workflow and publish test results

## Notes

- The suite runs against a live testnet. Availability and live data can change, so failures should be interpreted alongside the response, trace, and current service state.
- The freshness check depends on a synchronized local system clock.
- Exploratory notes are hypotheses or observations, not automatically confirmed defects. See [docs/test-notes.md](docs/test-notes.md) for their status.
- This is an evolving portfolio project focused on practical API quality engineering.

---

**Author:** [steelpush-aqa](https://github.com/steelpush-aqa)
