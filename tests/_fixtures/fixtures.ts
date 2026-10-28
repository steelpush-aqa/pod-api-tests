import { mergeTests } from '@playwright/test';
import { test as marketsTest } from './markets.fixture';

export const test = mergeTests(marketsTest);
export { expect } from '@playwright/test';
