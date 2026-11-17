import { test } from '../../_fixtures/fixtures';
import { collectSolutionNow, expectNeverDecreases } from '../../../src/helpers/solutionTime';
import {
  SOLUTION_TIME_SAMPLES,
  SOLUTION_TIME_SAMPLE_INTERVAL_MS,
} from '../../../src/constants/thresholds';

test('Get Solution Time: solution_now never decreases across repeated calls', async ({
  marketsApi,
}) => {
  const values = await collectSolutionNow(
    marketsApi,
    SOLUTION_TIME_SAMPLES,
    SOLUTION_TIME_SAMPLE_INTERVAL_MS,
  );
  expectNeverDecreases(values);
});
