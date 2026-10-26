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

## Test ideas: positive scenarios

| ID   | Area               | Input / condition | Observed behavior                                                                                                           | Source       | Status |
| ---- | ------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------ | ------ |
| P-01 | `GET clob/markets` | no parameters     | 200, JSON array, non-empty, `Cache-Control: public, max-age=60` (12 markets on Oct 25: count is live data, don't assert it) | curl, Oct 25 | open   |

## Findings: server vs spec vs docs

| ID   | Where         | Spec says                         | Docs page says                | Server does   | Status |
| ---- | ------------- | --------------------------------- | ----------------------------- | ------------- | ------ |
| F-01 | `getActivity` | 422 `text/plain` when `from > to` | lists only 400, 404, 503, 500 | not tried yet | open   |
