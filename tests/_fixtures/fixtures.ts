import { mergeTests } from '@playwright/test';
import { test as marketsTest } from './markets.fixture';
import { test as commonTest } from './common.fixture';

export const test = mergeTests(marketsTest, commonTest);
export { expect } from '@playwright/test';
