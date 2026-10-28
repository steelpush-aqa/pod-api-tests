import { test, expect } from '../../_fixtures/fixtures';

test('Get Solution Time: solution_now advances over time', async ({ solutionTime, marketsApi }) => {
  await expect
    .poll(() => marketsApi.fetchSolutionNow(), { timeout: 5_000 })
    .toBeGreaterThan(solutionTime);
});
