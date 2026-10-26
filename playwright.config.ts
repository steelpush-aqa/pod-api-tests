import { defineConfig } from '@playwright/test';
import { loadEnvFile, throwMissingEnvTypeError } from './src/helpers/loadEnvFile';

const envType = process.env.ENV_TYPE || throwMissingEnvTypeError();

loadEnvFile(envType);

const baseURL = process.env.BASE_URL;
if (!baseURL) {
  throw new Error(`BASE_URL is missing in env/.env.${envType}`);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    extraHTTPHeaders: { Accept: 'application/json' },
    trace: 'retain-on-failure',
  },

  projects: [{ name: 'api' }],
});
