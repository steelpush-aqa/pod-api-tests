# POD API Testing

**Playwright Test · TypeScript · API Testing · OpenAPI · Custom Assertions**

Automated API testing of the POD Network testnet REST API. This project uses Playwright Test and TypeScript to validate documented API behaviour, check data invariants, and investigate cases where a successful HTTP response does not necessarily mean the service is behaving correctly.

## What is being tested

| Area | Current coverage |
|---|---|
| Markets | Successful responses, JSON content type, cache-control headers, non-empty results, unique market IDs, allowed status/type values, ID and address formats, numeric strings, and market-name/symbol consistency |
| Solution time | Timestamp type, freshness against the local clock, and progression across repeated requests |
| HTTP methods | `HEAD` response headers and empty body; unsupported methods returning `405` with an `Allow` header |
| CORS | `OPTIONS` response origin and allowed-method headers |
| Exploratory testing | Boundary cases, plain-text error responses, large numeric values, and differences between documentation, the OpenAPI contract, and observed responses |

Automated coverage currently focuses on markets, solution time, and selected HTTP behaviours. Account, explorer, and bridge endpoints are not yet covered.

## Beyond status codes and schema validation

One example is the `/clob/status` endpoint, which returns `solution_now`, a timestamp in microseconds.

A schema check can confirm that the field exists and is an integer. It cannot establish that the indexer is keeping up. This project adds two behavioural checks:

- **Freshness:** the timestamp is close to the test machine's current time, within a configured tolerance.
- **Progress:** the timestamp advances across repeated polling within a bounded timeout.

Together, these checks can help detect an indexer that has stopped making progress even while its endpoint continues to respond. Because the checks compare the API timestamp with the local clock, the test machine's clock must be synchronized.

## Test design and investigation

The vendor-provided OpenAPI 3.0 specification in `spec/pod-rest.yaml` is used as a contract reference for expected endpoints, parameters, and response behaviour. Exploratory notes record observations and discrepancies between the API documentation, the OpenAPI specification, and actual responses. The contract is not silently changed to match observed behaviour.

Testing also accounts for API-specific details:

- Error responses may be plain text, so tests do not assume every response body is JSON.
- Blockchain-related numbers may exceed JavaScript's safe integer range.
- Decimal amounts may be represented as strings; converting them to JavaScript numbers can lose precision.
- Testnet data changes, so checks focus on useful invariants rather than fixed records or values.

See [docs/test-notes.md](docs/test-notes.md) for exploratory observations, edge cases, and coverage gaps. These notes distinguish observations and hypotheses from confirmed defects.

## Automation structure

API operations are separated from test cases. Reusable API clients and Playwright fixtures provide shared request functionality and prepared test data. Routes, status codes, headers, patterns, enums, and thresholds are maintained in dedicated constants.

```text
.
├── docs/
│   └── test-notes.md           # Exploratory findings and coverage gaps
├── env/
│   └── .env.testnet            # Testnet configuration
├── spec/
│   └── pod-rest.yaml           # Vendor OpenAPI 3.0 contract
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
└── playwright.config.ts
```

## Tech stack

- **Language:** TypeScript
- **Test runner and HTTP client:** Playwright Test and `APIRequestContext`
- **API contract:** OpenAPI 3.0 (YAML)
- **Code quality:** ESLint, Prettier, TypeScript
- **Git hooks:** Husky pre-commit checks
- **Diagnostics:** Playwright HTML report and traces on failure
- **Additional reporting:** Allure dependency included; dedicated report-generation scripts are not yet configured

## Run locally

### Requirements

- Node.js 20 or later
- npm
- Network access to the POD testnet API

Browser binaries are not required because the tests use Playwright's HTTP API client.

### Install

```bash
git clone https://github.com/steelpush-aqa/pod-api-tests.git
cd pod-api-tests
npm ci
```

### Run tests and checks

```bash
npm run test:testnet
npm run typecheck
npm run lint
npm run format:check
```

To open the Playwright HTML report:

```bash
npx playwright show-report
```

There is currently no remote CI workflow configured.

## Current scope and next steps

- [x] Playwright API test setup and environment loading
- [x] Typed API clients and reusable fixtures
- [x] Market response and data-invariant checks
- [x] Solution-time freshness and progress checks
- [x] HTTP method and CORS checks
- [x] Type-checking, linting, formatting, and pre-commit checks
- [ ] Add coverage for account, explorer, and bridge endpoints
- [ ] Expand negative and boundary testing for invalid parameters and error responses
- [ ] Add automated validation against the OpenAPI contract
- [ ] Explore spec-driven and property-based API testing with Schemathesis
- [ ] Configure remote CI and publish test results

The tests target a live testnet, so availability and data can change. When a test fails, inspect the response, trace, and current service state before treating it as a confirmed defect.

---

**Author:** [steelpush-aqa](https://github.com/steelpush-aqa)
