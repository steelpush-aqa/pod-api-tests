# Pod API Tests

**Playwright Test · TypeScript · Zod · Schemathesis · OpenAPI**

An API test framework for the [Pod Network](https://pod.network) testnet REST API, built step by step.

I'm using this project to learn how a test framework should grow: start with a plain request, add structure only when the tests show a need for it, and keep a record of every decision along the way. The API is live and public, so the tests run against real data that changes over time.

## How the framework grew

I didn't design the architecture up front. Each layer was added when the existing code made the need visible.

| Step | What I added                                                 | Why                                                                                                                                                                                                                |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | One test, one request, assertions inline                     | To see the real response before deciding what to check                                                                                                                                                             |
| 2    | `BaseApi` and `MarketsApi` classes                           | The same request, status check and parsing appeared in several tests                                                                                                                                               |
| 3    | Playwright fixtures                                          | Tests needed prepared data (a validated market list, a fresh timestamp) as a precondition                                                                                                                          |
| 4    | Constants for routes, status codes, headers, patterns, enums | The same values were repeated across files; one place to change them                                                                                                                                               |
| 5    | API-wide tests (`tests/common/`)                             | Some rules apply to every endpoint: unsupported methods, `HEAD`, CORS                                                                                                                                              |
| 6    | [Zod](https://zod.dev) schemas                               | Type casts (`as SolutionTime`) were claims nobody checked. A typo in a field name passed type-checking and only failed at runtime. Schemas check the data and produce the TypeScript type from the same definition |
| 7    | [Schemathesis](https://schemathesis.io) runs                 | To compare hand-written tests with tests generated from the OpenAPI spec                                                                                                                                           |

Patterns I'm deliberately holding back until the code asks for them: a Builder for query parameters (useful once endpoints with several optional parameters are covered), and a `BaseApi` split once more API classes exist.

## What is tested

| Area                           | Checks                                                                                                                                                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Markets (`/clob/markets`)      | Request succeeds with the documented headers; every market matches a Zod schema (formats, enums, required fields); market names are `base/quote` symbols; market IDs are unique                                                         |
| Solution time (`/clob/status`) | Request and schema; the timestamp is close to the current time; it advances; it never decreases across repeated calls                                                                                                                   |
| All routes                     | Unsupported methods (`PUT`, `POST`, `PATCH`, `DELETE`, `TRACE`, `QUERY`) return `405` with an `Allow` header; `HEAD` returns the `GET` headers without a body; `OPTIONS` and a browser-style CORS preflight allow `GET` from any origin |

Account, explorer and bridge endpoints are not covered yet.

## Beyond the contract

The OpenAPI spec says _what shape_ a response has. Several important rules are not in it, so I test them separately and mark them as my own reading:

- **Market IDs must exist and be unique.** The spec declares no required fields for a market, but other routes take the market ID as a path parameter, so a market without one is unusable.
- **`solution_now` must be recent and must not go backwards.** The spec only says it's an integer in microseconds. A stalled indexer would still return a valid integer; a value that jumps backwards would make websocket clients receive the same data twice.

These checks compare against the local clock, so the machine running them must be NTP-synchronized. I found this out early: the first lag measurements showed timestamps from the future, because my VM's clock wasn't syncing. Enabling the time-sync service (`systemd-timesyncd`) fixed it, and the clock has been stable since. A paused or restored VM can still fall behind until the next sync, so before running the time tests on a VM, check `timedatectl` shows "System clock synchronized: yes".

## Findings

Observations from comparing the documentation, the OpenAPI spec and the live API. Details and status are in [docs/test-notes.md](docs/test-notes.md).

| Finding                                                                                                                                | Severity      |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `MarketStatic` declares no `required` fields, so by the contract a market with no ID is valid                                          | Spec gap      |
| The spec's `servers` URL (`rpc.podtestnet.dev`) no longer responds; the docs now publish `staging-rpc.podtestnet.dev`                  | Outdated spec |
| `OPTIONS` returns `200`, but the same response's `Allow` header lists only `GET,HEAD` (likely the proxy answering CORS before the API) | Low           |
| Unknown routes return `404` without the CORS header, so browser clients see a CORS error instead of a 404                              | Low           |
| `HEAD` is supported but not documented                                                                                                 | Info          |
| `getActivity` declares a `422` in the spec that the docs page doesn't list                                                             | To verify     |

## Hand-written tests and Schemathesis

I ran [Schemathesis](https://schemathesis.io) against the same endpoints, with no test code of my own: it reads the OpenAPI spec and generates the requests and checks by itself.

What it gave me that I wouldn't have written myself:

- **Requests I hadn't thought of.** It's where the `OPTIONS` / `Allow` inconsistency in the findings came from. I later turned the unsupported-method checks into Playwright tests.
- **A long list of checks out of the box**: status codes, response schema, content type, the `Allow` header on `405` responses, unsupported methods and more, all derived from the spec in one command.
- **Reports that show every request.** The HAR report let me read each request and response, and the HTML report summarizes the run and the checks applied.
- **Low noise by design.** It deliberately avoids reporting problems that come from proxies in front of the API.

Where my hand-written tests add something, the reason is mostly the spec, not the tool:

|                                                                 | Schemathesis                         | My Playwright tests |
| --------------------------------------------------------------- | ------------------------------------ | ------------------- |
| Status codes, schema conformance                                | ✓                                    | ✓                   |
| Unsupported methods, `Allow` header                             | ✓                                    | ✓                   |
| Request variants I didn't think of                              | ✓                                    | only what I wrote   |
| Rules described only in prose (cache headers, name format)      | not in the schema, so not checked    | ✓                   |
| Rules not in the spec (unique IDs, freshness, never decreasing) | possible with custom checks (Python) | ✓                   |
| A market missing its ID                                         | the spec allows it                   | ✓                   |

Schemathesis can only be as strict as the contract it reads, and this spec leaves a lot unsaid. That's useful in itself: everything it accepted that I consider wrong pointed me at a gap in the spec.

## Decisions and trade-offs

- **TypeScript is pinned to 6.x.** TypeScript 7 was out, but typescript-eslint didn't support it yet, and type-aware linting (`no-floating-promises`) was the reason I chose TypeScript in the first place.
- **Required vs optional in the Zod schemas.** The spec marks nothing as required. I treat fields as required unless the docs say they can be omitted ("Omitted when…"). This is stricter than the spec, on purpose, and noted in the schema files.
- **Thresholds are my assumptions.** Freshness limits (−2 s / +10 s) come from observed lag, not from a Pod requirement; they live in `src/constants/thresholds.ts` with that note.
- **Dependency advisories.** A vulnerable transitive dependency of Allure (DOMPurify) is pinned to a patched version with an npm override. Advisories in `glob` and `minimatch` are accepted for now: they're in dev tooling that never processes outside input, and the only fixes are new major versions the tools don't support yet.

## Structure

```text
.
├── docs/test-notes.md          # Observations, boundaries, findings
├── env/.env.testnet            # Base URL and settings per environment
├── spec/pod-rest.yaml          # Vendor OpenAPI 3.0 spec, kept unmodified
├── src/
│   ├── api/                    # BaseApi (shared HTTP + assertions), MarketsApi
│   ├── constants/              # Routes, status codes, headers, patterns, enums, thresholds
│   ├── helpers/                # Environment loading, sampling helpers
│   └── schemas/                # Zod schemas for responses
└── tests/
    ├── _fixtures/              # Playwright fixtures, merged into one `test`
    ├── common/                 # Rules for every route: methods, HEAD, CORS
    └── markets/
        ├── markets/
        └── solutionTime/
```

## Running it

Requires Node.js 20+ and network access to the testnet. No browsers are needed.

```bash
npm ci
npm run test:testnet            # all tests against testnet
npm run test:testnet-ui         # Playwright UI mode
npm run typecheck               # tsc --noEmit (Playwright doesn't type-check)
npm run lint
npm run format:check
npm run allure:generate && npm run allure:open
```

A Husky pre-commit hook runs type-check, lint and format check. Tests aren't in the hook: they hit a live testnet.

Schemathesis, for the same endpoints:

```bash
uvx schemathesis run spec/pod-rest.yaml \
  --url https://staging-rpc.podtestnet.dev/v1 \
  --include-path /clob/markets --include-path /clob/status \
  --max-examples 10 --rate-limit 5/s \
  --report html,har
```

The tests run against a live testnet. When one fails, I check the response, the trace and the current service state before calling it a defect.

## Working with an AI assistant

I use Claude mostly for brainstorming: test ideas, reviewing my design decisions, and explaining concepts. [`CLAUDE.md`](CLAUDE.md) holds the project rules it follows, and [`.claude/settings.json`](.claude/settings.json) enforces guardrails: it can't push, can't edit the vendor spec, and every file it edits is formatted automatically.

## Next

- [ ] Parameterized endpoints (candles, orderbook, account routes), with negative and boundary tests
- [ ] Schemathesis on those endpoints, and an updated comparison
- [ ] A Builder for query parameters, if the tests show the need
- [ ] CI with test results published
- [ ] Account, explorer and bridge coverage

---
