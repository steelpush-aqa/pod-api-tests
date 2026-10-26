import * as fs from 'fs';
import dotenv from 'dotenv';

export function loadEnvFile(envType: string): void {
  const envFilePath = `./env/.env.${envType}`;

  if (!fs.existsSync(envFilePath)) {
    throw new Error(`Missing the config file ${envFilePath}`);
  }

  dotenv.config({ path: envFilePath, quiet: true });
}

export function throwMissingEnvTypeError(): never {
  throw new Error('ENV_TYPE is not set. Example: ENV_TYPE=testnet npx playwright test');
}
