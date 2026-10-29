import { test, expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { HTTP } from '../constants/httpStatus';
import { CORS } from '../constants/specHeaders';

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

  async sendWithMethod(route: string, method: string): Promise<APIResponse> {
    return this.step(`${method} ${route}`, () => this.request.fetch(route, { method }));
  }

  async assertMethodNotAllowed(response: APIResponse): Promise<void> {
    await this.assertStatus(response, HTTP.METHOD_NOT_ALLOWED);
  }

  async assertAllowedMethodsInResponse(response: APIResponse, expected: string): Promise<void> {
    await this.step(`Assert allowed methods are ${expected}`, () => {
      expect(response.headers()['allow']).toBe(expected);
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

  async assertEmptyBody(response: APIResponse): Promise<void> {
    await this.step('Assert body is empty', async () => {
      expect((await response.body()).length).toBe(0);
    });
  }

  async assertCorsAllowsGetFromAnyOrigin(response: APIResponse): Promise<void> {
    await this.step('Assert CORS allows GET from any origin', () => {
      expect(response.headers()['access-control-allow-origin']).toBe(CORS.ALLOW_ORIGIN);
      expect(response.headers()['access-control-allow-methods']).toBe(CORS.ALLOW_METHODS);
    });
  }
}
