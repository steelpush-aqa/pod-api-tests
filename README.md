# Pod API Tests

This is my API testing project for the [Pod Network](https://pod.network) testnet REST API. I built it with Playwright Test and TypeScript to explore how the API behaves and turn what I learn into automated checks.

I started with the markets and solution-time endpoints. I wanted to check more than whether an endpoint returns a successful status code. A response can look valid while something behind it is no longer working as expected.

One example is `/clob/status`, which returns `solution_now`, a timestamp in microseconds. Checking that it is an integer is not enough. I also check whether it is close to the current time and whether it keeps moving forward. That can help catch an indexer that has stopped making progress even though the endpoint still responds.

The project is a work in progress. As I explore the API, I keep notes about edge cases and differences between the API documentation, the OpenAPI specification, and the responses I actually receive.

## What I am testing

| Area | Current checks |
| --- | --- |
| Markets endpoint | Successful status, JSON content type, cache-control header, array response, and non-empty results |
| Market data | Unique market IDs, allowed status and type values, ID and address formats, numeric strings, and consistency between market names and symbols |
| Solution time | Response status, integer timestamp, cache-control header, freshness compared with the local clock, and timestamp advancement over time |
| HTTP methods | `HEAD` returns the expected headers without a response body; unsupported methods return `405` and an `Allow` header |
| CORS | `OPTIONS` response includes the expected origin and allowed methods |
| Exploratory notes | Boundary cases, plain-text error responses, large numeric values, and differences between documentation and the OpenAPI contract |

The automated tests currently cover markets, solution time, and some common HTTP behavior. Account, explorer, and bridge endpoints are not covered yet.

## A check I found worth adding

The `solution_now` check is a good example of why I do not want to rely only on status codes or schema validation.

The response can contain the right field with the right type, but that does not tell me whether the indexer is keeping up. I check two things:

1. **Freshness:** the timestamp is close to the current time, within a configured tolerance.
2. **Progress:** when I poll the endpoint, the timestamp advances within a bounded timeout.

These checks compare the API timestamp with the test machine's clock, so that clock needs to be synchronized.

## How I have organised the tests

I keep API operations separate from the test cases. The API client classes live in `src/api/`, and Playwright fixtures in `tests/_fixtures/` make shared API objects and prepared data available to tests. Routes, status codes, headers, patterns, enums, and thresholds are kept in `src/constants/`.

I also keep the vendor OpenAPI contract in `spec/pod-rest.yaml` and record exploratory findings in [docs/test-notes.md](docs/test-notes.md). I want those observations to stay visible instead of quietly changing the contract to match what the server happens to return.

A few details matter when testing this API:

- Error responses can be plain text, so I should not assume every response body is JSON.
- Some blockchain-related numbers can exceed JavaScript's safe integer range.
- Decimal amounts may be returned as strings, so converting them to JavaScript numbers can lose precision.
- The testnet data changes, so I check useful invariants instead of expecting a fixed list of markets or fixed live values.

## Tech stack

- **Language:** TypeScript
- **Test runner and API requests:** Playwright Test and `APIRequestContext`
- **API contract reference:** OpenAPI 3.0 YAML
- **Code checks:** ESLint, Prettier, and TypeScript
- **Pre-commit checks:** Husky
- **Test diagnostics:** Playwright HTML report and traces on failure
- **Additional reporting dependency:** Allure

## Getting started

### Requirements

- Node.js 20 or later
- npm
- Network access to the Pod testnet API

The tests use Playwright's HTTP API client, so browser binaries are not required.

### Install

```bash
git clone https://github.com/steelpush-aqa/pod-api-tests.git
cd pod-api-tests
npm ci
```

The testnet environment is configured in `env/.env.testnet`, including the base URL.

### Run the tests

```bash
npm run test:testnet
```

To open Playwright's interactive test runner:

```bash
npm run test:testnet-ui
```

### Run the code checks

```bash
npm run typecheck
npm run lint
npm run format:check
```

These checks also run in the local Husky pre-commit hook. There is no remote CI workflow configured yet.

### View the report

The Playwright configuration uses the HTML reporter and keeps traces when tests fail. After a test run, open the report with:

```bash
npx playwright show-report
```

Allure is included as a dependency, but I have not added dedicated `allure:generate` or `allure:open` scripts yet.

## Project structure

```text
.
├── docs/
│   └── test-notes.md           # Exploratory findings and coverage gaps
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
│   ├── common/                 # HTTP method and CORS checks
│   └── markets/
│       ├── markets/            # Market response and invariant checks
│       └── solutionTime/       # Freshness and progress checks
├── playwright.config.ts
├── package.json
└── README.md
```

## What I want to add next

- [x] Playwright API test setup and environment loading
- [x] Typed API client and reusable market fixtures
- [x] Market response and data-invariant checks
- [x] Solution-time freshness and progress checks
- [x] HTTP method and CORS checks
- [x] Type-checking, linting, formatting, and pre-commit checks
- [ ] Add tests for account, explorer, and bridge endpoints
- [ ] Add more negative and boundary tests for invalid parameters and error responses
- [ ] Add automated validation against the OpenAPI contract
- [ ] Try spec-driven and property-based API exploration with Schemathesis
- [ ] Set up remote CI and publish test results

The tests run against a live testnet, so availability and data can change. When a test fails, I need to look at the response and trace as well as the current service state. The notes in [docs/test-notes.md](docs/test-notes.md) include observations and hypotheses, not confirmed bugs unless I have verified them.

---

**Author:** [steelpush-aqa](https://github.com/steelpush-aqa)
