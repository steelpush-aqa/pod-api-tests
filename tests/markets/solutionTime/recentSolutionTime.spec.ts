import { test } from '../../_fixtures/fixtures';

test('Get Solution Time: solution_now is close to the current time', async ({
  solutionTime,
  marketsApi,
}) => {
  await marketsApi.assertSolutionTimeIsRecent(solutionTime);
});
