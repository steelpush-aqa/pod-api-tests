// an observation i don’t write down becomes a test i never write

# Test notes

Observations from exploring the Pod testnet REST API. Each entry is either a test idea
(behavior to cover) or a finding (a disagreement between server, spec and docs).

Status: `open` → not covered yet · `covered` → test exists (link) · `reported` → finding filed

## Test ideas: boundaries and negative scenarios

| ID   | Area              | Input / condition                              | Observed behavior                                           | Source       | Status |
| ---- | ----------------- | ---------------------------------------------- | ----------------------------------------------------------- | ------------ | ------ |
| T-01 | `{account}` param | `0xZZ` (too short)                             | 400, `text/plain`, "invalid string length"                  | curl, Oct 26 | open   |
| T-02 | `{account}` param | correct length (40 hex chars), non-hex char    | not tried yet; expected 400 on the hex check                | idea         | open   |
| T-03 | `{account}` param | validation order: length is checked before hex | `0xZZ` fails on length, never reaches the hex check         | curl, Oct 26 | open   |
| T-04 | errors in general | any 4xx/5xx                                    | body is plain text, not JSON; `response.json()` would throw | spec + curl  | open   |

## Findings: server vs spec vs docs

| ID   | Where          | Spec says                            | Docs page says                | Server does                               | Status                                                                                                                                                 |
| ---- | -------------- | ------------------------------------ | ----------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F-01 | `getActivity`  | 422 `text/plain` when `from > to`    | lists only 400, 404, 503, 500 | not tried yet                             | open                                                                                                                                                   |
| F-02 | unknown routes | "All routes allow any origin (CORS)" | (same)                        | 404 without `access-control-allow-origin` | low: affects only browser clients (e.g. explorer-style front ends), where a typo surfaces as a CORS error instead of 404; backend consumers unaffected | open |

## How to read a response in tests

A response has three parts. Each is read with its own method and has its own types.

| Part        | Example                                  | Read with            | Type                               |
| ----------- | ---------------------------------------- | -------------------- | ---------------------------------- |
| Status line | `HTTP/2 200`                             | `response.status()`  | number (`200`, not `"200"`)        |
| Headers     | `content-type: application/json`         | `response.headers()` | object of strings; names lowercase |
| Body        | `[{ "maker_fee": "0.000150", ... }]`     | `response.json()`    | parsed JSON: field types vary      |
|             | `Invalid URL: Cannot parse ...` (errors) | `response.text()`    | string (errors are plain text)     |

Rules:

- Assert the status as a number: `expect(response.status()).toBe(200)`.
- Assert content-type with `toContain('application/json')`: servers may append `; charset=utf-8`.
- Check the status before parsing the body: `response.json()` throws on plain-text error bodies.
- Body field types come from the spec, not from guessing:
  - amounts, prices, fees, sizes → decimal **strings** (`"0.000150"`, `"1000000000000"`)
  - counts, durations in µs, leverage → **numbers** (`20`, `500000`)
  - values that can exceed JavaScript's safe integer range → compare as strings,
    because `JSON.parse` rounds them silently
- Matchers: `toBe` for numbers and strings, `toEqual` for arrays and objects.

## Big numbers

JavaScript numbers are exact only up to 2^53 − 1 (9007199254740991). Pod amounts use
18 decimals, so most raw values are far above that.

- Use `BigInt` for integer comparisons and calculations:

  ```ts
  const rawAmount = BigInt('0x14d1120d7b160000'); // hex
  expect(rawAmount).toBe(1500000000000000000n);

  const lotSize = BigInt(market.lot_size); // decimal string from the API
  expect(lotSize > 0n).toBe(true);
  ```

- `BigInt` works on **strings** (decimal or `0x` hex) without precision loss.
- `BigInt` cannot repair a value already rounded by `JSON.parse`. Fields sent as huge
  JSON **numbers** (e.g. order `end`: 18446744073709551615) must be read from
  `response.text()`, not from `response.json()`.
- JSON has no BigInt type: `JSON.stringify({ x: 1n })` throws. Convert to a string first:
  `x.toString()`.
- Never mix BigInt and number in arithmetic: `1n + 1` throws a TypeError.

```ts
const text = await response.text();

const body = JSON.parse(
  text,
  (key, value, context) =>
    typeof value === 'number' && !Number.isSafeInteger(value)
      ? BigInt(context.source) // the digits exactly as they were in the JSON text
      : value, // normal-sized numbers stay normal numbers
);
```
