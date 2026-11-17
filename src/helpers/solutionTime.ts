import { expect } from '@playwright/test';
import { type MarketsApi } from '../api/MarketsApi';

export async function collectSolutionNow(
  marketsApi: MarketsApi,
  count: number,
  intervalMs: number,
): Promise<number[]> {
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    values.push(await marketsApi.fetchSolutionNow());
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return values;
}

// Not in the spec: our inference. A client using solution_now as `since`
// would receive batches twice if the value went backwards.
export function expectNeverDecreases(values: number[]): void {
  for (let i = 1; i < values.length; i++) {
    expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
  }
}
