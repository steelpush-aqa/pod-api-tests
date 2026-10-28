import { test, expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { HTTP } from '../constants/httpStatus';

export class BaseApi {
  constructor(protected readonly request: APIRequestContext) {}

  protected async step<T>(title: string, action: () => T | Promise<T>): Promise<T> {
    return test.step(title, action);
  }

  async assertStatus(response: APIResponse, expected: number): Promise<void> {
    await this.step(`Assert status is ${expected}`, () => {
      expect(response.status()).toBe(expected);
    });
  }

  async assertOk(response: APIResponse): Promise<void> {
    await this.assertStatus(response, HTTP.OK);
  }

  async parseJson(response: APIResponse): Promise<unknown> {
    return response.json();
  }

  async parseText(response: APIResponse): Promise<string> {
    return response.text();
  }

  async assertContentType(response: APIResponse, expected: string): Promise<void> {
    await this.step(`Assert content-type contains ${expected}`, () => {
      expect(response.headers()['content-type']).toContain(expected);
    });
  }

  async assertCacheControl(response: APIResponse, expected: string): Promise<void> {
    await this.step(`Assert cache-control is ${expected}`, () => {
      expect(response.headers()['cache-control']).toBe(expected);
    });
  }

  async assertIsArray(body: unknown): Promise<void> {
    await this.step('Assert body is an array', () => {
      expect(Array.isArray(body)).toBe(true);
    });
  }

  async assertIsInteger(value: unknown, field: string): Promise<void> {
    await this.step(`Assert ${field} is an integer`, () => {
      expect(Number.isInteger(value)).toBe(true);
    });
  }
}
